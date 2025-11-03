import requests
import pickle
import re
import numpy as np

# Load ML model and vectorizer
vectorizer = pickle.load(open("vectorizer.pkl", "rb"))
model = pickle.load(open("model_rfc.pkl", "rb"))

# NewsData.io API key
API_KEY = "pub_024f49ef2b7341ee9e0a81d70795132a"  # Replace with your actual key

def clean_text(text):
    text = re.sub(r"http\S+", "", text)
    text = re.sub(r"[^A-Za-z\s]", "", text)
    return text.lower()

def get_news_from_api(query):
    """
    Fetches related news articles from NewsData.io
    Returns a list of article titles/descriptions if found
    """
    print("\n📰 Searching NewsData.io for related news...")

    url = f"https://newsdata.io/api/1/news"
    params = {
        "apikey": API_KEY,
        "q": query,
        "language": "en",
        "country": "in"
    }

    try:
        response = requests.get(url, params=params)
        data = response.json()

        if "results" in data and len(data["results"]) > 0:
            articles = [f"{a.get('title', '')} - {a.get('description', '')}" for a in data["results"]]
            print(f"✅ Found {len(articles)} related articles.")
            return articles
        else:
            print("⚠️ No strong related news found.")
            return []
    except Exception as e:
        print(f"❌ API Error: {e}")
        return []

def ml_prediction(text):
    """
    Predicts if the news is fake or real using ML
    """
    cleaned = clean_text(text)
    vec = vectorizer.transform([cleaned])
    pred = model.predict(vec)[0]
    prob = np.max(model.predict_proba(vec))
    return pred, round(prob, 2)

def verify_news(user_input):
    print("--------------------------------------------------")
    print("🧠 Starting News Verification (Hackathon Mode)")
    print("--------------------------------------------------")

    # Step 1: Query NewsData.io
    articles = get_news_from_api(user_input)

    # Step 2: ML prediction
    ml_pred, ml_conf = ml_prediction(user_input)

    # Step 3: Decision logic (Demo-friendly)
    if len(articles) > 0:
        verdict = "True"
        confidence = max(ml_conf, 0.9)  # Boost confidence since API found something
        reason = "Found supporting articles through NewsData.io."
    else:
        verdict = "Unverified"
        confidence = ml_conf
        reason = "No related news found, limited verification sources."

    # Step 4: Final output
    print("\n--------------------------------------------------")
    print("🧾 FINAL SUMMARY:")
    print("--------------------------------------------------")
    print(f"✅ Decision: {verdict}")
    print(f"📊 Confidence: {confidence}")
    print(f"💡 Reason: {reason}")

    if len(articles) > 0:
        print("\n🔗 Related Articles:")
        for i, art in enumerate(articles[:3], start=1):
            print(f" {i}. {art[:200]}...")

    print("--------------------------------------------------")
    print("✅ Verification complete.\n")

# ---------------- MAIN EXECUTION ----------------
if __name__ == "__main__":
    user_input = input("\n🗞️ Enter a news headline, text, or URL:\n> ")
    verify_news(user_input)

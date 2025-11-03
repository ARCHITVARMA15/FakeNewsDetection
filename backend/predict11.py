import requests
import pickle
import re
import numpy as np

# ---------------- Load ML model and vectorizer ----------------
vectorizer = pickle.load(open("vectorizer.pkl", "rb"))
model = pickle.load(open("model_rfc.pkl", "rb"))

# ---------------- NewsData.io API key ----------------
API_KEY = "pub_024f49ef2b7341ee9e0a81d70795132a"  # Replace with your actual key

# ---------------- Utility functions ----------------
def clean_text(text):
    text = re.sub(r"http\S+", "", text)
    text = re.sub(r"[^A-Za-z\s]", "", text)
    return text.lower().strip()

def get_news_from_api(query):
    """
    Fetch related news articles from NewsData.io.
    Returns a list of dicts with title, description, and link.
    """
    print("\n📰 Searching NewsData.io for related news...")

    url = "https://newsdata.io/api/1/news"
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
            articles = []
            for a in data["results"]:
                title = a.get("title", "No Title")
                desc = a.get("description", "")
                link = a.get("link", "")
                articles.append({
                    "title": title,
                    "description": desc,
                    "link": link
                })
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
    Predicts if the news is fake or real using ML model.
    """
    cleaned = clean_text(text)
    vec = vectorizer.transform([cleaned])
    pred = model.predict(vec)[0]
    prob = np.max(model.predict_proba(vec))
    return pred, round(prob, 2)

# ---------------- Main verification logic ----------------
def verify_news(user_input):
    print("--------------------------------------------------")
    print("🧠 Starting News Verification (Hackathon Mode)")
    print("--------------------------------------------------")

    # Step 1: Query API
    articles = get_news_from_api(user_input)

    # Step 2: ML prediction
    ml_pred, ml_conf = ml_prediction(user_input)

    # Step 3: Decision logic (balanced demo-friendly)
    if len(articles) > 0:
        verdict = "True"
        confidence = max(ml_conf, 0.9)  # Boost confidence since API found something
        reason = "Found supporting articles via NewsData.io."
    else:
        if ml_conf > 0.7 and ml_pred == "fake":
            verdict = "Fake"
            confidence = ml_conf
            reason = "ML model detected patterns of misinformation and no articles found."
        else:
            verdict = "Unverified"
            confidence = ml_conf
            reason = "No strong matches found — cannot confirm yet."

    # Step 4: Output
    print("\n--------------------------------------------------")
    print("🧾 FINAL SUMMARY:")
    print("--------------------------------------------------")
    print(f"✅ Decision: {verdict}")
    print(f"📊 Confidence: {confidence}")
    print(f"💡 Reason: {reason}")

    # Step 5: Show top related articles
    if len(articles) > 0:
        print("\n🔗 Related Articles:")
        for i, art in enumerate(articles[:3], start=1):
            title = art['title'][:90]
            desc = art['description'][:90]
            link = art['link']
            print(f"\n {i}. 🗞️ {title}")
            print(f"     {desc}...")
            print(f"     🔗 {link}")

    print("--------------------------------------------------")
    print("✅ Verification complete.\n")

# ---------------- Main execution ----------------
if __name__ == "__main__":
    user_input = input("\n🗞️ Enter a news headline, text, or URL:\n> ")
    verify_news(user_input)

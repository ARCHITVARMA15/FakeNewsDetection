import pickle
import pandas as pd
import re
import requests
from statistics import mode
from newspaper import Article

print("🚀 predict_test.py started running...")

# ==========================================
# 1️⃣ Load Trained Models & Vectorizer
# ==========================================
LR = pickle.load(open("model_lr.pkl", "rb"))
rfc = pickle.load(open("model_rfc.pkl", "rb"))
gbc = pickle.load(open("model_gbc.pkl", "rb"))
vectorizer = pickle.load(open("vectorizer.pkl", "rb"))

print("✅ Models and vectorizer loaded successfully!")

# ==========================================
# 2️⃣ Text Cleaning Function
# ==========================================
def wordopt(text):
    text = text.lower()
    text = re.sub(r'https?://\S+|www\.\S+', '', text)
    text = re.sub(r'<.*?>', '', text)
    text = re.sub(r'[^\w\s]', '', text)
    text = re.sub(r'\d', '', text)
    text = re.sub(r'\n', '', text)
    return text


# ==========================================
# 3️⃣ Detect if input is URL
# ==========================================
def is_url(text):
    return bool(re.match(r'https?://\S+', text))


# ==========================================
# 4️⃣ Extract Text from URL
# ==========================================
def extract_text_from_url(url):
    try:
        print("🔗 URL detected — extracting article text...")
        article = Article(url)
        article.download()
        article.parse()
        return article.text
    except Exception as e:
        print(f"🚨 Error extracting article: {e}")
        return ""


# ==========================================
# 5️⃣ Output Label Helper
# ==========================================
def output_label(n):
    return "It is a Fake News ❌" if n == 0 else "It is a Genuine News ✅"


# ==========================================
# 6️⃣ Visual Confidence Meter
# ==========================================
def confidence_meter(prob):
    bars = int(prob * 10)
    meter = "🟩" * bars + "⬜" * (10 - bars)
    if prob > 0.85:
        level = "Very High Confidence"
    elif prob > 0.65:
        level = "Moderate Confidence"
    else:
        level = "Low Confidence"
    return f"{meter} ({level})"


# ==========================================
# 7️⃣ Google Fact Check API Verification
# ==========================================
def verify_with_google_factcheck(news_text):
    GOOGLE_API_KEY = "AIzaSyDHc6fLAnaDwuoxVFjSNe-E_yvYkUdL2Fw"  # 🔑 replace with your API key
    base_url = f"https://factchecktools.googleapis.com/v1alpha1/claims:search?key={GOOGLE_API_KEY}"
    params = {
        "query": news_text,
        "languageCode": "en"
    }

    try:
        print("\n🧠 Checking with Google Fact Check API...")
        response = requests.get(base_url, params=params)
        data = response.json()

        if "claims" in data:
            claims = data["claims"]
            print("\n🔎 Google Fact Check Results Found:\n")
            for c in claims[:3]:
                text = c.get("text", "")
                publisher = c.get("claimReview", [{}])[0].get("publisher", {}).get("name", "")
                rating = c.get("claimReview", [{}])[0].get("textualRating", "Unknown")
                print(f"📰 {text}\n   Source: {publisher} | Rating: {rating}\n")

            ratings = [r.get("claimReview", [{}])[0].get("textualRating", "").lower() for r in claims]
            if any("false" in r or "fake" in r or "incorrect" in r for r in ratings):
                return 0
            elif any("true" in r or "accurate" in r for r in ratings):
                return 1
            else:
                return -1
        else:
            print("⚠️ No fact-checking data found for this claim.")
            return -1
    except Exception as e:
        print(f"🚨 Google Fact Check API Error: {e}")
        return -1


# ==========================================
# 8️⃣ NewsData.io - Related Articles Fetcher
# ==========================================
def fetch_related_articles(news_text):
    API_KEY = "pub_024f49ef2b7341ee9e0a81d70795132a"
    url = f"https://newsdata.io/api/1/news?apikey={API_KEY}&q={requests.utils.quote(news_text)}&language=en"

    try:
        print("\n🌍 Fetching related news from NewsData.io...")
        response = requests.get(url)
        data = response.json()

        if data.get("status") == "success" and len(data.get("results", [])) > 0:
            print("\n🗞️ Related News Articles Found:")
            articles = []
            for item in data["results"][:3]:
                title = item.get("title", "")
                link = item.get("link", "")
                print(f"• {title}\n  🔗 {link}")
                articles.append({"title": title, "link": link})
            return articles
        else:
            print("⚠️ No related articles found.")
            return []
    except Exception as e:
        print(f"🚨 Error fetching related articles: {e}")
        return []


# ==========================================
# 9️⃣ Manual Testing Function
# ==========================================
def manual_testing(news_text):
    print("\n----------------------------------------------------")
    print("🧠 Starting full verification process...")

    # If URL -> extract article
    if is_url(news_text):
        news_text = extract_text_from_url(news_text)
        if not news_text.strip():
            return {"final_decision": "❌ No text could be extracted from the URL.", "confidence": 0, "articles": []}

    # Clean and transform text
    new_df_test = pd.DataFrame({"text": [wordopt(news_text)]})
    new_xv_test = vectorizer.transform(new_df_test["text"])

    # Model predictions
    pred_lr = LR.predict(new_xv_test)[0]
    pred_rfc = rfc.predict(new_xv_test)[0]
    pred_gbc = gbc.predict(new_xv_test)[0]
    final_pred = mode([pred_lr, pred_rfc, pred_gbc])
    prob = round(float(rfc.predict_proba(new_xv_test).max()), 2)

    # Display ML results
    print("\n---------------------------------------------")
    print("🤖 ML Model Predictions:")
    print("---------------------------------------------")
    print(f"🔹 Logistic Regression: {output_label(pred_lr)}")
    print(f"🔹 Random Forest:       {output_label(pred_rfc)}")
    print(f"🔹 Gradient Boosting:   {output_label(pred_gbc)}")
    print(f"📊 Confidence (RFC): {prob} {confidence_meter(prob)}")
    print("---------------------------------------------")
    print(f"🟩 ML Majority Verdict: {output_label(final_pred)}")

    # Verify with Google Fact Check
    google_result = verify_with_google_factcheck(news_text)

    # Fetch related articles
    related_articles = fetch_related_articles(news_text)

    # Final Decision Logic
    print("\n---------------------------------------------")
    print("🧩 Final Decision Logic:")
    print("---------------------------------------------")

    if google_result == 1:
        final_decision = 1
        print("✅ Final Decision (Based on Google Fact Check): It is a Genuine News ✅")
    elif google_result == 0:
        final_decision = 0
        print("❌ Final Decision (Based on Google Fact Check): It is a Fake News ❌")
    else:
        final_decision = final_pred
        print("⚙️ Using ML Verdict as fallback since Google Fact Check had no result.")
        print(f"🟩 Final Decision (Fallback): {output_label(final_pred)}")

    print("\n✅ Verification completed successfully!")
    return {
        "final_decision": output_label(final_decision),
        "confidence": prob,
        "articles": related_articles
    }


# ==========================================
# 🔟 Main Program
# ==========================================
if __name__ == "__main__":
    print("----------------------------------------------------")
    news_article = str(input("📰 Enter the news article text or URL:\n"))
    print("----------------------------------------------------")
    result = manual_testing(news_article)

    print("\n🟢 Final Output Summary:")
    print(f"➡️ Decision: {result['final_decision']}")
    print(f"➡️ Confidence: {result['confidence']}")
    print(f"➡️ Related Articles: {[a['title'] for a in result['articles']]}")

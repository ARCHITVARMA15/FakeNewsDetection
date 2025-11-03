import pickle
import pandas as pd
import re
import requests
from newspaper import Article

# ==========================================================
# 1️⃣ Load ML Models & Vectorizer (trained earlier)
# ==========================================================
LR = pickle.load(open("model_lr.pkl", "rb"))
rfc = pickle.load(open("model_rfc.pkl", "rb"))
gbc = pickle.load(open("model_gbc.pkl", "rb"))
vectorizer = pickle.load(open("vectorizer.pkl", "rb"))
print("✅ ML Models and Vectorizer Loaded Successfully!")

# ==========================================================
# 2️⃣ Text Cleaning Function
# ==========================================================
def wordopt(text):
    text = text.lower()
    text = re.sub(r'https?://\S+|www\.\S+', '', text)
    text = re.sub(r'<.*?>', '', text)
    text = re.sub(r'[^\w\s]', '', text)
    text = re.sub(r'\d', '', text)
    text = re.sub(r'\n', '', text)
    return text

# ==========================================================
# 3️⃣ Detect if input is a URL
# ==========================================================
def is_url(text):
    return bool(re.match(r'https?://\S+', text))

# ==========================================================
# 4️⃣ Extract Text from URL
# ==========================================================
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

# ==========================================================
# 5️⃣ Output Label Helper
# ==========================================================
def output_label(n):
    return "✅ Genuine News" if n == 1 else "❌ Fake News"

# ==========================================================
# 6️⃣ Visual Confidence Meter
# ==========================================================
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

# ==========================================================
# 7️⃣ NewsData.io Verification
# ==========================================================
def verify_with_newsdata(news_text):
    API_KEY = "pub_024f49ef2b7341ee9e0a81d70795132a"
    url = f"https://newsdata.io/api/1/news?apikey={API_KEY}&q={requests.utils.quote(news_text)}&language=en"

    try:
        print("\n🌍 Searching NewsData.io for related news...")
        response = requests.get(url)
        data = response.json()

        if data.get("status") != "success":
            print("⚠️ API Error or rate limit reached.")
            return {"status": "error", "articles": []}

        results = data.get("results", [])
        if len(results) == 0:
            print("❌ No related articles found online.")
            return {"status": "no_results", "articles": []}

        credible_articles = [
            item for item in results
            if any(domain in item.get("link", "").lower()
                   for domain in ["bbc", "cnn", "ndtv", "hindustantimes", "reuters", "timesofindia",
                                  "indiatoday", "thehindu", "deccan", "bloomberg", "abcnews", "cnbc", "aljazeera"])
        ]

        if len(credible_articles) > 0:
            print(f"✅ Found {len(credible_articles)} credible related articles:")
            for art in credible_articles[:3]:
                print(f"📰 {art.get('title', '')}\n🔗 {art.get('link', '')}\n")
            return {"status": "credible", "articles": credible_articles}
        else:
            print("⚠️ Only unverified or low-quality sources found.")
            return {"status": "unverified", "articles": results[:3]}

    except Exception as e:
        print(f"🚨 Error verifying with NewsData.io: {e}")
        return {"status": "error", "articles": []}

# ==========================================================
# 8️⃣ ML Prediction Function (only used if no API results)
# ==========================================================
def ml_prediction(news_text):
    print("\n🧠 Using ML Model Fallback...")
    new_df_test = pd.DataFrame({"text": [wordopt(news_text)]})
    new_xv_test = vectorizer.transform(new_df_test["text"])

    pred_lr = LR.predict(new_xv_test)[0]
    pred_rfc = rfc.predict(new_xv_test)[0]
    pred_gbc = gbc.predict(new_xv_test)[0]

    preds = [pred_lr, pred_rfc, pred_gbc]
    final_pred = max(set(preds), key=preds.count)
    prob = round(float(rfc.predict_proba(new_xv_test).max()), 2)

    print("---------------------------------------------")
    print(f"🔹 Logistic Regression: {output_label(pred_lr)}")
    print(f"🔹 Random Forest:       {output_label(pred_rfc)}")
    print(f"🔹 Gradient Boosting:   {output_label(pred_gbc)}")
    print(f"📊 Confidence: {prob} {confidence_meter(prob)}")
    print("---------------------------------------------")
    print(f"🟩 Final ML Verdict: {output_label(final_pred)}")

    return {"label": final_pred, "confidence": prob}

# ==========================================================
# 9️⃣ Final Hybrid Logic
# ==========================================================
def verify_news(news_text):
    print("\n----------------------------------------------------")
    print("🧩 Starting News Verification (Hybrid: NewsData + ML)")
    print("----------------------------------------------------")

    if is_url(news_text):
        news_text = extract_text_from_url(news_text)
        if not news_text.strip():
            return {"final_decision": "❌ No text extracted from URL", "confidence": 0, "articles": []}

    # Step 1: Check NewsData.io
    newsdata_result = verify_with_newsdata(news_text)

    if newsdata_result["status"] == "credible":
        print("\n✅ Decision: Genuine News (found on reputable outlets)")
        return {
            "final_decision": "✅ Genuine News (Verified by NewsData.io)",
            "confidence": 0.95,
            "articles": newsdata_result["articles"],
        }

    elif newsdata_result["status"] == "unverified":
        print("\n⚠️ Decision: Unverified (low-quality or unclear sources)")
        return {
            "final_decision": "⚠️ Unverified — no strong sources found",
            "confidence": 0.5,
            "articles": newsdata_result["articles"],
        }

    elif newsdata_result["status"] == "no_results":
        print("\n❌ No API results found — using ML model fallback.")
        ml_result = ml_prediction(news_text)
        return {
            "final_decision": output_label(ml_result["label"]),
            "confidence": ml_result["confidence"],
            "articles": [],
        }

    else:
        print("\n🚨 API Error — defaulting to ML prediction.")
        ml_result = ml_prediction(news_text)
        return {
            "final_decision": output_label(ml_result["label"]),
            "confidence": ml_result["confidence"],
            "articles": [],
        }

# ==========================================================
# 🔟 Run the System
# ==========================================================
if __name__ == "__main__":
    print("----------------------------------------------------")
    news_article = str(input("📰 Enter a news headline, text, or URL:\n"))
    print("----------------------------------------------------")
    result = verify_news(news_article)

    print("\n🟢 FINAL SUMMARY:")
    print(f"➡️ Decision: {result['final_decision']}")
    print(f"➡️ Confidence: {result['confidence']}")
    if result["articles"]:
        print("➡️ Related Articles:")
        for a in result["articles"]:
            print(f"   • {a['title']} ({a['link']})")

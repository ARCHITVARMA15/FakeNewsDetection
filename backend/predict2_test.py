import pickle
import pandas as pd
import re
import requests
from statistics import mode
from colorama import Fore, Style
from newspaper import Article

print("🚀 predict_test.py started running...")
#Detect if the input is a URL
def is_url(text):
    return bool(re.match(r'https?://\S+', text))

# ====================================================
# 1️⃣ Load ML Models and Vectorizer
# ====================================================
LR = pickle.load(open("model_lr.pkl", "rb"))
rfc = pickle.load(open("model_rfc.pkl", "rb"))
gbc = pickle.load(open("model_gbc.pkl", "rb"))
vectorizer = pickle.load(open("vectorizer.pkl", "rb"))

print(Fore.GREEN + "✅ Models and vectorizer loaded successfully!" + Style.RESET_ALL)


# ====================================================
# 2️⃣ Text Cleaning (same as during training)
# ====================================================
def extract_text_from_url(url):
    try:
        article = Article(url)
        article.download()
        article.parse()
        return article.text
    except Exception as e:
        print(f"Error extracting article: {e}")
        return ""



def wordopt(text):
    text = text.lower()
    text = re.sub(r'https?://\S+|www\.\S+', '', text)
    text = re.sub(r'<.*?>', '', text)
    text = re.sub(r'[^\w\s]', '', text)
    text = re.sub(r'\d', '', text)
    text = re.sub(r'\n', '', text)
    return text


# ====================================================
# 3️⃣ Output Label Helper
# ====================================================
def output_label(n):
    return "It is a Fake News ❌" if n == 0 else "It is a Genuine News ✅"


# ====================================================
# 4️⃣ Visual Confidence Meter
# ====================================================
def confidence_meter(prob):
    bars = int(prob * 10)
    return "🟩" * bars + "⬜" * (10 - bars)


# ====================================================
# 5️⃣ Google Fact Check API (for main decision)
# ====================================================
def verify_with_google_factcheck(news_text):
    """
    Uses Google Fact Check API to verify claims.
    Returns:
      1 = Genuine / True
      0 = Fake / Misleading
     -1 = API Error or No Data
    """
    GOOGLE_API_KEY = "AIzaSyDHc6fLAnaDwuoxVFjSNe-E_yvYkUdL2Fw"
    base_url = f"https://factchecktools.googleapis.com/v1alpha1/claims:search?key={GOOGLE_API_KEY}"
    params = {"query": news_text, "languageCode": "en"}

    try:
        print(Fore.CYAN + "\n🌐 Checking with Google Fact Check API..." + Style.RESET_ALL)
        response = requests.get(base_url, params=params)
        data = response.json()

        if "claims" in data:
            claims = data["claims"]
            print(Fore.GREEN + "\n🔎 Fact Check Results Found:\n" + Style.RESET_ALL)
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
            print(Fore.YELLOW + "\n⚠️ No fact-check data found for this claim." + Style.RESET_ALL)
            return -1

    except Exception as e:
        print(Fore.RED + f"🚨 Google Fact Check API Error: {e}" + Style.RESET_ALL)
        return -1


# ====================================================
# 6️⃣ NewsData.io API (only for related article display)
# ====================================================
def fetch_related_articles(news_text):
    """
    Fetches related articles (for frontend display only)
    """
    API_KEY = "pub_024f49ef2b7341ee9e0a81d70795132a"
    url = f"https://newsdata.io/api/1/news?apikey={API_KEY}&q={requests.utils.quote(news_text)}&language=en"

    try:
        response = requests.get(url)
        data = response.json()

        if data.get("status") == "success" and len(data.get("results", [])) > 0:
            print(Fore.CYAN + "\n📰 Related Sources Found Online:" + Style.RESET_ALL)
            articles = []
            for item in data["results"][:3]:
                title = item.get("title", "")
                link = item.get("link", "")
                print(f"🔹 {title}\n   🌍 {link}\n")
                articles.append({"title": title, "link": link})
            return articles
        else:
            print(Fore.YELLOW + "\n⚠️ No related articles found online." + Style.RESET_ALL)
            return []

    except Exception as e:
        print(Fore.RED + f"🚨 NewsData.io API Error: {e}" + Style.RESET_ALL)
        return []


# ====================================================
# 7️⃣ Core Verification Logic
# ====================================================
def manual_testing(news_text):
    print(Fore.MAGENTA + "\n----------------------------------------------------" + Style.RESET_ALL)
    print(Fore.BLUE + "🧠 Starting full verification process..." + Style.RESET_ALL)

    #Detect if the input is a URL
    if is_url(news_text):
        print("🔗 URL detected — extracting article text...")
        news_text = extract_text_from_url(news_text)
        if not news_text.strip():
            print("Could not extract article text. Please enter text manually")
            return {f"final_decision":"Error:NO text extracted", "confidence":0, "articles":[] }

    # 🧹 Clean & Vectorize
    testing_news = {"text": [news_text]}
    new_df_test = pd.DataFrame(testing_news)
    new_df_test["text"] = new_df_test["text"].apply(wordopt)
    new_xv_test = vectorizer.transform(new_df_test["text"])

    # 🧮 ML Predictions
    pred_lr = LR.predict(new_xv_test)[0]
    pred_rfc = rfc.predict(new_xv_test)[0]
    pred_gbc = gbc.predict(new_xv_test)[0]
    prob = round(float(rfc.predict_proba(new_xv_test).max()), 2)
    final_ml = mode([pred_lr, pred_rfc, pred_gbc])

    print(Fore.CYAN + "\n----------------------------------------------------" + Style.RESET_ALL)
    print(Fore.MAGENTA + "🤖 ML Model Predictions:" + Style.RESET_ALL)
    print("🔹 Logistic Regression:", output_label(pred_lr))
    print("🔹 Random Forest:", output_label(pred_rfc))
    print("🔹 Gradient Boosting:", output_label(pred_gbc))
    print(f"📊 Confidence (RFC): {prob} {confidence_meter(prob)}")
    print(Fore.GREEN + f"\n🧩 ML Majority Verdict: {output_label(final_ml)}" + Style.RESET_ALL)

    # 🌐 Related Articles (for frontend display)
    articles = fetch_related_articles(news_text)

    # ✅ Google Fact Check (Final Decision)
    fact_check_result = verify_with_google_factcheck(news_text)
    if fact_check_result == 1:
        decision = "✅ Verified True — It is a Genuine News."
    elif fact_check_result == 0:
        decision = "❌ Verified False — It is a Fake News."
    else:
        decision = f"⚠️ No Fact-Check Data Found — ML Verdict Used: {output_label(final_ml)}"

    print(Fore.MAGENTA + "\n----------------------------------------------------" + Style.RESET_ALL)
    print(Fore.GREEN + f"🟩 Final Decision: {decision}" + Style.RESET_ALL)
    print(Fore.MAGENTA + "----------------------------------------------------" + Style.RESET_ALL)

    return {"final_decision": decision, "confidence": prob, "articles": articles}


# ====================================================
# 8️⃣ Run Script
# ====================================================
if __name__ == "__main__":
    print("----------------------------------------------------")
    news_article = str(input("📰 Enter the news article text:\n"))
    print("----------------------------------------------------")
    result = manual_testing(news_article)
    print(Fore.GREEN + "\n✅ Verification completed successfully!" + Style.RESET_ALL)

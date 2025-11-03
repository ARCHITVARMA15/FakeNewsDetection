import pickle
import pandas as pd
import re
from statistics import mode
import requests 

print("🚀 predict_test.py started running...")


def get_confidence_meter(score):
    """
    Returns a visual emoji-based confidence bar and label.
    Score is between 0 and 1.
    """
    if score >= 0.9:
        bar = "🟩🟩🟩🟩🟩  (Very High Confidence)"
    elif score >= 0.75:
        bar = "🟩🟩🟩🟨⬜  (High Confidence)"
    elif score >= 0.5:
        bar = "🟩🟨⬜⬜⬜  (Moderate Confidence)"
    else:
        bar = "🟥⬜⬜⬜⬜  (Low Confidence)"
    return bar



# ==========================================
# 1️⃣ Load Trained Models & Vectorizer
# ==========================================
LR = pickle.load(open("model_lr.pkl", "rb"))
rfc = pickle.load(open("model_rfc.pkl", "rb"))
gbc = pickle.load(open("model_gbc.pkl", "rb"))
vectorizer = pickle.load(open("vectorizer.pkl", "rb"))

print("✅ Models and vectorizer loaded successfully!")

# ==========================================
# 2️⃣ Text Cleaning Function (Same as Training)
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
# 3️⃣ Output Label Helper
# ==========================================
def output_label(n):
    return "It is a Fake News ❌" if n == 0 else "It is a Genuine News ✅"




def verify_with_api(news_text):
    """
    Uses NewsData.io API to check if similar verified news exists online.
    """
    API_KEY = "pub_024f49ef2b7341ee9e0a81d70795132a"
    url = f"https://newsdata.io/api/1/news?apikey={API_KEY}&q={requests.utils.quote(news_text)}&language=en"

    try:
        response = requests.get(url)
        data = response.json()

        if data.get("status") == "success" and len(data.get("results", [])) > 0:
            source_titles = [item['title'] for item in data['results'][:3]]
            print("\n🌍 Verified sources found online:")
            for title in source_titles:
                print("📰", title)
            return 1  # Genuine
        else:
            print("\n⚠️ No verified articles found online.")
            return 0  # Fake

    except Exception as e:
        print(f"🚨 API Error: {e}")
        return -1


def verify_with_google_factcheck(news_text):
    """
    Uses Google Fact Check API to verify claims.
    Returns:
      1 = Genuine / Verified True
      0 = Fake / Misleading
     -1 = API Error or No data
    """
    GOOGLE_API_KEY = "AIzaSyDHc6fLAnaDwuoxVFjSNe-E_yvYkUdL2Fw"
    base_url = f"https://factchecktools.googleapis.com/v1alpha1/claims:search?key={GOOGLE_API_KEY}"
    params = {
        "query": news_text,
        "languageCode": "en"
    }

    try:
        response = requests.get(base_url, params=params)
        data = response.json()

        if "claims" in data:
            claims = data["claims"]
            print("\n🔎 Google Fact Check Results Found:")
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
            print("\n⚠️ No fact-checking data found for this claim.")
            return -1

    except Exception as e:
        print(f"🚨 Google Fact Check API Error: {e}")
        return -1


# ==========================================
# 4️⃣ Manual Testing Function (with Majority Vote)
# ==========================================
# def manual_testing(news_text):
#     """
#     Cleans and vectorizes the given news text,
#     predicts using LR, RFC, GBC,
#     and gives a final majority-vote result.
#     """
#     # Create DataFrame
#     testing_news = {"text": [news_text]}
#     new_df_test = pd.DataFrame(testing_news)

#     # Apply same preprocessing
#     new_df_test['text'] = new_df_test['text'].apply(wordopt)

#     # Transform using the saved TF-IDF vectorizer
#     new_xv_test = vectorizer.transform(new_df_test['text'])

#     # Individual model predictions
#     pred_lr = LR.predict(new_xv_test)[0]
#     rfc_pred = rfc.predict(new_xv_test)[0]
#     gbc_pred = gbc.predict(new_xv_test)[0]

#     # Majority vote (mode)
#     final_pred = mode([pred_lr, rfc_pred, gbc_pred])

#     # Confidence (from Random Forest)
#     prob = round(float(rfc.predict_proba(new_xv_test).max()), 2)

#     #API Verification
#     api_verdict = verify_with_api(news_text)

#     #combine both sources of truth 
#     if api_verdict == -1:
#         final_verdict = final_pred
#     elif api_verdict != final_pred:
#         final_verdict = api_verdict 
#     else:
#         final_verdict = final_pred

#     # Output formatting
#     result = f"""
# 🔍 Model Predictions:
# ---------------------------------------------
# 🔹 Logistic Regression: {output_label(pred_lr)}
# 🔹 Random Forest:       {output_label(rfc_pred)}
# 🔹 Gradient Boosting:   {output_label(gbc_pred)}
# ---------------------------------------------
# 🟩 Final Verdict (Majority Vote): {output_label(final_pred)}
# 📊 Confidence (from RFC): {prob}

# 🌐 API Verification Result: {output_label(api_verdict)}
# ✅ Final Decision (Model+ API):{output_label(final_verdict)}
# """
#     return result




from statistics import mode

def manual_testing(news_text):
    """
    Performs fake news verification using:
      - 3 ML models (LR, RFC, GBC)
      - NewsData.io API
      - Google Fact Check API

    Returns final result based on:
      Priority: Google Fact Check > NewsData.io > ML Majority
    """

    print("\n🔍 Starting full verification process...\n")

    # 🧹 Step 1: Clean and vectorize input text
    testing_news = {"text": [news_text]}
    new_df_test = pd.DataFrame(testing_news)
    new_df_test['text'] = new_df_test['text'].apply(wordopt)
    new_xv_test = vectorizer.transform(new_df_test['text'])

    # 🤖 Step 2: ML model predictions
    pred_lr = LR.predict(new_xv_test)[0]
    pred_rfc = rfc.predict(new_xv_test)[0]
    pred_gbc = gbc.predict(new_xv_test)[0]

    print("----------------------------------------------------")
    print("🤖 ML Model Predictions:")
    print("----------------------------------------------------")
    print(f"🔹 Logistic Regression: {output_label(pred_lr)}")
    print(f"🔹 Random Forest:       {output_label(pred_rfc)}")
    print(f"🔹 Gradient Boosting:   {output_label(pred_gbc)}")

    model_predictions = [pred_lr, pred_rfc, pred_gbc]
    model_majority = mode(model_predictions)
    confidence = round(float(rfc.predict_proba(new_xv_test).max()), 2)


    confidence_bar = get_confidence_meter(confidence)
    print(f"📊 Confidence (RFC): {confidence}  {confidence_bar}")


    print(f"\n🟩 ML Majority Verdict: {output_label(model_majority)}")
    print(f"📊 Confidence (RFC): {confidence}")

    # 🌍 Step 3: API Verifications
    print("\n----------------------------------------------------")
    print("🌍 Checking with NewsData.io API...")
    newsio_result = verify_with_api(news_text)
    print("----------------------------------------------------")
    print("🔎 Checking with Google Fact Check API...")
    google_result = verify_with_google_factcheck(news_text)

    # 🧮 Step 4: Final Decision Logic
    print("\n----------------------------------------------------")
    print("🧠 Final Decision Logic:")
    print("----------------------------------------------------")

    if google_result in [0, 1]:
        final_result = google_result
        final_source = "Google Fact Check API"
    elif newsio_result in [0, 1]:
        final_result = newsio_result
        final_source = "NewsData.io API"
    else:
        final_result = model_majority
        final_source = "ML Ensemble (Majority Vote)"

    # 🧾 Step 5: Print Summary
    print(f"\n🌐 NewsData.io API Result: {output_label(newsio_result)}")
    print(f"🔎 Google Fact Check Result: {output_label(google_result)}")
    print("----------------------------------------------------")
    print(f"✅ Final Decision (Based on {final_source}): {output_label(final_result)}")
    print("----------------------------------------------------")
    print("🟢 Verification completed successfully!\n")

    return final_result


# ==========================================
# 5️⃣ Run Manual Testing
# ==========================================
if __name__ == "__main__":
    print("----------------------------------------------------")
    news_article = str(input("📰 Enter the news article text:\n"))
    print("----------------------------------------------------")
    print(manual_testing(news_article))
    print("----------------------------------------------------")
    print("✅ Verification completed successfully!")
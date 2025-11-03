import pickle
import pandas as pd
import re
import requests
from statistics import mode
from newspaper import Article

# ==========================================
# 1️⃣ Load Trained Models & Vectorizer
# ==========================================
# NOTE: These files must exist in the same directory for the code to run
try:
    LR = pickle.load(open("model_lr.pkl", "rb"))
    rfc = pickle.load(open("model_rfc.pkl", "rb"))
    gbc = pickle.load(open("model_gbc.pkl", "rb"))
    vectorizer = pickle.load(open("vectorizer.pkl", "rb"))
    print("✅ Models and vectorizer loaded successfully!")
except FileNotFoundError:
    print("🚨 ERROR: Model files (model_lr.pkl, model_rfc.pkl, model_gbc.pkl, vectorizer.pkl) not found.")
    exit()

# ==========================================
# 2️⃣ Text Cleaning
# ==========================================
def wordopt(text):
    """Performs basic text cleaning suitable for Fake News Detection."""
    text = text.lower()
    text = re.sub(r'https?://\S+|www\.\S+', '', text) # Remove URLs
    text = re.sub(r'<.*?>', '', text)                  # Remove HTML tags
    text = re.sub(r'[^\w\s]', '', text)                # Remove punctuation
    text = re.sub(r'\d', '', text)                     # Remove digits
    text = re.sub(r'\n', '', text)                     # Remove newlines
    text = text.strip()                                # Remove leading/trailing whitespace
    return text

# ==========================================
# 3️⃣ Check if Input is a URL
# ==========================================
def is_url(text):
    """Checks if the input string is a valid URL."""
    return bool(re.match(r'https?://\S+', text))

# ==========================================
# 4️⃣ Extract Text from URL
# ==========================================
def extract_text_from_url(url):
    """Uses the newspaper library to extract article body text from a URL."""
    try:
        print("🔗 URL detected — extracting article text...")
        article = Article(url)
        article.download()
        article.parse()
        # Prioritize the article text, fall back to the title if text is empty
        return article.text if article.text else article.title
    except Exception as e:
        print(f"🚨 Error extracting article: {e}")
        return ""

# ==========================================
# 5️⃣ Output Label Helper
# ==========================================
def output_label(n):
    """Converts the binary prediction to a descriptive string."""
    return "It is a Fake News ❌" if n == 0 else "It is a Genuine News ✅"

# ==========================================
# 6️⃣ Visual Confidence Meter
# ==========================================
def confidence_meter(prob):
    """Generates a visual bar and confidence level based on probability."""
    prob_percent = int(prob * 100)
    bars = int(prob * 10)
    meter = "🟩" * bars + "⬜" * (10 - bars)
    
    if prob > 0.85:
        level = "Very High Confidence"
    elif prob > 0.70:
        level = "Moderate Confidence"
    else:
        level = "Low Confidence"
        
    return f"{meter} ({prob_percent}%) - {level}"

# ==========================================
# 7️⃣ Google Fact Check API (IMPROVED)
# ==========================================
def verify_with_google_factcheck(news_text):
    """
    Checks the news claim against the Google Fact Check API.
    Uses a refined scoring logic to reduce false positives.
    Returns 1 (Genuine), 0 (Fake), or -1 (Unknown/Mixed).
    """
    # 🔑 REPLACE THIS WITH YOUR ACTUAL GOOGLE API KEY
    GOOGLE_API_KEY = "AIzaSyDHc6fLAnaDwuoxVFjSNe-E_yvYkUdL2Fw" 
    
    base_url = f"https://factchecktools.googleapis.com/v1alpha1/claims:search?key={GOOGLE_API_KEY}"
    params = {
        "query": news_text,
        "languageCode": "en"
    }

    try:
        print("\n🌐 Checking with Google Fact Check API...")
        response = requests.get(base_url, params=params, timeout=10) # Added timeout
        data = response.json()

        if "claims" in data and len(data["claims"]) > 0:
            claims = data["claims"]
            print(f"🔎 Google Fact Check Results Found ({len(claims)} claims):\n")
            
            # --- Tally Ratings for Smarter Decision ---
            
            # Keywords for negative ratings
            FAKE_KEYWORDS = ["false", "fake", "incorrect", "misleading", "pants on fire", "mostly false"]
            # Keywords for positive ratings
            TRUE_KEYWORDS = ["true", "accurate", "correct", "mostly true", "verified", "legitimate"]
            
            ratings = [r.get("claimReview", [{}])[0].get("textualRating", "").lower() for r in claims]
            
            count_fake = sum(1 for r in ratings if any(k in r for k in FAKE_KEYWORDS))
            count_genuine = sum(1 for r in ratings if any(k in r for k in TRUE_KEYWORDS))

            # Display top 3 results
            for c in claims[:3]:
                text = c.get("text", "N/A")
                publisher = c.get("claimReview", [{}])[0].get("publisher", {}).get("name", "N/A")
                rating = c.get("claimReview", [{}])[0].get("textualRating", "Unknown")
                print(f"📰 Claim: {text}\n  Source: {publisher} | Rating: {rating}\n")
            
            print(f"📊 Summary: Fake matches: {count_fake} | Genuine matches: {count_genuine}")

            # Decision Logic: Prioritize True only if there are no conflicting Fake claims.
            if count_genuine > 0 and count_fake == 0:
                return 1 # Strong evidence of genuine news
            elif count_fake >= 1 and count_fake > count_genuine:
                return 0 # At least one fake claim, and majority is fake
            else:
                return -1 # Mixed, equal, or no clear verdict
        else:
            print("⚠️ No fact-checking data found for this claim.")
            return -1

    except Exception as e:
        # Check for specific API errors (e.g., rate limit, invalid key)
        if response.status_code == 400:
             print("🚨 Google Fact Check API Error: Check your API key or query structure.")
        elif response.status_code == 429:
             print("🚨 Google Fact Check API Error: Rate limit exceeded.")
        else:
             print(f"🚨 Google Fact Check API Error: {e}")
        return -1

# ==========================================
# 8️⃣ Fetch Related News
# ==========================================
def fetch_related_articles(news_text):
    """
    Fetches related articles for context and frontend display.
    (Does not impact the final fake/genuine decision).
    """
    # 🔑 REPLACE THIS WITH YOUR ACTUAL NEWSDATA.IO API KEY
    API_KEY = "pub_024f49ef2b7341ee9e0a81d70795132a"
    # Use only the first 100 characters for the search query for better results
    query_text = requests.utils.quote(news_text[:100]) 
    url = f"https://newsdata.io/api/1/news?apikey={API_KEY}&q={query_text}&language=en"

    try:
        print("\n📰 Fetching related news articles...")
        response = requests.get(url, timeout=10)
        data = response.json()

        articles = []
        if data.get("status") == "success" and len(data.get("results", [])) > 0:
            print("🗞️ Related Articles Found:")
            for item in data["results"][:3]: # Limit to top 3
                title = item.get("title", "N/A")
                link = item.get("link", "#")
                print(f"• {title}\n  🔗 {link}")
                articles.append({"title": title, "link": link})
            return articles
        else:
            print("⚠️ No related articles found online.")
            return []
    except Exception as e:
        print(f"🚨 Error fetching related articles: {e}")
        return []

# ==========================================
# 9️⃣ Manual Testing Logic (IMPROVED)
# ==========================================
def manual_testing(news_text):
    """Orchestrates the entire fake news detection process."""
    print("\n----------------------------------------------------")
    print("🧠 Starting full verification process...")

    # --- Step 1: Handle URLs and Initial Extraction ---
    if is_url(news_text):
        news_text = extract_text_from_url(news_text)
    
    # Check for empty or non-functional extraction
    if not news_text.strip():
        return {"final_decision": "❌ No usable text provided/extracted.", "confidence": 0, "articles": []}

    # --- Step 2: Clean and Validate Text ---
    cleaned_text = wordopt(news_text)
    
    # Set a minimum length threshold for reliable ML prediction
    MIN_CLEANED_LENGTH = 50 
    if len(cleaned_text) < MIN_CLEANED_LENGTH:
        print(f"🚨 Cleaned text too short ({len(cleaned_text)} chars). Cannot run ML prediction.")
        return {"final_decision": "❌ Text too short for reliable analysis.", "confidence": 0, "articles": []}

    # --- Step 3: ML Predictions ---
    new_df_test = pd.DataFrame({"text": [cleaned_text]})
    new_xv_test = vectorizer.transform(new_df_test["text"])

    # Ensemble Prediction
    pred_lr = LR.predict(new_xv_test)[0]
    pred_rfc = rfc.predict(new_xv_test)[0]
    pred_gbc = gbc.predict(new_xv_test)[0]
    final_pred = mode([pred_lr, pred_rfc, pred_gbc])
    
    # Confidence Score (Probability of the predicted class)
    prob_array = rfc.predict_proba(new_xv_test)[0]
    prob = round(float(prob_array.max()), 2)
    
    # --- Display ML results ---
    print("\n---------------------------------------------")
    print("🤖 ML Model Predictions:")
    print("---------------------------------------------")
    print(f"🔹 Logistic Regression: {output_label(pred_lr)}")
    print(f"🔹 Random Forest:       {output_label(pred_rfc)}")
    print(f"🔹 Gradient Boosting:   {output_label(pred_gbc)}")
    print(f"📊 Confidence (RFC): {confidence_meter(prob)}")
    print("---------------------------------------------")
    print(f"🟩 ML Majority Verdict: {output_label(final_pred)}")

    # --- Step 4: Google Fact Check (Highest Priority) ---
    google_result = verify_with_google_factcheck(news_text)

    # --- Step 5: Fetch related news (for display only) ---
    related_articles = fetch_related_articles(news_text)

    # --- Step 6: Smart Decision Logic (IMPROVED) ---
    print("\n---------------------------------------------")
    print("🧩 Final Decision Logic:")
    print("---------------------------------------------")
    
    # Priority 1: Google Fact Check Verdict
    if google_result == 1:
        final_decision = 1
        print("✅ Google Fact Check confirms this is TRUE (Genuine News).")
    elif google_result == 0:
        final_decision = 0
        print("❌ Google Fact Check marks this as FALSE (Fake News).")
    
    # Fallback: Google is Unknown (-1) or Mixed
    else:
        print("⚙️ Fallback Logic Activated (Google Uncertain/Mixed)")
        
        ml_verdict = final_pred 
        
        # NEW: Separate thresholds to reduce false positives on true news.
        FAKE_THRESHOLD = 0.75  # Moderate confidence to mark as fake
        TRUE_THRESHOLD = 0.85  # High confidence required to mark as genuine
        
        if ml_verdict == 0 and prob >= FAKE_THRESHOLD:
            final_decision = 0
            print(f"⚙️ Using ML Verdict (Fake, Confidence: {prob})")
        elif ml_verdict == 1 and prob >= TRUE_THRESHOLD:
            final_decision = 1
            print(f"⚙️ Using ML Verdict (Genuine, Confidence: {prob})")
        else:
            final_decision = -1
            print(f"⚠️ Insufficient verified data or low ML confidence (<{TRUE_THRESHOLD}) - Setting to Unverified.")

    # Final label assignment
    if final_decision == 1:
        label = "✅ Genuine News (Verified)"
    elif final_decision == 0:
        label = "❌ Fake News (Detected)"
    else:
        label = "⚠️ Unverified — Needs Manual Review"

    print("\n🟢 Final Decision:", label)
    print("✅ Verification completed successfully!")

    return {
        "final_decision": label,
        "confidence": prob,
        "articles": related_articles
    }

# ==========================================
# 🔟 Run
# ==========================================
if __name__ == "__main__":
    print("----------------------------------------------------")
    news_article = str(input("📰 Enter news text or URL:\n"))
    print("----------------------------------------------------")
    
    # Check if the user entered anything
    if not news_article.strip():
        print("❌ No input provided. Exiting.")
    else:
        result = manual_testing(news_article)

        print("\n\n----------------------------------------------------")
        print("🟢 Summary:")
        print(f"➡️ Decision: {result['final_decision']}")
        # Only show confidence if it was actually calculated (i.e., not 0)
        if result['confidence'] > 0:
             print(f"➡️ ML Confidence: {result['confidence'] * 100:.2f}%")
        
        print("\n➡️ Related Articles (for Context):")
        if result["articles"]:
            for art in result["articles"]:
                print(f"   • {art['title']} \n     (Link: {art['link']})")
        else:
            print("   • None found.")
        print("----------------------------------------------------")
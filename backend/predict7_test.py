import requests
import re
from newspaper import Article

# ==========================================================
# 1️⃣ Detect if input is a URL
# ==========================================================
def is_url(text):
    return bool(re.match(r'https?://\S+', text))

# ==========================================================
# 2️⃣ Extract article text from URL
# ==========================================================
def extract_text_from_url(url):
    try:
        print("🔗 URL detected — extracting article text...")
        article = Article(url)
        article.download()
        article.parse()
        return article.text
    except Exception as e:
        print(f"🚨 Error extracting article text: {e}")
        return ""

# ==========================================================
# 3️⃣ NewsData.io Verification
# ==========================================================
def verify_with_newsdata(news_text):
    API_KEY = "pub_024f49ef2b7341ee9e0a81d70795132a"
    url = f"https://newsdata.io/api/1/news?apikey={API_KEY}&q={requests.utils.quote(news_text)}&language=en"

    try:
        print("\n🌍 Searching NewsData.io for matching news articles...")
        response = requests.get(url)
        data = response.json()

        if data.get("status") != "success":
            print("⚠️ API Error or rate limit reached.")
            return {"decision": "❌ Could not verify news.", "articles": []}

        results = data.get("results", [])
        if len(results) == 0:
            print("❌ No matching articles found online.")
            return {"decision": "❌ Fake News (No credible sources found)", "articles": []}

        # Filter out suspicious / unrelated sites
        credible_articles = [
            item for item in results
            if any(domain in item.get("link", "").lower()
                   for domain in ["bbc", "cnn", "indiatimes", "ndtv", "hindustantimes", "reuters", "timesofindia", "indiatoday", "thehindu", "deccan", "bloomberg"])
        ]

        if len(credible_articles) > 0:
            print(f"✅ Found {len(credible_articles)} credible related articles.")
            for art in credible_articles[:3]:
                print(f"📰 {art.get('title', '')}")
                print(f"🔗 {art.get('link', '')}\n")

            return {
                "decision": "✅ Genuine News (Credible sources found online)",
                "articles": credible_articles
            }
        else:
            print("⚠️ Only unverified or irrelevant sources found.")
            return {
                "decision": "❌ Likely Fake News (No credible media coverage)",
                "articles": results[:3]
            }

    except Exception as e:
        print(f"🚨 Error verifying news: {e}")
        return {"decision": "❌ API Error during verification", "articles": []}

# ==========================================================
# 4️⃣ Main Function
# ==========================================================
def verify_news(news_text):
    print("----------------------------------------------------")
    print("🧠 Starting News Authenticity Verification...")
    print("----------------------------------------------------")

    if is_url(news_text):
        news_text = extract_text_from_url(news_text)
        if not news_text.strip():
            return {"decision": "❌ No text extracted from URL", "articles": []}

    result = verify_with_newsdata(news_text)
    print("----------------------------------------------------")
    print("✅ Verification completed.")
    print(f"📢 Final Decision: {result['decision']}")
    print("----------------------------------------------------")

    return result

# ==========================================================
# 5️⃣ Run
# ==========================================================
if __name__ == "__main__":
    user_input = input("📰 Enter a news headline or article text (or URL):\n")
    verify_news(user_input)

from flask import Flask, request, jsonify
import pickle
import re
import numpy as np
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# ---------------- Load ML model and vectorizer ----------------
vectorizer = pickle.load(open("vectorizer.pkl", "rb"))
model = pickle.load(open("model_rfc.pkl", "rb"))

# ---------------- NewsData.io API key ----------------
API_KEY = "pub_024f49ef2b7341ee9e0a81d70795132a"

# ---------------- Utility functions ----------------
def clean_text(text):
    text = re.sub(r"http\S+", "", text)
    text = re.sub(r"[^A-Za-z\s]", "", text)
    return text.lower().strip()

def get_news_from_api(query):
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

        articles = []
        if "results" in data and len(data["results"]) > 0:
            for a in data["results"]:
                title = a.get("title", "No Title")
                desc = a.get("description", "")
                link = a.get("link", "")
                articles.append({
                    "title": title,
                    "description": desc,
                    "link": link
                })
        return articles
    except Exception as e:
        print(f"❌ API Error: {e}")
        return []

def ml_prediction(text):
    cleaned = clean_text(text)
    vec = vectorizer.transform([cleaned])
    pred = model.predict(vec)[0]
    prob = np.max(model.predict_proba(vec))
    return pred, round(prob, 2)

# ---------------- News verification endpoint ----------------

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "CheckMate Flask backend is running successfully!"})

@app.route("/verify", methods=["POST"])
def verify_news():
    try:
        data = request.get_json()
        user_input = data.get("text", "")
        if not user_input.strip():
            return jsonify({"error": "No input provided"}), 400

        # Step 1: Fetch from API
        articles = get_news_from_api(user_input)

        # Step 2: ML prediction
        ml_pred, ml_conf = ml_prediction(user_input)

        # Step 3: Combine logic
        if len(articles) > 0:
            verdict = "True"
            confidence = max(ml_conf, 0.9)
            reason = "Found supporting articles via NewsData.io."
        else:
            if ml_conf > 0.7 and ml_pred == "fake":
                verdict = "Fake"
                confidence = ml_conf
                reason = "ML model detected misinformation patterns and no sources found."
            else:
                verdict = "Unverified"
                confidence = ml_conf
                reason = "No strong matches found — cannot confirm yet."

        # Step 4: Build final response
        result = {
            "decision": verdict,
            "confidence": confidence,
            "reason": reason,
            "related_articles": articles[:5]  # send top 5 articles
        }

        return jsonify(result)

    except Exception as e:
        print(f"Server Error: {e}")
        return jsonify({"error": str(e)}), 500

# ---------------- Run the app ----------------
if __name__ == "__main__":
    app.run(debug=True, port=5000)

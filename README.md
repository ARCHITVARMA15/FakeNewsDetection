Project Demo Link - https://drive.google.com/file/d/19apkiFtP_iLMTmPNBbpEnmuPgbWrbwsk/view?usp=sharing
 
♟️ CheckMate — AI-Powered Fake News Detection Platform  

> **"Check the news. Win against fakes."**  
An intelligent AI-driven web application that detects, verifies, and explains the authenticity of news headlines, text, or URLs — empowering users to fight misinformation with real-time ML and API-backed insights.  

---

## 🚀 Overview  

CheckMate is a **Machine Learning-powered Fake News Detection System** that combines **Natural Language Processing (NLP)** and **real-time cross-verification APIs** to evaluate the credibility of digital news content.  

It offers a **beautiful, dark-themed, professional UI** built in **Next.js** and a **Flask backend** for inference — delivering fast, explainable, and trustworthy results.  

---

## 🧠 Core Features  

### 🧩 **Machine Learning Backbone**
- Built using **TF-IDF Vectorization** + **Random Forest Classifier** trained on curated fake news datasets.  
- Achieves **over 90% classification confidence** on benchmark data.  
- Implements **keyword extraction** and **semantic similarity checks** for smarter contextual detection.  

### 🌐 **Real-Time News Verification (API Layer)**
- Integrated with **NewsData.io API** for cross-source fact checking.  
- Fetches supporting or contradicting articles dynamically for every query.  
- Smart decision logic combining **ML confidence scores** and **API validation results**.  

### 🎨 **Frontend Experience**
- Built with **Next.js + TailwindCSS** in a **dark, futuristic, and professional theme**.  
- Interactive **landing page**, glowing gradients, floating particle backgrounds, and animated verification results.  
- Elegant **login flow**, toast notifications, and verification modes for:
  - 📝 **Text-based verification**
  - 🔗 **URL-based verification**
  - 🖼️ **Image-based verification (future feature)**  

### 📊 **Analytics Dashboard (Coming Soon)**
- Visual insights powered by **Recharts.js**:
  - Number of verifications done  
  - Average model confidence  
  - Ratio of “True / Fake / Unverified” cases  
- Minimal glowing graphs with smooth transitions.  

### 🧭 **Functional Enhancements (Upcoming)**
- Multi-API verification for enhanced reliability.  
- Animated **Fake News Probability Meter** with gradient transitions.  
- **Trending Fakes Panel** — shows current misinformation trends using live data.  
- Local storage integration for saving **user’s last verified result**.  

---

## 🏗️ Tech Stack  

| Area | Technology |
|------|-------------|
| **Frontend** | Next.js, React.js, Tailwind CSS |
| **Backend** | Flask, Python |
| **Machine Learning** | scikit-learn, pandas, numpy |
| **NLP Techniques** | TF-IDF Vectorizer, Text Cleaning, Tokenization |
| **APIs Used** | NewsData.io API |
| **Data Visualization** | Recharts.js |
| **Deployment** | (Coming soon — Vercel / Render / Hugging Face Spaces) |

---

## ⚙️ How It Works  

1. User enters **headline / text / URL**.  
2. Flask backend performs:
   - Text preprocessing (stopword removal, regex cleanup)
   - TF-IDF vectorization  
   - ML model prediction  
   - Cross-verification using NewsData.io  
3. Combined verdict is sent to frontend:
   - ✅ **TRUE** → Display confetti and cheerful animation  
   - 🚨 **FAKE** → Red thumbs-down animation  
   - ⚪ **UNVERIFIED** → Neutral response with relevant suggestions  
4. User can explore **related verified articles** via direct links.  

---

## 🖥️ Screenshots  

### 🏠 Landing Page  
*Dark futuristic homepage with floating animations, tagline, and CTA buttons.*

### 🔐 Login Page  
*Animated particle background with gradient login form.*

### 🧾 Verify News Page  
*Interactive text input with ML-backed result display and emoji popups.*

### 📊 Dashboard (Coming Soon)  
*Glowing analytics showcasing verification trends.*

---

## 🧪 Local Setup  

```bash
# Clone repository
git clone https://github.com/<your-username>/CheckMate.git

# Navigate to project directory
cd CheckMate

# Install frontend dependencies
cd frontend
npm install

# Run Next.js frontend
npm run dev

# Setup Flask backend
cd ../backend
pip install -r requirements.txt
python app.py

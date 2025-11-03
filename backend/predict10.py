import requests
import pickle
import re
import math
import numpy as np
from difflib import SequenceMatcher
from datetime import datetime, timedelta

# ----------------------------
# Load your ML artifacts
# ----------------------------
VECTORIZER_PATH = "vectorizer.pkl"
MODEL_PATH = "model_rfc.pkl"          # use whichever model you prefer

vectorizer = pickle.load(open(VECTORIZER_PATH, "rb"))
model = pickle.load(open(MODEL_PATH, "rb"))

# ----------------------------
# NewsData.io configuration
# ----------------------------
API_KEY = "pub_024f49ef2b7341ee9e0a81d70795132a"     # <-- put your real key here
NEWSDATA_ENDPOINT = "https://newsdata.io/api/1/news"

# ----------------------------
# Tunable thresholds (balanced defaults)
# ----------------------------
MIN_STRONG_RELEVANCE = 0.58           # >= this => strong article
MIN_WEAK_RELEVANCE   = 0.42           # used to decide "Unverified (weak matches)"
ML_FAKE_STRONG       = 0.72           # ML fake prob > this + no strong article => Fake
LOOKBACK_DAYS        = 365            # ignore very old hits (optional)
MAX_RESULTS_CHECK    = 12             # score at most N articles

# ----------------------------
# Utilities
# ----------------------------

STOPWORDS = set("""
a an the and or of in on at for with without to from by into over under about as is are was were be been being
this that these those there here such not no nor but if then else when while though although because so than
it its itself we our ours you your yours they them their theirs he him his she her hers who whom whose which what why how
""".split())

WORD_RE = re.compile(r"[A-Za-z][A-Za-z\-']+")
NUM_RE  = re.compile(r"\b\d+(?:st|nd|rd|th)?\b")

def clean_text(s: str) -> str:
    s = re.sub(r"http\S+", "", s)
    s = re.sub(r"[^\w\s\-’']", " ", s)
    s = re.sub(r"\s+", " ", s).strip()
    return s

def tokenize(s: str):
    return [w.lower() for w in WORD_RE.findall(s)]

def proper_nouns(original: str):
    # grab sequences of Capitalized Words (very lightweight NER-ish)
    # e.g., "Narendra Modi", "New Delhi", "Bihar", "Supreme Court"
    tokens = re.findall(r"\b(?:[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b", original)
    # dedupe while preserving order
    seen, out = set(), []
    for t in tokens:
        if t not in seen:
            seen.add(t)
            out.append(t)
    return out

def key_words(tokens):
    # keywords = content words (no stopwords), keep top by length/frequency
    freq = {}
    for t in tokens:
        if t in STOPWORDS or len(t) < 3:
            continue
        freq[t] = freq.get(t, 0) + 1
    # sort by (count, length) to prioritize strong keywords
    return [w for w, _ in sorted(freq.items(), key=lambda kv: (kv[1], len(kv[0])), reverse=True)]

def extract_numbers(s: str):
    return set(NUM_RE.findall(s))

def jaccard(a: set, b: set):
    if not a or not b:
        return 0.0
    inter = len(a & b)
    union = len(a | b)
    return inter / union if union else 0.0

def similar(a: str, b: str):
    return SequenceMatcher(None, a.lower(), b.lower()).ratio()

def build_query(user_text: str):
    """
    Build a tight query using top keywords (try qInTitle) + fallback to q
    """
    original = user_text.strip()
    tokens   = tokenize(original)
    kws      = key_words(tokens)

    # take top 5 keywords for title matching
    top_for_title = kws[:5]
    q_in_title = " ".join(top_for_title) if top_for_title else original

    # general query (slightly longer)
    q_general = " ".join(kws[:10]) if kws else original

    return q_in_title, q_general, kws, proper_nouns(original), extract_numbers(original)

def newsdata_fetch(params):
    try:
        r = requests.get(NEWSDATA_ENDPOINT, params=params, timeout=10)
        r.raise_for_status()
        return r.json()
    except Exception as e:
        print(f"❌ API error: {e}")
        return {}

def within_lookback(date_str: str):
    if not date_str:
        return True
    try:
        # NewsData format example: "2025-10-20 10:00:00 UTC"
        dt = datetime.strptime(date_str.replace(" UTC", ""), "%Y-%m-%d %H:%M:%S")
        return dt >= datetime.utcnow() - timedelta(days=LOOKBACK_DAYS)
    except Exception:
        return True

def article_relevance(article, user_text, user_keywords, user_entities, user_numbers):
    """
    Score an article's relevance to the input.
    Components (0..1 each):
      - Title similarity to user text (SequenceMatcher)
      - Keyword overlap (Jaccard)
      - Entity overlap (count-based with small cap)
      - Numbers overlap (exact numbers)
    Weighted sum
    """
    title = article.get("title") or ""
    desc  = article.get("description") or ""
    text  = f"{title}. {desc}".strip()

    title_sim = similar(title, user_text)

    art_tokens  = set(tokenize(text))
    user_tokens = set(user_keywords)
    kw_overlap  = jaccard(art_tokens, user_tokens)

    # entity overlap: exact substring match count for each entity (case-insensitive)
    ent_score = 0.0
    lower_text = text.lower()
    for ent in user_entities:
        if ent and ent.lower() in lower_text:
            ent_score += 1.0
    # cap / normalize
    ent_score = min(ent_score / max(1, len(user_entities)), 1.0) if user_entities else 0.0

    nums = extract_numbers(text)
    num_overlap = jaccard(nums, user_numbers)

    # weights (tuned for balanced behavior)
    w_title = 0.42
    w_kw    = 0.25
    w_ent   = 0.23
    w_num   = 0.10

    score = (w_title * title_sim) + (w_kw * kw_overlap) + (w_ent * ent_score) + (w_num * num_overlap)

    return score

def ml_predict(text):
    cleaned = clean_text(text)
    vec = vectorizer.transform([cleaned])
    proba = model.predict_proba(vec)[0]
    pred  = model.classes_[np.argmax(proba)]
    conf  = float(np.max(proba))
    # Ensure we expose "fake probability" if your label is like {0,1} or {"fake","real"}
    if hasattr(model, "classes_"):
        try:
            # attempt to map 'fake' class prob if present
            idx_fake = list(model.classes_).index("fake")
            fake_prob = float(proba[idx_fake])
        except Exception:
            # fallback: if binary numeric model where '1' is fake — adjust if needed
            fake_prob = float(proba[1]) if len(proba) > 1 else (1.0 - conf)
    else:
        fake_prob = 1.0 - conf
    return pred, conf, fake_prob

# ----------------------------
# Main verification
# ----------------------------
def verify_news(user_input: str):
    print("\n🧭 Balanced News Verification")
    print("--------------------------------------------------")

    q_title, q_general, kws, ents, nums = build_query(user_input)
    print(f"🔎 Keywords: {kws[:8]}")
    if ents: print(f"🏷️ Entities: {ents[:6]}")
    if nums: print(f"🔢 Numbers:  {sorted(nums)}")

    # First try tighter title query
    params_title = {
        "apikey": API_KEY,
        "qInTitle": q_title,
        "language": "en",
        # Optional: country="in"
    }
    data = newsdata_fetch(params_title)

    articles = data.get("results", []) if isinstance(data, dict) else []
    # Fallback to a broader query if too few results
    if len(articles) < 2:
        params_general = {
            "apikey": API_KEY,
            "q": q_general,
            "language": "en",
        }
        data2 = newsdata_fetch(params_general)
        if isinstance(data2, dict) and data2.get("results"):
            # merge unique by link
            seen_links = {a.get("link") for a in articles}
            for a in data2["results"]:
                if a.get("link") not in seen_links:
                    articles.append(a)
                    seen_links.add(a.get("link"))

    # filter by lookback
    filtered = [a for a in articles if within_lookback(a.get("pubDate"))]
    if not filtered:
        filtered = articles

    # Score relevance
    scored = []
    for a in filtered[:MAX_RESULTS_CHECK]:
        sc = article_relevance(a, user_input, kws, ents, nums)
        scored.append((sc, a))
    scored.sort(key=lambda x: x[0], reverse=True)

    # Print top 3 matches (debug)
    if scored:
        print("\n🧮 Top matches:")
        for i, (sc, a) in enumerate(scored[:3], 1):
            t = (a.get("title") or "")[:120]
            print(f"  {i}. score={sc:.2f} | {t}")

    # ML fallback / support
    ml_pred, ml_conf, ml_fake_prob = ml_predict(user_input)
    print(f"\n🤖 ML says: {ml_pred} (conf={ml_conf:.2f}, fake_prob={ml_fake_prob:.2f})")

    # Decision
    strong = [x for x in scored if x[0] >= MIN_STRONG_RELEVANCE]
    weak   = [x for x in scored if MIN_WEAK_RELEVANCE <= x[0] < MIN_STRONG_RELEVANCE]

    if strong:
        verdict = "True"
        confidence = max(0.70, min(0.98, 0.70 + 0.20 * len(strong)))  # small boost with more strong hits
        reason = "Found highly relevant supporting coverage from news sources."
    elif weak:
        # ML strong fake and only weak matches => lean Unverified (not True)
        if ml_fake_prob > ML_FAKE_STRONG:
            verdict = "Fake"
            confidence = max(ml_conf, 0.75)
            reason = "ML strongly indicates fake and no highly relevant news coverage was found."
        else:
            verdict = "Unverified"
            confidence = 0.55
            reason = "Only weak or partial matches found; cannot confirm."
    else:
        if ml_fake_prob > ML_FAKE_STRONG:
            verdict = "Fake"
            confidence = max(ml_conf, 0.78)
            reason = "No relevant news found and ML indicates fake with high confidence."
        else:
            verdict = "Unverified"
            confidence = 0.50
            reason = "No relevant news coverage found."

    # Output
    print("\n--------------------------------------------------")
    print("🧾 FINAL SUMMARY")
    print("--------------------------------------------------")
    print(f"🟢 Decision  : {verdict}")
    print(f"📊 Confidence: {confidence:.2f}")
    print(f"💡 Reason    : {reason}")

    if scored:
        print("\n🔗 References:")
        for sc, a in scored[:5]:
            title = a.get("title") or "(no title)"
            src   = a.get("source_id") or "unknown"
            link  = a.get("link") or ""
            print(f"  • [{sc:.2f}] {title} | Source: {src} | {link}")

    print("--------------------------------------------------\n")
    return verdict, confidence

# ----------------------------
# Run as script
# ----------------------------
if __name__ == "__main__":
    user_input = input("\n🗞️ Enter a news headline, text, or URL:\n> ").strip()
    verify_news(user_input)

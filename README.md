# ⚡ Logic Link: Investor Edition

**Logic Link: Investor Edition** is a state-of-the-art, high-engagement logical reasoning, geography, and culture quiz web application built for instant deployment via **Streamlit** and **React + Vite + TypeScript**.

![Python](https://img.shields.io/badge/Python-3.12-blue?logo=python)
![Streamlit](https://img.shields.io/badge/Streamlit-1.60-FF4B4B?logo=streamlit)
![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4.0-38BDF8?logo=tailwindcss)

---

## 🌟 Key Commercial Features

1. **User Profile Sessions & Isolation**:
   - Play as **Guest** or create/switch custom player profiles.
   - Stage progress, star ratings, and high scores are isolated per session.

2. **32-Stage Campaign across 4 Difficulty Tiers**:
   - **Tier 1: Rookie Warm-Up** (Stages 1–8)
   - **Tier 2: Aptitude Standard** (Stages 9–16)
   - **Tier 3: Geo Maps & Sports** (Stages 17–24)
   - **Tier 4: Master Benchmark** (Stages 25–32)

3. **6 Reasoning & Trivia Categories**:
   - **Visual Shape Analogies**: $A : B :: C : ?$ geometry transformations.
   - **Code & Cipher Decoding**: Alphabet shift rules.
   - **Venn Diagram Set Logic**: Set relationships & intersections.
   - **Number & Pattern Series**: Progression difference rules.
   - **World Geography & Maps**: SVG country map outlines (Japan, Italy, France, Brazil, Australia, India) & Capitals.
   - **Sports & Culture Trivia**: Official rules & historic records.

4. **Global Hall of Fame Leaderboard**:
   - Ranks all player profiles based on total score, stars earned, and stages cleared.

5. **Interactive How to Play Guide**:
   - Built-in rulebook explaining scoring formula and star speed targets ($3\text{ stars} \le 15\text{s}$, $2\text{ stars} \le 30\text{s}$).

---

## 🚀 How to Run Locally

### 1. Streamlit Application (Python)
```bash
# Create and activate virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run Streamlit App
streamlit run app.py
```
App will launch at `http://localhost:8501`.

### 2. React + Vite Application (TypeScript)
```bash
npm install
npm run dev
```
App will launch at `http://localhost:5173`.

---

## ☁️ Deployment

### Streamlit Community Cloud / HuggingFace Spaces
1. Push repository to GitHub.
2. Connect repository to [Streamlit Community Cloud](https://share.streamlit.io/).
3. Main file path: `app.py`.

---

## 📄 License
MIT License © 2026 Logic Link Project.

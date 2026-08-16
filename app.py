import streamlit as st
import pandas as pd
import time
from engine.logic_engine import LogicEngine

# Page Config
st.set_page_config(
    page_title="Logic Link: Nexus Investor Edition",
    page_icon="⚡",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom Styling Injection
st.markdown("""
<style>
    .main {
        background-color: #090d16;
    }
    .stButton>button {
        background: linear-gradient(135deg, #090d16 0%, #1e1b4b 100%);
        color: #00f3ff;
        border: 1px solid rgba(0, 243, 255, 0.4);
        border-radius: 12px;
        padding: 12px 24px;
        font-weight: 700;
        transition: all 0.3s ease;
    }
    .stButton>button:hover {
        border-color: #00f3ff;
        box-shadow: 0 0 20px rgba(0, 243, 255, 0.4);
        transform: translateY(-2px);
    }
    .card-box {
        background: rgba(13, 19, 34, 0.8);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 20px;
        padding: 24px;
        backdrop-filter: blur(10px);
        margin-bottom: 20px;
    }
    .badge-tier {
        background: rgba(0, 243, 255, 0.1);
        border: 1px solid rgba(0, 243, 255, 0.4);
        color: #00f3ff;
        padding: 4px 12px;
        border-radius: 8px;
        font-size: 0.8rem;
        font-family: monospace;
    }
</style>
""", unsafe_allow_html=True)

# Initialize Session State
if "profiles" not in st.session_state:
    st.session_state.profiles = {
        "guest_user": {
            "name": "Guest Player",
            "avatar": "🎮",
            "is_guest": True,
            "levels": {i: {"unlocked": i == 1, "completed": False, "stars": 0, "best_score": 0} for i in range(1, 33)}
        },
        "alex_pro": {
            "name": "Alex (Pro Solver)",
            "avatar": "🚀",
            "is_guest": False,
            "levels": {i: {"unlocked": i <= 7, "completed": i <= 6, "stars": 3 if i <= 6 else 0, "best_score": 450 if i <= 6 else 0} for i in range(1, 33)}
        }
    }

if "active_profile_id" not in st.session_state:
    st.session_state.active_profile_id = "guest_user"

if "view_state" not in st.session_state:
    st.session_state.view_state = "level_select"

if "active_level" not in st.session_state:
    st.session_state.active_level = 1

if "puzzle_start_time" not in st.session_state:
    st.session_state.puzzle_start_time = time.time()

if "selected_option" not in st.session_state:
    st.session_state.selected_option = None

active_profile = st.session_state.profiles[st.session_state.active_profile_id]

# Sidebar - User Session & Navigation
with st.sidebar:
    st.title("⚡ Logic Link")
    st.caption("NEXUS INVESTOR EDITION")
    
    st.divider()
    
    # Session Manager
    st.subheader("👤 User Profile Session")
    profile_options = {pid: f"{p['avatar']} {p['name']}" for pid, p in st.session_state.profiles.items()}
    selected_pid = st.selectbox(
        "Switch Session:",
        options=list(profile_options.keys()),
        format_func=lambda x: profile_options[x],
        index=list(profile_options.keys()).index(st.session_state.active_profile_id)
    )
    if selected_pid != st.session_state.active_profile_id:
        st.session_state.active_profile_id = selected_pid
        st.rerun()

    # Create New Profile Expander
    with st.expander("➕ Create New Profile"):
        new_name = st.text_input("Handle:")
        new_avatar = st.selectbox("Avatar:", ["⚡", "🧠", "👑", "🎯", "🔥", "💎"])
        if st.button("Save & Switch Profile"):
            if new_name.strip():
                new_id = f"user_{int(time.time())}"
                st.session_state.profiles[new_id] = {
                    "name": new_name.strip(),
                    "avatar": new_avatar,
                    "is_guest": False,
                    "levels": {i: {"unlocked": i == 1, "completed": False, "stars": 0, "best_score": 0} for i in range(1, 33)}
                }
                st.session_state.active_profile_id = new_id
                st.success("Profile created!")
                st.rerun()

    st.divider()

    # Quick Navigation
    if st.button("🗺 Campaign Map", use_container_width=True):
        st.session_state.view_state = "level_select"
        st.session_state.selected_option = None
        st.rerun()
        
    if st.button("🏆 Global Hall of Fame", use_container_width=True):
        st.session_state.view_state = "leaderboard"
        st.rerun()

    # How to Play Expander
    with st.expander("📖 How to Play & Rules"):
        st.markdown("""
        **1. 6 Reasoning & Trivia Categories:**
        - **Visual Analogies:** Shape transformations ($A : B :: C : ?$).
        - **Code & Ciphers:** Letter shift rules.
        - **Venn Logic:** Set relationships.
        - **Series:** Difference step rules.
        - **World Maps & Capitals:** Country silhouettes & trivia.
        - **Sports & Culture:** Milestone records & rules.

        **2. Star Rating Speed System:**
        - ⭐⭐⭐ 3 Stars: Solve $\le 15$s
        - ⭐⭐ 2 Stars: Solve $\le 30$s
        - ⭐ 1 Star: Correct Answer
        """)

# Header Banner
st.markdown(f"""
<div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0;">
    <div>
        <h1 style="margin: 0; background: linear-gradient(90deg, #00f3ff, #a855f7, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">LOGIC LINK: NEXUS</h1>
        <p style="margin: 0; color: #94a3b8; font-family: monospace; font-size: 0.85rem;">INVESTOR SHOWCASE • 32 STAGES ACROSS 4 TIERS</p>
    </div>
    <div style="text-align: right; background: rgba(13, 19, 34, 0.8); padding: 8px 16px; border-radius: 12px; border: 1px solid rgba(168, 85, 247, 0.4);">
        <span style="font-size: 1.2rem;">{active_profile['avatar']}</span>
        <strong style="color: #f1f5f9; margin-left: 8px;">{active_profile['name']}</strong>
    </div>
</div>
""", unsafe_allow_html=True)

st.divider()

# Main View Router
if st.session_state.view_state == "level_select":
    st.subheader("🗺 Campaign Stage Map")
    
    tiers = [
        ("TIER 1: ROOKIE WARM-UP (BEGINNER 1–8)", range(1, 9), "#00f3ff"),
        ("TIER 2: APTITUDE STANDARD (INTERMEDIATE 9–16)", range(9, 17), "#a855f7"),
        ("TIER 3: GEO MAPS & SPORTS (EXPERT 17–24)", range(17, 25), "#ec4899"),
        ("TIER 4: MASTER BENCHMARK (GENIUS 25–32)", range(25, 33), "#f59e0b"),
    ]

    for title, lvl_range, color in tiers:
        st.markdown(f"<h4 style='color: {color}; margin-top: 15px;'>{title}</h4>", unsafe_allow_html=True)
        cols = st.columns(8)
        for idx, lvl_num in enumerate(lvl_range):
            lvl_info = active_profile["levels"][lvl_num]
            with cols[idx]:
                if lvl_info["unlocked"]:
                    stars_str = "⭐" * lvl_info["stars"] if lvl_info["stars"] > 0 else "•"
                    if st.button(f"S{lvl_num}\n{stars_str}", key=f"lvl_{lvl_num}"):
                        st.session_state.active_level = lvl_num
                        st.session_state.view_state = "playing"
                        st.session_state.puzzle_start_time = time.time()
                        st.session_state.selected_option = None
                        st.rerun()
                else:
                    st.button(f"🔒 {lvl_num}", key=f"lvl_{lvl_num}", disabled=True)

elif st.session_state.view_state == "playing":
    puzzle = LogicEngine.generate_puzzle(st.session_state.active_level)
    
    st.markdown(f"""
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
        <span class="badge-tier">STAGE {puzzle['level_number']} • {puzzle['category_title'].upper()}</span>
        <span style="font-family: monospace; color: #94a3b8;">DIFFICULTY: {puzzle['difficulty'].upper()}</span>
    </div>
    """, unsafe_allow_html=True)
    
    # Puzzle Display Card
    with st.container():
        st.markdown('<div class="card-box">', unsafe_allow_html=True)
        
        if puzzle["category"] == "analogy":
            col1, col2, col3, col4 = st.columns(4)
            col1.info(f"**Shape A:**\n\n{puzzle['data']['shapeA']}")
            col2.success(f"**Shape B:**\n\n{puzzle['data']['shapeB']}")
            col3.warning(f"**Shape C:**\n\n{puzzle['data']['shapeC']}")
            col4.error("**Shape D:**\n\n❓")
        elif puzzle["category"] == "cipher":
            st.info(f"**Example Cipher Pair:** {puzzle['data']['w1']} ➔ {puzzle['data']['c1']}")
            st.subheader(f"Decode Target: **{puzzle['data']['w2']}** ➔ **?**")
        elif puzzle["category"] == "venn":
            st.write("Analyze Relationship between 3 items:")
            st.success(f"1. {puzzle['data']['itemA']}  •  2. {puzzle['data']['itemB']}  •  3. {puzzle['data']['itemC']}")
        elif puzzle["category"] == "series":
            seq_str = "  ➔  ".join(map(str, puzzle['data']['sequence']))
            st.subheader(f"Sequence: {seq_str}  ➔  ❓")
        elif puzzle["category"] == "geography":
            if puzzle["data"]["type"] == "capital":
                st.subheader(f"{puzzle['data']['flag']} Capital city of {puzzle['data']['country']}?")
            else:
                st.subheader(f"{puzzle['data']['flag']} Identify Country Silhouette outline:")
                st.code(f"Continent: {puzzle['data']['continent']} | Map Silhouette D-Path: {puzzle['data']['path']}")
        elif puzzle["category"] == "sports":
            st.subheader(f"{puzzle['data']['icon']} {puzzle['data']['question']}")
        else:
            st.info(f"Premise 1: {puzzle['data']['p1']}\nPremise 2: {puzzle['data']['p2']}")
            st.subheader(puzzle['data']['question'])
            
        st.markdown('</div>', unsafe_allow_html=True)

    # Hint Expander
    with st.expander("💡 Visual Hint"):
        st.write(puzzle["hint"])

    # Options Grid
    st.write("### Choose the Correct Answer:")
    opt_cols = st.columns(2)
    for idx, opt in enumerate(puzzle["options"]):
        with opt_cols[idx % 2]:
            if st.button(f"{idx+1}. {opt['content']}", key=f"opt_btn_{opt['id']}", use_container_width=True):
                st.session_state.selected_option = opt["id"]
                time_spent = max(1, int(time.time() - st.session_state.puzzle_start_time))
                
                is_correct = opt["is_correct"]
                stars = 3 if (is_correct and time_spent <= 15) else 2 if (is_correct and time_spent <= 30) else 1 if is_correct else 0
                score = max(100, 500 - time_spent * 10) if is_correct else 0
                
                # Update Active Profile Levels
                lvl_num = st.session_state.active_level
                levels = active_profile["levels"]
                levels[lvl_num]["completed"] = True
                levels[lvl_num]["stars"] = max(levels[lvl_num]["stars"], stars)
                levels[lvl_num]["best_score"] = max(levels[lvl_num]["best_score"], score)
                if stars > 0 and lvl_num < 32:
                    levels[lvl_num + 1]["unlocked"] = True
                
                st.session_state.last_result = {
                    "is_correct": is_correct,
                    "stars": stars,
                    "score": score,
                    "time_spent": time_spent,
                    "explanation": puzzle["explanation"]
                }
                st.session_state.view_state = "result"
                st.rerun()

elif st.session_state.view_state == "result":
    res = st.session_state.last_result
    if res["is_correct"]:
        st.balloons()
        st.success(f"🎉 STAGE {st.session_state.active_level} CLEARED!")
    else:
        st.error("❌ INCORRECT DEDUCTION")
        
    cols = st.columns(3)
    cols[0].metric("Stars Earned", "⭐" * res["stars"] if res["stars"] > 0 else "None")
    cols[1].metric("Score Earned", f"+{res['score']}")
    cols[2].metric("Time Spent", f"{res['time_spent']}s")
    
    st.info(f"**Step-by-Step Logic Explanation:**\n\n{res['explanation']}")
    
    bcols = st.columns(3)
    if bcols[0].button("➡️ Next Stage", use_container_width=True):
        st.session_state.active_level = min(32, st.session_state.active_level + 1)
        st.session_state.view_state = "playing"
        st.session_state.puzzle_start_time = time.time()
        st.session_state.selected_option = None
        st.rerun()
        
    if bcols[1].button("🔄 Retry Stage", use_container_width=True):
        st.session_state.view_state = "playing"
        st.session_state.puzzle_start_time = time.time()
        st.session_state.selected_option = None
        st.rerun()
        
    if bcols[2].button("🗺 Stage Map", use_container_width=True):
        st.session_state.view_state = "level_select"
        st.rerun()

elif st.session_state.view_state == "leaderboard":
    st.subheader("🏆 Global Hall of Fame Leaderboard")
    
    leaderboard_data = []
    for pid, p in st.session_state.profiles.items():
        completed = sum(1 for lvl in p["levels"].values() if lvl["completed"])
        total_stars = sum(lvl["stars"] for lvl in p["levels"].values())
        total_score = sum(lvl["best_score"] for lvl in p["levels"].values())
        leaderboard_data.append({
            "Player": f"{p['avatar']} {p['name']}",
            "Stages Cleared": f"{completed} / 32",
            "Total Stars": total_stars,
            "Total Score": total_score
        })
        
    df = pd.DataFrame(leaderboard_data).sort_values(by="Total Score", ascending=False)
    st.dataframe(df, use_container_width=True, hide_index=True)
    
    if st.button("← Return to Stage Map"):
        st.session_state.view_state = "level_select"
        st.rerun()

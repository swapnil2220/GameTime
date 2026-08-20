# 🚀 Logic Link: AI Nexus - Architecture & AI Developer Prompt Guide

> **Official Repository**: [https://github.com/swapnil2220/GameTime.git](https://github.com/swapnil2220/GameTime.git)  
> **Live Production URL**: [https://swapnil2220.github.io/GameTime/](https://swapnil2220.github.io/GameTime/)  
> **Stack**: React 19, TypeScript, Vite 8, Tailwind CSS v4, Lucide React, Canvas Confetti, Howler Web Audio, Google Gemini REST API (`gemini-2.5-flash`).

---

## 📌 1. Executive Summary & Core Philosophy

**Logic Link: AI Nexus** is a state-of-the-art, highly addictive cognitive training and aptitude quiz application. It replaces dry trivia with procedural and generative AI reasoning puzzles, daily habit loops (Wordle/Connections-style), and luxury obsidian-gold UI micro-interactions.

### Key Highlights
- **10 Aptitude & General Knowledge Categories**: Geography, Sports, Visual Shape Analogies, Code Ciphers, Venn Diagrams, Number Series, Syllogisms, Science & Astronomy, Verbal Word Analogies, and Quick Math Logic.
- **NYT Connections 16-Tile Interactive Grid**: Group 16 shuffled tiles into 4 hidden color-coded categories with decoy traps.
- **Generative AI Studio**: Connects to Google Gemini API (`gemini-2.5-flash`) to generate dynamic 16-tile puzzles on *ANY* custom user prompt.
- **Zero-Repetition Engine**: Tracks `seenQuestionIds` per user profile to ensure 0 duplicate questions across consecutive plays.
- **Session Isolation & Profiles**: Isolated LocalStorage profiles, Guest mode, custom emoji avatars, 🔥 daily streak counter, and global score leaderboards.

---

## 📁 2. File Map & Project Structure

```
GameTime/
├── .env.example                       # Template for VITE_GEMINI_API_KEY
├── package.json                       # Dependencies & scripts (dev, build, deploy)
├── vite.config.ts                     # Vite 8 & Tailwind CSS v4 configuration (base: './')
├── src/
│   ├── types/
│   │   └── game.ts                    # Core TypeScript interfaces (AptitudeCategory, UserProfile, etc.)
│   ├── engine/
│   │   ├── seed.ts                    # PRNG SeededRandom utility
│   │   ├── sound.ts                   # Web Audio synth sound engine
│   │   ├── userManager.ts             # Profile management, LocalStorage, 0-repetition tracking
│   │   ├── aiEngine.ts                # Gemini API REST generator & smart preset fallbacks
│   │   ├── logicEngine.ts             # Master dispatcher routing 10 categories
│   │   └── categories/
│   │       ├── geography.ts           # 20+ countries, vector maps, capitals, landmarks
│   │       ├── sports.ts              # 15+ sports rules, arena trivia, scoring
│   │       ├── analogies.ts           # Visual shape transformations (outer, inner, color, rotation)
│   │       ├── ciphers.ts             # Alphabet shift ciphers (+1, +3, +5 progressive difficulty)
│   │       ├── series.ts              # Arithmetic, accelerating, and quadratic/cubic series
│   │       ├── syllogisms.ts          # 10 formal verbal logic deductions
│   │       ├── vennLogic.ts           # 10 set relationship scenarios (concentric, overlap, disjoint)
│   │       ├── science.ts             # Astronomy, physics, chemistry, biology trivia
│   │       ├── verbalAnalogies.ts     # Word relationship analogies (A : B :: C : ?)
│   │       └── mathLogic.ts           # Equation balances and mental math logic
│   ├── components/
│   │   ├── Navbar.tsx                 # Header with AI Studio button, Daily Streak, Scores, Auth
│   │   ├── BackgroundCanvas.tsx       # Obsidian slate background with floating gold constellation dust
│   │   ├── LevelSelect.tsx            # 30-stage campaign map (Tiers 1-3) & Featured Daily AI card
│   │   ├── PuzzleRunner.tsx           # Active stage runner with visual hints & explanations
│   │   ├── ConnectionsGrid.tsx        # 16-tile NYT Connections grouping grid
│   │   ├── AIStudioModal.tsx          # Custom AI prompt generator & Gemini API key input
│   │   ├── UserAuthModal.tsx          # Session switcher, avatar picker, reset, delete account
│   │   ├── ShareScoreModal.tsx        # Copyable Wordle/Connections style emoji scorecards
│   │   ├── HowToPlayModal.tsx         # Interactive rulebook for all 10 categories
│   │   ├── Leaderboard.tsx            # Unified global score ranking view
│   │   ├── ResultModal.tsx font       # Stage completion performance report (1-3 stars)
│   │   └── categoryViews/             # 10 custom visual rendering components
│   └── App.tsx                        # Master application state router
```

---

## 🛠 3. System Architecture & Data Flow

### A. Master Category Engine (`logicEngine.ts`)
`generateAptitudePuzzle(levelNumber, category?, seed?, seenIds?)`
- **Difficulty Tier Scaling**:
  - **Stages 1–10 (Beginner)**: $+1$ ciphers, simple arithmetic series, direct capitals.
  - **Stages 11–20 (Intermediate)**: $+3$ ciphers, accelerating step series, landmark trivia.
  - **Stages 21–30 (Expert)**: $+5$ ciphers, cubic/quadratic series, map silhouettes.
- **Strict 4-Option Guarantee**: Every category generator includes a fallback loop ensuring `options.length === 4` with unique distractors.

### B. Generative AI Engine (`aiEngine.ts`)
`fetchLiveGeminiConnectionsPuzzle(topicPrompt, apiKey?)`
- Endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`
- Structured JSON output with 4 categories (Yellow, Green, Blue, Purple) and 16 total items.
- Fallback: Uses `generateAIConnectionsPuzzle(topicPrompt)` with smart local presets if offline or no key.

### C. Profile & Session Manager (`userManager.ts`)
- Storage Key: `logic_link_users_v3`.
- Active Key: `logic_link_active_user_id`.
- Auto-initializes Guest profiles (`Guest_XXXX`).
- Tracks `seenQuestionIds` to prevent repeating questions.
- Functions: `getActiveUser()`, `switchOrRegisterUser()`, `recordSeenQuestion()`, `resetUserProgress()`, `deleteUserAccount()`.

---

## 🤖 4. Copy-Paste Prompts for Future Gemini Enhancements

When starting a new chat with Gemini, copy and paste any of the following prompts to immediately implement next-generation features:

### Prompt 1: Add Real-Time AI Coach / Hint System
```
I am enhancing "Logic Link: AI Nexus" (React 19 + TypeScript + Vite + Gemini API).
Please examine src/components/PuzzleRunner.tsx and src/engine/aiEngine.ts.
I want to add a real-time "Nexus AI Tutor" drawer during puzzle play. 
When the user clicks "Ask AI Tutor", query Gemini API (gemini-2.5-flash) to generate a personalized, witty 2-sentence hint tailored to the active puzzle and the player's elapsed time, without revealing the direct answer. Include loading UI and error handling.
```

### Prompt 2: Expand to 100 Campaign Stages with Boss Levels
```
I am enhancing "Logic Link: AI Nexus" (React 19 + TypeScript).
Please examine src/components/LevelSelect.tsx, src/engine/userManager.ts, and src/engine/logicEngine.ts.
I want to expand the campaign map from 30 to 100 stages organized in 10 Tiers of 10 levels each.
Every 10th level (Stage 10, 20, 30... 100) should be a "Boss Stage" featuring a timed 16-tile AI Connections Grid challenge instead of a single question. Update level unlocked logic and star rating thresholds accordingly.
```

### Prompt 3: Add PWA Support for Mobile Installation & Offline Caching
```
I am enhancing "Logic Link: AI Nexus" (Vite 8 + React 19).
Please update vite.config.ts, index.html, and create public/manifest.json & public/sw.js.
Enable full Progressive Web App (PWA) capabilities so users on iOS and Android can tap "Add to Home Screen" to install Logic Link as a standalone native app with offline asset caching and custom app icon badges.
```

### Prompt 4: Add Firebase / Supabase Live Cloud Leaderboards & Auth
```
I am enhancing "Logic Link: AI Nexus".
Please examine src/engine/userManager.ts, src/components/Leaderboard.tsx, and src/components/UserAuthModal.tsx.
Refactor the local user manager to sync profile scores, stars, daily streaks, and leaderboard rankings with a Firebase / Supabase cloud database while preserving offline local fallback mode when network connection is unavailable.
```

---

## 📋 5. How to Build & Deploy

```bash
# Install dependencies
npm install

# Run local development server (port 5173 / 5177)
npm run dev

# Test TypeScript typechecking & Vite production build
npm run build

# Deploy live static build to GitHub Pages (gh-pages branch)
npm run deploy
```

---
*Documentation compiled for Logic Link: AI Nexus V3 (2026).*

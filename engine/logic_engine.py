import random
import time

class LogicEngine:
    COLORS = ['#00f3ff', '#a855f7', '#10b981', '#f59e0b', '#ec4899', '#3b82f6']

    GEO_DATABASE = [
        {"country": "Japan", "capital": "Tokyo", "continent": "Asia", "flag": "🇯🇵", "path": "M 30,20 Q 40,10 60,25 Q 70,40 50,60 Q 30,70 20,50 Z"},
        {"country": "Italy", "capital": "Rome", "continent": "Europe", "flag": "🇮🇹", "path": "M 20,10 L 40,20 L 50,50 L 60,70 L 40,65 L 30,45 Z"},
        {"country": "France", "capital": "Paris", "continent": "Europe", "flag": "🇫🇷", "path": "M 30,10 L 60,10 L 70,40 L 50,70 L 20,50 Z"},
        {"country": "Brazil", "capital": "Brasília", "continent": "South America", "flag": "🇧🇷", "path": "M 20,20 L 70,15 L 60,65 L 30,70 L 15,40 Z"},
        {"country": "Egypt", "capital": "Cairo", "continent": "Africa", "flag": "🇪🇬", "path": "M 15,15 L 75,15 L 75,65 L 15,65 Z"},
        {"country": "Australia", "capital": "Canberra", "continent": "Oceania", "flag": "🇦🇺", "path": "M 15,30 Q 30,10 70,20 Q 80,50 60,70 Q 20,70 15,30 Z"},
        {"country": "Canada", "capital": "Ottawa", "continent": "North America", "flag": "🇨🇦", "path": "M 10,20 L 80,15 L 75,60 L 15,60 Z"},
        {"country": "India", "capital": "New Delhi", "continent": "Asia", "flag": "🇮🇳", "path": "M 20,10 L 70,10 L 45,75 Z"},
    ]

    SPORTS_DATABASE = [
        {
            "question": "How many players are on the field for one team in a standard Soccer match?",
            "correct": "11 Players",
            "wrong": ["9 Players", "10 Players", "12 Players"],
            "icon": "⚽",
            "explanation": "A standard soccer team fields 11 players including 1 goalkeeper."
        },
        {
            "question": "Which country has won the most FIFA Men's World Cup titles (5 titles)?",
            "correct": "Brazil",
            "wrong": ["Germany", "Argentina", "Italy"],
            "icon": "🏆",
            "explanation": "Brazil holds the record with 5 victories (1958, 1962, 1970, 1994, 2002)."
        },
        {
            "question": "In Tennis, what is the term for a score of 40-40?",
            "correct": "Deuce",
            "wrong": ["Love", "Fault", "Advantage"],
            "icon": "🎾",
            "explanation": "When both players reach 40 points in a game, the score is termed Deuce."
        },
        {
            "question": "How many rings make up the official Olympic symbol?",
            "correct": "5 Rings",
            "wrong": ["4 Rings", "6 Rings", "7 Rings"],
            "icon": "🥇",
            "explanation": "The 5 interlocking rings represent the five inhabited continents."
        },
        {
            "question": "What is the maximum break score in a single frame of Snooker?",
            "correct": "147",
            "wrong": ["150", "140", "180"],
            "icon": "🎱",
            "explanation": "15 reds with 15 blacks followed by all colors yields a maximum score of 147."
        }
    ]

    SYLLOGISM_DATABASE = [
        {
            "premise1": "All Architects are Designers.",
            "premise2": "All Designers are Creators.",
            "question": "Which conclusion MUST be logically true?",
            "correct": "All Architects are Creators.",
            "wrong": ["All Creators are Architects.", "No Architects are Creators.", "Some Creators are not Designers."],
            "explanation": "Transit Rule: A ⊂ B and B ⊂ C implies A ⊂ C."
        },
        {
            "premise1": "All Robots are Machines.",
            "premise2": "Some Machines are Autonomous.",
            "question": "Which statement is ALWAYS true based ONLY on the premises?",
            "correct": "Some Machines are Robots.",
            "wrong": ["All Robots are Autonomous.", "No Machines are Robots.", "All Autonomous items are Robots."],
            "explanation": "Since All Robots are Machines, it follows directly that Some Machines are Robots."
        }
    ]

    VENN_DATABASE = [
        {
            "itemA": "Mammals", "itemB": "Dogs", "itemC": "Golden Retrievers",
            "type": "concentric",
            "explanation": "Golden Retrievers ⊂ Dogs ⊂ Mammals (Concentric Subsets)."
        },
        {
            "itemA": "Teachers", "itemB": "Writers", "itemC": "Musicians",
            "type": "overlapping",
            "explanation": "People can belong to any combination of these 3 categories (Intersection)."
        },
        {
            "itemA": "Cars", "itemB": "Bicycles", "itemC": "Airplanes",
            "type": "disjoint",
            "explanation": "Mutually exclusive transport modes (Disjoint Groups)."
        }
    ]

    @staticmethod
    def generate_puzzle(level_number):
        random.seed(level_number * 100 + int(time.time() // 3600))
        
        categories = ['analogy', 'cipher', 'venn', 'series', 'geography', 'sports', 'syllogism']
        category = categories[(level_number - 1) % len(categories)]
        
        difficulty = "Beginner" if level_number <= 8 else "Intermediate" if level_number <= 16 else "Expert" if level_number <= 24 else "Master"
        
        if category == 'analogy':
            return LogicEngine._generate_analogy(level_number, difficulty)
        elif category == 'cipher':
            return LogicEngine._generate_cipher(level_number, difficulty)
        elif category == 'venn':
            return LogicEngine._generate_venn(level_number, difficulty)
        elif category == 'series':
            return LogicEngine._generate_series(level_number, difficulty)
        elif category == 'geography':
            return LogicEngine._generate_geography(level_number, difficulty)
        elif category == 'sports':
            return LogicEngine._generate_sports(level_number, difficulty)
        else:
            return LogicEngine._generate_syllogism(level_number, difficulty)

    @staticmethod
    def _generate_analogy(level_number, difficulty):
        outers = ['circle', 'square', 'triangle', 'pentagon']
        inners = ['star', 'diamond', 'cross', 'dot']
        
        c1, c2 = LogicEngine.COLORS[0], LogicEngine.COLORS[1]
        c3, c4 = LogicEngine.COLORS[2], LogicEngine.COLORS[3]

        shapeA = {
            "outerShape": outers[0], "innerShape": inners[0],
            "outerColor": c1, "innerColor": c2, "rotation": 0
        }
        shapeB = {
            "outerShape": outers[0], "innerShape": inners[0],
            "outerColor": c2, "innerColor": c1, "rotation": 0
        }
        shapeC = {
            "outerShape": outers[1], "innerShape": inners[1],
            "outerColor": c3, "innerColor": c4, "rotation": 0
        }
        shapeD = {
            "outerShape": outers[1], "innerShape": inners[1],
            "outerColor": c4, "innerColor": c3, "rotation": 0
        }

        options = [
            {"id": "opt_c", "content": shapeD, "is_correct": True},
            {"id": "opt_w1", "content": {**shapeC, "outerColor": "#ef4444"}, "is_correct": False},
            {"id": "opt_w2", "content": {**shapeD, "rotation": 90}, "is_correct": False},
            {"id": "opt_w3", "content": {**shapeD, "innerShape": "cross"}, "is_correct": False},
        ]
        random.shuffle(options)

        return {
            "id": f"analogy_{level_number}",
            "category": "analogy",
            "category_title": "Visual Shape Analogy",
            "difficulty": difficulty,
            "level_number": level_number,
            "data": {
                "shapeA": shapeA,
                "shapeB": shapeB,
                "shapeC": shapeC,
            },
            "options": options,
            "explanation": "Rule: Shape A swaps outer and inner colors to form Shape B. Applying this exact rule to Shape C produces Shape D.",
            "hint": "Observe how outer border color and inner fill color invert from A to B."
        }

    @staticmethod
    def _generate_cipher(level_number, difficulty):
        words = ['CODE', 'LINK', 'MIND', 'STAR', 'WAVE', 'PEAK', 'NEXUS', 'GRID']
        w1 = random.choice(words)
        w2 = random.choice([w for w in words if w != w1])
        shift = 1 if difficulty == "Beginner" else 2 if difficulty == "Intermediate" else 3
        
        def encode(word, s):
            return "".join([chr((ord(ch) - 65 + s) % 26 + 65) for ch in word])
        
        c1 = encode(w1, shift)
        c2 = encode(w2, shift)
        
        options = [
            {"id": "opt_c", "content": c2, "is_correct": True},
            {"id": "opt_w1", "content": encode(w2, shift + 1), "is_correct": False},
            {"id": "opt_w2", "content": encode(w2, max(1, shift - 1)), "is_correct": False},
            {"id": "opt_w3", "content": w2[::-1], "is_correct": False},
        ]
        random.shuffle(options)
        
        return {
            "id": f"cipher_{level_number}",
            "category": "cipher",
            "category_title": "Code & Cipher Decoding",
            "difficulty": difficulty,
            "level_number": level_number,
            "data": {
                "w1": w1, "c1": c1, "w2": w2, "shift": shift
            },
            "options": options,
            "explanation": f"Each letter is shifted forward by +{shift} position(s) in the alphabet ({w1} → {c1}). Thus {w2} becomes {c2}.",
            "hint": f"Compare '{w1[0]}' to '{c1[0]}': difference is +{shift} positions."
        }

    @staticmethod
    def _generate_venn(level_number, difficulty):
        item = random.choice(LogicEngine.VENN_DATABASE)
        
        options = [
            {"id": "opt_c", "content": f"Correct Relationship: {item['type'].capitalize()}", "is_correct": True},
            {"id": "opt_w1", "content": "Disjoint Circles (Completely Separate)", "is_correct": item['type'] == 'concentric'},
            {"id": "opt_w2", "content": "Overlapping Circles (Intersection)", "is_correct": False},
            {"id": "opt_w3", "content": "Concentric Circles (Subsets)", "is_correct": False},
        ]
        for opt in options:
            if opt["id"] != "opt_c":
                opt["is_correct"] = False
        random.shuffle(options)
        
        return {
            "id": f"venn_{level_number}",
            "category": "venn",
            "category_title": "Venn Diagram Set Logic",
            "difficulty": difficulty,
            "level_number": level_number,
            "data": {
                "itemA": item["itemA"], "itemB": item["itemB"], "itemC": item["itemC"]
            },
            "options": options,
            "explanation": item["explanation"],
            "hint": f"Check if all {item['itemC']} are a subset of {item['itemB']}."
        }

    @staticmethod
    def _generate_series(level_number, difficulty):
        start = random.randint(2, 8)
        step = random.randint(2, 5)
        seq = [start, start + step, start + 2 * step, start + 3 * step]
        ans = seq[-1] + step
        
        options = [
            {"id": "opt_c", "content": str(ans), "is_correct": True},
            {"id": "opt_w1", "content": str(ans + 2), "is_correct": False},
            {"id": "opt_w2", "content": str(ans - 3), "is_correct": False},
            {"id": "opt_w3", "content": str(ans + 5), "is_correct": False},
        ]
        random.shuffle(options)
        
        return {
            "id": f"series_{level_number}",
            "category": "series",
            "category_title": "Number & Pattern Series",
            "difficulty": difficulty,
            "level_number": level_number,
            "data": {"sequence": seq},
            "options": options,
            "explanation": f"Arithmetic Progression: Add +{step} to each term. {seq[-1]} + {step} = {ans}.",
            "hint": f"Difference between terms is constant (+{step})."
        }

    @staticmethod
    def _generate_geography(level_number, difficulty):
        item = random.choice(LogicEngine.GEO_DATABASE)
        qtype = random.choice(['capital', 'map'])
        
        if qtype == 'capital':
            wrong_caps = [g['capital'] for g in LogicEngine.GEO_DATABASE if g['country'] != item['country']]
            random.shuffle(wrong_caps)
            options = [
                {"id": "opt_c", "content": item['capital'], "is_correct": True},
                {"id": "opt_w1", "content": wrong_caps[0], "is_correct": False},
                {"id": "opt_w2", "content": wrong_caps[1], "is_correct": False},
                {"id": "opt_w3", "content": wrong_caps[2], "is_correct": False},
            ]
            random.shuffle(options)
            return {
                "id": f"geo_{level_number}",
                "category": "geography",
                "category_title": "World Geography & Capitals",
                "difficulty": difficulty,
                "level_number": level_number,
                "data": {"type": "capital", "country": item["country"], "flag": item["flag"], "continent": item["continent"]},
                "options": options,
                "explanation": f"The official capital city of {item['country']} {item['flag']} is {item['capital']}.",
                "hint": f"Located in {item['continent']}."
            }
        else:
            wrong_countries = [g['country'] for g in LogicEngine.GEO_DATABASE if g['country'] != item['country']]
            random.shuffle(wrong_countries)
            options = [
                {"id": "opt_c", "content": item['country'], "is_correct": True},
                {"id": "opt_w1", "content": wrong_countries[0], "is_correct": False},
                {"id": "opt_w2", "content": wrong_countries[1], "is_correct": False},
                {"id": "opt_w3", "content": wrong_countries[2], "is_correct": False},
            ]
            random.shuffle(options)
            return {
                "id": f"geo_map_{level_number}",
                "category": "geography",
                "category_title": "Country Map Silhouette",
                "difficulty": difficulty,
                "level_number": level_number,
                "data": {"type": "map", "path": item["path"], "flag": item["flag"], "continent": item["continent"]},
                "options": options,
                "explanation": f"This map silhouette outline represents {item['country']} {item['flag']}.",
                "hint": f"Country in {item['continent']}."
            }

    @staticmethod
    def _generate_sports(level_number, difficulty):
        item = random.choice(LogicEngine.SPORTS_DATABASE)
        options = [
            {"id": "opt_c", "content": item["correct"], "is_correct": True},
            {"id": "opt_w1", "content": item["wrong"][0], "is_correct": False},
            {"id": "opt_w2", "content": item["wrong"][1], "is_correct": False},
            {"id": "opt_w3", "content": item["wrong"][2], "is_correct": False},
        ]
        random.shuffle(options)
        return {
            "id": f"sports_{level_number}",
            "category": "sports",
            "category_title": "Sports & Global Culture Trivia",
            "difficulty": difficulty,
            "level_number": level_number,
            "data": {"question": item["question"], "icon": item["icon"]},
            "options": options,
            "explanation": item["explanation"],
            "hint": f"Official rules/records for {item['icon']}."
        }

    @staticmethod
    def _generate_syllogism(level_number, difficulty):
        item = random.choice(LogicEngine.SYLLOGISM_DATABASE)
        options = [
            {"id": "opt_c", "content": item["correct"], "is_correct": True},
            {"id": "opt_w1", "content": item["wrong"][0], "is_correct": False},
            {"id": "opt_w2", "content": item["wrong"][1], "is_correct": False},
            {"id": "opt_w3", "content": item["wrong"][2], "is_correct": False},
        ]
        random.shuffle(options)
        return {
            "id": f"syll_{level_number}",
            "category": "syllogism",
            "category_title": "Speed Syllogisms",
            "difficulty": difficulty,
            "level_number": level_number,
            "data": {"p1": item["premise1"], "p2": item["premise2"], "question": item["question"]},
            "options": options,
            "explanation": item["explanation"],
            "hint": "Set inclusion: Premise 1 + Premise 2."
        }

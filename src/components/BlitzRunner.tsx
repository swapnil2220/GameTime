import React, { useState, useEffect, useRef } from 'react';
import type { AptitudePuzzle, UserProfile, BlitzResult, Option } from '../types/game';
import { generateAptitudePuzzle } from '../engine/logicEngine';
import { updateBlitzResult, updateMindMatrixRating } from '../engine/userManager';
import { isRelicActive } from '../engine/modifierEngine';
import { GeographyView } from './categoryViews/GeographyView';
import { SportsView } from './categoryViews/SportsView';
import { AnalogyShapeSVG } from './categoryViews/AnalogyView';
import { CipherView } from './categoryViews/CipherView';
import { VennView } from './categoryViews/VennView';
import { SeriesView } from './categoryViews/SeriesView';
import { SyllogismView } from './categoryViews/SyllogismView';
import { ScienceView } from './categoryViews/ScienceView';
import { VerbalAnalogyView } from './categoryViews/VerbalAnalogyView';
import { MathLogicView } from './categoryViews/MathLogicView';
import { NexusAIPersona } from './NexusAIPersona';
import { sound } from '../engine/sound';
import { Clock, Flame, Zap, Trophy, RotateCcw, CheckCircle2, XCircle, ChevronRight, Lightbulb } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BlitzRunnerProps {
  activeUser: UserProfile;
  onUserUpdated?: (user: UserProfile) => void;
  onComboChange?: (combo: number) => void;
  onBackToMap: () => void;
}

export const BlitzRunner: React.FC<BlitzRunnerProps> = ({
  activeUser,
  onUserUpdated,
  onComboChange,
  onBackToMap,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [score, setScore] = useState<number>(0);
  const [comboStreak, setComboStreak] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [questionCount, setQuestionCount] = useState<number>(1);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [totalResponseTimeMs, setTotalResponseTimeMs] = useState<number>(0);

  const [puzzle, setPuzzle] = useState<AptitudePuzzle>(() =>
    generateAptitudePuzzle(Math.floor(Math.random() * 20) + 1, undefined, undefined, activeUser.seenQuestionIds || [])
  );
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [blitzSummary, setBlitzSummary] = useState<BlitzResult | null>(null);

  const [puzzleStartTime, setPuzzleStartTime] = useState<number>(Date.now());
  const timerRef = useRef<any>(null);

  const hasOccamsRazor = isRelicActive(activeUser.activeRelics, 'occams_razor');

  // 60-Second Countdown Timer
  useEffect(() => {
    if (!isGameOver) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            finishBlitzRun();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isGameOver]);

  const getMultiplier = (combo: number) => {
    if (combo >= 10) return 5;
    if (combo >= 5) return 3;
    if (combo >= 3) return 2;
    return 1;
  };

  const nextPuzzle = () => {
    const randomLvl = Math.floor(Math.random() * 25) + 1;
    const newPuzzle = generateAptitudePuzzle(randomLvl, undefined, undefined, activeUser.seenQuestionIds || []);
    setPuzzle(newPuzzle);
    setSelectedOptionId(null);
    setShowHint(false);
    setPuzzleStartTime(Date.now());
  };

  const handleOptionSelect = (optionId: string) => {
    if (selectedOptionId !== null || isGameOver) return;

    setSelectedOptionId(optionId);
    const responseTimeMs = Date.now() - puzzleStartTime;
    setTotalResponseTimeMs((prev) => prev + responseTimeMs);

    const selectedOpt = puzzle.options.find((o: Option) => o.id === optionId);
    const isCorrect = !!selectedOpt?.isCorrect;

    const timeSpentSec = Math.max(1, Math.floor(responseTimeMs / 1000));
    updateMindMatrixRating(activeUser.id, puzzle.category, isCorrect, timeSpentSec);

    if (isCorrect) {
      sound.playCorrect();

      const newCombo = comboStreak + 1;
      setComboStreak(newCombo);
      setMaxCombo((prev) => Math.max(prev, newCombo));
      if (onComboChange) onComboChange(newCombo);

      const mult = getMultiplier(newCombo);
      const points = 100 * mult;
      setScore((prev) => prev + points);
      setCorrectCount((prev) => prev + 1);

      // Add +3s bonus time
      setTimeLeft((prev) => Math.min(99, prev + 3));
    } else {
      sound.playWrong();
      setComboStreak(0);
      if (onComboChange) onComboChange(0);

      // Deduct -5s penalty time
      setTimeLeft((prev) => Math.max(0, prev - 5));
    }

    setTimeout(() => {
      setQuestionCount((prev) => prev + 1);
      nextPuzzle();
    }, 600);
  };

  const finishBlitzRun = () => {
    setIsGameOver(true);
    sound.playDualToneChord();
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });

    const totalAnswered = questionCount;
    const accuracy = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;
    const avgResponseTimeSec =
      totalAnswered > 0 ? Math.round((totalResponseTimeMs / totalAnswered / 1000) * 10) / 10 : 0;

    const result: BlitzResult = {
      score,
      maxCombo,
      accuracy,
      avgResponseTimeSec,
      totalAnswered,
      correctCount,
    };

    setBlitzSummary(result);
    const updated = updateBlitzResult(activeUser.id, result);
    if (onUserUpdated) onUserUpdated(updated);
  };

  let visibleOptions = puzzle.options;
  if (hasOccamsRazor && puzzle.options.length === 4) {
    const wrongDistractor = puzzle.options.find((o: Option) => !o.isCorrect);
    if (wrongDistractor) {
      visibleOptions = puzzle.options.filter((o: Option) => o.id !== wrongDistractor.id);
    }
  }

  const renderCategoryBody = () => {
    if (!puzzle.renderedData) {
      return (
        <div className="text-center font-mono font-black text-base text-cyan-300 my-4">
          Select the logically correct answer below:
        </div>
      );
    }

    switch (puzzle.category) {
      case 'geography':
        return (
          <GeographyView
            country={
              puzzle.renderedData.country || {
                name: 'World Geography',
                capital: 'Capital',
                landmark: 'Landmark',
                continent: 'World',
                triviaFact: '',
                svgShapeKey: 'japan',
              }
            }
            questionText={puzzle.renderedData.questionText || 'Which country or capital is described below?'}
          />
        );
      case 'sports':
        return (
          <SportsView
            data={
              puzzle.renderedData.questionText
                ? puzzle.renderedData
                : {
                    sportName: 'Sports Arena',
                    questionText: 'Identify the correct sports rule or terminology below:',
                    icon: '🏆',
                    correctAnswer: '',
                    distractors: [],
                    explanation: '',
                    triviaFact: '',
                  }
            }
          />
        );
      case 'analogy': {
        const shapeA = puzzle.renderedData.shapeA || null;
        const shapeB = puzzle.renderedData.shapeB || null;
        const shapeC = puzzle.renderedData.shapeC || null;
        return (
          <div className="flex items-center justify-center gap-3 my-4 font-sans">
            <AnalogyShapeSVG shape={shapeA} label="SHAPE A" />
            <span className="text-slate-500 font-mono text-xl">:</span>
            <AnalogyShapeSVG shape={shapeB} label="SHAPE B" />
            <span className="text-amber-400 font-mono text-2xl font-bold">::</span>
            <AnalogyShapeSVG shape={shapeC} label="SHAPE C" />
            <span className="text-slate-500 font-mono text-xl">:</span>
            <AnalogyShapeSVG shape={null} isQuestion label="SHAPE D" />
          </div>
        );
      }
      case 'cipher':
        return (
          <CipherView
            exampleWord={puzzle.renderedData.exampleWord || 'CODE'}
            exampleCode={puzzle.renderedData.exampleCode || 'DPEF'}
            targetWord={puzzle.renderedData.targetWord || 'MIND'}
          />
        );
      case 'venn':
        return <VennView data={puzzle.renderedData} />;
      case 'series':
        return <SeriesView sequence={puzzle.renderedData.sequence || ['2', '4', '8', '16', '?']} />;
      case 'syllogism':
        return <SyllogismView data={puzzle.renderedData} />;
      case 'science':
        return <ScienceView data={puzzle.renderedData} />;
      case 'verbal_analogy':
        return <VerbalAnalogyView data={puzzle.renderedData} />;
      case 'math_logic':
        return <MathLogicView equationText={puzzle.renderedData.equationText || 'Solve for X'} />;
      default:
        return (
          <div className="text-center font-mono font-black text-base text-cyan-300 my-4">
            Select the logically correct answer below:
          </div>
        );
    }
  };

  const activeMultiplier = getMultiplier(comboStreak);

  return (
    <div className="relative z-10 w-full max-w-4xl mx-auto px-4 py-6 flex flex-col items-center font-sans">
      {/* Top Header Bar */}
      <div className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-950/90 border border-amber-500/40 backdrop-blur-xl shadow-[0_0_30px_rgba(245,158,11,0.2)] mb-6">
        <button
          onClick={onBackToMap}
          className="flex items-center gap-1 text-xs font-mono text-cyan-400 hover:text-cyan-300"
        >
          ← EXIT BLITZ
        </button>

        {/* 60s Timer with Pulsing Warning */}
        <div className="flex items-center gap-2">
          <Clock className={`w-5 h-5 ${timeLeft <= 10 ? 'text-red-500 animate-ping' : 'text-amber-400'}`} />
          <span className={`text-2xl font-black font-mono tracking-wider ${timeLeft <= 10 ? 'text-red-400' : 'text-amber-300'}`}>
            {timeLeft}s
          </span>
        </div>

        {/* Dynamic Combo Multiplier Badge */}
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-400 animate-bounce" />
          <span className="px-3 py-1 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 font-mono font-black text-black text-xs shadow-md">
            {activeMultiplier}× MULTIPLIER ({comboStreak} 🔥)
          </span>
        </div>
      </div>

      {/* Score Tracker */}
      <div className="w-full flex justify-between items-center mb-4 px-2">
        <span className="text-xs font-mono text-slate-400">QUESTION #{questionCount}</span>
        <span className="text-xl font-black font-mono text-cyan-400 tracking-wider">SCORE: {score}</span>
      </div>

      {/* Main Puzzle Card */}
      {!isGameOver && (
        <div className="w-full p-8 rounded-3xl bg-slate-950/80 border border-slate-800 backdrop-blur-2xl shadow-2xl flex flex-col items-center">
          <div className="w-full flex justify-center py-2">{renderCategoryBody()}</div>

          {/* Hint Toggle Button */}
          {puzzle.visualHint && (
            <div className="w-full flex justify-center mt-2 mb-2">
              <button
                onClick={() => {
                  setShowHint((prev) => !prev);
                  sound.playClick();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold hover:bg-amber-900/80 transition-all shadow-[0_0_12px_rgba(245,158,11,0.2)]"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                {showHint ? 'HIDE VISUAL HINT' : 'SHOW VISUAL HINT'}
              </button>
            </div>
          )}

          {/* Visual Hint Drawer */}
          {showHint && puzzle.visualHint && (
            <div className="w-full p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-xs font-mono text-amber-200 text-center mb-3 animate-fadeIn">
              💡 {puzzle.visualHint}
            </div>
          )}

          {/* Nexus AI Persona Companion */}
          <NexusAIPersona puzzle={puzzle} personaType={activeUser.preferredPersona} />

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mt-6">
            {visibleOptions.map((opt: Option, idx: number) => {
              const isSelected = selectedOptionId === opt.id;
              const showResult = selectedOptionId !== null;

              let buttonStyle =
                'bg-slate-900/70 border-slate-700/80 text-slate-200 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(0,243,255,0.2)]';

              if (showResult) {
                if (opt.isCorrect) {
                  buttonStyle =
                    'bg-emerald-950/80 border-emerald-400 text-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.4)] scale-102';
                } else if (isSelected) {
                  buttonStyle =
                    'bg-red-950/80 border-red-400 text-red-300 shadow-[0_0_25px_rgba(239,68,68,0.4)] animate-shake';
                } else {
                  buttonStyle = 'bg-slate-950/40 border-slate-900 text-slate-600 opacity-40';
                }
              }

              return (
                <button
                  key={opt.id}
                  disabled={selectedOptionId !== null}
                  onClick={() => handleOptionSelect(opt.id)}
                  className={`relative flex items-center justify-between p-4 rounded-2xl border backdrop-blur-md font-mono transition-all duration-200 ${buttonStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
                      {idx + 1}
                    </span>

                    {puzzle.category === 'analogy' ? (
                      <AnalogyShapeSVG shape={opt.content} size={60} />
                    ) : (
                      <span className="text-base font-extrabold text-cyan-300">{opt.content}</span>
                    )}
                  </div>

                  {showResult && opt.isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                  {showResult && isSelected && !opt.isCorrect && <XCircle className="w-5 h-5 text-red-400" />}
                  {!showResult && <ChevronRight className="w-5 h-5 text-slate-500" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Speed Blitz Summary Modal */}
      {isGameOver && blitzSummary && (
        <div className="w-full max-w-lg p-8 rounded-3xl bg-slate-950 border border-amber-500/50 backdrop-blur-2xl flex flex-col items-center text-center shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 p-0.5 shadow-[0_0_30px_rgba(245,158,11,0.4)] mb-4">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Trophy className="w-8 h-8 text-amber-400" />
            </div>
          </div>

          <h2 className="text-3xl font-black font-mono text-amber-300 mb-1">TIME'S UP!</h2>
          <p className="text-xs font-mono text-slate-400 mb-6">SPEED BLITZ (OVERCLOCKED) REPORT</p>

          <div className="grid grid-cols-2 gap-3 w-full mb-6 font-mono text-xs">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col items-center">
              <span className="text-slate-400">TOTAL SCORE</span>
              <span className="text-2xl font-black text-amber-400 mt-1">{blitzSummary.score}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col items-center">
              <span className="text-slate-400">MAX COMBO</span>
              <span className="text-2xl font-black text-orange-400 mt-1">{blitzSummary.maxCombo}🔥</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col items-center">
              <span className="text-slate-400">ACCURACY</span>
              <span className="text-2xl font-black text-cyan-400 mt-1">{blitzSummary.accuracy}%</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col items-center">
              <span className="text-slate-400">AVG SPEED</span>
              <span className="text-2xl font-black text-purple-400 mt-1">{blitzSummary.avgResponseTimeSec}s</span>
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full">
            <button
              onClick={() => {
                setIsGameOver(false);
                setTimeLeft(60);
                setScore(0);
                setComboStreak(0);
                setMaxCombo(0);
                setQuestionCount(1);
                setCorrectCount(0);
                setTotalResponseTimeMs(0);
                nextPuzzle();
              }}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-600 to-purple-600 font-mono font-black text-black text-sm shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              <Zap className="w-5 h-5 fill-current" /> PLAY AGAIN
            </button>

            <button
              onClick={onBackToMap}
              className="w-full py-3 rounded-2xl bg-slate-900 border border-slate-700 font-mono text-xs text-slate-300 font-bold hover:text-white"
            >
              <RotateCcw className="w-4 h-4 inline mr-2" /> RETURN TO MAP
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

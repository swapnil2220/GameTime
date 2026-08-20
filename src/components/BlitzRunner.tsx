import React, { useState, useEffect, useRef } from 'react';
import type { AptitudePuzzle, UserProfile, BlitzResult } from '../types/game';
import { generateAptitudePuzzle } from '../engine/logicEngine';
import { updateMindMatrixRating, updateBlitzResult, recordSeenQuestion } from '../engine/userManager';
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
import { sound } from '../engine/sound';
import { Clock, Trophy, Flame, RotateCcw, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BlitzRunnerProps {
  activeUser: UserProfile;
  onUserUpdated: (user: UserProfile) => void;
  onBackToMap: () => void;
  onComboChange?: (streak: number) => void;
}

export const BlitzRunner: React.FC<BlitzRunnerProps> = ({
  activeUser,
  onUserUpdated,
  onBackToMap,
  onComboChange,
}) => {
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [comboStreak, setComboStreak] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  const [questionCount, setQuestionCount] = useState(1);
  const [puzzle, setPuzzle] = useState<AptitudePuzzle>(() =>
    generateAptitudePuzzle(Math.min(30, Math.floor(Math.random() * 20) + 1), undefined, undefined, activeUser.seenQuestionIds || [])
  );
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  const [totalResponseTimeSec, setTotalResponseTimeSec] = useState<number>(0);

  const timerRef = useRef<any>(null);
  const transitionTimerRef = useRef<any>(null);

  const getMultiplier = (streak: number) => {
    if (streak >= 8) return 5;
    if (streak >= 5) return 3;
    if (streak >= 3) return 2;
    return 1;
  };

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleEndBlitz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    };
  }, []);

  const loadNextPuzzle = () => {
    const randomLevel = Math.min(30, Math.floor(Math.random() * 25) + 1);
    const newPuzzle = generateAptitudePuzzle(
      randomLevel,
      undefined,
      undefined,
      activeUser.seenQuestionIds || []
    );
    setPuzzle(newPuzzle);
    recordSeenQuestion(activeUser.id, newPuzzle.id);
    setSelectedOptionId(null);
    setQuestionStartTime(Date.now());
  };

  const handleEndBlitz = () => {
    setIsGameOver(true);
    sound.playDualToneChord();
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
  };

  const handleOptionSelect = (optionId: string) => {
    if (selectedOptionId !== null || isGameOver) return;

    setSelectedOptionId(optionId);
    const responseSec = Math.max(1, Math.floor((Date.now() - questionStartTime) / 1000));
    setTotalResponseTimeSec((prev) => prev + responseSec);
    setTotalAnswered((prev) => prev + 1);

    const selectedOpt = puzzle.options.find((o) => o.id === optionId);
    const isCorrect = !!selectedOpt?.isCorrect;

    const updatedUser = updateMindMatrixRating(activeUser.id, puzzle.category, isCorrect, responseSec);

    if (isCorrect) {
      const newStreak = comboStreak + 1;
      setComboStreak(newStreak);
      if (onComboChange) onComboChange(newStreak);
      setMaxCombo((prev) => Math.max(prev, newStreak));
      setCorrectCount((prev) => prev + 1);

      const multiplier = getMultiplier(newStreak);
      const points = 100 * multiplier;
      setScore((prev) => prev + points);
      setTimeLeft((prev) => Math.min(99, prev + 3));

      sound.playComboNote(newStreak);
    } else {
      setComboStreak(0);
      if (onComboChange) onComboChange(0);
      setTimeLeft((prev) => Math.max(0, prev - 5));
      sound.playWrong();
    }

    onUserUpdated(updatedUser);

    transitionTimerRef.current = setTimeout(() => {
      if (timeLeft > 0) {
        setQuestionCount((prev) => prev + 1);
        loadNextPuzzle();
      }
    }, 600);
  };

  useEffect(() => {
    if (isGameOver) {
      const accuracy = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;
      const avgResponse = totalAnswered > 0 ? Math.round((totalResponseTimeSec / totalAnswered) * 10) / 10 : 0;

      const result: BlitzResult = {
        score,
        maxCombo,
        accuracy,
        avgResponseTimeSec: avgResponse,
        totalAnswered,
        correctCount,
      };

      const updated = updateBlitzResult(activeUser.id, result);
      onUserUpdated(updated);
    }
  }, [isGameOver]);

  const renderCategoryBody = () => {
    switch (puzzle.category) {
      case 'geography':
        return (
          <GeographyView
            country={puzzle.renderedData.country}
            questionText={puzzle.renderedData.questionText}
          />
        );
      case 'sports':
        return <SportsView data={puzzle.renderedData} />;
      case 'analogy': {
        const { shapeA, shapeB, shapeC } = puzzle.renderedData;
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
            exampleWord={puzzle.renderedData.exampleWord}
            exampleCode={puzzle.renderedData.exampleCode}
            targetWord={puzzle.renderedData.targetWord}
          />
        );
      case 'venn':
        return <VennView data={puzzle.renderedData} />;
      case 'series':
        return <SeriesView sequence={puzzle.renderedData.sequence} />;
      case 'syllogism':
        return <SyllogismView data={puzzle.renderedData} />;
      case 'science':
        return <ScienceView data={puzzle.renderedData} />;
      case 'verbal_analogy':
        return <VerbalAnalogyView data={puzzle.renderedData} />;
      case 'math_logic':
        return <MathLogicView equationText={puzzle.renderedData.equationText} />;
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
      <div className="w-full p-8 rounded-3xl bg-slate-950/80 border border-slate-800 backdrop-blur-2xl shadow-2xl flex flex-col items-center">
        <div className="w-full flex justify-center py-2">{renderCategoryBody()}</div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mt-6">
          {puzzle.options.map((opt, idx) => {
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
                disabled={selectedOptionId !== null || isGameOver}
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
              </button>
            );
          })}
        </div>
      </div>

      {/* End of Blitz Summary Modal */}
      {isGameOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-2xl font-sans animate-fadeIn">
          <div className="w-full max-w-lg p-8 rounded-3xl bg-slate-950 border border-amber-500/50 shadow-2xl flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-red-500 p-0.5 shadow-[0_0_30px_rgba(245,158,11,0.5)] mb-4">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Trophy className="w-8 h-8 text-amber-400" />
              </div>
            </div>

            <h2 className="text-3xl font-black font-mono tracking-wider text-amber-300 mb-1">
              SPEED BLITZ COMPLETED!
            </h2>
            <p className="text-xs font-mono text-slate-400 mb-6">OVERCLOCKED COGNITIVE SESSION REPORT</p>

            <div className="grid grid-cols-2 gap-3 w-full mb-6">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col items-center">
                <span className="text-[10px] font-mono text-slate-400">TOTAL SCORE</span>
                <span className="text-2xl font-black font-mono text-amber-400 mt-1">+{score}</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col items-center">
                <span className="text-[10px] font-mono text-slate-400">MAX STREAK</span>
                <span className="text-2xl font-black font-mono text-orange-400 mt-1">{maxCombo} 🔥</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col items-center">
                <span className="text-[10px] font-mono text-slate-400">ACCURACY</span>
                <span className="text-2xl font-black font-mono text-emerald-400 mt-1">
                  {totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0}%
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col items-center">
                <span className="text-[10px] font-mono text-slate-400">AVG SPEED</span>
                <span className="text-2xl font-black font-mono text-cyan-400 mt-1">
                  {totalAnswered > 0 ? (totalResponseTimeSec / totalAnswered).toFixed(1) : 0}s
                </span>
              </div>
            </div>

            <div className="flex gap-3 w-full">
              <button
                onClick={() => {
                  setIsGameOver(false);
                  setTimeLeft(60);
                  setScore(0);
                  setComboStreak(0);
                  setMaxCombo(0);
                  setTotalAnswered(0);
                  setCorrectCount(0);
                  setTotalResponseTimeSec(0);
                  setQuestionCount(1);
                  loadNextPuzzle();
                }}
                className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-600 to-purple-600 font-mono font-extrabold text-black text-sm shadow-[0_0_25px_rgba(245,158,11,0.4)] hover:scale-105 transition-all"
              >
                <RotateCcw className="w-4 h-4" /> PLAY AGAIN
              </button>

              <button
                onClick={onBackToMap}
                className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-slate-900 border border-slate-700 font-mono font-extrabold text-slate-300 text-sm hover:text-white transition-all"
              >
                STAGE MAP <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

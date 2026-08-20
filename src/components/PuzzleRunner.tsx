import React, { useState, useEffect, useRef } from 'react';
import type { AptitudePuzzle, UserProfile, Option } from '../types/game';
import { generateAptitudePuzzle } from '../engine/logicEngine';
import { recordSeenQuestion } from '../engine/userManager';
import { ALL_RELICS, isRelicActive } from '../engine/modifierEngine';
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
import { Lightbulb, ChevronRight, CheckCircle2, XCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PuzzleRunnerProps {
  activeUser: UserProfile;
  levelNumber: number;
  onCompleteLevel: (stars: number, score: number, timeSec: number) => void;
  onBackToMap: () => void;
  onUserUpdated?: (user: UserProfile) => void;
}

export const PuzzleRunner: React.FC<PuzzleRunnerProps> = ({
  activeUser,
  levelNumber,
  onCompleteLevel,
  onBackToMap,
}) => {
  const [puzzle, setPuzzle] = useState<AptitudePuzzle>(() =>
    generateAptitudePuzzle(levelNumber, undefined, undefined, activeUser.seenQuestionIds || [])
  );
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [elapsedSec, setElapsedSec] = useState(0);

  const timeoutRef = useRef<any>(null);

  const hasOccamsRazor = isRelicActive(activeUser.activeRelics, 'occams_razor');
  const hasChronosLens = isRelicActive(activeUser.activeRelics, 'chronos_lens');

  useEffect(() => {
    const newPuzzle = generateAptitudePuzzle(
      levelNumber,
      undefined,
      undefined,
      activeUser.seenQuestionIds || []
    );
    setPuzzle(newPuzzle);
    recordSeenQuestion(activeUser.id, newPuzzle.id);

    setSelectedOptionId(null);
    setShowExplanation(false);
    const now = Date.now();
    setStartTime(now);
    setElapsedSec(0);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [levelNumber, activeUser.id]);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSec(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime]);

  const handleBackToMap = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    onBackToMap();
  };

  const handleOptionSelect = (optionId: string) => {
    if (selectedOptionId !== null) return;

    setSelectedOptionId(optionId);
    sound.playClick();

    const selectedOpt = puzzle.options.find((o: Option) => o.id === optionId);
    const isCorrect = !!selectedOpt?.isCorrect;

    if (isCorrect) {
      sound.playCorrect();
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    } else {
      sound.playWrong();
    }

    setShowExplanation(true);

    let timeSpent = Math.max(1, Math.floor((Date.now() - startTime) / 1000));
    if (hasChronosLens) timeSpent = Math.max(1, timeSpent - 5);

    let stars = 1;
    if (isCorrect) {
      if (timeSpent <= 15) stars = 3;
      else if (timeSpent <= 30) stars = 2;
    } else {
      stars = 0;
    }

    let score = isCorrect ? Math.max(100, 500 - timeSpent * 10) : 0;
    if (hasOccamsRazor && isCorrect) score = Math.round(score * 0.75);

    timeoutRef.current = setTimeout(() => {
      onCompleteLevel(stars, score, timeSpent);
    }, 1800);
  };

  let visibleOptions = puzzle.options;
  if (hasOccamsRazor && puzzle.options.length === 4) {
    const wrongDistractor = puzzle.options.find((o: Option) => !o.isCorrect);
    if (wrongDistractor) {
      visibleOptions = puzzle.options.filter((o: Option) => o.id !== wrongDistractor.id);
    }
  }

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

  return (
    <div className="relative z-10 w-full max-w-4xl mx-auto px-4 py-6 flex flex-col items-center font-sans">
      {/* Top Level Runner Header */}
      <div className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-950/80 border border-slate-800 backdrop-blur-xl shadow-xl mb-6">
        <button
          onClick={handleBackToMap}
          className="flex items-center gap-1 text-xs font-mono text-cyan-400 hover:text-cyan-300"
        >
          ← STAGE MAP
        </button>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-xl bg-purple-950/80 border border-purple-500/40 text-purple-300 text-xs font-mono font-bold uppercase">
            STAGE {levelNumber} • {puzzle.categoryTitle} ({puzzle.difficulty.toUpperCase()})
          </span>
        </div>

        {/* Active Relics Badges */}
        {activeUser.activeRelics && activeUser.activeRelics.length > 0 && (
          <div className="hidden sm:flex items-center gap-1">
            {activeUser.activeRelics.map((rId) => {
              const r = ALL_RELICS.find((rel) => rel.id === rId);
              return (
                <span
                  key={rId}
                  className="px-2 py-0.5 rounded-lg bg-amber-950/80 border border-amber-500/40 text-amber-300 text-[10px] font-mono"
                  title={r?.description}
                >
                  {r?.icon} {r?.name}
                </span>
              );
            })}
          </div>
        )}

        <span className="text-xs font-mono text-slate-400">TIME: {elapsedSec}s</span>
      </div>

      {/* Main Puzzle Area */}
      <div className="w-full p-8 rounded-3xl bg-slate-950/80 border border-slate-800 backdrop-blur-2xl shadow-2xl flex flex-col items-center">
        <div className="w-full flex justify-center py-2">{renderCategoryBody()}</div>

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

        {/* Step-by-step logic explanation card */}
        {showExplanation && (
          <div className="w-full mt-6 p-4 rounded-2xl bg-purple-950/40 border border-purple-500/40 text-xs font-mono text-purple-200 flex flex-col gap-2 shadow-[0_0_20px_rgba(168,85,247,0.15)] animate-fadeIn">
            <div className="flex items-center gap-2 text-purple-400 font-extrabold">
              <Lightbulb className="w-4 h-4" /> EASY STEP-BY-STEP EXPLANATION
            </div>
            <p>{puzzle.explanation}</p>
          </div>
        )}
      </div>
    </div>
  );
};

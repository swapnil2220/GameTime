import React, { useState, useEffect, useRef } from 'react';
import type { UserProfile, GhostRunData, GhostTelemetryFrame, AptitudePuzzle } from '../types/game';
import { generateAptitudePuzzle } from '../engine/logicEngine';
import { sound } from '../engine/sound';
import { Swords, Copy, Check, Play, RotateCcw, Trophy, Clock, XCircle, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface GhostDuelModalProps {
  activeUser: UserProfile;
  initialGhostData?: GhostRunData | null;
  onBackToMap: () => void;
}

export function exportGhostRunToBase64(run: GhostRunData): string {
  try {
    const jsonStr = JSON.stringify(run);
    return btoa(encodeURIComponent(jsonStr));
  } catch (e) {
    return '';
  }
}

export function importGhostRunFromBase64(base64Str: string): GhostRunData | null {
  try {
    const jsonStr = decodeURIComponent(atob(base64Str));
    return JSON.parse(jsonStr);
  } catch (e) {
    return null;
  }
}

export const GhostDuelModal: React.FC<GhostDuelModalProps> = ({
  activeUser,
  initialGhostData,
  onBackToMap,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const [ghostRun, setGhostRun] = useState<GhostRunData | null>(initialGhostData || null);
  const [copiedLink, setCopiedLink] = useState(false);

  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [ghostScore, setGhostScore] = useState(0);
  const [isDuelActive, setIsDuelActive] = useState(false);
  const [isDuelComplete, setIsDuelComplete] = useState(false);

  const [startTime, setStartTime] = useState(Date.now());
  const [elapsedSec, setElapsedSec] = useState(0);
  const [splitDeltaSec, setSplitDeltaSec] = useState<number | null>(null);

  const [telemetry, setTelemetry] = useState<GhostTelemetryFrame[]>([]);
  const [puzzle, setPuzzle] = useState<AptitudePuzzle>(() => generateAptitudePuzzle(currentStep + 1, undefined, 424242));
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (isDuelActive && !isDuelComplete) {
      timerRef.current = setInterval(() => {
        setElapsedSec(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isDuelActive, isDuelComplete, startTime]);

  const startNewDuel = (customGhost?: GhostRunData) => {
    if (customGhost) setGhostRun(customGhost);
    setCurrentStep(0);
    setScore(0);
    setGhostScore(0);
    setTelemetry([]);
    setIsDuelActive(true);
    setIsDuelComplete(false);
    const now = Date.now();
    setStartTime(now);
    setElapsedSec(0);

    const seedVal = 424242;
    setPuzzle(generateAptitudePuzzle(1, undefined, seedVal));
    setSelectedOptionId(null);
  };

  const handleOptionSelect = (optId: string) => {
    if (selectedOptionId !== null || isDuelComplete) return;

    setSelectedOptionId(optId);
    const nowMs = Date.now() - startTime;
    const isCorrect = puzzle.options.find((o) => o.id === optId)?.isCorrect || false;

    const frame: GhostTelemetryFrame = {
      stepIndex: currentStep,
      timestampMs: nowMs,
      selectedOptionId: optId,
      isCorrect,
    };

    const newTelemetry = [...telemetry, frame];
    setTelemetry(newTelemetry);

    if (isCorrect) {
      sound.playCorrect();
      setScore((prev) => prev + 500);
    } else {
      sound.playWrong();
    }

    if (ghostRun && ghostRun.telemetry[currentStep]) {
      const ghostFrame = ghostRun.telemetry[currentStep];
      if (ghostFrame.isCorrect) setGhostScore((prev) => prev + 500);

      const deltaMs = nowMs - ghostFrame.timestampMs;
      setSplitDeltaSec(Math.round(deltaMs / 100) / 10);
    }

    setTimeout(() => {
      if (currentStep < 4) {
        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);
        setPuzzle(generateAptitudePuzzle(nextStep + 1, undefined, 424242 + nextStep * 100));
        setSelectedOptionId(null);
      } else {
        setIsDuelActive(false);
        setIsDuelComplete(true);
        sound.playDualToneChord();
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
      }
    }, 1000);
  };

  const handleShareDuelLink = () => {
    const runData: GhostRunData = {
      seedStr: todayStr,
      username: activeUser.username,
      avatar: activeUser.avatar,
      totalTimeSec: elapsedSec,
      score,
      telemetry,
    };

    const encoded = exportGhostRunToBase64(runData);
    const duelUrl = `${window.location.origin}${window.location.pathname}?duel=${encoded}`;

    navigator.clipboard.writeText(duelUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="relative z-10 w-full max-w-4xl mx-auto px-4 py-6 flex flex-col items-center font-sans">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-950/80 border border-slate-800 backdrop-blur-xl shadow-xl mb-6">
        <button
          onClick={onBackToMap}
          className="flex items-center gap-1 text-xs font-mono text-cyan-400 hover:text-cyan-300"
        >
          ← STAGE MAP
        </button>

        <div className="flex items-center gap-2 text-amber-400 font-mono font-extrabold text-sm uppercase">
          <Swords className="w-5 h-5 text-amber-400" /> DAILY SEEDED GHOST DUEL ({todayStr})
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
          <Clock className="w-4 h-4 text-cyan-400" /> TIME: {elapsedSec}s
        </div>
      </div>

      {!isDuelActive && !isDuelComplete && (
        <div className="w-full max-w-lg p-8 rounded-3xl bg-slate-950/90 border border-amber-500/50 backdrop-blur-2xl flex flex-col items-center text-center shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 p-0.5 shadow-[0_0_30px_rgba(245,158,11,0.4)] mb-4">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Swords className="w-8 h-8 text-amber-400" />
            </div>
          </div>

          <h2 className="text-3xl font-black font-mono text-amber-300 mb-2">SEEDED PvP GHOST DUEL</h2>
          <p className="text-xs font-mono text-slate-400 mb-6">
            Compete asynchronously on a deterministic 5-puzzle sequence! Race against an animated ghost racer.
          </p>

          {ghostRun && (
            <div className="w-full p-4 rounded-2xl bg-slate-900 border border-slate-800 mb-6 flex items-center justify-between font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{ghostRun.avatar}</span>
                <div className="flex flex-col text-left">
                  <span className="font-bold text-slate-200">{ghostRun.username} (GHOST)</span>
                  <span className="text-[10px] text-slate-400">TIME: {ghostRun.totalTimeSec}s</span>
                </div>
              </div>
              <span className="text-amber-400 font-extrabold">{ghostRun.score} PTS</span>
            </div>
          )}

          <button
            onClick={() => startNewDuel()}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-600 to-purple-600 font-mono font-black text-black text-sm shadow-[0_0_25px_rgba(245,158,11,0.4)] hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5 fill-current" /> START GHOST DUEL (ROUND 1/5)
          </button>
        </div>
      )}

      {isDuelActive && (
        <div className="w-full flex flex-col items-center">
          <div className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md mb-4 font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="text-lg">{activeUser.avatar}</span>
              <span className="font-bold text-cyan-300">YOU: {score} PTS</span>
            </div>

            {splitDeltaSec !== null && (
              <span
                className={`px-3 py-1 rounded-xl border font-bold text-xs ${
                  splitDeltaSec <= 0
                    ? 'bg-emerald-950 border-emerald-400 text-emerald-300'
                    : 'bg-red-950 border-red-400 text-red-300'
                }`}
              >
                SPLIT: {splitDeltaSec > 0 ? `+${splitDeltaSec}s` : `${splitDeltaSec}s`}
              </span>
            )}

            {ghostRun && (
              <div className="flex items-center gap-2">
                <span className="text-lg">{ghostRun.avatar}</span>
                <span className="font-bold text-purple-300">{ghostRun.username}: {ghostScore} PTS</span>
              </div>
            )}
          </div>

          <div className="w-full p-8 rounded-3xl bg-slate-950/80 border border-slate-800 backdrop-blur-2xl shadow-2xl flex flex-col items-center">
            <div className="w-full flex justify-between items-center text-xs font-mono text-slate-400 mb-4">
              <span>ROUND {currentStep + 1} OF 5</span>
              <span>CATEGORY: {puzzle.categoryTitle}</span>
            </div>

            <p className="text-base font-black font-mono text-cyan-300 text-center mb-6">
              {puzzle.explanation}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              {puzzle.options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                const showResult = selectedOptionId !== null;

                let buttonStyle =
                  'bg-slate-900/70 border-slate-700/80 text-slate-200 hover:border-cyan-400';

                if (showResult) {
                  if (opt.isCorrect) {
                    buttonStyle = 'bg-emerald-950/80 border-emerald-400 text-emerald-300';
                  } else if (isSelected) {
                    buttonStyle = 'bg-red-950/80 border-red-400 text-red-300';
                  } else {
                    buttonStyle = 'bg-slate-950/40 border-slate-900 text-slate-600 opacity-40';
                  }
                }

                return (
                  <button
                    key={opt.id}
                    disabled={selectedOptionId !== null}
                    onClick={() => handleOptionSelect(opt.id)}
                    className={`relative flex items-center justify-between p-4 rounded-2xl border backdrop-blur-md font-mono transition-all ${buttonStyle}`}
                  >
                    <span className="text-base font-extrabold text-cyan-300">{opt.content}</span>
                    {showResult && opt.isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                    {showResult && isSelected && !opt.isCorrect && <XCircle className="w-5 h-5 text-red-400" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {isDuelComplete && (
        <div className="w-full max-w-lg p-8 rounded-3xl bg-slate-950 border border-amber-500/50 backdrop-blur-2xl flex flex-col items-center text-center shadow-2xl">
          <Trophy className="w-12 h-12 text-amber-400 mb-3 animate-bounce" />
          <h2 className="text-3xl font-black font-mono text-amber-300 mb-1">DUEL COMPLETE!</h2>
          <p className="text-xs font-mono text-slate-400 mb-6">FINAL RESULTS & CHALLENGE LINK</p>

          <div className="grid grid-cols-2 gap-3 w-full mb-6 font-mono text-xs">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col items-center">
              <span className="text-slate-400">YOUR SCORE</span>
              <span className="text-2xl font-black text-amber-400 mt-1">{score} PTS</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col items-center">
              <span className="text-slate-400">TOTAL TIME</span>
              <span className="text-2xl font-black text-cyan-400 mt-1">{elapsedSec}s</span>
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full">
            <button
              onClick={handleShareDuelLink}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-600 to-purple-600 font-mono font-black text-black text-sm shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              {copiedLink ? <Check className="w-5 h-5 text-black" /> : <Copy className="w-5 h-5" />}
              {copiedLink ? 'DUEL URL COPIED TO CLIPBOARD!' : 'SHARE DUEL CHALLENGE LINK'}
            </button>

            <button
              onClick={() => startNewDuel()}
              className="w-full py-3 rounded-2xl bg-slate-900 border border-slate-700 font-mono text-xs text-slate-300 font-bold hover:text-white"
            >
              <RotateCcw className="w-4 h-4 inline mr-2" /> RETRY GHOST DUEL
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

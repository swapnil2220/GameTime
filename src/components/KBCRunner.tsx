import React, { useState, useEffect, useRef } from 'react';
import type { AptitudePuzzle, UserProfile, LadderTier, LifelineId, AudiencePollResult, AIExpertRecommendation } from '../types/game';
import { generateEscalatingQuestion } from '../engine/logicEngine';
import { updateKBCResult, updateMindMatrixRating, recordSeenQuestion } from '../engine/userManager';
import { computeFiftyFifty, computeAudiencePoll, fetchAIExpertRecommendation } from '../engine/lifelineEngine';
import { sound } from '../engine/sound';
import { Trophy, Clock, ShieldCheck, Sparkles, UserCheck, BarChart3, RefreshCw, XCircle, CheckCircle2, ArrowRight, RotateCcw, LogOut } from 'lucide-react';
import confetti from 'canvas-confetti';

interface KBCRunnerProps {
  activeUser: UserProfile;
  onUserUpdated: (user: UserProfile) => void;
  onBackToMap: () => void;
}

export const LADDER_TIERS: LadderTier[] = [
  { stage: 15, prizePts: 10000000, prizeLabel: '₹1 CRORE (10,000,000)', isSafeHaven: true, timerSec: null },
  { stage: 14, prizePts: 5000000, prizeLabel: '₹50,000,000 (5,000,000)', isSafeHaven: false, timerSec: null },
  { stage: 13, prizePts: 2500000, prizeLabel: '₹25,000,000 (2,500,000)', isSafeHaven: false, timerSec: null },
  { stage: 12, prizePts: 1250000, prizeLabel: '₹12,50,000 (1,250,000)', isSafeHaven: false, timerSec: null },
  { stage: 11, prizePts: 640000, prizeLabel: '₹6,40,000 (640,000)', isSafeHaven: false, timerSec: null },
  { stage: 10, prizePts: 320000, prizeLabel: '₹3,20,000 (320,000)', isSafeHaven: true, timerSec: 45 },
  { stage: 9, prizePts: 160000, prizeLabel: '₹1,60,000 (160,000)', isSafeHaven: false, timerSec: 45 },
  { stage: 8, prizePts: 80000, prizeLabel: '₹80,000 (80,000)', isSafeHaven: false, timerSec: 45 },
  { stage: 7, prizePts: 40000, prizeLabel: '₹40,000 (40,000)', isSafeHaven: false, timerSec: 45 },
  { stage: 6, prizePts: 20000, prizeLabel: '₹20,000 (20,000)', isSafeHaven: false, timerSec: 45 },
  { stage: 5, prizePts: 10000, prizeLabel: '₹10,000 (10,000)', isSafeHaven: true, timerSec: 30 },
  { stage: 4, prizePts: 5000, prizeLabel: '₹5,000 (5,000)', isSafeHaven: false, timerSec: 30 },
  { stage: 3, prizePts: 3000, prizeLabel: '₹3,000 (3,000)', isSafeHaven: false, timerSec: 30 },
  { stage: 2, prizePts: 2000, prizeLabel: '₹2,000 (2,000)', isSafeHaven: false, timerSec: 30 },
  { stage: 1, prizePts: 1000, prizeLabel: '₹1,000 (1,000)', isSafeHaven: false, timerSec: 30 },
];

export const KBCRunner: React.FC<KBCRunnerProps> = ({
  activeUser,
  onUserUpdated,
  onBackToMap,
}) => {
  const [currentStage, setCurrentStage] = useState(1); // 1 to 15
  const [puzzle, setPuzzle] = useState<AptitudePuzzle>(() =>
    generateEscalatingQuestion(1, activeUser.seenQuestionIds || [])
  );

  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isLockedIn, setIsLockedIn] = useState(false);
  const [isSuspenseFlashing, setIsSuspenseFlashing] = useState(false);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);

  const [timeLeft, setTimeLeft] = useState<number | null>(30);
  const [usedLifelines, setUsedLifelines] = useState<Record<LifelineId, boolean>>({
    fifty_fifty: false,
    ai_expert: false,
    audience_poll: false,
    flip_question: false,
  });

  const [hiddenOptionIds, setHiddenOptionIds] = useState<string[]>([]);
  const [audiencePoll, setAudiencePoll] = useState<AudiencePollResult | null>(null);
  const [aiExpertRec, setAiExpertRec] = useState<AIExpertRecommendation | null>(null);
  const [aiExpertLoading, setAiExpertLoading] = useState(false);

  const [isGameOver, setIsGameOver] = useState(false);
  const [isWalkedAway, setIsWalkedAway] = useState(false);
  const [guaranteedPrize, setGuaranteedPrize] = useState(0);

  const timerRef = useRef<any>(null);

  const activeTier = LADDER_TIERS.find((t) => t.stage === currentStage) || LADDER_TIERS[LADDER_TIERS.length - 1];

  useEffect(() => {
    recordSeenQuestion(activeUser.id, puzzle.id);
  }, [puzzle.id, activeUser.id]);

  // Timer Countdown Logic
  useEffect(() => {
    if (isGameOver || isWalkedAway || isLockedIn || activeTier.timerSec === null) return;

    setTimeLeft(activeTier.timerSec);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null) return null;
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimeOut();
          return 0;
        }
        if (prev <= 6) sound.playHeartbeatPulse();
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentStage, isGameOver, isWalkedAway, isLockedIn]);

  const handleTimeOut = () => {
    sound.playHollowDrone();
    setIsGameOver(true);
  };

  const handleOptionClick = (optId: string) => {
    if (isLockedIn || isGameOver || isWalkedAway) return;
    sound.playClick();
    setSelectedOptionId(optId);

    // Instant lock-in for Stages 1-10; Double confirmation required for Stages 11-15
    if (currentStage <= 10) {
      lockInOption(optId);
    }
  };

  const lockInOption = (optId: string) => {
    if (isLockedIn) return;
    setIsLockedIn(true);
    sound.playSuspenseChord();
    setIsSuspenseFlashing(true);

    setTimeout(() => {
      setIsSuspenseFlashing(false);
      setIsAnswerRevealed(true);

      const correctOpt = puzzle.options.find((o) => o.isCorrect);
      const isCorrect = correctOpt?.id === optId;

      const responseSec = activeTier.timerSec ? activeTier.timerSec - (timeLeft || 0) : 15;
      const updatedUser = updateMindMatrixRating(activeUser.id, puzzle.category, isCorrect, responseSec);

      if (isCorrect) {
        sound.playBrassTriumph();
        if (activeTier.isSafeHaven) {
          setGuaranteedPrize(activeTier.prizePts);
        }

        if (currentStage === 15) {
          // 🏆 GRAND CROREPATI WINNER
          confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 } });
          const finalUser = updateKBCResult(activeUser.id, 10000000, true);
          onUserUpdated(finalUser);
          setTimeout(() => setIsGameOver(true), 2500);
        } else {
          setTimeout(() => {
            const nextStage = currentStage + 1;
            setCurrentStage(nextStage);
            setPuzzle(generateEscalatingQuestion(nextStage, activeUser.seenQuestionIds || []));
            setSelectedOptionId(null);
            setIsLockedIn(false);
            setIsAnswerRevealed(false);
            setHiddenOptionIds([]);
            setAudiencePoll(null);
            setAiExpertRec(null);
          }, 2500);
        }
      } else {
        sound.playHollowDrone();
        const finalUser = updateKBCResult(activeUser.id, guaranteedPrize, false);
        onUserUpdated(finalUser);
        setTimeout(() => setIsGameOver(true), 2500);
      }

      onUserUpdated(updatedUser);
    }, 2000);
  };

  const handleWalkAway = () => {
    if (isLockedIn || isGameOver) return;
    sound.playClick();
    const currentPrize = currentStage > 1 ? LADDER_TIERS.find((t) => t.stage === currentStage - 1)?.prizePts || 0 : 0;
    setGuaranteedPrize(currentPrize);
    setIsWalkedAway(true);
    const finalUser = updateKBCResult(activeUser.id, currentPrize, false);
    onUserUpdated(finalUser);
  };

  // Lifelines Triggers
  const handleUseFiftyFifty = () => {
    if (usedLifelines.fifty_fifty || isLockedIn) return;
    sound.playClick();
    setUsedLifelines((prev) => ({ ...prev, fifty_fifty: true }));
    const keptIds = computeFiftyFifty(puzzle.options);
    const hidden = puzzle.options.filter((o) => !keptIds.includes(o.id)).map((o) => o.id);
    setHiddenOptionIds(hidden);
  };

  const handleUseAudiencePoll = () => {
    if (usedLifelines.audience_poll || isLockedIn) return;
    sound.playClick();
    setUsedLifelines((prev) => ({ ...prev, audience_poll: true }));
    const poll = computeAudiencePoll(puzzle);
    setAudiencePoll(poll);
  };

  const handleUseAIExpert = async () => {
    if (usedLifelines.ai_expert || isLockedIn || aiExpertLoading) return;
    sound.playClick();
    setUsedLifelines((prev) => ({ ...prev, ai_expert: true }));
    setAiExpertLoading(true);
    const rec = await fetchAIExpertRecommendation(puzzle);
    setAiExpertRec(rec);
    setAiExpertLoading(false);
  };

  const handleUseFlipQuestion = () => {
    if (usedLifelines.flip_question || isLockedIn) return;
    sound.playClick();
    setUsedLifelines((prev) => ({ ...prev, flip_question: true }));
    setPuzzle(generateEscalatingQuestion(currentStage, activeUser.seenQuestionIds || []));
    setSelectedOptionId(null);
    setHiddenOptionIds([]);
    setAudiencePoll(null);
    setAiExpertRec(null);
  };

  const currentBankPts = currentStage > 1 ? LADDER_TIERS.find((t) => t.stage === currentStage - 1)?.prizePts || 0 : 0;

  return (
    <div className="relative z-10 w-full max-w-5xl mx-auto px-4 py-6 flex flex-col items-center font-sans selection:bg-amber-500 selection:text-black">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-950/90 border border-amber-500/40 backdrop-blur-xl shadow-[0_0_30px_rgba(245,158,11,0.2)] mb-6">
        <button
          onClick={onBackToMap}
          className="flex items-center gap-1 text-xs font-mono text-cyan-400 hover:text-cyan-300"
        >
          ← STAGE MAP
        </button>

        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          <span className="font-mono font-black text-sm text-amber-300 uppercase tracking-wider">
            THE GRAND NEXUS LADDER (STAGE {currentStage}/15)
          </span>
        </div>

        {/* Timer Display */}
        <div className="flex items-center gap-2">
          <Clock className={`w-5 h-5 ${timeLeft !== null && timeLeft <= 10 ? 'text-red-500 animate-ping' : 'text-amber-400'}`} />
          <span className="text-xl font-black font-mono tracking-wider text-amber-300">
            {timeLeft !== null ? `${timeLeft}s` : '∞ UNLIMITED'}
          </span>
        </div>
      </div>

      {/* Main Game Show Staging Area */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left 3 Columns: Active Stage Card & Options */}
        <div className="lg:col-span-3 flex flex-col items-center">
          {/* Lifelines Toolbar */}
          <div className="w-full grid grid-cols-4 gap-2 mb-4">
            <button
              disabled={usedLifelines.fifty_fifty || isLockedIn}
              onClick={handleUseFiftyFifty}
              className={`p-3 rounded-2xl border flex flex-col items-center justify-center font-mono transition-all ${
                usedLifelines.fifty_fifty
                  ? 'bg-slate-950 border-slate-900 text-slate-700 opacity-40'
                  : 'bg-slate-900/90 border-amber-500/50 text-amber-300 hover:scale-105 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
              }`}
              title="50:50 (Eliminate 2 wrong options)"
            >
              <span className="text-sm font-black">50:50</span>
              <span className="text-[9px] text-slate-400 mt-0.5">ELIMINATE 2</span>
            </button>

            <button
              disabled={usedLifelines.ai_expert || isLockedIn || aiExpertLoading}
              onClick={handleUseAIExpert}
              className={`p-3 rounded-2xl border flex flex-col items-center justify-center font-mono transition-all ${
                usedLifelines.ai_expert
                  ? 'bg-slate-950 border-slate-900 text-slate-700 opacity-40'
                  : 'bg-slate-900/90 border-purple-500/50 text-purple-300 hover:scale-105 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
              }`}
              title="AI Nexus Expert Tele-Call"
            >
              {aiExpertLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <UserCheck className="w-4 h-4" />}
              <span className="text-[9px] text-slate-400 mt-0.5">AI EXPERT</span>
            </button>

            <button
              disabled={usedLifelines.audience_poll || isLockedIn}
              onClick={handleUseAudiencePoll}
              className={`p-3 rounded-2xl border flex flex-col items-center justify-center font-mono transition-all ${
                usedLifelines.audience_poll
                  ? 'bg-slate-950 border-slate-900 text-slate-700 opacity-40'
                  : 'bg-slate-900/90 border-cyan-500/50 text-cyan-300 hover:scale-105 shadow-[0_0_15px_rgba(0,243,255,0.2)]'
              }`}
              title="Audience Logic Poll"
            >
              <BarChart3 className="w-4 h-4" />
              <span className="text-[9px] text-slate-400 mt-0.5">AUDIENCE POLL</span>
            </button>

            <button
              disabled={usedLifelines.flip_question || isLockedIn}
              onClick={handleUseFlipQuestion}
              className={`p-3 rounded-2xl border flex flex-col items-center justify-center font-mono transition-all ${
                usedLifelines.flip_question
                  ? 'bg-slate-950 border-slate-900 text-slate-700 opacity-40'
                  : 'bg-slate-900/90 border-pink-500/50 text-pink-300 hover:scale-105 shadow-[0_0_15px_rgba(236,72,153,0.2)]'
              }`}
              title="Flip the Question"
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-[9px] text-slate-400 mt-0.5">FLIP QUESTION</span>
            </button>
          </div>

          {/* AI Expert Tele-Call Dialogue Box */}
          {aiExpertRec && (
            <div className="w-full p-4 rounded-2xl bg-purple-950/80 border border-purple-400 font-mono text-xs text-purple-200 mb-4 flex items-start gap-3 shadow-[0_0_20px_rgba(168,85,247,0.3)] animate-fadeIn">
              <UserCheck className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-extrabold text-purple-300 block mb-1">
                  📞 AI SCHOLAR RECOMMENDATION (CONFIDENCE: {aiExpertRec.confidenceScore}%)
                </span>
                <p>{aiExpertRec.explanation}</p>
              </div>
            </div>
          )}

          {/* Audience Poll Percentage Bar Chart */}
          {audiencePoll && (
            <div className="w-full p-4 rounded-2xl bg-cyan-950/80 border border-cyan-400 font-mono text-xs text-cyan-200 mb-4 shadow-[0_0_20px_rgba(0,243,255,0.3)] animate-fadeIn">
              <span className="font-extrabold text-cyan-300 block mb-3 text-center">
                📊 AUDIENCE LOGIC POLL PERCENTAGES
              </span>
              <div className="grid grid-cols-4 gap-2">
                {puzzle.options.map((opt, i) => {
                  const pct = audiencePoll.percentages[opt.id] || 0;
                  return (
                    <div key={opt.id} className="flex flex-col items-center gap-1">
                      <div className="w-full h-24 bg-slate-900 rounded-lg overflow-hidden flex flex-col justify-end p-1 border border-cyan-500/40">
                        <div
                          style={{ height: `${pct}%` }}
                          className="w-full bg-gradient-to-t from-cyan-500 to-indigo-500 rounded-md transition-all duration-1000"
                        />
                      </div>
                      <span className="font-extrabold text-cyan-400">{pct}%</span>
                      <span className="text-[10px] text-slate-400">OPTION {i + 1}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Active Question Card */}
          <div className="w-full p-8 rounded-3xl bg-slate-950/90 border border-amber-500/40 backdrop-blur-2xl shadow-2xl flex flex-col items-center text-center mb-6">
            <div className="flex items-center gap-2 text-amber-400 font-mono text-xs uppercase tracking-widest mb-3">
              <Trophy className="w-4 h-4" /> QUESTION FOR {activeTier.prizeLabel}
            </div>

            <p className="text-xl sm:text-2xl font-black font-mono text-slate-100 mb-8 tracking-wide">
              {puzzle.renderedData.questionText || puzzle.explanation}
            </p>

            {/* Diamond / Hexagonal Metallic Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              {puzzle.options.map((opt, idx) => {
                const isHidden = hiddenOptionIds.includes(opt.id);
                if (isHidden) {
                  return (
                    <div
                      key={opt.id}
                      className="p-5 rounded-2xl border border-slate-900 bg-slate-950/30 opacity-20 pointer-events-none"
                    />
                  );
                }

                const isSelected = selectedOptionId === opt.id;
                let optionStyle =
                  'bg-slate-900/90 border-slate-700/80 text-slate-200 hover:border-amber-400/80 hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]';

                if (isSelected && !isAnswerRevealed) {
                  optionStyle =
                    'bg-amber-950/90 border-amber-400 text-amber-300 shadow-[0_0_25px_rgba(245,158,11,0.5)] scale-102';
                  if (isSuspenseFlashing) {
                    optionStyle += ' animate-pulse';
                  }
                }

                if (isAnswerRevealed) {
                  if (opt.isCorrect) {
                    optionStyle =
                      'bg-emerald-950 border-emerald-400 text-emerald-300 shadow-[0_0_30px_rgba(16,185,129,0.6)] scale-105';
                  } else if (isSelected) {
                    optionStyle =
                      'bg-red-950 border-red-400 text-red-300 shadow-[0_0_30px_rgba(239,68,68,0.6)]';
                  } else {
                    optionStyle = 'bg-slate-950/40 border-slate-900 text-slate-700 opacity-30';
                  }
                }

                return (
                  <button
                    key={opt.id}
                    disabled={isLockedIn}
                    onClick={() => handleOptionClick(opt.id)}
                    className={`relative p-5 rounded-2xl border font-mono font-bold text-sm flex items-center justify-between transition-all duration-300 ${optionStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-black text-amber-400">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="text-left font-extrabold">{opt.content}</span>
                    </div>

                    {isAnswerRevealed && opt.isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                    {isAnswerRevealed && isSelected && !opt.isCorrect && <XCircle className="w-5 h-5 text-red-400" />}
                  </button>
                );
              })}
            </div>

            {/* Double Confirmation Lock Button for Stages 11-15 */}
            {currentStage >= 11 && selectedOptionId && !isLockedIn && (
              <button
                onClick={() => lockInOption(selectedOptionId)}
                className="mt-6 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 font-mono font-black text-black text-sm shadow-[0_0_30px_rgba(245,158,11,0.6)] hover:scale-105 transition-all animate-bounce flex items-center gap-2"
              >
                <ShieldCheck className="w-5 h-5" /> LOCK KIYA JAAYE? (CONFIRM CHOICE)
              </button>
            )}
          </div>

          {/* Cash Out / Walk Away Bar */}
          {!isLockedIn && (
            <div className="w-full p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">
                CURRENT BANKED PRIZE: <span className="text-amber-400 font-bold">₹{currentBankPts.toLocaleString()}</span>
              </span>

              <button
                onClick={handleWalkAway}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono font-bold text-amber-300 hover:border-amber-400 transition-all"
              >
                <LogOut className="w-4 h-4" /> QUIT & WALK AWAY
              </button>
            </div>
          )}
        </div>

        {/* Right Column: 15-Stage Escalation Ladder Drawer */}
        <div className="lg:col-span-1 p-4 rounded-3xl bg-slate-950/90 border border-amber-500/40 backdrop-blur-2xl flex flex-col gap-1 shadow-2xl font-mono text-xs">
          <span className="font-black text-center text-amber-400 uppercase tracking-wider mb-2 border-b border-slate-800 pb-2">
            PRIZE LADDER
          </span>

          {LADDER_TIERS.map((tier) => {
            const isCurrent = tier.stage === currentStage;
            const isPassed = tier.stage < currentStage;

            let rowStyle = 'bg-slate-900/50 border-slate-800 text-slate-400';
            if (isCurrent) {
              rowStyle = 'bg-amber-400 border-amber-300 text-black font-black scale-102 shadow-[0_0_15px_rgba(245,158,11,0.5)]';
            } else if (isPassed) {
              rowStyle = 'bg-slate-900 border-emerald-500/40 text-emerald-400 font-bold';
            } else if (tier.isSafeHaven) {
              rowStyle = 'bg-purple-950/60 border-purple-500/40 text-purple-300 font-bold';
            }

            return (
              <div
                key={tier.stage}
                className={`px-3 py-2 rounded-xl border flex items-center justify-between transition-all ${rowStyle}`}
              >
                <span className="font-extrabold">{tier.stage}</span>
                <span className="truncate">{tier.prizeLabel}</span>
                {tier.isSafeHaven && <ShieldCheck className="w-3.5 h-3.5 shrink-0" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Game Over / Walk Away Result Summary Modal */}
      {(isGameOver || isWalkedAway) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-2xl font-sans animate-fadeIn">
          <div className="w-full max-w-lg p-8 rounded-3xl bg-slate-950 border border-amber-500/50 shadow-2xl flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-red-500 p-0.5 shadow-[0_0_30px_rgba(245,158,11,0.5)] mb-4">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Trophy className="w-8 h-8 text-amber-400" />
              </div>
            </div>

            <h2 className="text-3xl font-black font-mono text-amber-300 mb-1">
              {currentStage === 15 && isAnswerRevealed ? '🏆 GRAND CROREPATI!' : isWalkedAway ? 'WALKED AWAY!' : 'GAME OVER'}
            </h2>
            <p className="text-xs font-mono text-slate-400 mb-6">GRAND NEXUS LADDER REPORT</p>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 w-full flex flex-col items-center mb-6">
              <span className="text-xs font-mono text-slate-400">TOTAL PRIZE EARNED</span>
              <span className="text-3xl font-black font-mono text-amber-400 mt-2">
                ₹{guaranteedPrize.toLocaleString()}
              </span>
            </div>

            <div className="flex gap-3 w-full">
              <button
                onClick={() => {
                  setIsGameOver(false);
                  setIsWalkedAway(false);
                  setCurrentStage(1);
                  setGuaranteedPrize(0);
                  setUsedLifelines({ fifty_fifty: false, ai_expert: false, audience_poll: false, flip_question: false });
                  setPuzzle(generateEscalatingQuestion(1, activeUser.seenQuestionIds || []));
                  setSelectedOptionId(null);
                  setIsLockedIn(false);
                  setIsAnswerRevealed(false);
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

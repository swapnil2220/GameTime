import { useState, useEffect } from 'react';
import type { ViewState, UserProfile, ConnectionsPuzzle } from './types/game';
import { getActiveUser, updateUserLevelProgress } from './engine/userManager';
import { generateAIConnectionsPuzzle } from './engine/aiEngine';
import { Navbar } from './components/Navbar';
import { BackgroundCanvas } from './components/BackgroundCanvas';
import { LevelSelect } from './components/LevelSelect';
import { ConnectionsGrid } from './components/ConnectionsGrid';
import { PuzzleRunner } from './components/PuzzleRunner';
import { ResultModal } from './components/ResultModal';
import { Leaderboard } from './components/Leaderboard';
import { HowToPlayModal } from './components/HowToPlayModal';
import { UserAuthModal } from './components/UserAuthModal';
import { AIStudioModal } from './components/AIStudioModal';
import { ShareScoreModal } from './components/ShareScoreModal';

export function App() {
  const [viewState, setViewState] = useState<ViewState>('level_select');
  const [activeUser, setActiveUser] = useState<UserProfile>(() => getActiveUser());
  const [activeLevelNumber, setActiveLevelNumber] = useState<number>(1);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAIStudioOpen, setIsAIStudioOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const [activeConnectionsPuzzle, setActiveConnectionsPuzzle] = useState<ConnectionsPuzzle | null>(null);
  const [lastResult, setLastResult] = useState<{ stars: number; score: number; timeSec: number; emojiGrid?: string } | null>(null);

  useEffect(() => {
    setActiveUser(getActiveUser());
  }, []);

  const handleSelectLevel = (lvlNum: number) => {
    setActiveLevelNumber(lvlNum);
    setViewState('playing');
  };

  const handleStartDailyAI = () => {
    const puzzle = generateAIConnectionsPuzzle();
    setActiveConnectionsPuzzle(puzzle);
    setViewState('connections_playing');
  };

  const handleGenerateTopicPuzzle = (topicPrompt: string) => {
    const puzzle = generateAIConnectionsPuzzle(topicPrompt);
    setActiveConnectionsPuzzle(puzzle);
    setViewState('connections_playing');
  };

  const handleCompleteConnections = (score: number, stars: number, emojiGrid: string) => {
    setLastResult({ stars, score, timeSec: 45, emojiGrid });
    const updatedUser = updateUserLevelProgress(activeUser.id, activeLevelNumber, stars, score, 45);
    setActiveUser(updatedUser);
    setViewState('result');
  };

  const handleCompleteLevel = (stars: number, score: number, timeSec: number) => {
    setLastResult({ stars, score, timeSec });
    const updatedUser = updateUserLevelProgress(activeUser.id, activeLevelNumber, stars, score, timeSec);
    setActiveUser(updatedUser);
    setViewState('result');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative font-sans selection:bg-cyan-500 selection:text-black">
      {/* Background Canvas */}
      <BackgroundCanvas overdrive={false} />

      {/* Navigation Header */}
      <Navbar
        activeUser={activeUser}
        onNavigate={(v) => setViewState(v)}
        onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
        onOpenAIStudio={() => setIsAIStudioOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        audioEnabled={audioEnabled}
        onAudioToggle={setAudioEnabled}
      />

      {/* Main App Router */}
      <main className="flex-1 flex flex-col justify-center items-center relative z-10 py-6">
        {viewState === 'level_select' && (
          <LevelSelect
            activeUser={activeUser}
            levels={activeUser.levelProgress}
            onSelectLevel={handleSelectLevel}
            onStartDailyAIChallenge={handleStartDailyAI}
            onOpenAIStudio={() => setIsAIStudioOpen(true)}
            onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
          />
        )}

        {viewState === 'connections_playing' && activeConnectionsPuzzle && (
          <ConnectionsGrid
            puzzle={activeConnectionsPuzzle}
            onComplete={handleCompleteConnections}
            onBackToMap={() => setViewState('level_select')}
          />
        )}

        {viewState === 'playing' && (
          <PuzzleRunner
            levelNumber={activeLevelNumber}
            onCompleteLevel={handleCompleteLevel}
            onBackToMap={() => setViewState('level_select')}
          />
        )}

        {viewState === 'result' && lastResult && (
          <div className="flex flex-col items-center">
            <ResultModal
              stars={lastResult.stars}
              score={lastResult.score}
              timeSec={lastResult.timeSec}
              levelNumber={activeLevelNumber}
              onNextLevel={() => {
                setActiveLevelNumber((prev) => Math.min(30, prev + 1));
                setViewState('playing');
              }}
              onRetryLevel={() => setViewState('playing')}
              onBackToMap={() => setViewState('level_select')}
            />

            {lastResult.emojiGrid && (
              <button
                onClick={() => setIsShareOpen(true)}
                className="mt-4 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-600 to-purple-600 font-mono font-extrabold text-black text-xs shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:scale-105 transition-all"
              >
                📋 SHARE EMOJI SCORECARD WITH FRIENDS
              </button>
            )}
          </div>
        )}

        {viewState === 'leaderboard' && (
          <Leaderboard onBackToMenu={() => setViewState('level_select')} />
        )}
      </main>

      {/* Modals */}
      <HowToPlayModal isOpen={isHowToPlayOpen} onClose={() => setIsHowToPlayOpen(false)} />
      <AIStudioModal
        isOpen={isAIStudioOpen}
        onClose={() => setIsAIStudioOpen(false)}
        onGenerateTopicPuzzle={handleGenerateTopicPuzzle}
      />
      <UserAuthModal
        isOpen={isAuthOpen}
        activeUser={activeUser}
        onClose={() => setIsAuthOpen(false)}
        onUserChanged={(newUser) => setActiveUser(newUser)}
      />
      {lastResult && lastResult.emojiGrid && (
        <ShareScoreModal
          isOpen={isShareOpen}
          score={lastResult.score}
          stars={lastResult.stars}
          emojiGrid={lastResult.emojiGrid}
          onClose={() => setIsShareOpen(false)}
        />
      )}

      {/* Footer */}
      <footer className="w-full py-4 text-center text-xs font-mono text-slate-600 border-t border-slate-900 relative z-10">
        LOGIC LINK: AI NEXUS V3 © 2026 • GENERATIVE AI COGNITIVE QUIZ
      </footer>
    </div>
  );
}

export default App;

import { useState } from 'react';
import type { ViewState, UserProfile } from './types/game';
import { getActiveProfile, saveProfile } from './engine/profileManager';
import { Navbar } from './components/Navbar';
import { ProfileModal } from './components/ProfileModal';
import { HowToPlayModal } from './components/HowToPlayModal';
import { BackgroundCanvas } from './components/BackgroundCanvas';
import { LevelSelect } from './components/LevelSelect';
import { PuzzleRunner } from './components/PuzzleRunner';
import { ResultModal } from './components/ResultModal';
import { Leaderboard } from './components/Leaderboard';
import { sound } from './engine/sound';

export function App() {
  const [viewState, setViewState] = useState<ViewState>('level_select');
  const [activeProfile, setActiveProfile] = useState<UserProfile>(() => getActiveProfile());
  const [activeLevelNumber, setActiveLevelNumber] = useState<number>(1);
  const [audioEnabled, setAudioEnabled] = useState(true);
  
  // Modals state
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);

  const [lastResult, setLastResult] = useState<{ stars: number; score: number; timeSec: number } | null>(null);

  const handleSelectLevel = (lvlNum: number) => {
    sound.playClick();
    setActiveLevelNumber(lvlNum);
    setViewState('playing');
  };

  const handleCompleteLevel = (stars: number, score: number, timeSec: number) => {
    setLastResult({ stars, score, timeSec });

    // Update active profile levels
    const updatedLevels = activeProfile.levels.map((lvl) => {
      if (lvl.levelNumber === activeLevelNumber) {
        return {
          ...lvl,
          completed: true,
          stars: Math.max(lvl.stars, stars),
          bestScore: Math.max(lvl.bestScore, score),
          bestTimeSec: lvl.bestTimeSec ? Math.min(lvl.bestTimeSec, timeSec) : timeSec,
        };
      }
      if (lvl.levelNumber === activeLevelNumber + 1 && stars > 0) {
        return { ...lvl, unlocked: true };
      }
      return lvl;
    });

    const totalStars = updatedLevels.reduce((acc, l) => acc + l.stars, 0);
    const totalScore = updatedLevels.reduce((acc, l) => acc + l.bestScore, 0);

    const updatedProfile: UserProfile = {
      ...activeProfile,
      totalStars,
      totalScore,
      levels: updatedLevels,
    };

    setActiveProfile(updatedProfile);
    saveProfile(updatedProfile);
    setViewState('result');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative font-sans selection:bg-cyan-500 selection:text-black">
      {/* Background Particle Canvas */}
      <BackgroundCanvas overdrive={false} />

      {/* Navigation Header */}
      <Navbar
        activeProfile={activeProfile}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
        onOpenLeaderboard={() => setViewState('leaderboard')}
        onNavigateHome={() => setViewState('level_select')}
        audioEnabled={audioEnabled}
        onAudioToggle={setAudioEnabled}
      />

      {/* Modals */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        activeProfile={activeProfile}
        onProfileChanged={(p) => setActiveProfile(p)}
      />

      <HowToPlayModal
        isOpen={isHowToPlayOpen}
        onClose={() => setIsHowToPlayOpen(false)}
      />

      {/* Main View Router */}
      <main className="flex-1 flex flex-col justify-center items-center relative z-10 py-6">
        {viewState === 'level_select' && (
          <LevelSelect levels={activeProfile.levels} onSelectLevel={handleSelectLevel} />
        )}

        {viewState === 'playing' && (
          <PuzzleRunner
            levelNumber={activeLevelNumber}
            onCompleteLevel={handleCompleteLevel}
            onBackToMap={() => setViewState('level_select')}
          />
        )}

        {viewState === 'result' && lastResult && (
          <ResultModal
            stars={lastResult.stars}
            score={lastResult.score}
            timeSec={lastResult.timeSec}
            levelNumber={activeLevelNumber}
            onNextLevel={() => {
              setActiveLevelNumber((prev) => Math.min(32, prev + 1));
              setViewState('playing');
            }}
            onRetryLevel={() => setViewState('playing')}
            onBackToMap={() => setViewState('level_select')}
          />
        )}

        {viewState === 'leaderboard' && (
          <Leaderboard onBackToMap={() => setViewState('level_select')} />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-xs font-mono text-slate-600 border-t border-slate-900 relative z-10">
        LOGIC LINK: INVESTOR EDITION © 2026 • REASONING, GEOGRAPHY & TRIVIA SHOWCASE
      </footer>
    </div>
  );
}

export default App;

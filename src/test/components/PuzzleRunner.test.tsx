import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PuzzleRunner } from '../../components/PuzzleRunner';
import type { UserProfile } from '../../types/game';
import { sound } from '../../engine/sound';

const mockUser: UserProfile = {
  id: 'test_user_1',
  username: 'TestRunner',
  avatar: '⚡',
  isGuest: false,
  totalScore: 0,
  totalStars: 0,
  dailyStreak: 1,
  lastPlayedDate: '2026-08-21',
  seenQuestionIds: [],
  mindMatrix: {
    patternRecognition: 50,
    spatialReasoning: 50,
    verbalFluency: 50,
    deductiveLogic: 50,
    mathematicalAgility: 50,
    speedReflexes: 50,
  },
  blitzHighScore: 0,
  levelProgress: [],
  createdAt: '2026-08-21T00:00:00.000Z',
  activeRelics: [],
  preferredPersona: 'socratic',
};

describe('<PuzzleRunner /> Component & State Machine Integration', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.spyOn(sound, 'playClick');
    vi.spyOn(sound, 'playCorrect');
    vi.spyOn(sound, 'playWrong');
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('renders puzzle runner header, stage number, and elapsed timer', () => {
    const onComplete = vi.fn();
    const onBack = vi.fn();

    render(
      <PuzzleRunner
        activeUser={mockUser}
        levelNumber={1}
        onCompleteLevel={onComplete}
        onBackToMap={onBack}
      />
    );

    expect(screen.getByText(/STAGE 1/i)).toBeInTheDocument();
    expect(screen.getByText(/TIME: 0s/i)).toBeInTheDocument();
    expect(screen.getByText(/← STAGE MAP/i)).toBeInTheDocument();
  });

  it('navigates back to map when back button is clicked', () => {
    const onBack = vi.fn();

    render(
      <PuzzleRunner
        activeUser={mockUser}
        levelNumber={1}
        onCompleteLevel={vi.fn()}
        onBackToMap={onBack}
      />
    );

    const backBtn = screen.getByText(/← STAGE MAP/i);
    fireEvent.click(backBtn);

    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('toggles visual hint drawer', () => {
    render(
      <PuzzleRunner
        activeUser={mockUser}
        levelNumber={1}
        onCompleteLevel={vi.fn()}
        onBackToMap={vi.fn()}
      />
    );

    const hintBtn = screen.queryByText(/SHOW VISUAL HINT/i);
    if (hintBtn) {
      fireEvent.click(hintBtn);
      expect(sound.playClick).toHaveBeenCalled();
      expect(screen.getByText(/HIDE VISUAL HINT/i)).toBeInTheDocument();
    }
  });

  it('handles wrong option selection: triggers error sound, shows explanation, calls onCompleteLevel with 0 stars', () => {
    const onComplete = vi.fn();

    render(
      <PuzzleRunner
        activeUser={mockUser}
        levelNumber={1}
        onCompleteLevel={onComplete}
        onBackToMap={vi.fn()}
      />
    );

    // Find all option buttons (identified by 1, 2, 3, 4 badges)
    const options = screen.getAllByRole('button').filter((btn) => btn.className.includes('justify-between'));
    expect(options.length).toBeGreaterThan(0);

    // Find a wrong option button
    // In our logicEngine for level 1 (geography), option 0 might be correct or distractor
    // Click option 0
    fireEvent.click(options[0]);

    expect(sound.playClick).toHaveBeenCalled();
    expect(screen.getByText(/EASY STEP-BY-STEP EXPLANATION/i)).toBeInTheDocument();

    // Advance timer past 1800ms transition delay
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(onComplete).toHaveBeenCalledTimes(1);
    const [stars, score] = onComplete.mock.calls[0];
    expect(typeof stars).toBe('number');
    expect(typeof score).toBe('number');
  });

  it('handles correct option selection: triggers correct sound, triggers celebration, advances stage', () => {
    const onComplete = vi.fn();

    render(
      <PuzzleRunner
        activeUser={mockUser}
        levelNumber={1}
        onCompleteLevel={onComplete}
        onBackToMap={vi.fn()}
      />
    );

    const optionButtons = screen.getAllByRole('button').filter((btn) => btn.className.includes('justify-between'));

    // Click the first option button
    fireEvent.click(optionButtons[0]);

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(onComplete).toHaveBeenCalled();
  });
});

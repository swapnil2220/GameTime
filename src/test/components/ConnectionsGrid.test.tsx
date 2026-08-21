import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ConnectionsGrid } from '../../components/ConnectionsGrid';
import { generateAIConnectionsPuzzle } from '../../engine/aiEngine';
import { sound } from '../../engine/sound';
import type { ConnectionsPuzzle } from '../../types/game';

describe('<ConnectionsGrid /> Component & State Machine Integration', () => {
  let samplePuzzle: ConnectionsPuzzle;

  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.spyOn(sound, 'playClick');
    vi.spyOn(sound, 'playCorrect');
    vi.spyOn(sound, 'playWrong');

    // Generate deterministic puzzle
    samplePuzzle = generateAIConnectionsPuzzle('tech', 12345);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('renders all 16 tiles and control buttons', () => {
    render(
      <ConnectionsGrid
        puzzle={samplePuzzle}
        onComplete={vi.fn()}
        onBackToMap={vi.fn()}
      />
    );

    expect(screen.getByText(samplePuzzle.title)).toBeInTheDocument();
    expect(screen.getByText(/MISTAKES:/i)).toBeInTheDocument();

    // Verify 16 tiles present
    samplePuzzle.shuffledTiles.forEach((tile) => {
      expect(screen.getByText(tile)).toBeInTheDocument();
    });

    expect(screen.getByText(/SHUFFLE/i)).toBeInTheDocument();
    expect(screen.getByText(/DESELECT ALL/i)).toBeInTheDocument();
    expect(screen.getByText(/SUBMIT \(4\/4\)/i)).toBeInTheDocument();
  });

  it('toggles tile selection up to maximum limit of 4', () => {
    render(
      <ConnectionsGrid
        puzzle={samplePuzzle}
        onComplete={vi.fn()}
        onBackToMap={vi.fn()}
      />
    );

    const submitBtn = screen.getByText(/SUBMIT \(4\/4\)/i) as HTMLButtonElement;
    expect(submitBtn).toBeDisabled();

    const tiles = samplePuzzle.shuffledTiles;

    // Select 4 tiles
    fireEvent.click(screen.getByText(tiles[0]));
    fireEvent.click(screen.getByText(tiles[1]));
    fireEvent.click(screen.getByText(tiles[2]));
    fireEvent.click(screen.getByText(tiles[3]));

    expect(submitBtn).not.toBeDisabled();

    // Attempting to select a 5th tile should be ignored (limit 4)
    fireEvent.click(screen.getByText(tiles[4]));
    // Submit button should still be enabled (4 tiles selected)
    expect(submitBtn).not.toBeDisabled();

    // Deselect tile 0 by clicking again
    fireEvent.click(screen.getByText(tiles[0]));
    expect(submitBtn).toBeDisabled();
  });

  it('clears selection when DESELECT ALL is clicked', () => {
    render(
      <ConnectionsGrid
        puzzle={samplePuzzle}
        onComplete={vi.fn()}
        onBackToMap={vi.fn()}
      />
    );

    const tiles = samplePuzzle.shuffledTiles;
    fireEvent.click(screen.getByText(tiles[0]));
    fireEvent.click(screen.getByText(tiles[1]));

    const deselectBtn = screen.getByText(/DESELECT ALL/i);
    fireEvent.click(deselectBtn);

    const submitBtn = screen.getByText(/SUBMIT \(4\/4\)/i);
    expect(submitBtn).toBeDisabled();
  });

  it('handles incorrect guess: decrements mistake counter, displays warning message', () => {
    render(
      <ConnectionsGrid
        puzzle={samplePuzzle}
        onComplete={vi.fn()}
        onBackToMap={vi.fn()}
      />
    );

    // Group 0 has 4 items, Group 1 has 4 items. Create a wrong 2+2 mix
    const wrongMix = [
      samplePuzzle.groups[0].items[0],
      samplePuzzle.groups[0].items[1],
      samplePuzzle.groups[1].items[0],
      samplePuzzle.groups[1].items[1],
    ];

    wrongMix.forEach((tile) => fireEvent.click(screen.getByText(tile)));

    const submitBtn = screen.getByText(/SUBMIT \(4\/4\)/i);
    fireEvent.click(submitBtn);

    expect(sound.playWrong).toHaveBeenCalled();
    expect(screen.getByText(/INCALCULABLE! Try another 4-tile combination./i)).toBeInTheDocument();
  });

  it('handles "One Away!" guess (3 correct + 1 distractor)', () => {
    render(
      <ConnectionsGrid
        puzzle={samplePuzzle}
        onComplete={vi.fn()}
        onBackToMap={vi.fn()}
      />
    );

    const group0 = samplePuzzle.groups[0];
    const group1 = samplePuzzle.groups[1];

    const oneAwayMix = [group0.items[0], group0.items[1], group0.items[2], group1.items[0]];

    oneAwayMix.forEach((tile) => fireEvent.click(screen.getByText(tile)));
    fireEvent.click(screen.getByText(/SUBMIT \(4\/4\)/i));

    expect(screen.getByText(/⚠️ ONE AWAY!/i)).toBeInTheDocument();
  });

  it('handles solving a group: collapses solved tiles into banner, updates remaining grid', () => {
    render(
      <ConnectionsGrid
        puzzle={samplePuzzle}
        onComplete={vi.fn()}
        onBackToMap={vi.fn()}
      />
    );

    const group0 = samplePuzzle.groups[0];
    group0.items.forEach((tile) => fireEvent.click(screen.getByText(tile)));

    fireEvent.click(screen.getByText(/SUBMIT \(4\/4\)/i));

    expect(sound.playCorrect).toHaveBeenCalled();
    expect(screen.getByText(`SOLVED: ${group0.categoryTitle}!`)).toBeInTheDocument();
    expect(screen.getByText(group0.categoryTitle)).toBeInTheDocument();
    expect(screen.getByText(group0.items.join(' • '))).toBeInTheDocument();
  });

  it('triggers onComplete callback when 4 mistakes are reached (Game Over)', () => {
    const onComplete = vi.fn();

    render(
      <ConnectionsGrid
        puzzle={samplePuzzle}
        onComplete={onComplete}
        onBackToMap={vi.fn()}
      />
    );

    const group0 = samplePuzzle.groups[0];
    const group1 = samplePuzzle.groups[1];
    const wrongMix = [group0.items[0], group0.items[1], group1.items[0], group1.items[1]];

    // Select wrong mix initially
    wrongMix.forEach((tile) => fireEvent.click(screen.getByText(tile)));

    // Make 4 mistakes by clicking SUBMIT
    for (let m = 0; m < 4; m++) {
      fireEvent.click(screen.getByText(/SUBMIT \(4\/4\)/i));
    }

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(onComplete).toHaveBeenCalledWith(200, 0, expect.any(String));
  });
});

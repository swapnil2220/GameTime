import { describe, it, expect, beforeEach, vi } from 'vitest';
import { sound } from '../../engine/sound';

describe('SoundEngine Safe Degrade & Web Audio Resilience', () => {
  beforeEach(() => {
    sound.enabled = true;
    sound.setTheme('cyberpunk');
  });

  it('plays sounds across all themes without crashing', () => {
    const themes = ['cyberpunk', 'typewriter', 'zen'] as const;

    themes.forEach((t) => {
      sound.setTheme(t);
      expect(() => sound.playClick()).not.toThrow();
      expect(() => sound.playComboNote(1)).not.toThrow();
      expect(() => sound.playComboNote(5)).not.toThrow();
      expect(() => sound.playCorrect()).not.toThrow();
      expect(() => sound.playDualToneChord()).not.toThrow();
      expect(() => sound.playWrong()).not.toThrow();
      expect(() => sound.playTickWarning()).not.toThrow();
      expect(() => sound.playOverdrive()).not.toThrow();
    });
  });

  it('safely degrades when disabled (muted)', () => {
    sound.enabled = false;

    expect(() => {
      sound.playClick();
      sound.playCorrect();
      sound.playWrong();
      sound.playComboNote(3);
      sound.playDualToneChord();
      sound.playTickWarning();
    }).not.toThrow();
  });

  it('safely handles suspended AudioContext state', () => {
    // Force AudioContext to suspended
    if ((sound as any).ctx) {
      (sound as any).ctx.state = 'suspended';
    }

    expect(() => {
      sound.playClick();
      sound.playCorrect();
      sound.playWrong();
    }).not.toThrow();
  });

  it('handles environment without AudioContext (unsupported browser)', () => {
    const originalAudioContext = window.AudioContext;
    const originalWebkit = (window as any).webkitAudioContext;

    delete (window as any).AudioContext;
    delete (window as any).webkitAudioContext;
    (sound as any).ctx = null; // reset instance context

    expect(() => {
      sound.playClick();
      sound.playCorrect();
      sound.playWrong();
      sound.playComboNote(2);
    }).not.toThrow();

    // Restore
    window.AudioContext = originalAudioContext;
    (window as any).webkitAudioContext = originalWebkit;
  });

  it('handles rapid concurrent audio triggers without promise rejections or crashes', () => {
    expect(() => {
      for (let i = 0; i < 50; i++) {
        sound.playClick();
        sound.playComboNote(i % 10);
        sound.playWrong();
        sound.playTickWarning();
      }
    }).not.toThrow();
  });
});

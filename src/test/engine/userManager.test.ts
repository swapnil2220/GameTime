import { describe, it, expect, beforeEach } from 'vitest';
import {
  getAllUsers,
  saveAllUsers,
  getActiveUser,
  switchOrRegisterUser,
  resetUserProgress,
  deleteUserAccount,
  recordSeenQuestion,
  updateMindMatrixRating,
  updateBlitzResult,
  updateUserLevelProgress,
  checkAndUpdateDailyStreak,
  saveCustomGeminiKey,
  getCustomGeminiKey,
  createDefaultMindMatrix,
  createDefaultLevels,
} from '../../engine/userManager';
import type { UserProfile } from '../../types/game';

describe('userManager (Profile Integrity & Zero-Repetition Engine)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('Storage & Schema Migration', () => {
    it('returns empty array when storage is empty', () => {
      expect(getAllUsers()).toEqual([]);
    });

    it('handles corrupt JSON gracefully', () => {
      localStorage.setItem('logic_link_users_v3', '{corrupt_json');
      expect(getAllUsers()).toEqual([]);
    });

    it('sanitizes user profiles missing mindMatrix or seenQuestionIds', () => {
      const incompleteUser = {
        id: 'user_incomplete',
        username: 'IncompleteUser',
        avatar: '⚡',
        isGuest: false,
        totalScore: 100,
        totalStars: 5,
        dailyStreak: 1,
        lastPlayedDate: '2026-08-20',
      };
      localStorage.setItem('logic_link_users_v3', JSON.stringify([incompleteUser]));

      const users = getAllUsers();
      expect(users).toHaveLength(1);
      expect(users[0].mindMatrix).toBeDefined();
      expect(users[0].mindMatrix.patternRecognition).toBe(50);
      expect(users[0].seenQuestionIds).toEqual([]);
      expect(users[0].blitzHighScore).toBe(0);
    });

    it('saves and retrieves custom Gemini API key', () => {
      expect(getCustomGeminiKey()).toBe('');
      saveCustomGeminiKey('AIzaSyTestKey123');
      expect(getCustomGeminiKey()).toBe('AIzaSyTestKey123');
      saveCustomGeminiKey('');
      expect(getCustomGeminiKey()).toBe('');
    });
  });

  describe('User Registration & Session Switch', () => {
    it('creates guest user if no active user exists', () => {
      const active = getActiveUser();
      expect(active.isGuest).toBe(true);
      expect(active.username).toMatch(/^Guest_/);
      expect(active.levelProgress).toHaveLength(30);
      expect(active.levelProgress[0].unlocked).toBe(true);
    });

    it('registers a new user and sets as active', () => {
      const newUser = switchOrRegisterUser('CyberPlayer', '🚀');
      expect(newUser.username).toBe('CyberPlayer');
      expect(newUser.avatar).toBe('🚀');

      const active = getActiveUser();
      expect(active.id).toBe(newUser.id);
      expect(active.username).toBe('CyberPlayer');
    });

    it('switches to existing user if username matches', () => {
      const user1 = switchOrRegisterUser('Alice', '⚡');
      const user2 = switchOrRegisterUser('Bob', '🎯');

      expect(getActiveUser().id).toBe(user2.id);

      const switchedBack = switchOrRegisterUser('Alice', '👑');
      expect(switchedBack.id).toBe(user1.id);
      expect(switchedBack.avatar).toBe('👑'); // Avatar updated
      expect(getActiveUser().id).toBe(user1.id);
    });
  });

  describe('Zero-Repetition Tracking', () => {
    it('records seen question IDs without duplicates', () => {
      const user = switchOrRegisterUser('TestTracker', '👾');
      expect(user.seenQuestionIds).toEqual([]);

      const updated1 = recordSeenQuestion(user.id, 'geo_japan_101');
      expect(updated1.seenQuestionIds).toContain('geo_japan_101');
      expect(updated1.seenQuestionIds).toHaveLength(1);

      const updated2 = recordSeenQuestion(user.id, 'geo_japan_101'); // Duplicate
      expect(updated2.seenQuestionIds).toHaveLength(1);

      const updated3 = recordSeenQuestion(user.id, 'cipher_caesar_202');
      expect(updated3.seenQuestionIds).toHaveLength(2);
      expect(updated3.seenQuestionIds).toEqual(['geo_japan_101', 'cipher_caesar_202']);
    });
  });

  describe('Daily Streak Calculation', () => {
    it('maintains streak if played today', () => {
      const today = new Date().toISOString().split('T')[0];
      const user = switchOrRegisterUser('StreakUser', '🔥');
      user.lastPlayedDate = today;
      user.dailyStreak = 5;

      const checked = checkAndUpdateDailyStreak(user);
      expect(checked.dailyStreak).toBe(5);
    });

    it('increments streak if last played yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      const user = switchOrRegisterUser('StreakUser', '🔥');
      user.lastPlayedDate = yesterdayStr;
      user.dailyStreak = 5;

      const checked = checkAndUpdateDailyStreak(user);
      expect(checked.dailyStreak).toBe(6);
      expect(checked.lastPlayedDate).toBe(new Date().toISOString().split('T')[0]);
    });

    it('resets streak to 1 if last played earlier than yesterday', () => {
      const user = switchOrRegisterUser('StreakUser', '🔥');
      user.lastPlayedDate = '2026-01-01';
      user.dailyStreak = 10;

      const checked = checkAndUpdateDailyStreak(user);
      expect(checked.dailyStreak).toBe(1);
    });
  });

  describe('Mind Matrix & Score Updates', () => {
    it('updates patternRecognition for series category', () => {
      const user = switchOrRegisterUser('BrainPlayer', '🧠');
      const initialRating = user.mindMatrix.patternRecognition;

      const updated = updateMindMatrixRating(user.id, 'series', true, 4);
      expect(updated.mindMatrix.patternRecognition).toBe(initialRating + 4);
      expect(updated.mindMatrix.speedReflexes).toBe(50 + 3); // <= 5s speed bonus
    });

    it('penalizes rating for wrong answer', () => {
      const user = switchOrRegisterUser('BrainPlayer', '🧠');
      const updated = updateMindMatrixRating(user.id, 'syllogism', false, 12);
      expect(updated.mindMatrix.deductiveLogic).toBe(47); // 50 - 3
      expect(updated.mindMatrix.speedReflexes).toBe(49); // > 10s speed penalty (-1)
    });

    it('updates blitz high score and total score', () => {
      const user = switchOrRegisterUser('BlitzMaster', '⚡');
      const blitz = { score: 1200, correctCount: 12, wrongCount: 1, totalTimeSec: 60 };

      const updated = updateBlitzResult(user.id, blitz);
      expect(updated.blitzHighScore).toBe(1200);
      expect(updated.totalScore).toBe(1200);

      // Higher score updates high score
      const blitz2 = { score: 1500, correctCount: 15, wrongCount: 0, totalTimeSec: 60 };
      const updated2 = updateBlitzResult(user.id, blitz2);
      expect(updated2.blitzHighScore).toBe(1500);
      expect(updated2.totalScore).toBe(2700);
    });

    it('updates level progress and unlocks next stage', () => {
      const user = switchOrRegisterUser('CampaignPlayer', '🏆');
      const updated = updateUserLevelProgress(user.id, 1, 3, 450, 12);

      expect(updated.levelProgress[0].completed).toBe(true);
      expect(updated.levelProgress[0].stars).toBe(3);
      expect(updated.levelProgress[0].bestScore).toBe(450);
      expect(updated.levelProgress[0].bestTimeSec).toBe(12);
      expect(updated.levelProgress[1].unlocked).toBe(true); // Stage 2 unlocked
    });
  });

  describe('Account Reset & Deletion', () => {
    it('resets user progress', () => {
      const user = switchOrRegisterUser('ResetPlayer', '🔮');
      updateUserLevelProgress(user.id, 1, 3, 500, 10);
      recordSeenQuestion(user.id, 'q1');

      const reset = resetUserProgress(user.id);
      expect(reset.totalScore).toBe(0);
      expect(reset.totalStars).toBe(0);
      expect(reset.seenQuestionIds).toEqual([]);
      expect(reset.levelProgress[0].completed).toBe(false);
    });

    it('deletes user account and defaults to guest', () => {
      const user = switchOrRegisterUser('DeleteMe', '💎');
      expect(getAllUsers()).toHaveLength(1);

      const activeAfterDelete = deleteUserAccount(user.id);
      expect(getAllUsers()).toHaveLength(1); // Guest created
      expect(activeAfterDelete.isGuest).toBe(true);
    });
  });
});

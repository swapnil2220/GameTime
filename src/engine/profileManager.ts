import type { UserProfile, LevelProgress } from '../types/game';

const PROFILES_STORAGE_KEY = 'logic_link_user_profiles';
const ACTIVE_PROFILE_KEY = 'logic_link_active_profile_id';

export function createDefaultLevels(): LevelProgress[] {
  return Array.from({ length: 32 }).map((_, i) => ({
    levelNumber: i + 1,
    unlocked: i === 0, // level 1 unlocked initially
    completed: false,
    stars: 0,
    bestTimeSec: null,
    bestScore: 0,
  }));
}

export function getAllProfiles(): UserProfile[] {
  const raw = localStorage.getItem(PROFILES_STORAGE_KEY);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch (e) {
      console.error(e);
    }
  }

  // Initial default profiles
  const guestProfile: UserProfile = {
    id: 'guest_user',
    name: 'Guest Player',
    avatar: '🎮',
    isGuest: true,
    totalScore: 0,
    totalStars: 0,
    levels: createDefaultLevels(),
  };

  const samplePro: UserProfile = {
    id: 'user_alex',
    name: 'Alex (Pro Solver)',
    avatar: '🚀',
    isGuest: false,
    totalScore: 4250,
    totalStars: 18,
    levels: createDefaultLevels().map((l) =>
      l.levelNumber <= 6 ? { ...l, unlocked: true, completed: true, stars: 3, bestScore: 700 } : l
    ),
  };

  const profiles = [guestProfile, samplePro];
  localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(profiles));
  return profiles;
}

export function getActiveProfileId(): string {
  return localStorage.getItem(ACTIVE_PROFILE_KEY) || 'guest_user';
}

export function setActiveProfileId(id: string) {
  localStorage.setItem(ACTIVE_PROFILE_KEY, id);
}

export function getActiveProfile(): UserProfile {
  const profiles = getAllProfiles();
  const activeId = getActiveProfileId();
  return profiles.find((p) => p.id === activeId) || profiles[0];
}

export function saveProfile(updatedProfile: UserProfile) {
  const profiles = getAllProfiles();
  const idx = profiles.findIndex((p) => p.id === updatedProfile.id);
  if (idx !== -1) {
    profiles[idx] = updatedProfile;
  } else {
    profiles.push(updatedProfile);
  }
  localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(profiles));
}

export function createNewUserProfile(name: string, avatar: string): UserProfile {
  const newProfile: UserProfile = {
    id: `user_${Date.now()}`,
    name,
    avatar: avatar || '⚡',
    isGuest: false,
    totalScore: 0,
    totalStars: 0,
    levels: createDefaultLevels(),
  };
  saveProfile(newProfile);
  setActiveProfileId(newProfile.id);
  return newProfile;
}

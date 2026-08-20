import type { UserProfile, LevelProgress } from '../types/game';

const USERS_STORAGE_KEY = 'logic_link_users_v3';
const ACTIVE_USER_KEY = 'logic_link_active_user_id';
const CUSTOM_GEMINI_KEY = 'logic_link_custom_gemini_key';

export const AVATARS = ['⚡', '🧠', '👑', '🚀', '🎯', '👾', '🔥', '🔮', '🏆', '💎'];

export function getCustomGeminiKey(): string {
  return localStorage.getItem(CUSTOM_GEMINI_KEY) || '';
}

export function saveCustomGeminiKey(key: string) {
  if (!key.trim()) {
    localStorage.removeItem(CUSTOM_GEMINI_KEY);
  } else {
    localStorage.setItem(CUSTOM_GEMINI_KEY, key.trim());
  }
}

export function createDefaultLevels(): LevelProgress[] {
  return Array.from({ length: 30 }).map((_, i) => ({
    levelNumber: i + 1,
    unlocked: i === 0,
    completed: false,
    stars: 0,
    bestTimeSec: null,
    bestScore: 0,
  }));
}

export function getAllUsers(): UserProfile[] {
  const raw = localStorage.getItem(USERS_STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Failed to parse user storage:', e);
    return [];
  }
}

export function saveAllUsers(users: UserProfile[]) {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save users to localStorage:', e);
  }
}

function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

export function getActiveUser(): UserProfile {
  const users = getAllUsers();
  const activeId = localStorage.getItem(ACTIVE_USER_KEY);

  if (activeId) {
    const found = users.find((u) => u.id === activeId);
    if (found) return checkAndUpdateDailyStreak(found);
  }

  const today = getTodayString();
  const guest: UserProfile = {
    id: `guest_${Math.floor(Math.random() * 9000 + 1000)}`,
    username: `Guest_${Math.floor(Math.random() * 900 + 100)}`,
    avatar: '⚡',
    isGuest: true,
    totalScore: 0,
    totalStars: 0,
    dailyStreak: 1,
    lastPlayedDate: today,
    levelProgress: createDefaultLevels(),
    createdAt: new Date().toISOString(),
  };

  users.push(guest);
  saveAllUsers(users);
  localStorage.setItem(ACTIVE_USER_KEY, guest.id);
  return guest;
}

export function checkAndUpdateDailyStreak(user: UserProfile): UserProfile {
  const today = getTodayString();
  if (user.lastPlayedDate === today) return user;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  if (user.lastPlayedDate === yesterdayStr) {
    user.dailyStreak += 1;
  } else {
    user.dailyStreak = 1;
  }
  user.lastPlayedDate = today;

  const users = getAllUsers();
  const idx = users.findIndex((u) => u.id === user.id);
  if (idx !== -1) {
    users[idx] = user;
    saveAllUsers(users);
  }

  return user;
}

export function switchOrRegisterUser(usernameInput: string, avatar: string, isGuest: boolean = false): UserProfile {
  const users = getAllUsers();
  const today = getTodayString();
  const cleanUsername = usernameInput.trim();

  let existing = users.find((u) => u.username.trim().toLowerCase() === cleanUsername.toLowerCase());
  if (!existing) {
    existing = {
      id: `user_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      username: cleanUsername,
      avatar,
      isGuest,
      totalScore: 0,
      totalStars: 0,
      dailyStreak: 1,
      lastPlayedDate: today,
      levelProgress: createDefaultLevels(),
      createdAt: new Date().toISOString(),
    };
    users.push(existing);
  } else {
    existing.avatar = avatar;
  }

  saveAllUsers(users);
  localStorage.setItem(ACTIVE_USER_KEY, existing.id);
  return checkAndUpdateDailyStreak(existing);
}

export function resetUserProgress(userId: string): UserProfile {
  const users = getAllUsers();
  const user = users.find((u) => u.id === userId);
  if (user) {
    user.levelProgress = createDefaultLevels();
    user.totalScore = 0;
    user.totalStars = 0;
    saveAllUsers(users);
    return user;
  }
  return getActiveUser();
}

export function deleteUserAccount(userId: string): UserProfile {
  let users = getAllUsers();
  users = users.filter((u) => u.id !== userId);
  saveAllUsers(users);
  localStorage.removeItem(ACTIVE_USER_KEY);
  return getActiveUser();
}

export function updateUserLevelProgress(
  userId: string,
  levelNumber: number,
  stars: number,
  score: number,
  timeSec: number
): UserProfile {
  const users = getAllUsers();
  const user = users.find((u) => u.id === userId);
  if (!user) return getActiveUser();

  const level = user.levelProgress.find((l) => l.levelNumber === levelNumber);
  if (level) {
    level.completed = true;
    level.stars = Math.max(level.stars, stars);
    level.bestScore = Math.max(level.bestScore, score);
    level.bestTimeSec = level.bestTimeSec ? Math.min(level.bestTimeSec, timeSec) : timeSec;
  }

  if (stars > 0 && levelNumber < 30) {
    const nextLvl = user.levelProgress.find((l) => l.levelNumber === levelNumber + 1);
    if (nextLvl) nextLvl.unlocked = true;
  }

  user.totalScore = user.levelProgress.reduce((acc, l) => acc + l.bestScore, 0);
  user.totalStars = user.levelProgress.reduce((acc, l) => acc + l.stars, 0);

  saveAllUsers(users);
  return checkAndUpdateDailyStreak(user);
}

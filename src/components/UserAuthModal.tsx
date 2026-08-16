import React, { useState } from 'react';
import type { UserProfile } from '../types/game';
import { AVATARS, getAllUsers, switchOrRegisterUser } from '../engine/userManager';
import { X, UserCheck, UserPlus } from 'lucide-react';

interface UserAuthModalProps {
  isOpen: boolean;
  activeUser: UserProfile;
  onClose: () => void;
  onUserChanged: (newUser: UserProfile) => void;
}

export const UserAuthModal: React.FC<UserAuthModalProps> = ({
  isOpen,
  activeUser,
  onClose,
  onUserChanged,
}) => {
  const [usernameInput, setUsernameInput] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);

  if (!isOpen) return null;

  const usersList = getAllUsers();

  const handleCreateOrSwitch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim()) return;
    const updated = switchOrRegisterUser(usernameInput.trim(), selectedAvatar, false);
    onUserChanged(updated);
    setUsernameInput('');
    onClose();
  };

  const handleSelectExisting = (user: UserProfile) => {
    const updated = switchOrRegisterUser(user.username, user.avatar, user.isGuest);
    onUserChanged(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.9)] font-sans max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{activeUser.avatar}</span>
            <div className="flex flex-col">
              <h3 className="text-xl font-extrabold font-mono text-cyan-400">USER PROFILE / AUTH</h3>
              <span className="text-[10px] font-mono text-slate-400">
                ACTIVE: {activeUser.username} {activeUser.isGuest ? '(GUEST)' : '(REGISTERED)'}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Existing Accounts Switcher */}
        {usersList.length > 0 && (
          <div className="mb-6">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-widest block mb-2">
              SWITCH ACCOUNT SESSION
            </span>
            <div className="flex flex-col gap-2 max-h-36 overflow-y-auto pr-1">
              {usersList.map((u) => (
                <button
                  key={u.id}
                  onClick={() => handleSelectExisting(u)}
                  className={`flex items-center justify-between p-3 rounded-xl border text-xs font-mono transition-all ${
                    u.id === activeUser.id
                      ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,243,255,0.2)]'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{u.avatar}</span>
                    <span className="font-bold">{u.username}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-slate-400">
                    <span>{u.totalStars} ★</span>
                    <span>{u.totalScore} PTS</span>
                    {u.id === activeUser.id && <UserCheck className="w-4 h-4 text-cyan-400" />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Register / Create New Profile Form */}
        <form onSubmit={handleCreateOrSwitch} className="flex flex-col gap-4">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-widest block">
            CREATE / LOGIN NEW PROFILE
          </span>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-mono text-cyan-400">USERNAME HANDLE</label>
            <input
              type="text"
              required
              maxLength={16}
              placeholder="e.g. CYBER_MIND"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 font-mono text-sm text-slate-100 focus:border-cyan-400 focus:outline-none"
            />
          </div>

          {/* Avatar Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-mono text-cyan-400">CHOOSE AVATAR</label>
            <div className="flex flex-wrap gap-2">
              {AVATARS.map((av) => (
                <button
                  type="button"
                  key={av}
                  onClick={() => setSelectedAvatar(av)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl border transition-all ${
                    selectedAvatar === av
                      ? 'bg-cyan-500/20 border-cyan-400 shadow-[0_0_12px_rgba(0,243,255,0.4)] scale-110'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="mt-2 w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 font-mono font-extrabold text-white text-sm shadow-[0_0_20px_rgba(0,243,255,0.3)] hover:scale-102 transition-all flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" /> START PLAYING AS NEW PROFILE
          </button>
        </form>
      </div>
    </div>
  );
};

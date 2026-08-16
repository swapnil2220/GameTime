import React, { useState } from 'react';
import type { UserProfile } from '../types/game';
import { getAllProfiles, createNewUserProfile, setActiveProfileId } from '../engine/profileManager';
import { X, UserPlus, CheckCircle2, UserCheck } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeProfile: UserProfile;
  onProfileChanged: (profile: UserProfile) => void;
}

const AVATARS = ['⚡', '🚀', '🧠', '👑', '🎯', '🔥', '💎', '🎮'];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  activeProfile,
  onProfileChanged,
}) => {
  const [profiles, setProfiles] = useState<UserProfile[]>(() => getAllProfiles());
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('🚀');

  if (!isOpen) return null;

  const handleSelectProfile = (id: string) => {
    setActiveProfileId(id);
    const updatedProfiles = getAllProfiles();
    const active = updatedProfiles.find((p) => p.id === id) || updatedProfiles[0];
    onProfileChanged(active);
    onClose();
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const created = createNewUserProfile(newName.trim(), selectedAvatar);
    setProfiles(getAllProfiles());
    onProfileChanged(created);
    setIsCreating(false);
    setNewName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl p-8 rounded-3xl bg-slate-950 border border-slate-800 shadow-[0_0_50px_rgba(168,85,247,0.2)] font-mono">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-2">
          <UserCheck className="w-8 h-8 text-purple-400" />
          <h2 className="text-3xl font-black tracking-wider bg-gradient-to-r from-purple-400 via-pink-300 to-cyan-400 bg-clip-text text-transparent">
            USER SESSIONS
          </h2>
        </div>
        <p className="text-xs text-slate-400 mb-6">LOG IN OR SWITCH PROFILES FOR ISOLATED PROGRESS</p>

        {!isCreating ? (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
              {profiles.map((p) => {
                const isActive = p.id === activeProfile.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => handleSelectProfile(p.id)}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                      isActive
                        ? 'bg-purple-950/80 border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.3)]'
                        : 'bg-slate-900/60 border-slate-800 hover:border-purple-500/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl p-2 rounded-xl bg-slate-950 border border-slate-800">
                        {p.avatar}
                      </span>
                      <div className="flex flex-col text-left">
                        <span className="font-extrabold text-sm text-slate-200">
                          {p.name} {p.isGuest && '(Guest)'}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          STARS: {p.totalStars} • SCORE: {p.totalScore}
                        </span>
                      </div>
                    </div>

                    {isActive && <CheckCircle2 className="w-5 h-5 text-purple-400" />}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setIsCreating(true)}
              className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 font-extrabold text-white text-sm shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:scale-102 transition-all mt-2"
            >
              <UserPlus className="w-5 h-5" /> CREATE NEW PROFILE
            </button>
          </div>
        ) : (
          <form onSubmit={handleCreate} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-xs text-slate-400">PLAYER NAME</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Enter player handle (e.g., Alex_Ace)"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 focus:border-purple-400 focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-xs text-slate-400">SELECT AVATAR</label>
              <div className="flex flex-wrap gap-2">
                {AVATARS.map((av) => (
                  <button
                    type="button"
                    key={av}
                    onClick={() => setSelectedAvatar(av)}
                    className={`w-10 h-10 rounded-xl text-xl border transition-all ${
                      selectedAvatar === av
                        ? 'bg-purple-950 border-purple-400 scale-110 shadow'
                        : 'bg-slate-900 border-slate-800'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <button
                type="submit"
                className="flex-1 py-3.5 rounded-xl bg-purple-600 font-bold text-white text-sm hover:bg-purple-500 transition-all"
              >
                SAVE & LOG IN
              </button>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="flex-1 py-3.5 rounded-xl bg-slate-900 border border-slate-700 font-bold text-slate-400 text-sm hover:text-slate-200 transition-all"
              >
                CANCEL
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

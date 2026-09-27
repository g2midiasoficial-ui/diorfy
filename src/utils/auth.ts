import { UserProfile, UserPlan } from '../types/auth';

const USER_SESSION_KEY = 'diorfy_user_session_v1';

export const DEFAULT_USER: UserProfile = {
  id: 'usr-default-g2',
  name: 'G2 Mídias',
  email: 'g2midiasoficial@gmail.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
  plan: 'pro',
  billingCycle: 'monthly',
  company: 'G2 Mídias Oficial',
  createdAt: '2026-01-15',
};

export function getCurrentUser(): UserProfile {
  try {
    const raw = localStorage.getItem(USER_SESSION_KEY);
    if (!raw) {
      localStorage.setItem(USER_SESSION_KEY, JSON.stringify(DEFAULT_USER));
      return DEFAULT_USER;
    }
    return JSON.parse(raw);
  } catch (e) {
    return DEFAULT_USER;
  }
}

export function saveCurrentUser(user: UserProfile): void {
  try {
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(user));
  } catch (e) {
    console.error('Failed to save user session', e);
  }
}

export function loginUser(email: string, name?: string): UserProfile {
  const existing = getCurrentUser();
  const updatedUser: UserProfile = {
    ...existing,
    id: `usr-${Date.now()}`,
    name: name || email.split('@')[0] || 'Usuário Diorfy',
    email: email.trim().toLowerCase(),
    avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || email)}`,
  };
  saveCurrentUser(updatedUser);
  return updatedUser;
}

export function registerUser(name: string, email: string, plan: UserPlan = 'free'): UserProfile {
  const newUser: UserProfile = {
    id: `usr-${Date.now()}`,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
    plan,
    billingCycle: 'monthly',
    createdAt: new Date().toISOString().split('T')[0],
  };
  saveCurrentUser(newUser);
  return newUser;
}

export function logoutUser(): void {
  // Reset to guest/new user
  const guestUser: UserProfile = {
    id: `usr-guest-${Date.now()}`,
    name: 'Visitante',
    email: 'visitante@diorfy.com',
    plan: 'free',
    billingCycle: 'monthly',
    createdAt: new Date().toISOString().split('T')[0],
  };
  saveCurrentUser(guestUser);
}

export function updateUserPlan(plan: UserPlan, billingCycle: 'monthly' | 'annual' = 'monthly'): UserProfile {
  const current = getCurrentUser();
  const updated: UserProfile = {
    ...current,
    plan,
    billingCycle,
  };
  saveCurrentUser(updated);
  return updated;
}

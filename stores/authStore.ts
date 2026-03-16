import create from 'zustand';
import { Driver } from '../types';

interface AuthState {
  user: Driver | null;
  token: string | null;
  login: (user: Driver, token: string) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  login: (user, token) => set({ user, token }),
  logout: () => set({ user: null, token: null }),
}));

export default useAuthStore;
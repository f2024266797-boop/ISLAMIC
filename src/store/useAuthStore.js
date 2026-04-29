import { create } from 'zustand';
import { storageService, KEYS } from '../services/storageService';
import * as Crypto from 'expo-crypto';

const AUTH_KEY = KEYS.AUTH_USER;

const hashPassword = async (password) => {
  return await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password
  );
};

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoaded: false,

  loadAuth: async () => {
    const user = await storageService.load(AUTH_KEY, null);
    set({ user, isAuthenticated: !!user, isLoaded: true });
  },

  login: async (name) => {
    if (!name.trim()) return { success: false, message: 'Name is required' };
    
    const user = { 
      name: name.trim(), 
      email: `${name.toLowerCase().replace(/\s/g, '')}@guest.com`,
      id: Date.now().toString() 
    };
    
    set({ user, isAuthenticated: true });
    await storageService.save(AUTH_KEY, user);
    return { success: true };
  },

  register: async (name, email, password) => {
    const storedUsers = await storageService.load(KEYS.ALL_USERS, []);
    if (storedUsers.some(u => u.email === email)) {
      return { success: false, message: 'Email already exists' };
    }

    const hashedPassword = await hashPassword(password);
    const newUser = { name, email, password: hashedPassword, id: Date.now().toString() };
    const updatedUsers = [...storedUsers, newUser];
    await storageService.save(KEYS.ALL_USERS, updatedUsers);
    
    const { password: _, ...userWithoutPassword } = newUser;
    set({ user: userWithoutPassword, isAuthenticated: true });
    await storageService.save(AUTH_KEY, userWithoutPassword);
    return { success: true };
  },

  logout: async () => {
    set({ user: null, isAuthenticated: false });
    await storageService.save(AUTH_KEY, null);
  },

  updateProfile: async (updates) => {
    set((state) => {
      const updatedUser = { ...state.user, ...updates };
      storageService.save(AUTH_KEY, updatedUser);
      return { user: updatedUser };
    });
  }
}));

export default useAuthStore;

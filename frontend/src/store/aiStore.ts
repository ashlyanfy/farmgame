import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AiStore {
  lastAdviceDate: string;
  canShowAdvice: () => boolean;
  markAdviceShown: () => void;
}

function today() {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Almaty' });
}

export const useAiStore = create<AiStore>()(persist(
  (set, get) => ({
    lastAdviceDate: '',
    canShowAdvice: () => get().lastAdviceDate !== today(),
    markAdviceShown: () => set({ lastAdviceDate: today() }),
  }),
  { name: 'mf_ai' }
));

import { create } from "zustand";

interface InboxStore {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export const useInbox = create<InboxStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
})); 
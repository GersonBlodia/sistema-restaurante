import { create } from "zustand";

interface SidebarState {
  isActive: boolean;
  handleIsActive: () => void;
  setIsActive: (value: boolean) => void; // Nueva función para establecer el estado manualmente
}

export const useSidebarState = create<SidebarState>((set, get) => ({
  isActive: true,
  handleIsActive: () => {
    set((state) => ({ isActive: !state.isActive }));
  },
  setIsActive: (value) => {
    set({ isActive: value });
  },
}));
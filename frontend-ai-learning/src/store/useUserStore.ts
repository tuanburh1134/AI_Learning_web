import create from 'zustand'

export const useUserStore = create((set:any) => ({
  user: null,
  setUser: (u:any) => set({ user: u })
}))

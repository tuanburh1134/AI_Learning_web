import create from 'zustand'

export const useThemeStore = create((set:any) => ({
  theme: 'light',
  setTheme: (t:string) => set({ theme: t })
}))

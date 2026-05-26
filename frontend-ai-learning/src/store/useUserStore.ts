import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AuthResponse } from '../features/auth/types/auth.types'
import { RoadmapMap } from '../types/roadmap.types'

export interface UserProfile {
  grade?: string
  subjects?: string[]
  currentLevel?: string
  goal?: string
  onboarded?: boolean
}

export interface UserInfo {
  userId: string | number
  username: string
  email: string
  fullName: string
  token: string
  profile?: UserProfile
}

interface UserStore {
  user: UserInfo | null
  showOnboardingModal: boolean
  roadmaps: RoadmapMap          // key = tên môn, value = RoadmapData
  setUser: (u: AuthResponse) => void
  setShowOnboardingModal: (show: boolean) => void
  updateProfile: (profile: UserProfile) => void
  setRoadmaps: (maps: RoadmapMap) => void
  clearRoadmaps: () => void
  logout: () => void
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      showOnboardingModal: false,
      roadmaps: {},
      setUser: (u) => {
        const profile = u.onboarded ? {
          grade: u.grade,
          subjects: u.subjects ? u.subjects.split(',') : [],
          currentLevel: u.currentLevel,
          goal: u.goal,
          onboarded: u.onboarded
        } : undefined;

        set({
          user: {
            userId: u.userId,
            username: u.username,
            email: u.email,
            fullName: u.fullName,
            token: u.token,
            profile
          }
        })
      },
      setShowOnboardingModal: (show) => set({ showOnboardingModal: show }),
      updateProfile: (profileData) => set((state) => {
        if (!state.user) return {}
        return {
          user: {
            ...state.user,
            profile: {
              ...state.user.profile,
              ...profileData,
              onboarded: true
            }
          }
        }
      }),
      setRoadmaps: (maps) => set({ roadmaps: maps }),
      clearRoadmaps: () => set({ roadmaps: {} }),
      logout: () => set({ user: null, showOnboardingModal: false, roadmaps: {} }),
    }),
    { name: 'ai-learning-user' }
  )
)


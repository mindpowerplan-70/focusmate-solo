import { create } from 'zustand';
import type { Video, Script, Avatar, Voice } from '@/types';

interface VideoCreationState {
  // Current video being created
  script: Script | null;
  selectedAvatar: Avatar | null;
  selectedVoice: Voice | null;

  // Available options
  avatars: Avatar[];
  voices: Voice[];

  // Generated videos
  videos: Video[];
  currentVideo: Video | null;

  // UI state
  step: 'script' | 'avatar' | 'voice' | 'preview' | 'generating';
  isLoading: boolean;
  error: string | null;

  // Actions
  setScript: (script: Script | null) => void;
  setSelectedAvatar: (avatar: Avatar | null) => void;
  setSelectedVoice: (voice: Voice | null) => void;
  setAvatars: (avatars: Avatar[]) => void;
  setVoices: (voices: Voice[]) => void;
  setVideos: (videos: Video[]) => void;
  setCurrentVideo: (video: Video | null) => void;
  addVideo: (video: Video) => void;
  updateVideo: (id: string, updates: Partial<Video>) => void;
  setStep: (step: VideoCreationState['step']) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  script: null,
  selectedAvatar: null,
  selectedVoice: null,
  avatars: [],
  voices: [],
  videos: [],
  currentVideo: null,
  step: 'script' as const,
  isLoading: false,
  error: null,
};

export const useVideoStore = create<VideoCreationState>((set) => ({
  ...initialState,

  setScript: (script) => set({ script }),

  setSelectedAvatar: (avatar) => set({ selectedAvatar: avatar }),

  setSelectedVoice: (voice) => set({ selectedVoice: voice }),

  setAvatars: (avatars) => set({ avatars }),

  setVoices: (voices) => set({ voices }),

  setVideos: (videos) => set({ videos }),

  setCurrentVideo: (video) => set({ currentVideo: video }),

  addVideo: (video) =>
    set((state) => ({ videos: [video, ...state.videos] })),

  updateVideo: (id, updates) =>
    set((state) => ({
      videos: state.videos.map((v) =>
        v.id === id ? { ...v, ...updates } : v
      ),
      currentVideo:
        state.currentVideo?.id === id
          ? { ...state.currentVideo, ...updates }
          : state.currentVideo,
    })),

  setStep: (step) => set({ step }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  reset: () => set(initialState),
}));

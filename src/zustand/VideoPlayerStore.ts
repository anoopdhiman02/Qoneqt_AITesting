import { create } from 'zustand';

type VideoPlayerState = {
  videoRef: any;
  setVideoRef: (ref: any) => void;
  isPlay: boolean;
  setIsPlay: (isPlay: boolean) => void;
};

export const useVideoPlayerStore = create<VideoPlayerState>((set) => ({
  videoRef: null,
  setVideoRef: (ref) => set({ videoRef: ref }),
  isPlay: false,
  setIsPlay: (isPlay) => set({ isPlay }),
}));
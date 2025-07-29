import { create } from "zustand";

export const useScrollStore = create((set) => ({
  scrollViewRef: null, // Store the reference
  setScrollViewRef: (ref: any) => set({ scrollViewRef: ref }),
  scrollToTop: () => {
    set((state: any) => {
      if (state.scrollViewRef?.current) {
        //  state.scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
         state.scrollViewRef.current.scrollToOffset({ offset: 0, animated: true });

        // state.scrollViewRef.current.scrollToOffset(0, 0, true);
      }
      return state;
    });
  },
}));

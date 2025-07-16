import create from "zustand";

interface deletePostModal {
  deletePostModal: boolean;
  setDeletePostModal: (update: boolean | ((prev: boolean) => boolean)) => void;
}
export const useDeletePostModal = create<deletePostModal>((set) => ({
  deletePostModal: false,
  setDeletePostModal: (update) =>
    set((state) => ({
      deletePostModal:
        typeof update === "function" ? update(state.deletePostModal) : update,
    })),
}));
interface delePostId {
  deleteUserId: boolean;
  setDeleteUserId: (update: boolean | ((prev: boolean) => boolean)) => void;
}
export const useDeletePostId = create<delePostId>((set) => ({
  deleteUserId: false,
  setDeleteUserId: (update) =>
    set((state) => ({
      deleteUserId:
        typeof update === "function" ? update(state.deleteUserId) : update,
    })),
}));

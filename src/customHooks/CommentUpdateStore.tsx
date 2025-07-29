import { TextInput } from "react-native";
import { create } from "zustand";

interface CommentStore {
  commentData: any[];
  setCommentData: (update: any[] | ((prevData: any[]) => any[])) => void;
}

export const useCommentStore = create<CommentStore>((set) => ({
  commentData: [],
  setCommentData: (update) =>
    set((state) => ({
      commentData:
        typeof update === "function" ? update(state.commentData) : update,
    })),
}));

interface idStore {
  id: string | null;
  setID: (update: string | ((prevId: string | null) => string | null)) => void;
}

// Create the Zustand store
export const useIdStore = create<idStore>((set) => ({
  id: null, // Initially, there is no id set
  setID: (update) =>
    set((state) => ({
      id: typeof update === "function" ? update(state.id) : update,
    })),
}));
interface deleteIdStore {
  Deleteid: string | null; 
  setDeleteID: (update: string | ((prevId: string | null) => string | null)) => void;
}

// Create the Zustand store
export const useDeleteIdStore = create<deleteIdStore>((set) => ({
  Deleteid: null,
  setDeleteID: (update) =>
    set((state) => ({
      Deleteid: typeof update === "function" ? update(state.Deleteid) : update,
    })),
}));

interface refreshShow {
  refresh_Button: boolean; 
  setRefresh_Button: (update: boolean | ((prev: boolean) => boolean)) => void;
}
export const useRefreshShow = create<refreshShow>((set) => ({
  refresh_Button: false, 
  setRefresh_Button: (update) =>
    set((state) => ({
      refresh_Button:
        typeof update === "function" ? update(state.refresh_Button) : update, 
    })),
}));

interface CommentStoreRef {
  expandModal: boolean;
  replyStatus:boolean;
  CommentId: string | null;
  repliedId: number | null;
  replyingTo: any;
  inputRef: React.RefObject<TextInput> | null;
  setExpandModal: (expand: boolean) => void;
  setCommentId: (id: string | null) => void;
  setRepliedId: (id: number | null) => void;
  setReplyingTo: (data: any) => void;
  setInputRef: (ref: React.RefObject<TextInput>) => void;
  setReplyStatus: (expand: boolean) => void;

}

export const useCommentRef = create<CommentStoreRef>((set) => ({
  expandModal: false,
  CommentId: null,
  repliedId: null,
  replyingTo: null,
  inputRef: null,
  replyStatus:null,
  setReplyStatus:(status)=>set({replyStatus:status}),
  setExpandModal: (expand) => set({ expandModal: expand }),
  setCommentId: (id) => set({ CommentId: id }),
  setRepliedId: (id) => set({ repliedId: id }),
  setReplyingTo: (data) => set({ replyingTo: data }),
  setInputRef: (ref) => set({ inputRef: ref }),
}));

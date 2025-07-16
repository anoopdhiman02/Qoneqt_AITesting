import { create } from "zustand";

interface PostStateProps {
  postId: number;
  postType: number;
  postFileType: number;
  postedByUserId: number;
  isComment: boolean;
  postValue: any;
  setPostId: (id: number) => void;
  setPostType: (type: number) => void;
  setPostFileType: (fileType: number) => void;
  setPostedByUserId: (userId: number) => void;
  setIsComment: (isComment: boolean) => void;
  setPostValue: (postValue: any) => void;
}

export const usePostDetailStore = create<PostStateProps>((set) => ({
  postId: 0,
  postType: 0,
  postFileType: 0,
  postedByUserId: 0,
  isComment: false,
  postValue: {},

  setPostId: (id: number) => set({ postId: id }),
  setPostType: (type: number) => set({ postType: type }),
  setPostFileType: (fileType: number) => set({ postFileType: fileType }),
  setPostedByUserId: (userId: number) => set({ postedByUserId: userId }),
  setIsComment: (isCommen: boolean) => set({ isComment: isCommen}),
  setPostValue: (postValue: any) => set({ postValue: postValue })
}));

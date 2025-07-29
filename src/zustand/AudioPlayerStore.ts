import { create } from "zustand";

interface useAudio {
  recordingPath: string | null;
  setRecordingPath: (
    update: string | ((prevId: string | null) => string | null)
  ) => void;
}

// Create the Zustand store
export const useAudioStore = create<useAudio>((set) => ({
  recordingPath: null, // Initially, there is no id set
  setRecordingPath: (update) =>
    set((state) => ({
      recordingPath:
        typeof update === "function" ? update(state.recordingPath) : update,
    })),
}));

interface useModal {
  isAddModalVisible: boolean;
  setIsAddModalVisible: (
    update: boolean | ((prev: boolean) => boolean)
  ) => void;
}
export const userShowModal = create<useModal>((set) => ({
  isAddModalVisible: false,
  setIsAddModalVisible: (update) =>
    set((state) => ({
      isAddModalVisible:
        typeof update === "function" ? update(state.isAddModalVisible) : update,
    })),
}));

interface userecordingStopped {
  recordingStopped: boolean;
  setRecordingStopped: (update: boolean | ((prev: boolean) => boolean)) => void;
}
export const userShowRecordingStopped = create<userecordingStopped>((set) => ({
  recordingStopped: false,
  setRecordingStopped: (update) =>
    set((state) => ({
      recordingStopped:
        typeof update === "function" ? update(state.recordingStopped) : update,
    })),
}));



interface useIsRecording {
  isRecording: boolean;
  setIsRecording: (update: boolean | ((prev: boolean) => boolean)) => void;
}
export const userShowIsRecording = create<useIsRecording>((set) => ({
  isRecording: false,
  setIsRecording: (update) =>
    set((state) => ({
      isRecording:
        typeof update === "function" ? update(state.isRecording) : update,
    })),
}));

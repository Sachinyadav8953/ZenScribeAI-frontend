import { create } from "zustand";
import { Consultation, ConsultationStatus, Transcript } from "../types";

interface ConsultationState {
  currentConsultation: Consultation | null;
  status: ConsultationStatus | null;
  transcripts: Transcript[];
  setCurrentConsultation: (consultation: Consultation | null) => void;
  setStatus: (status: ConsultationStatus | null) => void;
  setTranscripts: (transcripts: Transcript[]) => void;
  addTranscriptChunk: (chunk: Transcript) => void;
  clearConsultation: () => void;
}

export const useConsultationStore = create<ConsultationState>((set) => ({
  currentConsultation: null,
  status: null,
  transcripts: [],
  setCurrentConsultation: (consultation) =>
    set({
      currentConsultation: consultation,
      status: consultation ? consultation.status : null,
      transcripts: consultation?.transcripts || [],
    }),
  setStatus: (status) => set({ status }),
  setTranscripts: (transcripts) => set({ transcripts }),
  addTranscriptChunk: (chunk) =>
    set((state) => {
      // Avoid duplicate transcripts by uuid if server sends it again
      const exists = state.transcripts.some((t) => t.uuid === chunk.uuid);
      if (exists) {
        return {
          transcripts: state.transcripts.map((t) =>
            t.uuid === chunk.uuid ? chunk : t
          ),
        };
      }
      return { transcripts: [...state.transcripts, chunk] };
    }),
  clearConsultation: () =>
    set({
      currentConsultation: null,
      status: null,
      transcripts: [],
    }),
}));

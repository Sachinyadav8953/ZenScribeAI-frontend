import { useState, useCallback } from "react";
import { useConsultationStore } from "../stores/consultationStore";
import { consultationService } from "../services/consultationService";
import { Consultation } from "../types";

export function useConsultation() {
  const {
    currentConsultation,
    status,
    transcripts,
    setCurrentConsultation,
    setStatus,
    setTranscripts,
    clearConsultation,
  } = useConsultationStore();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createConsultation = useCallback(async (data: {
    patient_name: string;
    patient_age?: number;
    patient_gender?: string;
    patient_phone?: string;
    chief_complaint?: string;
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const consultation = await consultationService.create(data);
      setCurrentConsultation(consultation);
      return consultation;
    } catch (err: any) {
      const errMsg = err.response?.data?.detail || "Failed to create consultation";
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setIsLoading(false);
    }
  }, [setCurrentConsultation]);

  const fetchConsultation = useCallback(async (uuid: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const consultation = await consultationService.getByUuid(uuid);
      setCurrentConsultation(consultation);
      return consultation;
    } catch (err: any) {
      const errMsg = err.response?.data?.detail || "Failed to fetch consultation";
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setIsLoading(false);
    }
  }, [setCurrentConsultation]);

  const updateConsultation = useCallback(async (
    uuid: string,
    data: {
      patient_name?: string;
      patient_age?: number;
      patient_gender?: string;
      patient_phone?: string;
      chief_complaint?: string;
    }
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const updated = await consultationService.update(uuid, data);
      setCurrentConsultation(updated);
      return updated;
    } catch (err: any) {
      const errMsg = err.response?.data?.detail || "Failed to update consultation";
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setIsLoading(false);
    }
  }, [setCurrentConsultation]);

  const endConsultation = useCallback(async (uuid: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const ended = await consultationService.end(uuid);
      setCurrentConsultation(ended);
      return ended;
    } catch (err: any) {
      const errMsg = err.response?.data?.detail || "Failed to end consultation";
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setIsLoading(false);
    }
  }, [setCurrentConsultation]);

  const deleteConsultation = useCallback(async (uuid: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await consultationService.delete(uuid);
      if (currentConsultation?.uuid === uuid) {
        clearConsultation();
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.detail || "Failed to delete consultation";
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setIsLoading(false);
    }
  }, [currentConsultation, clearConsultation]);

  return {
    currentConsultation,
    status,
    transcripts,
    isLoading,
    error,
    createConsultation,
    fetchConsultation,
    updateConsultation,
    endConsultation,
    deleteConsultation,
    clearConsultation,
    setTranscripts,
    setStatus,
  };
}

import { api } from "../lib/axios";
import { Consultation } from "../types";

export const consultationService = {
  async create(data: {
    patient_name: string;
    patient_age?: number;
    patient_gender?: string;
    patient_phone?: string;
    chief_complaint?: string;
  }): Promise<Consultation> {
    const res = await api.post("/consultations/", data);
    return res.data;
  },

  async getAll(): Promise<Consultation[]> {
    const res = await api.get("/consultations/");
    return res.data;
  },

  async getByUuid(uuid: string): Promise<Consultation> {
    const res = await api.get(`/consultations/${uuid}`);
    return res.data;
  },

  async update(
    uuid: string,
    data: {
      patient_name?: string;
      patient_age?: number;
      patient_gender?: string;
      patient_phone?: string;
      chief_complaint?: string;
    }
  ): Promise<Consultation> {
    const res = await api.patch(`/consultations/${uuid}`, data);
    return res.data;
  },

  async end(uuid: string): Promise<Consultation> {
    const res = await api.patch(`/consultations/${uuid}/end`);
    return res.data;
  },

  async delete(uuid: string): Promise<void> {
    await api.delete(`/consultations/${uuid}`);
  },
};

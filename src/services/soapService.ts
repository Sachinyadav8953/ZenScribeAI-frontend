import { api } from "../lib/axios";
import { SoapNote } from "../types";

export const soapService = {
  async get(consultationUuid: string): Promise<SoapNote> {
    const res = await api.get(`/soap/${consultationUuid}`);
    return res.data;
  },

  async generate(consultationUuid: string): Promise<SoapNote> {
    const res = await api.post(`/soap/${consultationUuid}/generate`);
    return res.data;
  },

  async update(
    consultationUuid: string,
    data: {
      subjective?: string;
      objective?: string;
      assessment?: string;
      plan?: string;
    }
  ): Promise<SoapNote> {
    const res = await api.patch(`/soap/${consultationUuid}`, data);
    return res.data;
  },

  async approve(consultationUuid: string): Promise<SoapNote> {
    const res = await api.patch(`/soap/${consultationUuid}/approve`);
    return res.data;
  },
};

import { apiRequest } from "./client";
import type { CreateSymptomRequest, Symptom, UpdateSymptomRequest } from "../types/symptom";

type ListSymptomsParams = {
  token: string;
  from_?: string;
  to?: string;
  category?: string;
  severity?: number;
};

function buildSymptomsQuery(params: Omit<ListSymptomsParams, "token">): string {
  const search = new URLSearchParams();

  if (params.from_) {
    search.set("from_", params.from_);
  }
  if (params.to) {
    search.set("to", params.to);
  }
  if (params.category) {
    search.set("category", params.category);
  }
  if (params.severity !== undefined) {
    search.set("severity", String(params.severity));
  }

  const query = search.toString();
  return query ? `?${query}` : "";
}
export function createSymptom(token: string, payload: CreateSymptomRequest): Promise<Symptom> {
  return apiRequest<Symptom>("/symptoms", {
    method: "POST",
    token,
    body: payload,
  });
}

export function listSymptoms(params: ListSymptomsParams): Promise<Symptom[]> {
  const { token, ...queryParams } = params;
  return apiRequest<Symptom[]>(`/symptoms${buildSymptomsQuery(queryParams)}`, {
    token,
  });
}

export function getSymptom(token: string, symptomId: string): Promise<Symptom> {
  return apiRequest<Symptom>(`/symptoms/${symptomId}`, {
    token,
  });
}

export function updateSymptom(
  token: string,
  symptomId: string,
  payload: UpdateSymptomRequest,
): Promise<Symptom> {
  return apiRequest<Symptom>(`/symptoms/${symptomId}`, {
    method: "PUT",
    token,
    body: payload,
  });
}

export function deleteSymptom(token: string, symptomId: string): Promise<void> {
  return apiRequest<void>(`/symptoms/${symptomId}`, {
    method: "DELETE",
    token,
  });
}
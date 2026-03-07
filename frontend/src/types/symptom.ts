export type SymptomCategory =
  | "cramps"
  | "headache"
  | "mood"
  | "fatigue"
  | "sleep"
  | "bloating"
  | "nausea"
  | "other";

export type Symptom = {
  id: string;
  user_id: string;
  date_time: string;
  category: SymptomCategory;
  severity: number;
  notes: string | null;
  tags: string[] | null;
  created_at: string;
};

export type CreateSymptomRequest = {
  date_time: string;
  category: SymptomCategory;
  severity: number;
  notes?: string;
  tags?: string[];
};

export type UpdateSymptomRequest = {
  date_time?: string;
  category?: SymptomCategory;
  severity?: number;
  notes?: string;
  tags?: string[];
};
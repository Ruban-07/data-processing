export interface FieldData {
  id: string;
  label: string;
  value: string | null;
  confidence_score: number;
  originalPath: string[];
  index: number;
}

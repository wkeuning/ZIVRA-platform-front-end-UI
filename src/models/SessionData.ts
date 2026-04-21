export interface Metric {
  id: number;
  exerciseId: number;
  metric: {
    id: number;
    name: string;
    type: number;
  };
  value: string;
}

export interface Exercise {
  metrics?: Metric[];
  bvhIdentifier?: string;
}

export interface SessionData {
  id: number;
  patient: {
    firstName: string;
    lastName: string;
  };
  category?: string;
  game?: { level?: string; name?: string };
  exercises?: Exercise[];
  sessionStart: string;
}

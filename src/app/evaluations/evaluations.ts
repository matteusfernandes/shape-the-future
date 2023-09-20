export interface Evaluation {
  id: number;
  title: string;
  subtitle: string;
  schedule: string;
  finalist: boolean;
  spaceId: number;
  students: Student[];
  notes: unknown[];
}

export interface Student {
  id: number;
  name: string;
  projectId: number;
  spaceId: number;
}

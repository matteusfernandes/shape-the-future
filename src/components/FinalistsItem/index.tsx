'use client';

import { Evaluation, Student } from '@/app/evaluations/evaluations';

export type FinalistsItemProps = {
  background?: string;
  horizontal?: boolean;
  vote?: number;
  isVote?: boolean;
  evaluation?: boolean;
  schedule?: string;
  title?: string;
  students?: Student[];
  project?: Evaluation;
  getProject?: () => void;
  group: string;
  notes?: number;
};

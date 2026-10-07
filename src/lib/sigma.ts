// Tipos das respostas dos endpoints /sigma do backend

export type Overview = {
  projects: number;
  finalists: number;
  students: number;
  spaces: number;
  evaluations: number;
  users: { judge: number; staff: number; admin: number; sigma: number };
  juryVotes: number;
  publicVotes: number;
  popularVoteActive: boolean;
};

export type ProjectRef = {
  id: number;
  title: string;
  schedule: string;
  spaceName?: string | null;
};

export type JudgeProgress = {
  id: number;
  username: string;
  spaceId: number | null;
  spaceName: string | null;
  expected: number;
  done: number;
  pending: ProjectRef[];
};

export type ProjectProgress = {
  id: number;
  title: string;
  subtitle: string;
  schedule: string;
  spaceId: number;
  spaceName: string | null;
  expected: number;
  done: number;
  missingJudges: { id: number; username: string }[];
};

export type EvaluationProgress = {
  totals: {
    expected: number;
    done: number;
    judges: number;
    judgesDone: number;
  };
  judges: JudgeProgress[];
  projects: ProjectProgress[];
};

export type Consistency = {
  scheduleConflicts: {
    spaceId: number;
    spaceName: string | null;
    schedule: string;
    projects: ProjectRef[];
  }[];
  spacesWithoutJudges: { id: number; name: string; projects: number }[];
  projectsWithoutStudents: ProjectRef[];
  judgesWithoutSpace: { id: number; username: string }[];
  spacesWithoutProjects: { id: number; name: string }[];
};

export const percent = (done: number, total: number) =>
  total ? Math.round((done / total) * 100) : 0;

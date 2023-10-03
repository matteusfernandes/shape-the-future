export interface Timeline {
  id: number;
  name: string;
  projects: Project[];
  judges: Judge[];
  students: Student[];
}

export interface Project {
  id: number;
  title: string;
  subtitle: string;
  schedule: string;
  finalist: boolean;
  spaceId: number;
  students?: Student[];
}

export interface Judge {
  id: number;
  username: string;
  role: string;
  spaceId: number;
}

export interface Student {
  id: number;
  name: string;
  projectId: number;
  spaceId: number;
}

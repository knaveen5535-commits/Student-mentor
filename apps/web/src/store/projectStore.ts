import { create } from 'zustand';

export type Project = {
  id: string;
  title: string;
  information: string;
  created_at: string;
};

type ProjectState = {
  projects: Project[];
  setProjects: (projects: Project[]) => void;
};

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  setProjects: (projects) => set({ projects })
}));

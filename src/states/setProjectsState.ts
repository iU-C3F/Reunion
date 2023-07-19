import { Principal } from "@dfinity/principal";
import { atom } from "recoil";
import { Project, Projects } from "types/project";

const dumyProject: Project = {
  canister_id: Principal.anonymous(),
  project_name: "first project",
  created_canister: [],
  logo_url: undefined,
  description: undefined,
  created_at: 0,
  updated_at: 0,
}

const mapedDumyProjects: Projects = new Map(Object.entries({ index: dumyProject }))

export const projectState = atom<Projects>({
  key: "projectState",
  default: mapedDumyProjects,
});

export const projectShowState = atom<Projects>({
  key: "projectShowState",
  default: mapedDumyProjects,
});
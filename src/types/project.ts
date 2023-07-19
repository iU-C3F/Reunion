import { Principal } from "@dfinity/principal";

export type ProjectContextType = Project | null | undefined;
export type ProjectsContextType = [Projects];

export type Projects = Map<string, Project>;

export type Project = {
  canister_id: Principal,
  project_name: string,
  created_canister: [CanisterStatusResponse] | [],
  logo_url?: string,
  description?: string,
  created_at: number,
  updated_at: number,
}

export type CanisterStatusResponse = {
  status: CanisterStatusType,
  settings?: DefiniteCanisterSettings,
  module_hash?: [Uint8Array] | [],
  memory_size: number,
  cycles: number,
  idle_cycles_burned_per_day: number,
}

export enum CanisterStatusType {
  Running,
  Stopping,
  Stopped,
}

export type DefiniteCanisterSettings = {
  controllers: Array<Principal>,
  compute_allocation: number,
  memory_allocation: number,
  freezing_threshold: number,
}

export type inputProjectForm = {
  projectName: string,
  logoUrl: string,
  description: string,
  withExtraCycles: number,
  computeAllocation?: number,
  memoryAllocation?: number,
  freezingThreshold?: number,
}

export type InsertProjectForm = {
  project_name: string,
  logo_url: string,
  description: string,
  with_extra_cycles: bigint,
  compute_allocation: [bigint] | [],
  memory_allocation: [bigint] | [],
  freezing_threshold: [bigint] | [],
}

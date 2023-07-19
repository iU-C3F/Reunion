import { atom } from "recoil";
import { inputProjectForm } from "types/project";

export const inputProjectState = atom<inputProjectForm>({
  key: "inputProjectState",
  default: {
    projectName: "",
    logoUrl: "",
    description: "",
    withExtraCycles: 500000000000000,
    computeAllocation: undefined,
    memoryAllocation: undefined,
    freezingThreshold: undefined,
  }
});
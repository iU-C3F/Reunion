import { atom } from "recoil";
import { inputProfileForm } from "types/user";

export const inputProfileState = atom<inputProfileForm>({
  key: "inputProfileState",
  default: {
    id: "",
    iconUrl: "",
    displayName: "",
    userName: "",
    selfIntroduction: "",
    homePageUrl: "",
    twitterUrl: "",
    youtubeUrl: "",
    tiktokUrl: "",
  }
});
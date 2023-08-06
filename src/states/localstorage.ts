import { atom } from "recoil";
import { User, UserContextType } from "types/user";

const localStorageUserEffect = (key: string) => ({ setSelf, onSet }: any) => {
  if (typeof window === "undefined") return;
  const savedValue = localStorage.getItem(key);
  if (savedValue != null) {
    setSelf(JSON.parse(savedValue));
  }

  onSet((newValue: any, _: any, isReset: boolean) => {
    isReset
      ? localStorage.removeItem(key)
      : localStorage.setItem(key, JSON.stringify(newValue));
  });
};

export const localStorageUserState = atom<User>({
  key: "isLocalUser",
  default: {
    id: undefined,
    iconUrl: undefined,
    displayName: undefined,
    userName: undefined,
    selfIntroduction: undefined,
    homePageUrl: undefined,
    twitterUrl: undefined,
    youtubeUrl: undefined,
    tiktokUrl: undefined,
    createdAt: undefined,
    updatedAt: undefined,
    isAuthenticated: false,
  },
  effects: [localStorageUserEffect("localstorage")]
});
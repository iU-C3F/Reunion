import { atom } from "recoil";
import { User, UserContextType } from "types/user";

const sessionStorageUserEffect = (key: string) => ({ setSelf, onSet }: any) => {
  if (typeof window === "undefined") return;
  const savedValue = sessionStorage.getItem(key);
  if (savedValue != null) {
    setSelf(JSON.parse(savedValue));
  }

  onSet((newValue: any, _: any, isReset: boolean) => {
    isReset
      ? sessionStorage.removeItem(key)
      : sessionStorage.setItem(key, JSON.stringify(newValue));
  });
};

export const sessionStorageUserState = atom<User>({
  key: "isSessionlUser",
  default: {
    identity: undefined,
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
  effects: [sessionStorageUserEffect("sessionstorage")]
});
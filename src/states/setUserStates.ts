import { Dispatch, SetStateAction } from "react";
import { User } from "types/user";

export function setUserStates(
  isClient: boolean,
  isLocalUser: User,
  isSessionUser: User,
  setUser: Dispatch<SetStateAction<User | undefined>>,
  setEnv: Dispatch<SetStateAction<string>>,
) {
  if (isClient) {
    setUser(isLocalUser);
    setEnv("local");
  } else {
    setUser(isSessionUser);
    setEnv("session");
  }
}
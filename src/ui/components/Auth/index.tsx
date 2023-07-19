import { useSetRecoilState } from "recoil";
import { localStorageUserState } from "states/localstorage";
import { sessionStorageUserState } from "states/sessionstorage";

import { User } from "types/user";
import { Identity } from "@dfinity/agent";
import { AuthButton } from "./AuthButton";
import { InternetIdentityProvider } from "./@internet-identity-labs/react-ic-ii-auth";

const NFID_ORIGIN = process.env.NFID_ORIGIN || "https://nfid.one";
const APPLICATION_NAME = process.env.NEXT_PUBLIC_APPLICATION_NAME;
const AUTH_PATH = "/authenticate/?applicationName=" + APPLICATION_NAME + "#authorize";
const windowOpenerFeatures = 'toolbar=0,location=0,menubar=0,width=525,height=705';
const maxTimeToLive = BigInt(Date.now() + 7 * 24 * 60 * 60 * 1e9);

const Auth = () => {
  const setLocalUser = useSetRecoilState(localStorageUserState);
  const setSessionUser = useSetRecoilState(sessionStorageUserState);
  return (
    <InternetIdentityProvider
      authClientOptions={{
        maxTimeToLive: maxTimeToLive,
        identityProvider: NFID_ORIGIN + AUTH_PATH,
        windowOpenerFeatures: windowOpenerFeatures,
        onSuccess: (identity: Identity) => {
          const appUser: User = {
            identity: identity as Identity,
            id: (identity as Identity).getPrincipal().toText() as string,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            isAuthenticated: true,
          };
          setLocalUser(appUser);
          setSessionUser(appUser);
        },
      }}
    >
      <AuthButton />
    </InternetIdentityProvider>
  );
}

export default Auth;
import React, {
  ReactNode, createContext, useContext, useEffect, useState
} from "react";
import { Identity } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { AuthClient } from "@dfinity/auth-client";
import { canisterId as IICanisterID }
  from 'declarations/internet_identity_div';
import { InsertUser, User } from "types/user";
import { makeUsersActor } from "ui/service/actor-locator";
type Result = {
  Ok: [Principal, User] | false;
  Err: string | false;
}

export type AuthContextType = {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  authClient: AuthClient | undefined;
  identity: Identity | null;
  principal: Principal | null;
  user: User | undefined;
  updateUser: (user: User) => void;
  // usersValidationCheck: (queryType: string, principalID: Principal, insertUser: InsertUser) => Promise<Result>;
  // users_insert: (principalID: Principal, insertUser: InsertUser) => Promise<[Principal, User] | []>;
};

const defaultAuthContext: AuthContextType = {
  isAuthenticated: false,
  login: () => { },
  logout: () => { },
  authClient: undefined,
  identity: null,
  principal: null,
  user: undefined,
  updateUser: () => { },
  // usersValidationCheck: async () => Promise.resolve({ Ok: false, Err: "usersValidationCheck is not implemented" }),
  // users_insert: async () => Promise.resolve([]),
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

const defaultOptions = {
  /**
   *  @type {import("@dfinity/auth-client").AuthClientCreateOptions}
   */
  createOptions: {
    idleOptions: {
      // Set to true if you do not want idle functionality
      disableIdle: true,
    },
  },
  /**
   * @type {import("@dfinity/auth-client").AuthClientLoginOptions}
   */
  loginOptions: {
    identityProvider:
      process.env['DFX_NETWORK'] === "ic" ?
        "https://identity.ic0.app/#authorize" :
        `http://localhost:8000/?canisterId=${IICanisterID}`,
  },
};

/**
 *
 * @param options - Options for the AuthClient
 * @param {AuthClientCreateOptions} options.createOptions - Options for the AuthClient.create() method
 * @param {AuthClientLoginOptions} options.loginOptions - Options for the AuthClient.login() method
 * @returns
 */
export const useAuthClient = (options = defaultOptions) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authClient, setAuthClient] = useState<AuthClient>();
  const [identity, setIdentity] = useState<null | Identity>(null);
  const [principal, setPrincipal] = useState<null | Principal>(null);
  const [user, setUser] = useState<User>();
  // const usersActor = makeUsersActor();

  useEffect(() => {
    // Initialize AuthClient
    AuthClient.create(options.createOptions).then(async (client) => {
      updateClient(client);
    });
  }, []);

  const login = () => {
    if (authClient) {
      authClient.login({
        ...options.loginOptions,
        onSuccess: () => {
          updateClient(authClient);
        },
      });
    }
  };

  async function updateClient(client: AuthClient) {
    const isAuthenticated = await client.isAuthenticated();
    setIsAuthenticated(isAuthenticated);

    const identity = client.getIdentity();
    setIdentity(identity);

    const principal = identity.getPrincipal();
    setPrincipal(principal);

    if (isAuthenticated) {
      // ユーザー情報を保持している canisterに接続しユーザー情報の登録有無を確認
      const usersActor = makeUsersActor();
      const result = await usersActor.users_get(principal);

      // ユーザー情報が存在している場合はresultの配列に１つ情報が入っている。lengthがゼロの場合は登録なし
      if (result.length > 0) {
        const existUser: User = {
          id: result[0].id,
          isAuthenticated: result[0].isAuthenticated,
          iconUrl: result[0].icon_url,
          displayName: result[0].display_name,
          userName: result[0].user_name,
          selfIntroduction: result[0].self_introduction[0] || undefined,
          homePageUrl: result[0].homepage_url[0] || undefined,
          twitterUrl: result[0].twitter_url[0] || undefined,
          youtubeUrl: result[0].youtube_url[0] || undefined,
          tiktokUrl: result[0].tiktok_url[0] || undefined,
          updatedAt: result[0].created_at,
          createdAt: result[0].updated_at,
        };
        setUser(existUser);
      } else {
        setUser(undefined);
      }
    } else {
      setUser(undefined);
    }

    setAuthClient(client);
  }

  async function logout() {
    if (authClient) {
      await authClient.logout();
      await updateClient(authClient);
    }
  }

  async function updateUser(user: User) {
    // await usersActor.users_update(user);
    setUser(user);
  }

  // async function usersValidationCheck(queryType: string, principalID: Principal, insertUser: InsertUser) {
  //   if (queryType === 'registe') {
  //     let checkResult = await usersActor.users_registe_validation_check(principalID, insertUser);
  //     if (checkResult.Ok) {
  //       checkResult.Err = false;
  //     } else if (checkResult.Err) {
  //       checkResult.Ok = false;
  //     }
  //     return checkResult;
  //   } else if (queryType === 'edit') {
  //     let checkResult = await usersActor.users_update_validation_check(principalID, insertUser);
  //     if (checkResult.Ok) {
  //       checkResult.Err = false;
  //     } else if (checkResult.Err) {
  //       checkResult.Ok = false;
  //     }
  //     return checkResult;
  //   }
  // }

  // async function users_insert(principalID: Principal, insertUser: InsertUser) {
  //   return await usersActor.users_insert(principalID, insertUser);
  // }

  return {
    isAuthenticated,
    login,
    logout,
    authClient,
    identity,
    principal,
    user,
    updateUser,
    // usersValidationCheck,
    // users_insert,
  }
};

/**
 * @type {React.FC}
 */
export function AuthProvider({ children }: {
  children: ReactNode;
}) {
  const auth = useAuthClient();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext<AuthContextType>(AuthContext);
import { useEffect, useLayoutEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { localStorageUserState } from "states/localstorage";
import { sessionStorageUserState } from "states/sessionstorage";
import { User } from "types/user";
import { setUserStates } from "states/setUserStates";
import Auth from "ui/components/Auth";
import {
  Container,
  Typography,
} from "@mui/material";

const history = () => {
  const [isClient, setIsClient] = useState(false);
  const isLocalUser = useRecoilValue<User>(localStorageUserState);
  const isSessionUser = useRecoilValue<User>(sessionStorageUserState);
  const [isUser, setUser] = useState<User>();
  const [isEnv, setEnv] = useState("");
  () => (setUserStates(isClient, isLocalUser, isSessionUser, setUser, setEnv));

  useLayoutEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    setUserStates(isClient, isLocalUser, isSessionUser, setUser, setEnv);
  }, [isLocalUser, isSessionUser]);

  return (
    <>
      {isLocalUser && isLocalUser.isAuthenticated || isSessionUser && isSessionUser.isAuthenticated ? (
        <Container maxWidth="sm" >
          未実装
        </Container>
      ) : (
        <Container maxWidth="sm">
          <Typography variant='h4' >
            ウォレットの利用には Sign In が必要です
          </Typography>
          <Auth />
        </Container>
      )}

    </>
  );
}

export default history;
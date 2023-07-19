import { useEffect, useLayoutEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { localStorageUserState } from "states/localstorage";
import { sessionStorageUserState } from "states/sessionstorage";
import { User } from "types/user";
import { setUserStates } from "states/setUserStates";
import Auth from "ui/components/Auth";
import {
  Container,
  Button,
  Grid,
  Paper,
  Box,
  Typography
} from "@mui/material";

import Router from 'next/router'
const transitionHandler = (path: string) => {
  Router.push(path)
}

const transferManagement2 = () => {
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
          <Button onClick={() => transitionHandler("/conditionalTransfer")} color="secondary" variant="contained" sx={{ marginTop: "20px" }} fullWidth>送信条件を設定（新規設定）※実装中</Button>
          <Button color="secondary" variant="contained" sx={{ marginTop: "20px" }} fullWidth>設定済み内容の変更（編集）※未実装</Button>
          <Button color="secondary" variant="contained" sx={{ marginTop: "20px" }} fullWidth>送信対象者がいるかを確認 ※未実装</Button>
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

export default transferManagement2;
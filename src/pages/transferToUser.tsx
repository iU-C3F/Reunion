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
  Grid,
  TextField,
  Box,
  FormControl,
  OutlinedInput,
  InputAdornment
} from "@mui/material";
import dynamic from "next/dynamic";
const Transfer = dynamic(async () => await import('../ui/components/Transfer'), { ssr: false });

const transferToUser = () => {
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
        <Container maxWidth="sm">
          <Grid container spacing={2}>
            <Grid item xs={12}>※実装優先度は低い。</Grid>
            <Grid item xs={12}>※TO は仮実装。相手の AccountID または PrincipalID</Grid>
            <Grid item xs={12}>※実際に送信できる。</Grid>
            <Grid item xs={1} alignItems="center">TO</Grid>
            <Grid item xs={11} alignItems="center">
              <FormControl sx={{ m: 1, width: '15ch' }} variant="outlined">
                <OutlinedInput
                  id="to"
                />
              </FormControl>
            </Grid>
            <Grid item xs={1} alignItems="center">
              <Box component="img" src="icp.png" sx={{ height: 15 }} />
            </Grid>
            <Grid item xs={11} alignItems="center">
              <FormControl sx={{ m: 1, width: '15ch' }} variant="outlined">
                <OutlinedInput
                  id="amount"
                  endAdornment={<InputAdornment position="end">ICP</InputAdornment>}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sx={{ paddingTop: '10px' }}>
              <Transfer />
            </Grid>
            <Grid item xs={12} sx={{ paddingTop: '10px' }}>
              <Typography id="message" />
            </Grid>
          </Grid>
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

export default transferToUser;
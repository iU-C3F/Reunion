import { useEffect, useLayoutEffect, useState } from 'react';

import { useRecoilValue } from 'recoil';
import { localStorageUserState } from 'states/localstorage';
import { sessionStorageUserState } from 'states/sessionstorage';

import {
  Box,
  Container,
  Typography,
} from '@mui/material';
import ProTip from '../ui/components/ProTip';
import Copyright from '../ui/components/Copyright';

import { User } from 'types/user';
import { setUserStates } from 'states/setUserStates';

export default function About() {
  const [isClient, setIsClient] = useState(false);
  const isLocalUser = useRecoilValue<User>(localStorageUserState);
  const isSessionUser = useRecoilValue<User>(sessionStorageUserState);
  const [isUser, setUser] = useState<User>();
  const [isEnv, setEnv] = useState("");

  useLayoutEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    setUserStates(isClient, isLocalUser, isSessionUser, setUser, setEnv);
  }, [isClient, isLocalUser, isSessionUser, setUser, setEnv]);

  return (
    <>
      <Container maxWidth="lg">
        <Box
          sx={{
            my: 4,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            fontFamily: 'hiragino'
          }}
        >
          <Typography variant="h2" gutterBottom>
            Group
          </Typography>
          <Typography variant='body1' style={{ whiteSpace: 'pre-wrap', margin: 10 }}>
            （inner About） isLocalUser.principalID: {isLocalUser && isLocalUser.id ? String(isLocalUser.id) : "null"}\n
            （inner About） isLocalUser.isAuthenticated: {isLocalUser ? String(isLocalUser.isAuthenticated) : "false"}\n
            （inner About） isSessionUser.principalID: {isSessionUser && isSessionUser.id ? String(isSessionUser.id) : "null"}\n
            （inner About） isSessionUser.isAuthenticated: {isSessionUser ? String(isSessionUser.isAuthenticated) : "false"}\n
          </Typography>
          <ProTip />
          <Copyright />
        </Box>
      </Container>
    </>
  );
}

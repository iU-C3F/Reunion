import { useEffect, useLayoutEffect, useState } from 'react';
import dynamic from 'next/dynamic'

import {
  Box,
  Container,
  Typography,
  Button,
} from '@mui/material';

import { useRecoilValue } from 'recoil';
import { localStorageUserState } from 'states/localstorage';
import { sessionStorageUserState } from 'states/sessionstorage';

import { User } from 'types/user';
import { setUserStates } from 'states/setUserStates';

const Projects = dynamic(async () => await import('ui/components/Projects'), { ssr: false })

export default function Hello() {

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
    <Container maxWidth="lg">
      {/* <Stack spacing={1}>
        <ListItem>isLocalUser.principalID: {isLocalUser && isLocalUser.id ? String(isLocalUser.id) : null}</ListItem>
        <ListItem>isLocalUser.isAuthenticated: {isLocalUser ? String(isLocalUser.isAuthenticated) : false}</ListItem>
        <ListItem>isSessionUser.principalID: {isSessionUser && isSessionUser.id ? String(isSessionUser.id) : null}</ListItem>
        <ListItem>isSessionUser.isAuthenticated: {isSessionUser ? String(isSessionUser.isAuthenticated) : false}</ListItem>
      </Stack> */}
      <Box
        sx={{
          my: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          margin: 10
        }}
      >
        <Typography variant='h6'>
          <strong>プロジェクトを作成しましょう！</strong>
        </Typography>
        <Typography variant="h6">
          local環境ではCreate Canister ボタンを押下する前に以下のdfxコマンドを実行してmanagement_canisterにCycleを補充してください
        </Typography>
        <Typography variant="body1">
          "dfx ledger fabricate-cycles --canister management_canister --cycles 500000000000000"
        </Typography>
        <Button href="/project/create" variant="contained" >
          プロジェクトを作成
        </Button>
      </Box>
      <Projects />
    </Container>
  )
}

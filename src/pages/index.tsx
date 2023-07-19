import { useEffect, useLayoutEffect, useState } from 'react';

import { User } from 'types/user';
import { useRecoilValue } from 'recoil';
import { localStorageUserState } from 'states/localstorage';
import { sessionStorageUserState } from 'states/sessionstorage';

import { setUserStates } from 'states/setUserStates';
import { Box, Container, Grid, Stack, Theme, Typography } from '@mui/material';

import Auth from 'ui/components/Auth';
import ProTip from 'ui/components/ProTip';
import Copyright from 'ui/components/Copyright';
import { defaultTheme } from '../ui/theme';
import { height, maxHeight } from '@mui/system';

const defaultIcon = "/Reunion10.png"

export default function Home() {
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
      <Container maxWidth="lg" sx={{ height: '500px' }}>
        <Box
          sx={{
            my: 4,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            maxWidth: '100%',
            height: '100%'
          }}
        >
          <Grid container direction="column" alignItems="center">
            <Stack direction="row" alignItems='center' justifyContent='center' spacing='10px' height='50%'>
              <img src={defaultIcon} alt="reunion" width="70" height="70" style={{ display: 'flax' }} />
              <Typography fontFamily='hiragino' variant="h3" color={(defaultTheme as Theme).palette.primary.main} style={{ display: 'flax' }}>
                <strong>Reunion</strong>
              </Typography>
            </Stack>
          </Grid>
          <Auth />
        </Box>
      </Container>
    </>
  );
}

// import { useEffect, useLayoutEffect, useState } from 'react';
// import { useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil';
// import { localStorageUserState } from 'states/localstorage';
// import { sessionStorageUserState } from 'states/sessionstorage';

// import { User } from 'types/user';
// import { Identity } from '@dfinity/agent';
// import { useInternetIdentity } from "./@internet-identity-labs/react-ic-ii-auth";

import Button from '@mui/material/Button';
import { Grid } from '@mui/material';
import { useAuth } from 'hooks/auth';

export const AuthButton = () => {
  const { login, logout, isAuthenticated, identity } = useAuth();
  // const { identity, signout, authenticate, isAuthenticated } = useInternetIdentity();
  // const [isClient, setIsClient] = useState(false);
  // const isLocalUser = useRecoilValue<User>(localStorageUserState);
  // const setLocalUser = useSetRecoilState<User>(localStorageUserState);
  // const rsetLocalUser = useResetRecoilState(localStorageUserState);
  // const isSessionUser = useRecoilValue<User>(sessionStorageUserState);
  // const setSessionUser = useSetRecoilState<User>(sessionStorageUserState);
  // const rsetSessionUser = useResetRecoilState(sessionStorageUserState);

  // useLayoutEffect(() => {
  //   setIsClient(true);
  // }, []);

  // useEffect(() => {
  //   if (isClient && isAuthenticated) {
  //     if (isLocalUser && isLocalUser.identity === identity) {
  //       setLocalUser(isLocalUser);
  //       setSessionUser(isLocalUser);
  //     } else if (isSessionUser && isSessionUser.identity === identity) {
  //       setLocalUser(isLocalUser);
  //       setSessionUser(isLocalUser);
  //     }
  //   }
  // }, [isAuthenticated]);

  // function singIn() {
  //   const appUser: User = {
  //     identity: identity,
  //     id: identity.getPrincipal().toText(),
  //     createdAt: Date.now(),
  //     updatedAt: Date.now(),
  //     isAuthenticated: true,
  //   };
  //   return appUser;
  // }

  // function singOut() {
  //   logout();
  //   rsetLocalUser();
  //   rsetSessionUser();
  // };

  // useEffect(() => {
  //   if (isClient && isAuthenticated) {
  //     if (isLocalUser && isLocalUser.identity === identity) {
  //       setLocalUser(isLocalUser);
  //       setSessionUser(isLocalUser);
  //     } else if (isSessionUser && isSessionUser.identity === identity) {
  //       setLocalUser(isLocalUser);
  //       setSessionUser(isLocalUser);
  //     }
  //   }
  // }, [isAuthenticated]);

  return (
    <>
      <Grid container alignItems='center' justifyContent='center' className='auth-section'>
        {!isAuthenticated ? (
          <Button style={{ maxWidth: '280px', minWidth: '250px' }} variant="contained" color="primary" onClick={login} className="auth-button-singin">
            <strong>ログイン</strong>
          </Button>
        ) : (
          <Button style={{ maxWidth: '280px', minWidth: '250px' }} variant="contained" color="primary" onClick={logout} className="auth-button-signout">
            <strong>ログアウト</strong>
          </Button>
        )}
      </Grid>
    </>
  )
}

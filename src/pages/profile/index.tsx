import { useEffect, useLayoutEffect, useState } from 'react';
import { useRecoilValue } from "recoil";

import { User } from "types/user";
import { setUserStates } from "states/setUserStates";
import { localStorageUserState } from "states/localstorage";
import { sessionStorageUserState } from "states/sessionstorage";
import Auth from 'ui/components/Auth';

import { Box, Typography } from '@mui/material';

import dynamic from 'next/dynamic';
const Profile = dynamic(async () => await import('../../ui/components/Profile'), { ssr: false })


function profile() {
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
  }, []);

  // ログイン状態、会員登録状態をチェックしてリダイレクト処理
  useEffect(() => {
    setUserStates(isClient, isLocalUser, isSessionUser, setUser, setEnv);
  }, [isClient, isLocalUser, isSessionUser, setUser, setEnv]);

  // 未登録の場合は新規登録ページにリダイレクト
  // ******* ユーザーデータを保存する backend を作成次第、backend をのuserNameを検索する方式に変更する  *******
  if (isClient && !(isLocalUser && isLocalUser.isAuthenticated || isSessionUser && isSessionUser.isAuthenticated)) return (
    <>
      <Box
        sx={{
          my: 4,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          margin: 0
        }}
      >
        <Box sx={{ height: '80px' }} />
        <Typography variant="h6" color="gray" style={{ textAlign: 'center' }}>
          <strong>プロフィールの利用にはログインが必要です</strong>
        </Typography>
      </Box>
      <Auth />
    </>
  );

  return (
    <>
      <Profile />
    </>
  );
}

export default profile;
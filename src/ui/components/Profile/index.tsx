import { useRouter } from 'next/router';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import { User } from "types/user";
import { setUserStates } from "states/setUserStates";
import { localStorageUserState } from "states/localstorage";
import { sessionStorageUserState } from "states/sessionstorage";
import { inputProfileState } from 'states/inputProfileState';

import { Avatar, Box, Button, Container, IconButton, Typography } from '@mui/material';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import { TikTokIcon } from "ui/components/TiktokIcon";

import { Principal } from '@dfinity/principal';
import { makeUsersActor } from '../../service/actor-locator';

import RegisterFrom from './RegisterForm';
import Auth from '../Auth';

function Profile() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const isLocalUser = useRecoilValue<User>(localStorageUserState);
  const isSessionUser = useRecoilValue<User>(sessionStorageUserState);
  const setLocalUser = useSetRecoilState(localStorageUserState);
  const setSessionUser = useSetRecoilState(sessionStorageUserState);
  const [isUser, setUser] = useState<User>();
  const [isEnv, setEnv] = useState("");

  const [input, setInput] = useRecoilState(inputProfileState);// EditFormに現在のプロフィール情報を引き継ぐためのState
  function goToEdit() {
    setInput((currentInput) => ({
      ...currentInput,
      ...{
        iconUrl: (isUser as User).iconUrl as string,
        displayName: (isUser as User).displayName as string,
        userName: (isUser as User).userName as string,
        selfIntroduction: (isUser as User).selfIntroduction || undefined,
        homePageUrl: (isUser as User).homePageUrl || undefined,
        twitterUrl: (isUser as User).twitterUrl || undefined,
        youtubeUrl: (isUser as User).youtubeUrl || undefined,
        tiktokUrl: (isUser as User).tiktokUrl || undefined,
      }
    }))
    router.push('/profile/edit');
  }

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

  // ユーザー情報を保持している canisterに接続しユーザー情報の登録有無を確認
  useEffect(() => {
    (async () => {
      if (isUser && isUser.id && !isUser.userName) {
        const usersActor = makeUsersActor();
        // principal をkeyとしてユーザー情報を取得
        const principalID = Principal.fromText(isUser.id as string);
        const result = await usersActor.users_get(principalID);
        // ユーザー情報が存在している場合はresultの配列に１つ情報が入っている。lengthがゼロの場合は登録なし
        if (result.length > 0) {
          console.log('exist user! result[0]: ', result[0]);
          const appUser: User = {
            identity: isUser.identity,
            id: isUser.id,
            isAuthenticated: isUser.isAuthenticated,
            iconUrl: result[0].icon_url,
            displayName: result[0].display_name,
            userName: result[0].user_name,
            selfIntroduction: result[0].self_introduction[0] || undefined,
            homePageUrl: result[0].homepage_url[0] || undefined,
            twitterUrl: result[0].twitter_url[0] || undefined,
            youtubeUrl: result[0].youtube_url[0] || undefined,
            tiktokUrl: result[0].tiktok_url[0] || undefined,
            updatedAt: Number(result[0].created_at),
            createdAt: Number(result[0].updated_at),
          }
          console.log('appUser: ', appUser);
          setLocalUser(appUser);
          setSessionUser(appUser);
        }
      }
    })()
  }, [isUser]);

  return (
    <>
      {isUser?.userName ? (
        <Container maxWidth="sm" sx={{ direction: "column", flex: '1' }}>
          <Box sx={{ height: '20px' }} />{/* Avatar要素の表示位置調整用 */}
          <Box sx={{ display: 'grid', justifyContent: 'right' }} >
            <Button onClick={goToEdit} variant='contained' size='small' style={{ borderRadius: '20px', width: '60px', alignSelf: 'right' }}>編集</Button>
          </Box>
          <Box
            sx={{
              my: 4,
              display: 'grid',
              justifyContent: 'center',
              alignItems: 'center',
              margin: 1
            }}
          >
            <Avatar src={isUser.iconUrl} sx={{ width: 120, height: 120, zIndex: 1, }} />
            <Typography variant="h6" style={{ textAlign: 'center' }}>
              <strong>{isUser.displayName}</strong>
            </Typography>
            <Typography variant='body1' color='gray' style={{ textAlign: 'center' }}>
              @{isUser.userName}
            </Typography>
          </Box>
          <Typography variant='body2' style={{ whiteSpace: 'pre-wrap', margin: 10 }}>
            {isUser.selfIntroduction ? (isUser.selfIntroduction) : ("")}
          </Typography>
          {/* HomePage、Tiwtter、Youtube、Tiktok リンク先 */}
          <Box
            maxWidth="sm"
            sx={{
              flexDirection: 'row',
              margin: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {isUser.homePageUrl ? (
              <IconButton href={isUser.homePageUrl} target="_blank" rel="noopener noreferrer" aria-label="Home Page">
                <InsertLinkIcon style={{ rotate: '135deg' }} />
              </IconButton>
            ) : ("")}
            {isUser.twitterUrl ? (
              <IconButton href={isUser.twitterUrl} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <TwitterIcon />
              </IconButton>
            ) : ("")}
            {isUser.youtubeUrl ? (
              <IconButton href={isUser.youtubeUrl} target="_blank" rel="noopener noreferrer" aria-label="Youtube" >
                <YouTubeIcon />
              </IconButton>
            ) : ("")}
            {isUser.tiktokUrl ? (
              <IconButton href={isUser.tiktokUrl} target="_blank" rel="noopener noreferrer" aria-label="Tiktok">
                <TikTokIcon color='gray' width="25px" />
              </IconButton>
            ) : ("")}
          </Box>
          <Box sx={{ height: '80px' }} />{/* 画面下部のComponentがfooterに隠れてしまうので、底上げ用のBoxを設置 */}
        </Container>
      ) : (
        <RegisterFrom />
      )}
      <Auth />
      <Box sx={{ height: '80px' }} />{/* 画面下部のComponentがfooterに隠れてしまうので、底上げ用のBoxを設置 */}
    </>
  );
}

export default Profile;
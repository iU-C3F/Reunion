import { useRouter } from 'next/router';
import { useRecoilState } from "recoil";

import { inputProfileState } from 'states/inputProfileState';

import { Avatar, Box, Button, Container, IconButton, Typography } from '@mui/material';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import { TikTokIcon } from "ui/components/TiktokIcon";

import RegisterFrom from './RegisterForm';
import Auth from '../Auth';
import { useAuth } from 'hooks/auth';
import { toast } from 'react-hot-toast';

function Profile() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  const [input, setInput] = useRecoilState(inputProfileState);// EditFormに現在のプロフィール情報を引き継ぐためのState
  function goToEdit() {
    if (user) {
      setInput((currentInput) => ({
        ...currentInput,
        ...{
          iconUrl: user.iconUrl as string,
          displayName: user.displayName as string,
          userName: user.userName as string,
          selfIntroduction: user.selfIntroduction || undefined,
          homePageUrl: user.homePageUrl || undefined,
          twitterUrl: user.twitterUrl || undefined,
          youtubeUrl: user.youtubeUrl || undefined,
          tiktokUrl: user.tiktokUrl || undefined,
        }
      }))
      router.push('/profile/edit');
    } else {
      let notifyError = () => toast.error('プロファイル情報の取得に失敗しました。画面を更新して再度お試しください。', { position: "top-right", duration: 3000 });
      notifyError();
    }
  }

  return (
    <>
      {isAuthenticated && user && user.userName ? (
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
            <Avatar src={user.iconUrl} sx={{ width: 120, height: 120, zIndex: 1, }} />
            <Typography variant="h6" style={{ textAlign: 'center' }}>
              <strong>{user.displayName}</strong>
            </Typography>
            <Typography variant='body1' color='gray' style={{ textAlign: 'center' }}>
              @{user.userName}
            </Typography>
          </Box>
          <Typography variant='body2' style={{ whiteSpace: 'pre-wrap', margin: 10 }}>
            {user.selfIntroduction ? (user.selfIntroduction) : ("")}
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
            {user.homePageUrl ? (
              <IconButton href={user.homePageUrl} target="_blank" rel="noopener noreferrer" aria-label="Home Page">
                <InsertLinkIcon style={{ rotate: '135deg' }} />
              </IconButton>
            ) : ("")}
            {user.twitterUrl ? (
              <IconButton href={user.twitterUrl} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <TwitterIcon />
              </IconButton>
            ) : ("")}
            {user.youtubeUrl ? (
              <IconButton href={user.youtubeUrl} target="_blank" rel="noopener noreferrer" aria-label="Youtube" >
                <YouTubeIcon />
              </IconButton>
            ) : ("")}
            {user.tiktokUrl ? (
              <IconButton href={user.tiktokUrl} target="_blank" rel="noopener noreferrer" aria-label="Tiktok">
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
import { Box, Container, Typography } from '@mui/material';

import Auth from 'ui/components/Auth';
import { useAuth } from 'hooks/auth';

import dynamic from 'next/dynamic';
const Profile = dynamic(async () => await import('ui/components/Profile'), { ssr: false })

function profile() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {!isAuthenticated ? (
        <Container maxWidth="sm" >
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
        </Container >
      ) : (
        <Profile />
      )}
    </>
  );
}

export default profile;
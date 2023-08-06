import {
  Box,
  Container,
  Typography,
} from '@mui/material';
import ProTip from '../ui/components/ProTip';
import Copyright from '../ui/components/Copyright';

import { useAuth } from 'hooks/auth';

export default function About() {
  const { isAuthenticated, user } = useAuth();

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
          <ProTip />
          <Copyright />
        </Box>
      </Container>
    </>
  );
}

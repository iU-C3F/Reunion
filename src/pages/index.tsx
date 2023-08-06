import { Box, Container, Grid, Stack, Theme, Typography } from '@mui/material';

import Auth from 'ui/components/Auth';
import { defaultTheme } from '../ui/theme';
import { useAuth } from 'hooks/auth';

const defaultIcon = "/Reunion10.png"

export default function Home() {

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

import Auth from "ui/components/Auth";
import {
  Container,
  Typography,
  Grid,
  Box,
  FormControl,
  OutlinedInput,
  InputAdornment
} from "@mui/material";

import { useAuth } from "hooks/auth";

import dynamic from "next/dynamic";
const Transfer = dynamic(async () => await import('../ui/components/Transfer'), { ssr: false });

const transferToUser = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {isAuthenticated ? (
        <Container maxWidth="sm">
          <Grid container spacing={2}>
            <Grid item xs={12}>※実装優先度は低い。</Grid>
            <Grid item xs={12}>※TO は仮実装。相手の AccountID または PrincipalID</Grid>
            <Grid item xs={12}>※実際に送信できる。</Grid>
            <Grid item xs={1} alignItems="center">TO</Grid>
            <Grid item xs={11} alignItems="center">
              <FormControl sx={{ m: 1, width: '15ch' }} variant="outlined">
                <OutlinedInput
                  id="to"
                />
              </FormControl>
            </Grid>
            <Grid item xs={1} alignItems="center">
              <Box component="img" src="icp.png" sx={{ height: 15 }} />
            </Grid>
            <Grid item xs={11} alignItems="center">
              <FormControl sx={{ m: 1, width: '15ch' }} variant="outlined">
                <OutlinedInput
                  id="amount"
                  endAdornment={<InputAdornment position="end">ICP</InputAdornment>}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sx={{ paddingTop: '10px' }}>
              <Transfer />
            </Grid>
            <Grid item xs={12} sx={{ paddingTop: '10px' }}>
              <Typography id="message" />
            </Grid>
          </Grid>
        </Container>
      ) : (
        <Container maxWidth="sm">
          <Typography variant='h4' >
            ウォレットの利用には Sign In が必要です
          </Typography>
          <Auth />
        </Container>
      )}

    </>
  );
}

export default transferToUser;
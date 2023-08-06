import Auth from "ui/components/Auth";
import {
  Container,
  Button,
  Typography
} from "@mui/material";

import Router from 'next/router'
import { useAuth } from "hooks/auth";

const transitionHandler = (path: string) => {
  Router.push(path)
}

const transferManagement = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {isAuthenticated ? (

        <Container maxWidth="sm" >
          <Button onClick={() => transitionHandler("/transferToUser")} variant="contained" sx={{ marginTop: "20px" }} fullWidth>特定ユーザへ送信</Button>
          <Button onClick={() => transitionHandler("/transferManagement2")} variant="contained" sx={{ marginTop: "20px" }} fullWidth>条件を指定して送信（管理）</Button>
        </Container>
      ) : (
        <Container maxWidth="sm">
          <Typography variant='h4' >
            ウォレットの利用には Sign In が必要です
          </Typography>
          <Auth />
        </Container>
      )
      }
    </>
  );
}

export default transferManagement;
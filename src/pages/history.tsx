import Auth from "ui/components/Auth";
import {
  Container,
  Typography,
} from "@mui/material";
import { useAuth } from "hooks/auth";

const history = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {isAuthenticated ? (
        <Container maxWidth="sm" >
          未実装
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

export default history;
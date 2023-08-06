import Button from '@mui/material/Button';
import { Grid } from '@mui/material';
import { useAuth } from 'hooks/auth';

const Auth = () => {
  const { login, logout, isAuthenticated } = useAuth();

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

export default Auth;
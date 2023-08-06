import {
  Box,
  Container,
  Typography,
  Button,
} from '@mui/material';

import { useAuth } from 'hooks/auth';

import dynamic from 'next/dynamic'
const Projects = dynamic(async () => await import('ui/components/Projects'), { ssr: false })

export default function Hello() {
  const { isAuthenticated } = useAuth();

  return (
    <Container maxWidth="lg">
      {isAuthenticated ? (
        <Box
          sx={{
            my: 4,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            margin: 10
          }}
        >
          <Typography variant='h6'>
            <strong>プロジェクトを作成しましょう！</strong>
          </Typography>
          <Typography variant="h6">
            local環境ではCreate Canister ボタンを押下する前に以下のdfxコマンドを実行してmanagement_canisterにCycleを補充してください
          </Typography>
          <Typography variant="body1">
            "dfx ledger fabricate-cycles --canister management_canister --cycles 500000000000000"
          </Typography>
          <Button href="/project/create" variant="contained" >
            プロジェクトを作成
          </Button>
        </Box>
      ) : ("")}
      <Projects />
    </Container>
  )
}

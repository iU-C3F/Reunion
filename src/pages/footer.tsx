
// for mui
import Paper from '@mui/material/Paper';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/HomeOutlined';
import GroupIcon from '@mui/icons-material/MapsUgcOutlined';
import PortalIcon from '@mui/icons-material/DoorBackOutlined';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import AppsIcon from '@mui/icons-material/GridViewOutlined';
import WalletIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import Link from 'ui/Link';

function footer() {
  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
      <BottomNavigation showLabels >
        <BottomNavigationAction label="ホーム" href="/" icon={<HomeIcon />} component={Link} noLinkStyle />
        <BottomNavigationAction label="グループ" href="/group" icon={<GroupIcon />} component={Link} noLinkStyle />
        <BottomNavigationAction label="プロジェクト" href="/project" icon={<AccountTreeIcon />} component={Link} noLinkStyle />
        <BottomNavigationAction label="アプリ" href="/apps" icon={<AppsIcon />} component={Link} noLinkStyle />
        <BottomNavigationAction label="wallet" href="/wallet" icon={<WalletIcon />} id="wallet" component={Link} noLinkStyle />
      </BottomNavigation>
    </Paper>
  );
}

export default footer;
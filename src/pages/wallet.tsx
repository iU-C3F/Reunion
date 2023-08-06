import React, { useEffect, useState } from "react";
import Auth from "ui/components/Auth";

import {
  Grid,
  Container,
  Typography,
  Paper,
  Box,
  ToggleButtonGroup,
  ToggleButton,
  Tabs,
  Tab,
} from "@mui/material";
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import FilterNoneIcon from '@mui/icons-material/FilterNone';

import { principalToAddress } from "ictool"
// ictool の principalToAddress を呼び出すにあたり、型を合わせる必要があるため
// import { Principal } from "@dfinity/principal";
import { Principal } from "ictool/node_modules/@dfinity/principal";

import dynamic from "next/dynamic";

import Router from 'next/router'
import { useAuth } from "hooks/auth";
const transitionHandler = (path: string) => {
  Router.push(path)
}

const Transfer = dynamic(async () => await import('../ui/components/Transfer'), { ssr: false });

const wallet = () => {
  const { isAuthenticated, user, principal, identity } = useAuth();

  let principalText = "";
  let accountID = "";
  if (principal) {
    principalText = principal.toText();
    accountID = principalToAddress(Principal.fromText(principalText));
  }
  const [balance, setBalance] = useState<number>();

  function getBalance() {
    fetch("https://rosetta-api.internetcomputer.org/account/balance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        network_identifier: {
          blockchain: "Internet Computer",
          network: "00000000000000020101",
        },
        account_identifier: {
          address: accountID,
        },
      }),
    }).then((response) => {
      return response.json();
    }).then((json) => {
      // TODO なぜ配列？理解不十分。
      // TODO 浮動小数点の計算で誤差はでないか？
      // TODO 例外処理？
      const balance = parseFloat(json.balances[0].value) / 100000000
      setBalance(balance);
    });
  };

  useEffect(() => {
    const timer = setInterval(() => {
      if (isAuthenticated) {
        getBalance();
      }
    }, 20000);

    return () => clearInterval(timer);
  }, []);

  const [alignment, setAlignment] = useState('jpy');

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string,
  ) => {
    setAlignment(newAlignment);
  };

  const OrangeButton = styled(Button)({
    backgroundColor: '#FD9927',
    borderColor: '#FD9927',
    fontFamily: [].join(','),
    '&:active': {
      backgroundColor: '#FD9927',
    },
    '&:focus': {
      backgroundColor: '#FD9927',
    },
  });

  interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
  }

  function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  // For tabs
  const [value, setValue] = React.useState(0);
  const handleChangeForTabs = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  // TODO Warning: Expected server HTML to contain a matching <p> in <div>.
  return (
    <>
      {isAuthenticated ? (
        <>
          <Container maxWidth="sm">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Paper elevation={3} sx={{ marginTop: '20px', padding: '20px' }} >
                  <Grid container spacing={0}>
                    <Grid item xs={12}>
                      <ToggleButtonGroup
                        color="primary"
                        value={alignment}
                        exclusive
                        onChange={handleChange}
                        aria-label="Platform"
                      >
                        <ToggleButton value="jpy">¥</ToggleButton>
                        <ToggleButton value="usd">$</ToggleButton>
                      </ToggleButtonGroup>
                    </Grid>
                    <Grid item xs={12} textAlign={'center'}><Typography variant="h3" gutterBottom>¥9999.99</Typography></Grid>
                    <Grid item xs={12} textAlign={'center'}><Typography variant="overline" gutterBottom>合計 / Total</Typography></Grid>
                    <Grid item xs={12} textAlign={'right'}><FilterNoneIcon /></Grid>
                  </Grid>
                </Paper>
              </Grid>
              <Grid item xs={12}>※円換算未調査未実装</Grid>
              <Grid item xs={12}>
                <Button onClick={() => transitionHandler('/transferManagement')} variant="contained" sx={{ marginTop: '20px' }} fullWidth>送信管理</Button>
              </Grid>
              <Grid item xs={12}>
                <OrangeButton onClick={() => transitionHandler('/history')} variant="contained" sx={{ marginTop: '8px' }} fullWidth>履歴</OrangeButton>
              </Grid>
            </Grid>
            <Box sx={{ width: '100%' }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChangeForTabs} aria-label="basic tabs example" variant="fullWidth">
                  <Tab label="通貨" {...a11yProps(0)} />
                  <Tab label="NFT" {...a11yProps(1)} />
                </Tabs>
              </Box>
              <TabPanel value={value} index={0}>
                <Grid container spacing={2}>
                  <Grid item xs={4} alignItems='center'><Box component="img" src="icp.png" sx={{ height: 15 }} /> ICP</Grid>
                  <Grid item xs={4} justifyContent='flex-end'>{balance}</Grid>
                  <Grid item xs={4} justifyContent='flex-end'>¥9999.99</Grid>
                </Grid>
              </TabPanel>
              <TabPanel value={value} index={1}>
                未実装
              </TabPanel>
            </Box>
          </Container >
        </>
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

export default wallet;
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { GetStaticProps } from 'next';

import { Container } from '@mui/system';
import { Alert, Box, Button, Grid, Typography } from '@mui/material';

import type { Dapp } from 'types/dapp';
import { HttpError, HttpErrorObject } from "types/httperror";

import DappCardItem from 'ui/components/dappCardItem';
import { useIntersection } from 'hooks/intersection';

export type Props = {
  dapps?: any;
  err?: HttpErrorObject;
}

export default function IcProjects({ dapps, err }: Props) {
  const [isDapps, setDapps] = useState<Map<string, Dapp> | null>();

  useLayoutEffect(() => {
    if (dapps !== undefined) {
      setShowMore(true);
      const mapTmpDapps: Map<string, Dapp> = new Map(Object.entries(dapps));
      const arrTmpDapps = Array.from(mapTmpDapps).slice(0, 20);
      const mapDapps: Map<string, Dapp> = new Map(arrTmpDapps);
      setDapps(mapDapps);
    }
  }, [dapps])

  // >>> 最下段までスクロールしたらIC Projects のCardを追加で読み込むための処理
  const ref = useRef<HTMLDivElement>(null) as React.MutableRefObject<HTMLDivElement>;
  const intersection = useIntersection(ref);
  const [intersected, setIntersected] = useState<boolean>(true);
  const [showMore, setShowMore] = useState<boolean>(true);

  useEffect(() => {
    setIntersected(intersection);
  }, [intersection]);

  useEffect(() => {
    if (intersected && showMore) {
      onButtonClick();
    }
  }, [intersected, showMore]);

  const onButtonClick = async () => {
    if (!isDapps) return;
    const mapTmpDapps: Map<string, Dapp> = new Map(Object.entries(dapps));
    const isDappsLength = Array.from(isDapps as Map<string, Dapp>).length
    let sliceCount = isDappsLength + 10;
    setShowMore(true);
    if (Array.from(mapTmpDapps).length <= sliceCount) {
      sliceCount = Array.from(mapTmpDapps).length;
      setShowMore(false);
    };
    const arrTmpDapps = Array.from(mapTmpDapps).slice(0, sliceCount);
    const mapDapps: Map<string, Dapp> = new Map(arrTmpDapps);
    setDapps(mapDapps);

  }
  // <<< 最下段までスクロールしたらIC Projects のCardを追加で読み込むための処理

  if (err) return <Alert severity="error">{err.message}</Alert>

  return (
    <>
      <Container sx={{ direction: "column", flex: '1' }}>
        <Box
          sx={{
            my: 4,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography variant='h3'>
            <strong>IC Projects</strong>
          </Typography>
        </Box>
        <Grid
          className='dapps-list'
          columnSpacing={1}
          rowSpacing={1}
          maxHeight='80%'
        >
          {isDapps ? (Array.from(isDapps.values()).map((dapp, index) => (
            <DappCardItem index={index} dapp={dapp} />
          ))
          ) : (
            <Typography variant='h4'>IC Progect Not Found...</Typography>
          )}

          <div ref={ref}>
            {showMore && (
              <Button variant='text' onClick={onButtonClick}>Load More IC Projects...</Button>
            )}
          </div>
          <Box sx={{ height: '80px' }} />{/* 画面下部のカードがfooterに隠れてしまうので、底上げ用のBoxを設置 */}

        </Grid>
      </Container>
    </>
  )
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const url = "https://raw.githubusercontent.com/junkei-okinawa/scraping-icp-projects/main/data/dapps.json";

  try {
    const res = await fetch(url);
    if (!res.ok) throw new HttpError(res);
    const dapps = await res.json();
    // console.log("inner staticProps dapps: ", dapps);
    return { props: { dapps } };
  } catch (err) {
    if (err instanceof HttpError) {
      return { props: { err: err.serialize() } };
    }
    throw err;
  }
};

import Auth from "ui/components/Auth";
import {
  Container,
  Typography,
  Grid,
  Box,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  InputAdornment,
  Button
} from "@mui/material";
import { useAuth } from "hooks/auth";

const conditionalTransfer = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {isAuthenticated ? (
        <>
          <Typography textAlign="center" sx={{ backgroundColor: "red", marginBottom: "10px" }}>どんなことができるのか？（未実装）</Typography>
          <Container maxWidth="sm">
            <Grid container spacing={2}>
              <Grid item xs={12}>※一番下の確認ボタンを押しても何も起きない。未実装。</Grid>
              <Grid item xs={12}><Typography variant="h6">【1. プロジェクト画像】</Typography></Grid>
              <Grid item xs={1}></Grid>
              <Grid item xs={11}><Typography>プロジェクトの概要がわかる、16:9の画像を使用してください。</Typography></Grid>
              <Grid item xs={1}></Grid>
              <Grid item xs={11}><Typography>※入力欄 未実装</Typography></Grid>
              <Grid item xs={12}><Typography variant="h6">【2. プロジェクトタイトル】</Typography></Grid>
              <Grid item xs={1}></Grid>
              <Grid item xs={11}><Typography>30文字以内でプロジェクトのタイトルを記入してください。</Typography></Grid>
              <Grid item xs={1}></Grid>
              <Grid item xs={11}><TextField label="タイトル" variant="outlined" fullWidth /></Grid>
              <Grid item xs={12}><Typography variant="h6">【3. プロジェクト説明】</Typography></Grid>
              <Grid item xs={1}></Grid>
              <Grid item xs={11}><Typography>120文字以内でプロジェクトの説明文を記載してください。</Typography></Grid>
              <Grid item xs={1}></Grid>
              <Grid item xs={11}><TextField label="説明文" variant="outlined" fullWidth /></Grid>
              <Grid item xs={12}><Typography variant="h6">【4. 対象期間の設定】</Typography></Grid>
              <Grid item xs={1}></Grid>
              <Grid item xs={11}><Typography>なにか説明文が必要？ワイヤーフレーム、書き間違えている様子。</Typography></Grid>
              <Grid item xs={1}></Grid>
              <Grid item xs={11}>※カレンダー未実装。参考 https://mui.com/x/react-date-pickers/getting-started/</Grid>
              <Grid item xs={12}><Typography variant="h6">【5. 対象ツイート条件設定】</Typography></Grid>
              <Grid item xs={1}></Grid>
              <Grid item xs={11}><Typography>以下のどちらかにチェックをしてください。</Typography></Grid>
              <Grid item xs={12}>
                <RadioGroup
                  aria-labelledby=""
                  name=""
                  id="radioGroup5"
                >
                  <Grid container spacing={2}>
                    <Grid item xs={1}></Grid>
                    <Grid item xs={11}>
                      <FormControlLabel value="hashtag" control={<Radio />} label="特定の「ハッシュタグ」を付けたツイート" />
                    </Grid>
                    <Grid item xs={2}></Grid>
                    <Grid item xs={10}><TextField variant="outlined" InputProps={{
                      startAdornment: <InputAdornment position="start">#</InputAdornment>,
                    }} /></Grid>
                    <Grid item xs={1}></Grid>
                    <Grid item xs={11}>
                      <FormControlLabel value="retweet" control={<Radio />} label="特定のツイートについての「引用リツイート」" />
                    </Grid>
                    <Grid item xs={2}></Grid>
                    <Grid item xs={10}><TextField label="特定のツイートURL" variant="outlined" fullWidth /></Grid>
                  </Grid>
                </RadioGroup>
              </Grid>
              <Grid item xs={12}><Typography variant="h6">【6. 個別条件設定】</Typography></Grid>
              <Grid item xs={1}></Grid>
              <Grid item xs={11}><Typography>以下のどちらかにチェックをしてください。</Typography></Grid>
              <Grid item xs={12}>
                <RadioGroup
                  aria-labelledby=""
                  name=""
                  id="radioGroup6"
                >
                  <Grid container spacing={2}>
                    <Grid item xs={1}></Grid>
                    <Grid item xs={11}><FormControlLabel value="good" control={<Radio />} label="いいね数で条件設定" /></Grid>
                    <Grid item xs={2}></Grid>
                    <Grid item xs={10}><TextField label="数値入力" variant="outlined" /></Grid>
                    <Grid item xs={1}></Grid>
                    <Grid item xs={11}><FormControlLabel value="impression" control={<Radio />} label="インプレッション数で条件設定" /></Grid>
                    <Grid item xs={2}></Grid>
                    <Grid item xs={4}><TextField label="数値入力" variant="outlined" /></Grid>
                    <Grid item xs={6}>以上のインプレッションを条件</Grid>
                  </Grid>
                </RadioGroup>
              </Grid>
              <Grid item xs={12}><Typography variant="h6">【7. 対象ユーザ範囲（予算規模）】</Typography></Grid>
              <Grid item xs={1}></Grid>
              <Grid item xs={11}><Typography>以下のどちらか、または両方に、チェックをしてください。</Typography></Grid>
              <Grid item xs={12}>
                <RadioGroup
                  aria-labelledby=""
                  name=""
                  id="radioGroup7"
                >
                  <Grid container spacing={2}>
                    <Grid item xs={1}></Grid>
                    <Grid item xs={11}><FormControlLabel value="good" control={<Radio />} label="ICPを支払う" /></Grid>
                    <Grid item xs={2}></Grid>
                    <Grid item xs={10}>１ユーザ（該当の１ツイート）あたりに支払う額</Grid>
                    <Grid item xs={2}></Grid>
                    <Grid item xs={5}><TextField label="数値入力" variant="outlined" /></Grid>
                    <Grid item xs={5} >を単価とする</Grid>
                    <Grid item xs={2}></Grid>
                    <Grid item xs={10}>予算上限額（全体）の設定</Grid>
                    <Grid item xs={2}></Grid>
                    <Grid item xs={5}><TextField label="数値入力" variant="outlined" /></Grid>
                    <Grid item xs={5}>までを全体の上限とする</Grid>
                    <Grid item xs={1}></Grid>
                    <Grid item xs={11}><FormControlLabel value="impression" control={<Radio />} label="NFTを配布する ※１回目のリリースでは実装しないかも" /></Grid>
                    <Grid item xs={2}></Grid>
                    <Grid item xs={10} >配布するNFTの指定</Grid>
                    <Grid item xs={2}></Grid>
                    <Grid item xs={10}><TextField label="" variant="outlined" fullWidth /></Grid>
                    <Grid item xs={2}></Grid>
                    <Grid item xs={10}>配布するNFTの数の全体上限（トータル）</Grid>
                    <Grid item xs={2}></Grid>
                    <Grid item xs={5}><TextField label="数値入力" variant="outlined" /></Grid>
                    <Grid item xs={5}>までを全体の上限とする</Grid>
                  </Grid>
                </RadioGroup>
              </Grid>
              <Grid item xs={12}><Typography variant="h6">【8. 支払い/配布方法（手動）】</Typography></Grid>
              <Grid item xs={1}></Grid>
              <Grid item xs={11}><Typography>支払い/配布の対象ユーザがいるかどうかの確認、及び対象ユーザへの設定した内容での送信/配布（手動）は、送信管理画面で行ってください。</Typography></Grid>
              <Grid item xs={12}>
                <Button variant="contained" sx={{ marginTop: '20px' }} fullWidth>条件設定を確認する ※未実装</Button>
              </Grid>
            </Grid>
            {/* TODO スクロールすると一番下がフッターに隠れてしまうため、一時措置 */}
            <Box sx={{ marginBottom: 10 }} />
          </Container>
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

export default conditionalTransfer;
import { Button } from "@mui/material";
import { requestTransfer, RequestTransferParams } from "@nfid/wallet";

const transfer = async () => {
  (document.getElementById('message') as HTMLInputElement).textContent = "送信中です。";
  // TODO LOGO URL
  const APPLICATION_LOGO_URL = "https://nfid.one/icons/favicon-96x96.png";
  const APPLICATION_NAME = process.env.NEXT_PUBLIC_APPLICATION_NAME;
  const APP_META = `applicationName=${APPLICATION_NAME}&applicationLogo=${APPLICATION_LOGO_URL}`;
  const NFID_ORIGIN = "https://nfid.one";
  const REQ_TRANSFER = "wallet/request-transfer";
  const PROVIDER_URL = new URL(`${NFID_ORIGIN}/${REQ_TRANSFER}?${APP_META}`);
  // TODO 'to', 'amount' に依存
  const to = (document.getElementById('to') as HTMLInputElement).value;
  // TODO 浮動小数点による誤差は発生しうる？
  const amount = parseFloat((document.getElementById('amount') as HTMLInputElement).value);

  const result = await requestTransfer(
    { to: to, amount: amount },
    {
      provider: PROVIDER_URL,
    }
  );
  console.log('result', result);
  if (result.status == "SUCCESS") {
    (document.getElementById('message') as HTMLInputElement).textContent = "送信しました。";
  } else {
    (document.getElementById('message') as HTMLInputElement).textContent = "正常に完了しませんでした。";
  }
}

const Transfer = () => {
  return (
    <>
      <Button variant="contained" onClick={transfer}>送信する</Button>
    </>
  );
}

export default Transfer;
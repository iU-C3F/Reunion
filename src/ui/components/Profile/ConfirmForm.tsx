import { useRouter } from "next/router";
import { useEffect, useLayoutEffect, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import { Avatar, Box, Button, Container, IconButton, Typography } from "@mui/material";
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import { TikTokIcon } from "ui/components/TiktokIcon";

import { User, InsertUser, inputProfileForm } from "types/user";
import { setUserStates } from "states/setUserStates";
import { inputProfileState } from 'states/inputProfileState';
import { localStorageUserState } from "states/localstorage";
import { sessionStorageUserState } from "states/sessionstorage";

import { Principal } from '@dfinity/principal';
import { makeUsersActor } from '../../service/actor-locator';

function ConfirmForm() {
  const router = useRouter();

  // URLのqueryにtypeが含まれない。またはtypeが不正の場合は手打ちでアクセスしている。正しい遷移では無いので、前のページに強制的に戻す
  if (!router.query.type || (router.query.type !== "registe" && router.query.type !== "edit")) {
    setTimeout(function () {
      router.back();
    }, 3 * 1000);
    return (
      <>
        <Box
          sx={{
            my: 4,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: 0
          }}
        >
          <Box sx={{ height: '80px' }} />
          <Typography variant="h6" color="gray" style={{ textAlign: 'center' }}>
            <strong>不正なアクセスです。正しい手順を行ってください。</strong>
          </Typography>
        </Box>
      </>
    );
  }

  let successMessage = '';
  let cautionMessage = '';
  let cautionSubMessage = '';
  let submitButtonText = '';
  let previousButtonText = '';
  if (router.query.type === 'registe') {
    successMessage = 'おめでとうございます！\nプロフィール情報を登録しました😁';
    cautionMessage = 'まだ登録は完了していません';
    cautionSubMessage = '\n内容を修正したい場合は\n「登録画面に戻る」で戻って\n再度入力してください';
    submitButtonText = '登録する';
    previousButtonText = '登録画面に戻る';
  } else if (router.query.type === 'edit') {
    successMessage = 'プロフィール情報を変更しました😁';
    cautionMessage = 'まだ変更内容は登録されていません';
    cautionSubMessage = '\n内容を修正したい場合は\n「編集画面に戻る」で戻って\n再度入力してください';
    submitButtonText = '変更内容を反映';
    previousButtonText = '編集画面に戻る';
  }

  const [input, setInput] = useRecoilState(inputProfileState);// 入力されたFormの情報を一時保存するState
  const inputProfileData = useRecoilValue(inputProfileState);
  const setLocalUser = useSetRecoilState(localStorageUserState);
  const setSessionUser = useSetRecoilState(sessionStorageUserState);
  const [isClient, setIsClient] = useState(false);
  const isLocalUser = useRecoilValue<User>(localStorageUserState);
  const isSessionUser = useRecoilValue<User>(sessionStorageUserState);
  const [isUser, setUser] = useState<User>();
  const [isEnv, setEnv] = useState("");

  const { handleSubmit } = useForm<inputProfileForm>();
  let notifyError = () => toast.error('データの送信に失敗しました😢\n少し待ってからリトライしてください', { position: "top-right", duration: 4000 });

  const notifySuccess = () => toast.success(successMessage, { position: "top-right", duration: 4000 });

  useEffect(() => {
    setUserStates(isClient, isLocalUser, isSessionUser, setUser, setEnv);
  }, [isClient, isUser, isLocalUser, isSessionUser, isEnv]);

  useLayoutEffect(() => {
    setIsClient(true);
  }, []);


  function previous() {
    setInput(inputProfileData);
    router.back();
  }

  const onSubmit: SubmitHandler<inputProfileForm> = async (data) => {
    // ボタン要素を取得して非活性にする
    const submitButtonElement = document.querySelector('button[type="submit"]') as HTMLButtonElement;
    submitButtonElement.innerText = '送信中';
    submitButtonElement.disabled = true;
    submitButtonElement.style.color = 'white';
    submitButtonElement.style.backgroundColor = 'silver';
    // =========================

    // 登録対象のユーザー情報をオブジェクト化
    console.log('inner onSubmit');
    const tmpUser = isUser || isLocalUser || isSessionUser;
    console.log('inner onSubmit tmpUser: ', tmpUser);
    const principalID = Principal.fromText(tmpUser.id as string);
    console.log('inner onSubmit principalID: ', principalID);
    const insertUser: InsertUser = {
      id: principalID as Principal,
      icon_url: inputProfileData.iconUrl as string,
      display_name: inputProfileData.displayName as string,
      user_name: inputProfileData.userName as string,
      self_introduction: inputProfileData.selfIntroduction ? [inputProfileData.selfIntroduction as string] : [],
      homepage_url: inputProfileData.homePageUrl ? [inputProfileData.homePageUrl as string] : [],
      twitter_url: inputProfileData.twitterUrl ? [inputProfileData.twitterUrl as string] : [],
      youtube_url: inputProfileData.youtubeUrl ? [inputProfileData.youtubeUrl as string] : [],
      tiktok_url: inputProfileData.tiktokUrl ? [inputProfileData.tiktokUrl as string] : [],
      created_at: Date.now(),
      updated_at: Date.now(),
      delete_flg: false,
    }
    // =========================

    // backendキャニスターのインスタンスを取得
    const usersActor = makeUsersActor();
    // =========================

    // 登録を実行する前に、登録内容に不正が無いかチェック（登録済チェック、登録容量チェック）
    let validationCheckResult;
    if (router.query.type === 'registe') {
      validationCheckResult = await usersActor.users_registe_validation_check(principalID, insertUser);
    } else if (router.query.type === 'edit') {
      validationCheckResult = await usersActor.users_update_validation_check(principalID, insertUser);
    }

    console.log('validationCheckResult: ', validationCheckResult);
    if (validationCheckResult.Err) {
      // 登録情報に不正があった場合はここに入ってくる
      console.log('validationCheckResult.Err: ', validationCheckResult.Err);
      // エラーメッセージを日本語に置換
      let error_msg = validationCheckResult.Err;
      error_msg = error_msg.replace('already registered.', '登録済のIDです\n登録情報を修正してください\n');
      error_msg = error_msg.replace('registration does not exist. ', '未登録のIDです\n登録情報を修正してください\n');
      error_msg = error_msg.replace(/Key is too large\. Expected \<\= \d* bytes\, found \d* bytes\. /i, 'プリンシパルIDが不正です\n登録情報を修正してください\n');
      error_msg = error_msg.replace(/Value is too large\. Expected \<\= \d* bytes\, found \d* bytes\. /i, '文字数が容量を超えています。\n登録情報を修正してください\n');
      notifyError = () => toast.error(error_msg, { position: "top-right", duration: 4000 });
      notifyError();
      // 3秒後にprofileページへリダイレクト
      setTimeout(function () {
        router.back();
      }, 3 * 1000);
    } else {
      // validationCheckでErrorが無い場合は登録を行う
      // 登録成功の場合=>insertResultに空配列[]が格納される
      // 登録失敗の場合=>insertResult.Errにエラーメッセージが格納される
      const insertResult = await usersActor.users_insert(principalID, insertUser);
      console.log('inner function insertResult: ', insertResult);
      if (!insertResult.Err) {
        // ユーザー情報の登録に成功した場合
        notifySuccess();
        console.log('registe success!', insertResult);

        const appUser: User = {
          identity: tmpUser.identity,
          id: tmpUser.id,
          isAuthenticated: tmpUser.isAuthenticated,
          iconUrl: insertUser.icon_url,
          displayName: insertUser.display_name,
          userName: insertUser.user_name,
          selfIntroduction: insertUser.self_introduction[0] || undefined,
          homePageUrl: insertUser.homepage_url[0] || undefined,
          twitterUrl: insertUser.twitter_url[0] || undefined,
          youtubeUrl: insertUser.youtube_url[0] || undefined,
          tiktokUrl: insertUser.tiktok_url[0] || undefined,
          updatedAt: insertUser.created_at,
          createdAt: insertUser.updated_at,
        }
        console.log('appUser: ', appUser);
        setLocalUser(appUser);
        setSessionUser(appUser);
        // 3秒後にprofileページへリダイレクト
        setTimeout(function () {
          router.push("/profile");
        }, 3 * 1000);
      } else {
        // ユーザー情報の登録に成功した場合
        if (insertResult.Err) {
          // エラーメッセージがあれば表示してプロフィールページにリダイレクトする
          const error_msg = insertResult.Err;
          console.log('result error_msg... ', error_msg);
          notifyError = () => toast.error(error_msg, { position: "top-right", duration: 4000 });
          notifyError();
          // 4秒後にprofileページへリダイレクト
          setTimeout(function () {
            router.push("/profile");
          }, 4 * 1000);
        } else {
          // エラー内容が不明な場合はデフォルトで設定した「データの送信に失敗しました~」エラーメッセージを表示し、前のページに戻す
          console.log('An unknown error has occurred...');
          notifyError();
          // 4秒後にprofileページへリダイレクト
          setTimeout(function () {
            router.push("/profile");
          }, 4 * 1000);
        }
      }
    }
  };

  return (
    <>
      <Container maxWidth="sm" sx={{ direction: "column", flex: '1' }}>
        <Toaster />
        <Box
          component="form"
          marginTop="20px"
          width="100%"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Box
            sx={{
              my: 4,
              display: 'flex',
              gridRow: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              margin: 0
            }}
          >
            <Typography variant='body2' color='gray' style={{ whiteSpace: 'pre-wrap', margin: 10, textAlign: 'center' }}>
              <strong>{cautionMessage}</strong>
              {String(cautionSubMessage)}
            </Typography>
          </Box>
          <Box
            sx={{
              my: 4,
              display: 'grid',
              justifyContent: 'center',
              alignItems: 'center',
              margin: 1
            }}
          >
            <Avatar src={inputProfileData.iconUrl} sx={{ width: 120, height: 120, zIndex: 1, }} />
            <Typography variant="h6" style={{ textAlign: 'center' }}>
              <strong>{inputProfileData.displayName}</strong>
            </Typography>
            <Typography variant='body1' color='gray' style={{ textAlign: 'center' }}>
              @{inputProfileData.userName}
            </Typography>
          </Box>
          <Typography variant='body2' style={{ whiteSpace: 'pre-wrap', margin: 10 }}>
            {inputProfileData.selfIntroduction ? (inputProfileData.selfIntroduction) : ("")}
          </Typography>
          {/* HomePage、Tiwtter、Youtube、Tiktok リンク先 */}
          <Box maxWidth="sm" sx={{ flexDirection: 'column', margin: 1 }}>
            {inputProfileData.homePageUrl ? (
              <Box style={{ display: 'flex', textAlign: 'center', overflow: 'hidden', whiteSpace: 'nowrap' }} >
                <IconButton href={inputProfileData.homePageUrl} target="_blank" rel="noopener noreferrer" aria-label="Home Page">
                  <InsertLinkIcon style={{ rotate: '135deg' }} />
                  <Typography variant='body2' color="gray" maxWidth="100%" style={{ textAlign: 'center', height: '60px', lineHeight: '60px' }} >
                    {inputProfileData.homePageUrl}
                  </Typography>
                </IconButton>
              </Box>
            ) : ("")}
            {inputProfileData.twitterUrl ? (
              <Box style={{ display: 'flex', textAlign: 'center', overflow: 'hidden', whiteSpace: 'nowrap' }} >
                <IconButton href={inputProfileData.twitterUrl} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                  <TwitterIcon />
                  <Typography variant='body2' color="gray" maxWidth="100%" style={{ textAlign: 'center', height: '60px', lineHeight: '60px' }} >
                    {inputProfileData.twitterUrl}
                  </Typography>
                </IconButton>
              </Box>
            ) : ("")}
            {inputProfileData.youtubeUrl ? (
              <Box style={{ display: 'flex', textAlign: 'center', overflow: 'hidden', whiteSpace: 'nowrap' }} >
                <IconButton href={inputProfileData.youtubeUrl} target="_blank" rel="noopener noreferrer" aria-label="Youtube" >
                  <YouTubeIcon />
                  <Typography variant='body2' color="gray" maxWidth="100%" style={{ textAlign: 'center', height: '60px', lineHeight: '60px' }} >
                    {inputProfileData.youtubeUrl}
                  </Typography>
                </IconButton>
              </Box>
            ) : ("")}
            {inputProfileData.tiktokUrl ? (
              <Box style={{ display: 'flex', textAlign: 'center', overflow: 'hidden', whiteSpace: 'nowrap' }} >
                <IconButton href={inputProfileData.tiktokUrl} target="_blank" rel="noopener noreferrer" aria-label="Tiktok" >
                  <TikTokIcon color='gray' width="25px" />
                  <Typography variant='body2' color="gray" maxWidth="100%" style={{ textAlign: 'center', height: '60px', lineHeight: '60px' }} >
                    {inputProfileData.tiktokUrl}
                  </Typography>
                </IconButton>
              </Box>
            ) : ("")}
          </Box>
          <Box
            sx={{
              my: 4,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              margin: 1
            }}
          >
            <Button type="submit" color="primary" variant="contained" style={{ maxWidth: '280px', minWidth: '250px' }}>
              {submitButtonText}
            </Button>
          </Box>
          <Button onClick={() => previous()} >{previousButtonText}</Button>
        </Box>
        <Box sx={{ height: '80px' }} />{/* 画面下部のカードがfooterに隠れてしまうので、底上げ用のBoxを設置 */}
      </Container>
    </>
  );
}

export default ConfirmForm;
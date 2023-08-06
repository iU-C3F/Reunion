import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Avatar,
  Modal,
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { inputProfileForm } from 'types/user';
import { inputProfileState } from 'states/inputProfileState';

function EditFrom() {
  const router = useRouter();
  const [input, setInput] = useRecoilState(inputProfileState);// 入力されたFormの情報を一時保存するState
  const inputProfileData = useRecoilValue(inputProfileState);
  console.log('inputProfileData: ', inputProfileData);
  // ２，react-hook-form使用の宣言
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<inputProfileForm>({
    mode: "onBlur", // blur イベントからバリデーションがトリガーされます。
    criteriaMode: "all", // all -> 発生した全てのエラーが収集されます。
    shouldFocusError: false, //true -> エラーのある最初のフィールドがフォーカスされます。
    defaultValues: {
      iconUrl: input.iconUrl,
      displayName: input.displayName,
      userName: input.userName,
      selfIntroduction: input.selfIntroduction,
      homePageUrl: input.homePageUrl,
      twitterUrl: input.twitterUrl,
      youtubeUrl: input.youtubeUrl,
      tiktokUrl: input.tiktokUrl,
    }
  });
  // ３．Submit発火時に実行されるメソッド。ここでPOSTメソッドなどを呼ぶ
  const onSubmit: SubmitHandler<inputProfileForm> = (data) => {
    setInput((currentInput) => ({
      ...currentInput,
      ...{
        iconUrl: data.iconUrl,
        displayName: data.displayName,
        userName: data.userName,
        selfIntroduction: data.selfIntroduction,
        homePageUrl: data.homePageUrl,
        twitterUrl: data.twitterUrl,
        youtubeUrl: data.youtubeUrl,
        tiktokUrl: data.tiktokUrl,
      }
    }));
    console.log(data);
    router.push({
      pathname: '/profile/confirm',
      query: { type: "edit" } //検索クエリ
    });
  };

  // modalの設定
  const [isIconUrl, setIconUrl] = useState<string>();
  const [open, setOpen] = useState<boolean>(false);
  const [openError, setOpenError] = useState<boolean>(false);
  const customStyles = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    maxWidth: 500,
    minWidth: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    borderRadius: "10px",
  };
  useEffect(() => {
    if (inputProfileData.userName === '') {
      console.log('プロフィールデータの取得に失敗しました😢\n再度「編集」ボタンよりお試しください。');
      setOpenError(true);
      setTimeout(function () {
        router.back();
      }, 3 * 1000);
    }
    if (inputProfileData.iconUrl !== '') {
      setIconUrl(inputProfileData.iconUrl)
    }
  }, []);

  function setIcon() {
    const iconUrlElement = document.getElementById('iconURL') as HTMLInputElement | null;
    if (iconUrlElement) setIconUrl(iconUrlElement.value);
    setOpen(false);
  }

  function handleClose() {
    setOpenError(false);
  }

  return (
    <>
      <Container maxWidth="sm" sx={{ direction: "column", flex: '1' }}>
        <Modal
          open={openError}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={{ ...customStyles, color: 'red;', border: "5px solid red;", }}>
            <Typography id="modal-error-title" variant="h6" component="h2">
              情報取得エラー
            </Typography>
            <Typography id="modal-error-description" sx={{ mt: 2 }}>
              プロフィールデータの取得に失敗しました😢
              再度プロフィール画面の「編集」ボタンよりお試しください。
            </Typography>
          </Box>
        </Modal>
        <Box
          sx={{
            my: 4,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box
            component="form"
            marginTop="20px"
            width="100%"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* ===================== */}
            <Container
              sx={{
                my: 4,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                margin: 1
              }}
            >
              {!isIconUrl ? (
                <>
                  <Typography variant='body2' sx={{ position: 'absolute', top: '255px', left: 'auto', color: 'white', zIndex: 2, }}>
                    アイコンURL
                  </Typography>
                  <Avatar onClick={() => setOpen(true)} sx={{ width: 120, height: 120, zIndex: 1, }}>
                    <AddIcon sx={{ width: 40, height: 40 }} />
                  </Avatar>
                </>
              ) : (
                <Avatar src={isIconUrl} onClick={() => setOpen(true)} sx={{ width: 120, height: 120, zIndex: 1, }} />
              )}
            </Container>
            <Modal
              open={open}
              onClose={() => setOpen(false)}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={customStyles}>
                <Box sx={{ height: -50, width: -50, textAlign: "right", }}>
                  <IconButton onClick={() => setOpen(false)}>
                    <CloseIcon />
                  </IconButton>
                </Box>
                <Container maxWidth="lg" sx={{ height: '400px' }}>
                  <Controller
                    name="iconUrl"
                    control={control}
                    rules={{
                      pattern: {
                        value: new RegExp(/^https?:\/\/[\w/:%#\$&\?\(\)~\.=\+\-]+$/),
                        message: "正しいURLを入力してください",
                      },
                      minLength: {
                        value: 9,
                        message: '9文字以上で入力してください',
                      },
                      maxLength: {
                        value: 500,
                        message: "500文字以内で入力してください",
                      },
                    }}
                    render={({
                      field: { onChange, onBlur, value, name, ref },
                      fieldState: { invalid, isTouched, isDirty, error },
                    }) => (
                      <TextField
                        id='iconURL'
                        label="アイコンURL"
                        placeholder="https://example.com/"
                        value={value}
                        variant="outlined"
                        margin="dense"
                        onChange={onChange}
                        onBlur={onBlur}
                        error={Boolean(error)}
                        helperText={error?.message}
                        fullWidth
                      />
                    )}
                  />
                  <Button variant='contained' onClick={setIcon} >登録</Button>
                  <Typography id="modal-modal-title" variant="h6" component="h2">
                    <strong>例えば以下のような方法で<br />プロフィールURLを取得できます</strong>
                  </Typography>
                  <Typography id="modal-modal-description" variant="body2" sx={{ mt: 2, padding: 1, backgroundColor: 'rgb(255, 255, 200)' }}>
                    Twitterプロフィール画像の例<br />
                    1. Twitterを開きます<br />
                    2. プロフィールを選択します<br />
                    3. プロフィール画像を選択します<br />
                    4. 右上の詳細ボタンを押します<br />
                    5. androidの場合:<br />&nbsp;&emsp;&emsp;&emsp;"画像のリンクを共有する"を選択<br />
                    &nbsp;&emsp;iphone の場合:<br />&nbsp;&emsp;&emsp;&emsp;"ウェブページで開く"を選択<br />
                    &nbsp;&emsp;&emsp;&emsp;右上の"共有"からURLをコピー
                  </Typography>
                </Container>
              </Box>
            </Modal>

            {/* ===================== */}
            <Controller
              name="displayName"
              control={control}
              rules={{
                required: "入力必須",
                minLength: {
                  value: 5,
                  message: '5文字以上で入力してください',
                },
                maxLength: {
                  value: 50,
                  message: "50文字以内で入力してください",
                },
              }}
              render={({
                field: { onChange, onBlur, value, name, ref },
                fieldState: { invalid, isTouched, isDirty, error },
              }) => (
                <TextField
                  label="表示名(5文字以上50文字以内)"
                  placeholder="リユニオン　太郎"
                  required
                  value={value}
                  variant="outlined"
                  margin="dense"
                  onChange={onChange}
                  onBlur={onBlur}
                  error={Boolean(error)}
                  helperText={error?.message}
                />
              )}
            />
            {/* ===================== */}
            <Controller
              name="userName"
              control={control}
              rules={{
                required: "入力必須",
                pattern: {
                  value: new RegExp(/^[a-zA-Z0-9\-]{5,50}$/),
                  message: "半角英数字,半角ハイフン,5文字以上50文字以内で入力してください",
                },
                minLength: {
                  value: 5,
                  message: '5文字以上で入力してください',
                },
                maxLength: {
                  value: 50,
                  message: "50文字以内で入力してください",
                },
              }}
              render={({
                field: { onChange, onBlur, value, name, ref },
                fieldState: { invalid, isTouched, isDirty, error },
              }) => (
                <TextField
                  name="userName"
                  label="ユーザー名(変更不可)"
                  placeholder="reunion-bob-1234"
                  required
                  disabled
                  value={value}
                  variant="outlined"
                  margin="dense"
                  onChange={onChange}
                  onBlur={onBlur}
                  error={Boolean(error)}
                  helperText={error?.message}
                />
              )}
            />
            {/* ===================== */}
            <Controller
              name="selfIntroduction"
              control={control}
              rules={{
                maxLength: {
                  value: 200,
                  message: "200文字以内で入力してください",
                },
              }}
              render={({
                field: { onChange, onBlur, value, name, ref },
                fieldState: { invalid, isTouched, isDirty, error },
              }) => (
                <TextField
                  label="自己紹介文(200文字以内)"
                  placeholder="Reunionでのあなたの自己紹介の内容を200文字以内で記入してください"
                  multiline
                  value={value}
                  variant="outlined"
                  margin="dense"
                  onChange={onChange}
                  onBlur={onBlur}
                  error={Boolean(error)}
                  helperText={error?.message}
                />
              )}
            />
            {/* ===================== */}
            <Controller
              name="homePageUrl"
              control={control}
              rules={{
                pattern: {
                  value: new RegExp(/^https?:\/\/[\w/:%#\$&\?\(\)~\.=\+\-]+$/),
                  message: "正しいURLを入力してください",
                },
                minLength: {
                  value: 9,
                  message: '9文字以上で入力してください',
                },
                maxLength: {
                  value: 500,
                  message: "500文字以内で入力してください",
                },
              }}
              render={({
                field: { onChange, onBlur, value, name, ref },
                fieldState: { invalid, isTouched, isDirty, error },
              }) => (
                <TextField
                  label="URL(ホームページ等)"
                  placeholder="https://example.com/"
                  value={value}
                  variant="outlined"
                  margin="dense"
                  onChange={onChange}
                  onBlur={onBlur}
                  error={Boolean(error)}
                  helperText={error?.message}
                />
              )}
            />
            {/* ===================== */}
            <Controller
              name="twitterUrl"
              control={control}
              rules={{
                pattern: {
                  value: new RegExp(/^https:\/\/twitter\.com\/[\w/:%#\$&\?\(\)~\.=\+\-]+$/),
                  message: "正しいTwitterプロフィールURLを入力してください",
                },
                minLength: {
                  value: 20,
                  message: '20文字以上で入力してください',
                },
                maxLength: {
                  value: 500,
                  message: "500文字以内で入力してください",
                },
              }}
              render={({
                field: { onChange, onBlur, value, name, ref },
                fieldState: { invalid, isTouched, isDirty, error },
              }) => (
                <TextField
                  label="TwitterプロフィールページURL"
                  placeholder="https://twitter.com/example"
                  value={value}
                  variant="outlined"
                  margin="dense"
                  onChange={onChange}
                  onBlur={onBlur}
                  error={Boolean(error)}
                  helperText={error?.message}
                />
              )}
            />
            {/* ===================== */}
            <Controller
              name="youtubeUrl"
              control={control}
              rules={{
                pattern: {
                  value: new RegExp(/^https:\/\/(www\.)?youtube\.com\/[\w/:%#\$&\?\(\)~\.=\+\-]+$/),
                  message: "正しいYoutubeプロフィールURLを入力してください",
                },
                minLength: {
                  value: 20,
                  message: '20文字以上で入力してください',
                },
                maxLength: {
                  value: 500,
                  message: "500文字以内で入力してください",
                },
              }}
              render={({
                field: { onChange, onBlur, value, name, ref },
                fieldState: { invalid, isTouched, isDirty, error },
              }) => (
                <TextField
                  label="YoutubeチャンネルURL"
                  placeholder="https://www.youtube.com/channel/example"
                  value={value}
                  variant="outlined"
                  margin="dense"
                  onChange={onChange}
                  onBlur={onBlur}
                  error={Boolean(error)}
                  helperText={error?.message}
                />
              )}
            />
            {/* ===================== */}
            <Controller
              name="tiktokUrl"
              control={control}
              rules={{
                pattern: {
                  value: new RegExp(/^https:\/\/(www\.)?tiktok\.com\/[@\w/:%#\$&\?\(\)~\.=\+\-]+$/),
                  message: "正しいTikTokプロフィールURLを入力してください",
                },
                minLength: {
                  value: 19,
                  message: '19文字以上で入力してください',
                },
                maxLength: {
                  value: 500,
                  message: "500文字以内で入力してください",
                },
              }}
              render={({
                field: { onChange, onBlur, value, name, ref },
                fieldState: { invalid, isTouched, isDirty, error },
              }) => (
                <TextField
                  label="TikTokチャンネルURL"
                  placeholder="https://www.tiktok.com/@example"
                  value={value}
                  variant="outlined"
                  margin="dense"
                  onChange={onChange}
                  onBlur={onBlur}
                  error={Boolean(error)}
                  helperText={error?.message}
                />
              )}
            />

            <Box
              sx={{
                my: 4,
                display: 'flex',
                flexDirection: "column",
                justifyContent: 'center',
                alignItems: 'center',
                margin: 1
              }}
            >
              <Button type="submit" color="primary" variant="contained" style={{ maxWidth: '280px', minWidth: '250px' }}>
                確認画面に進む
              </Button>
              <Button onClick={() => router.back()} >戻る</Button>
            </Box>
          </Box>
        </Box>
        <Box sx={{ height: '80px' }} />{/* 画面下部のカードがfooterに隠れてしまうので、底上げ用のBoxを設置 */}
      </Container>
    </>
  );
}

export default EditFrom;
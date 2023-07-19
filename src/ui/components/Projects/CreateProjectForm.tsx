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
import { inputProjectForm } from 'types/project';
import { inputProjectState } from 'states/inputProjectState';

const regU128 = new RegExp(/^[0-340282366920938463463374607431768211455]$/);

function CreateProjectForm() {
  const router = useRouter();
  const [input, setInput] = useRecoilState(inputProjectState);// 入力されたFormの情報を一時保存するState
  const inputProjectData = useRecoilValue(inputProjectState);
  console.log('inputProjectData: ', inputProjectData);
  // ２，react-hook-form使用の宣言
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<inputProjectForm>({
    mode: "onBlur", // blur イベントからバリデーションがトリガーされます。
    criteriaMode: "all", // all -> 発生した全てのエラーが収集されます。
    shouldFocusError: false, //true -> エラーのある最初のフィールドがフォーカスされます。
    defaultValues: {
      projectName: input.projectName,
      logoUrl: input.logoUrl,
      description: input.description,
      withExtraCycles: input.withExtraCycles,
      computeAllocation: input.computeAllocation,
      memoryAllocation: input.memoryAllocation,
      freezingThreshold: input.freezingThreshold,
    }
  });
  // ３．Submit発火時に実行されるメソッド。ここでPOSTメソッドなどを呼ぶ
  const onSubmit: SubmitHandler<inputProjectForm> = (data) => {
    setInput((currentInput) => ({
      ...currentInput,
      ...{
        projectName: data.projectName,
        logoUrl: data.logoUrl,
        description: data.description,
        withExtraCycles: data.withExtraCycles,
        computeAllocation: data.computeAllocation,
        memoryAllocation: data.memoryAllocation,
        freezingThreshold: data.freezingThreshold,
      }
    }));
    console.log(data);
    router.push({
      pathname: '/project/confirm',
      query: { type: "create" } //検索クエリ
    });
  };

  // modalの設定
  const [isLogoUrl, setLogoUrl] = useState<string>();
  const [open, setOpen] = useState<boolean>(false);
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
    if (inputProjectData.logoUrl !== '') {
      setLogoUrl(inputProjectData.logoUrl)
    }
  }, []);
  function setIcon() {
    const logoUrlElement = document.getElementById('logoUrl') as HTMLInputElement | null;
    if (logoUrlElement) setLogoUrl(logoUrlElement.value);
    setOpen(false);
  }

  return (
    <>
      <Container maxWidth="sm" sx={{ direction: "column", flex: '1' }}>
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
            marginTop="50px"
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
              {!isLogoUrl ? (
                <>
                  <Typography variant='body2' sx={{ position: 'absolute', top: '180px', left: 'auto', color: 'white', zIndex: 2, }}>
                    ロゴURL
                  </Typography>
                  <Avatar onClick={() => setOpen(true)} sx={{ width: 120, height: 120, zIndex: 1, }}>
                    <AddIcon sx={{ width: 40, height: 40 }} />
                  </Avatar>
                </>
              ) : (
                <Avatar src={isLogoUrl} onClick={() => setOpen(true)} sx={{ width: 120, height: 120, zIndex: 1, }} />
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
                    name="logoUrl"
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
                        id='logoUrl'
                        label="ロゴURL"
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
                </Container>
              </Box>
            </Modal>

            {/* ===================== */}
            <Controller
              name="projectName"
              control={control}
              rules={{
                required: "入力必須",
                minLength: {
                  value: 10,
                  message: '10文字以上で入力してください',
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
                  label="プロジェクト名(10文字以上50文字以内)"
                  placeholder="リユニオン　プロジェクト"
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
              name="description"
              control={control}
              rules={{
                required: "入力必須",
                minLength: {
                  value: 10,
                  message: '10文字以上で入力してください',
                },
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
                  label="プロジェクト説明(10文字以上200文字以内)"
                  placeholder="プロジェクトの説明を200文字以内で記入してください"
                  required
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
              name="withExtraCycles"
              control={control}
              rules={{
                min: {
                  value: 0,
                  message: '0以上で入力してください',
                },
                max: {
                  value: (Math.pow(2, 128) - 1),
                  message: `${(Math.pow(2, 128) - 1)}以下で入力してください`,
                },
              }}
              render={({
                field: { onChange, onBlur, value, name, ref },
                fieldState: { invalid, isTouched, isDirty, error },
              }) => (
                <TextField
                  label="注入するCycle量(2の128乗未満の数値)"
                  placeholder="50000000000000"
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
              name="computeAllocation"
              control={control}
              rules={{
                min: {
                  value: 0,
                  message: '0以上で入力してください',
                },
                max: {
                  value: 100,
                  message: "100以下で入力してください",
                },
              }}
              render={({
                field: { onChange, onBlur, value, name, ref },
                fieldState: { invalid, isTouched, isDirty, error },
              }) => (
                <TextField
                  label="計算リソース割り当て(0以上100以下)"
                  placeholder="設定した数値の計算リソースが割り当てられます"
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
              name="memoryAllocation"
              control={control}
              rules={{
                min: {
                  value: 0,
                  message: '0以上で入力してください',
                },
                max: {
                  value: 38654705664,
                  message: "38654705664以下で入力してください",
                },
              }}
              render={({
                field: { onChange, onBlur, value, name, ref },
                fieldState: { invalid, isTouched, isDirty, error },
              }) => (
                <TextField
                  label="メモリ割り当て(0以上の数値)"
                  placeholder="設定した数値のメモリが割り当てられます"
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
              name="freezingThreshold"
              control={control}
              rules={{
                min: {
                  value: 0,
                  message: '0以上で入力してください',
                },
                max: {//2^64-1
                  value: (Math.pow(2, 64 - 1)),
                  message: `${(Math.pow(2, 64 - 1))}以下で入力してください`,
                },
              }}
              render={({
                field: { onChange, onBlur, value, name, ref },
                fieldState: { invalid, isTouched, isDirty, error },
              }) => (
                <TextField
                  label="一時停止しきい値Cycle数"
                  placeholder="設定したCycle数を下回ると一時停止します"
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

export default CreateProjectForm;
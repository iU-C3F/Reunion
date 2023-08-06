import { useRouter } from "next/router";
import toast, { Toaster } from 'react-hot-toast';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useRecoilState, useRecoilValue } from "recoil";

import { Avatar, Box, Button, Container, Typography } from "@mui/material";

import { InsertProjectForm } from "types/project";
import { inputProjectState } from 'states/inputProjectState';

import { useAuth } from "hooks/auth";
import { makeManagementCanisterActor } from 'ui/service/actor-locator';
import { Identity } from "@dfinity/agent";


function ConfirmForm() {
  const { identity } = useAuth();
  const router = useRouter();

  // URLのqueryにtypeが含まれない。またはtypeが不正の場合は手打ちでアクセスしている。正しい遷移では無いので、前のページに強制的に戻す
  if (!router.query.type || (router.query.type !== "create" && router.query.type !== "edit")) {
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
  if (router.query.type === 'create') {
    successMessage = '新規プロジェクトを作成しました';
    cautionMessage = 'まだ作成は完了していません';
    cautionSubMessage = '\n内容を修正したい場合は\n「入力画面に戻る」で戻って\n再度入力してください';
    submitButtonText = 'プロジェクトを作成する';
    previousButtonText = '入力画面に戻る';
  } else if (router.query.type === 'edit') {
    successMessage = 'プロジェクト情報を変更しました😁';
    cautionMessage = 'まだ変更内容は登録されていません';
    cautionSubMessage = '\n内容を修正したい場合は\n「編集画面に戻る」で戻って\n再度入力してください';
    submitButtonText = '変更内容を反映';
    previousButtonText = '編集画面に戻る';
  }

  const [input, setInput] = useRecoilState(inputProjectState);// 入力されたFormの情報を一時保存するState
  const inputProjectData = useRecoilValue(inputProjectState);


  const { handleSubmit } = useForm<InsertProjectForm>();
  let notifyError = () => toast.error('データの送信に失敗しました😢\n少し待ってからリトライしてください', { position: "top-right", duration: 4000 });

  const notifySuccess = () => toast.success(successMessage, { position: "top-right", duration: 4000 });

  function previous() {
    setInput(inputProjectData);
    router.back();
  }

  const onSubmit: SubmitHandler<InsertProjectForm> = async (data) => {
    // ボタン要素を取得して非活性にする
    const submitButtonElement = document.querySelector('button[type="submit"]') as HTMLButtonElement;
    submitButtonElement.innerText = '送信中';
    submitButtonElement.disabled = true;
    submitButtonElement.style.color = 'white';
    submitButtonElement.style.backgroundColor = 'silver';
    // =========================

    // プロジェクト情報をオブジェクト化
    console.log('inner onSubmit');

    const insertProject: InsertProjectForm = {
      project_name: inputProjectData.projectName,
      logo_url: inputProjectData.logoUrl,
      description: inputProjectData.description,
      with_extra_cycles: BigInt(inputProjectData.withExtraCycles),
      compute_allocation: inputProjectData.computeAllocation ? [BigInt(inputProjectData.computeAllocation)] : [],
      memory_allocation: inputProjectData.memoryAllocation ? [BigInt(inputProjectData.memoryAllocation)] : [],
      freezing_threshold: inputProjectData.freezingThreshold ? [BigInt(inputProjectData.freezingThreshold)] : [],
    }
    // =========================

    // backendキャニスターのインスタンスを取得
    console.log("before makeManagementCanisterActor. identity: ", identity);
    const managementCanisterActor = await makeManagementCanisterActor(identity as Identity);
    console.log("managementCanisterActor: ", managementCanisterActor);
    // =========================
    const insertResult = await managementCanisterActor.execute_create_canister_with_extra_cycles(insertProject);
    console.log('inner function insertResult: ', insertResult);
    if (!insertResult.Err) {
      // プロジェクト作成に成功した場合
      notifySuccess();
      console.log('registe success!', insertResult);
      // 3秒後にprofileページへリダイレクト
      setTimeout(function () {
        router.push("/project");
      }, 3 * 1000);
    } else {
      // プロジェクト作成に失敗した場合
      if (insertResult.Err) {
        console.log('result error... ', insertResult.Err);
        // エラーメッセージがあれば表示してプロフィールページにリダイレクトする
        const error_msg = insertResult.Err[1];
        notifyError = () => toast.error(error_msg, { position: "top-right", duration: 4000 });
        notifyError();
      } else {
        // エラー内容が不明な場合はデフォルトで設定した「データの送信に失敗しました~」エラーメッセージを表示
        console.log('An unknown error has occurred...');
        notifyError();
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
              display: 'flex',
              justifyContent: 'center',
              alignContent: 'center',
              margin: 1
            }}
          >
            <Avatar src={inputProjectData.logoUrl} sx={{ width: 120, height: 120, zIndex: 1, alignContent: 'center' }} />
          </Box>
          <Typography variant="h6" style={{ textAlign: 'center' }}>
            <strong>{inputProjectData.projectName}</strong>
          </Typography>
          <Box
            sx={{
              my: 4,
              display: 'grid',
              justifyContent: 'center',
              alignContent: 'left',
              margin: 1
            }}
          >
            <Typography variant='body2' style={{ whiteSpace: 'pre-wrap', margin: 10 }}>
              {inputProjectData.description}
            </Typography>
            <Typography variant='body2' style={{ whiteSpace: 'pre-wrap', margin: 10 }}>
              注入するCycle量: {inputProjectData.withExtraCycles}
            </Typography>
            <Typography variant='body2' style={{ whiteSpace: 'pre-wrap', margin: 10 }}>
              計算リソース割り当て: {inputProjectData.computeAllocation}
            </Typography>
            <Typography variant='body2' style={{ whiteSpace: 'pre-wrap', margin: 10 }}>
              メモリ割り当て: {inputProjectData.memoryAllocation}
            </Typography>
            <Typography variant='body2' style={{ whiteSpace: 'pre-wrap', margin: 10 }}>
              一時停止しきい値Cycle数: {inputProjectData.freezingThreshold}
            </Typography>
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
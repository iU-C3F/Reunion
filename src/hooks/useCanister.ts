import { toast } from "react-hot-toast";
import { Principal } from "@dfinity/principal";
import { Projects } from "types/project";
import { makeManagementCanisterActor } from "ui/service/actor-locator";

export const canisterId_users = process.env.NEXT_PUBLIC_CANISTER_USERS_CANISTER_ID as String;
export const canisterId_management_canister = process.env.NEXT_PUBLIC_MANAGEMENT_CANISTER_CANISTER_ID as String;
export const canisterId___Candid_UI_canister = process.env.NEXT_PUBLIC___CANDID_UI_CANISTER_ID as String;
const baseHost = process.env.NEXT_PUBLIC_IC_HOST as String;
export const host = baseHost.indexOf(':') !== -1 ? "http://" + baseHost : baseHost;

// create canister function >>>
export async function handleCreateCanister() {
  console.log("canisterId_users: ", canisterId_users);
  console.log("canisterId_management_canister: ", canisterId_management_canister);
  console.log("__Candid_UI_canister: ", canisterId___Candid_UI_canister);
  console.log("host: ", host);
  const managementCanisterActor = makeManagementCanisterActor();
  const create_canister_result = await managementCanisterActor.execute_create_canister_with_extra_cycles("first project");
  console.log("create_canister_result: ", create_canister_result);
}
// <<< create canister function

// function for projects >>>
export async function getProjects() {
  const managementCanisterActor = makeManagementCanisterActor();
  const projects_result = await managementCanisterActor.get_canister_values();
  const projects: Projects = new Map(Object.entries(projects_result));
  return projects;
}

export async function getProjectsPlane() {
  const managementCanisterActor = makeManagementCanisterActor();
  return await managementCanisterActor.get_canister_values();
}
// <<< function for projects

// <<< start or stop canister
// const [isProjects, setProjects] = useRecoilState(projectState);
export function handleChangeStatus(e_handle: any, setProjects: any) {
  const successMessage = 'ステータスを変更しました😁';
  const notifySuccess = () => toast.success(successMessage, { position: "top-right", duration: 3000 });
  let notifyError = () => toast.error('プロジェクトリストの更新に失敗しました😢\n画面を再読み込みしてください', { position: "top-right", duration: 3000 });
  const principalID = Principal.fromText(e_handle.target.value);
  e_handle.target.disabled = true;

  if (e_handle.target.innerText.indexOf("START") !== -1) {
    const managementCanisterActor = makeManagementCanisterActor();
    managementCanisterActor.execute_start_canister(principalID)
      .then((result: any) => {
        if (result.Err) {
          const rejectCode = result.Err[0].CanisterReject;
          const errorMessage = result.Err[1];
          console.log(`execute_start_canister error...\nrejectCode: ${rejectCode}\nerrorMessage: ${errorMessage}`);
          notifyError = () => toast.error(`ステータスの更新に失敗しました😢\nrejectCode: ${rejectCode}\nerrorMessage: ${errorMessage}`, { position: "top-right", duration: 3000 });
          notifyError();
        } else {
          notifySuccess();
          getProjects()
            .then((projects: Projects) => setProjects(projects))
            .catch((err: any) => {
              console.log("getProjects error: ", err);
              notifyError();
            })
        }
      });

  } else if (e_handle.target.innerText.indexOf("STOP") !== -1) {
    const managementCanisterActor = makeManagementCanisterActor();
    managementCanisterActor.execute_stop_canister(principalID)
      .then((result: any) => {
        if (result.Err) {
          const rejectCode = result.Err[0].CanisterReject;
          const errorMessage = result.Err[1];
          console.log(`execute_stop_canister error...\nrejectCode: ${rejectCode}\nerrorMessage: ${errorMessage}`);
          notifyError = () => toast.error(`ステータスの更新に失敗しました😢\nrejectCode: ${rejectCode}\nerrorMessage: ${errorMessage}`, { position: "top-right", duration: 3000 });
          notifyError();
        } else {
          notifySuccess();
          getProjects()
            .then((projects: Projects) => setProjects(projects))
            .catch((err: any) => {
              console.log("getProjects error: ", err);
              notifyError();
            })
        }
      });
  }
  e_handle.target.disabled = false;
};
// start or stop canister >>>

// for wasm file upload >>>

// const [isProjects, setProjects] = useRecoilState(projectState);
export function handleChangeFile(e_handle: any, setFile: any, setFileName: any, setProjects: any) {
  const principalID = Principal.fromText(e_handle.target.alt);
  if (e_handle.target.files) {
    console.log(e_handle.target.files[0].name);
    setFile(e_handle.target.files[0]);
    setFileName(e_handle.target.files[0].name);
    const fileReader = new FileReader();
    fileReader.onload = (e_fileReader) => {
      if (e_fileReader.target) {
        const managementCanisterActor = makeManagementCanisterActor();
        const uploadBlob = new Uint8Array(e_fileReader.target.result as ArrayBuffer);
        console.log("uploadBlob.length: ", uploadBlob.length);
        managementCanisterActor.execute_install_code(principalID, uploadBlob)
          .then((result: any) => {
            if (result.Err) {
              const rejectCode = result.Err[0].CanisterReject;
              const errorMessage = result.Err[1];
              console.log(`file upload error...\nrejectCode: ${rejectCode}\nerrorMessage: ${errorMessage}`);
            } else {
              console.log("file upload result: ", result)
              getProjects()
                .then((projects: Projects) => setProjects(projects))
                .catch((err: any) => console.log("getProjects error: ", err))
            }
          })
      }
    }
    fileReader.readAsArrayBuffer(e_handle.target.files[0]);
  }
};
// <<< for wasm file upload
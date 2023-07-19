use candid::{CandidType, Principal};
use ic_cdk::api::management_canister::provisional::CanisterIdRecord;
use ic_cdk::api::{
    call::{CallResult, RejectionCode},
    management_canister::main::*,
    time,
};
use ic_cdk_macros;
use store::{
    CanistersState, StableBTreeMapCanistersItemType, StableBTreeMapCanistersKeyType,
    StableBTreeMapCanistersValueType,
};

mod store;

#[derive(Ord, PartialOrd, Eq, PartialEq, Clone, serde::Deserialize, Debug, CandidType)]
pub struct InsertProjectArg {
    project_name: String,
    logo_url: String,
    description: String,
    with_extra_cycles: u128,
    compute_allocation: Option<candid::Nat>,
    memory_allocation: Option<candid::Nat>,
    freezing_threshold: Option<candid::Nat>,
}

#[ic_cdk_macros::update]
#[candid::candid_method(update)]
pub fn arg_default() {
    let first_setting = CanisterSettings {
        controllers: Some(vec![ic_cdk::id(), ic_cdk::api::caller()]),
        compute_allocation: None,
        memory_allocation: None,
        freezing_threshold: None,
    };
    let arg_default = CreateCanisterArgument {
        settings: Some(first_setting),
    };
    // let arg_default = CreateCanisterArgument::default();
    ic_cdk::api::print(format!("arg_default: {:?}", arg_default));
}

// dfx ledger fabricate-cycles --canister caller --cycles 100000000000000
#[ic_cdk_macros::query]
#[candid::candid_method(query)]
pub fn caller() -> Principal {
    let caller = ic_cdk::api::caller();
    ic_cdk::api::print(format!("caller: {:?}", caller.to_string()));
    // The anonymous principal is not allowed to do certain actions, such as creating new signals or add messages.
    if caller == Principal::anonymous() {
        panic!("Anonymous principal not allowed to make this call.")
    }
    caller
}

#[ic_cdk_macros::update]
#[candid::candid_method(update)]
async fn execute_create_canister(project_name: String) -> CallResult<(CanisterIdRecord,)> {
    let arg = CreateCanisterArgument { settings: None };
    ic_cdk::api::print(format!("arg: {:?}", arg));

    let created_canister_result = create_canister(arg).await;

    match created_canister_result {
        Ok(created_canister) => {
            let canister_id = created_canister.0.canister_id;
            ic_cdk::api::print(format!("canister_id: {:?}", canister_id));

            let arg = CanisterIdRecord { canister_id };
            ic_cdk::api::print(format!("CanisterIdRecord arg: {:?}", arg));

            let canister_status_result = canister_status(arg).await;
            ic_cdk::api::print(format!(
                "canister_status_result: {:?}",
                canister_status_result
            ));

            match canister_status_result {
                Ok(response) => {
                    let canister_state = CanistersState {
                        canister_id: canister_id,
                        project_name,
                        created_canister: Some(response.0),
                        logo_url: Some("https://example.com".to_string()),
                        description: Some("test description".to_string()),
                        created_at: candid::Nat::from(time()),
                        updated_at: candid::Nat::from(time()),
                    };
                    let insert_result = store::insert(canister_id, canister_state);
                    ic_cdk::api::print(format!("insert_result: {:?}", insert_result));
                    created_canister_result
                }
                Err(err) => Err(err),
            }
        }
        Err(err) => Err(err),
    }
}

#[ic_cdk_macros::update]
#[candid::candid_method(update)]
async fn execute_create_canister_with_extra_cycles(
    insert_project_arg: InsertProjectArg,
) -> CallResult<(CanisterIdRecord,)> {
    ic_cdk::api::print(format!(
        "ic_cdk::api::caller(): {:?}",
        ic_cdk::api::caller().to_string()
    ));

    let first_setting = CanisterSettings {
        controllers: Some(vec![ic_cdk::id(), ic_cdk::api::caller()]),
        compute_allocation: insert_project_arg.compute_allocation,
        memory_allocation: insert_project_arg.memory_allocation,
        freezing_threshold: insert_project_arg.freezing_threshold,
    };
    for principal in first_setting.controllers.clone().unwrap() {
        ic_cdk::api::print(format!(
            "principal.to_string(): {:?}",
            principal.to_string()
        ));
    }

    let arg = CreateCanisterArgument {
        settings: Some(first_setting),
    };
    let created_canister_result =
        create_canister_with_extra_cycles(arg, insert_project_arg.with_extra_cycles).await;

    // let arg = CreateCanisterArgument { settings: None };
    // ic_cdk::api::print(format!("arg: {:?}", arg));
    // let created_canister_result =
    //     create_canister_with_extra_cycles(arg, 50_000_000_000_000u128).await;

    match created_canister_result {
        Ok(created_canister) => {
            let canister_id = created_canister.0.canister_id;
            ic_cdk::api::print(format!("canister_id: {:?}", canister_id));

            let arg = CanisterIdRecord { canister_id };
            ic_cdk::api::print(format!("CanisterIdRecord arg: {:?}", arg));

            let canister_status_result = canister_status(arg).await;
            ic_cdk::api::print(format!(
                "canister_status_result: {:?}",
                canister_status_result
            ));

            match canister_status_result {
                Ok(response) => {
                    ic_cdk::api::print(format!(
                        "response.0.settings.controllers.0.to_string(): {:?}",
                        response.0.settings.controllers[0].to_string()
                    ));
                    let canister_state = CanistersState {
                        canister_id: canister_id,
                        project_name: insert_project_arg.project_name,
                        created_canister: Some(response.0),
                        logo_url: Some(insert_project_arg.logo_url),
                        description: Some(insert_project_arg.description),
                        created_at: candid::Nat::from(time()),
                        updated_at: candid::Nat::from(time()),
                    };
                    let insert_result = store::insert(canister_id, canister_state);
                    ic_cdk::api::print(format!("insert_result: {:?}", insert_result));
                    created_canister_result
                }
                Err(err) => Err(err),
            }
        }
        Err(err) => Err(err),
    }
}

#[ic_cdk_macros::update]
#[candid::candid_method(update)]
async fn execute_get_canister_status(
    canister_id: CanisterId,
) -> Result<(CanisterStatusResponse,), (RejectionCode, String)> {
    let arg = CanisterIdRecord { canister_id };
    ic_cdk::api::print(format!("CanisterIdRecord arg: {:?}", arg));

    let canister_status_result = canister_status(arg).await;
    ic_cdk::api::print(format!("response: {:?}", canister_status_result));

    match canister_status_result {
        Ok(response) => Ok(response),
        Err(err) => Err(err),
    }
}

#[ic_cdk_macros::query]
#[candid::candid_method(query)]
async fn get_canister_items() -> Vec<StableBTreeMapCanistersItemType> {
    store::items()
}

#[ic_cdk_macros::query]
#[candid::candid_method(query)]
fn get_canister_keys() -> Vec<StableBTreeMapCanistersKeyType> {
    store::keys()
}

#[ic_cdk_macros::query]
#[candid::candid_method(query)]
fn get_canister_values() -> Vec<StableBTreeMapCanistersValueType> {
    store::values()
}

#[ic_cdk_macros::query]
#[candid::candid_method(query)]
fn get_canisters(key: candid::Principal) -> Option<StableBTreeMapCanistersValueType> {
    store::get(key)
}

#[ic_cdk_macros::update]
#[candid::candid_method(update)]
async fn execute_start_canister(
    canister_id: CanisterId,
) -> Result<(CanisterStatusResponse,), (RejectionCode, String)> {
    let mut project_canister = CanistersState {
        canister_id: canister_id,
        project_name: "dumy project name".to_string(),
        created_canister: None,
        logo_url: Some("https://example.com".to_string()),
        description: Some("test description".to_string()),
        created_at: candid::Nat::from(time()),
        updated_at: candid::Nat::from(time()),
    };
    let canister_get_result = store::get(canister_id);
    let canister_exist = match canister_get_result {
        Some(canister_data) => {
            project_canister = canister_data.0;
            // project_name = canister_data.0.project_name;
            true
        }
        None => false,
    };
    if !canister_exist {
        return Err((
            RejectionCode::CanisterReject,
            "canister id not found.".to_string(),
        ));
    }

    let arg = CanisterIdRecord { canister_id };
    ic_cdk::api::print(format!("CanisterIdRecord arg: {:?}", arg));

    let start_canister_result = start_canister(arg).await;
    ic_cdk::api::print(format!(
        "start_canister_result: {:?}",
        start_canister_result
    ));

    match start_canister_result {
        Ok(_res) => {
            let canister_status_result = canister_status(arg).await;
            ic_cdk::api::print(format!(
                "canister_status_result: {:?}",
                canister_status_result
            ));

            // clone() to use canister_status_result in retuen Check match with
            match canister_status_result.clone() {
                Ok(response) => {
                    project_canister.created_canister = Some(response.0);
                    project_canister.updated_at = candid::Nat::from(time());
                    let insert_result = store::insert(canister_id, project_canister);
                    ic_cdk::api::print(format!("insert_result: {:?}", insert_result));
                    canister_status_result
                }
                Err(err) => Err(err),
            }
        }
        Err(err) => Err(err),
    }
}

#[ic_cdk_macros::update]
#[candid::candid_method(update)]
async fn execute_stop_canister(
    canister_id: CanisterId,
) -> Result<(CanisterStatusResponse,), (RejectionCode, String)> {
    let mut project_canister = CanistersState {
        canister_id: canister_id,
        project_name: "dumy project name".to_string(),
        created_canister: None,
        logo_url: Some("https://example.com".to_string()),
        description: Some("dumy description".to_string()),
        created_at: candid::Nat::from(time()),
        updated_at: candid::Nat::from(time()),
    };
    let canister_get_result = store::get(canister_id);
    let canister_exist = match canister_get_result {
        Some(canister_data) => {
            project_canister = canister_data.0;
            // project_name = canister_data.0.project_name;
            true
        }
        None => false,
    };
    if !canister_exist {
        return Err((
            RejectionCode::CanisterReject,
            "canister id not found.".to_string(),
        ));
    }

    let arg = CanisterIdRecord { canister_id };
    ic_cdk::api::print(format!("CanisterIdRecord arg: {:?}", arg));

    let stop_canister_result = stop_canister(arg).await;
    ic_cdk::api::print(format!("stop_canister_result: {:?}", stop_canister_result));

    match stop_canister_result {
        Ok(_res) => {
            let canister_status_result = canister_status(arg).await;
            ic_cdk::api::print(format!(
                "canister_status_result: {:?}",
                canister_status_result
            ));

            // clone() to use canister_status_result in retuen Check match with
            match canister_status_result.clone() {
                Ok(response) => {
                    project_canister.created_canister = Some(response.0);
                    project_canister.updated_at = candid::Nat::from(time());

                    let insert_result = store::insert(canister_id, project_canister);
                    ic_cdk::api::print(format!("insert_result: {:?}", insert_result));
                    canister_status_result
                }
                Err(err) => Err(err),
            }
        }
        Err(err) => Err(err),
    }
}

#[ic_cdk_macros::update]
#[candid::candid_method(update)]
async fn execute_delete_canister(
    canister_id: CanisterId,
) -> Result<(StableBTreeMapCanistersValueType,), (RejectionCode, String)> {
    let arg = CanisterIdRecord { canister_id };
    ic_cdk::api::print(format!("CanisterIdRecord arg: {:?}", arg));

    let delete_canister_result = delete_canister(arg).await;
    match delete_canister_result {
        Ok(_res) => {
            let canister_data_remove_result = store::remove(canister_id);
            match canister_data_remove_result {
                Some(deleted_canister_value) => Ok((deleted_canister_value,)),
                None => Err((
                    RejectionCode::CanisterError,
                    "Failed to delete canister data.".to_string(),
                )),
            }
        }
        Err(err) => Err(err),
    }
}

#[ic_cdk_macros::update]
#[candid::candid_method(update)]
async fn execute_install_code(
    canister_id: Principal,
    wasm_module: Vec<u8>,
) -> Result<(CanisterStatusResponse,), (RejectionCode, String)> {
    let mut project_canister = CanistersState {
        canister_id: canister_id,
        project_name: "dumy project name".to_string(),
        created_canister: None,
        logo_url: Some("https://example.com".to_string()),
        description: Some("dumy description".to_string()),
        created_at: candid::Nat::from(time()),
        updated_at: candid::Nat::from(time()),
    };
    let canister_get_result = store::get(canister_id);
    let canister_exist = match canister_get_result {
        Some(canister_data) => {
            project_canister = canister_data.0;
            true
        }
        None => false,
    };
    if !canister_exist {
        return Err((
            RejectionCode::CanisterReject,
            "canister id not found.".to_string(),
        ));
    }

    let install_arg = InstallCodeArgument {
        mode: CanisterInstallMode::Install,
        canister_id,
        // A minimal valid wasm module
        // wat2wasm "(module)"
        wasm_module: wasm_module,
        arg: vec![],
    };
    ic_cdk::api::print(format!("install_code install_arg: {:?}", install_arg));

    let install_code_result = install_code(install_arg).await;
    ic_cdk::api::print(format!("install_code_result: {:?}", install_code_result));

    match install_code_result {
        Ok(_res) => {
            let arg = CanisterIdRecord { canister_id };
            let canister_status_result = canister_status(arg).await;
            ic_cdk::api::print(format!(
                "canister_status_result: {:?}",
                canister_status_result
            ));

            // clone() to use canister_status_result in retuen Check match with
            match canister_status_result.clone() {
                Ok(response) => {
                    project_canister.created_canister = Some(response.0);
                    project_canister.updated_at = candid::Nat::from(time());

                    let insert_result = store::insert(canister_id, project_canister);
                    ic_cdk::api::print(format!("insert_result: {:?}", insert_result));
                    canister_status_result
                }
                Err(err) => Err(err),
            }
        }
        Err(err) => Err(err),
    }
}

// #[ic_cdk_macros::update]
// #[candid::candid_method(update)]
// async fn execute_uninstall_code(canister_id: Principal) -> CallResult<()> {
//     let arg = InstallCodeArgument {
//         mode: CanisterInstallMode::Install,
//         canister_id,
//         // A minimal valid wasm module
//         // wat2wasm "(module)"
//         wasm_module: b"\x00asm\x01\x00\x00\x00".to_vec(),
//         arg: vec![],
//     };
//     ic_cdk::api::print(format!("install_code arg: {:?}", arg));

//     let install_code_result = install_code(arg).await;
//     ic_cdk::api::print(format!("install_code_result: {:?}", install_code_result));
//     install_code_result
// }

#[ic_cdk_macros::update]
#[candid::candid_method(update)]
async fn execute_main_methods() {
    let arg = CreateCanisterArgument {
        settings: Some(CanisterSettings {
            controllers: Some(vec![ic_cdk::id()]),
            compute_allocation: Some(0.into()),
            memory_allocation: Some(10000.into()),
            freezing_threshold: Some(10000.into()),
        }),
    };
    ic_cdk::api::print(format!("arg: {:?}", arg));

    let created_canister = create_canister(arg).await.unwrap();
    ic_cdk::api::print(format!("created_canister: {:?}", created_canister));

    let canister_id =
        create_canister_with_extra_cycles(CreateCanisterArgument::default(), 1_000_000_000_000u128)
            .await
            .unwrap()
            .0
            .canister_id;
    ic_cdk::api::print(format!("canister_id: {:?}", canister_id));

    let arg = UpdateSettingsArgument {
        canister_id,
        settings: CanisterSettings::default(),
    };
    ic_cdk::api::print(format!("update arg: {:?}", arg));
    let update_settings_result = update_settings(arg).await.unwrap();
    ic_cdk::api::print(format!(
        "update_settings_result: {:?}",
        update_settings_result
    ));

    let arg = InstallCodeArgument {
        mode: CanisterInstallMode::Install,
        canister_id,
        // A minimal valid wasm module
        // wat2wasm "(module)"
        wasm_module: b"\x00asm\x01\x00\x00\x00".to_vec(),
        arg: vec![],
    };
    ic_cdk::api::print(format!("install_code arg: {:?}", arg));

    let install_code_result = install_code(arg).await.unwrap();
    ic_cdk::api::print(format!("install_code_result: {:?}", install_code_result));

    let arg = CanisterIdRecord { canister_id };
    ic_cdk::api::print(format!("CanisterIdRecord arg: {:?}", arg));

    let response = canister_status(arg).await.unwrap().0;
    ic_cdk::api::print(format!("response: {:?}", response));

    let uninstall_code_result = uninstall_code(arg).await.unwrap();
    ic_cdk::api::print(format!(
        "uninstall_code_result: {:?}",
        uninstall_code_result
    ));

    let start_canister_result = start_canister(arg).await.unwrap();
    ic_cdk::api::print(format!(
        "start_canister_result: {:?}",
        start_canister_result
    ));

    let stop_canister_result = stop_canister(arg).await.unwrap();
    ic_cdk::api::print(format!("stop_canister_result: {:?}", stop_canister_result));

    let response = canister_status(arg).await.unwrap().0;
    ic_cdk::api::print(format!("response: {:?}", response));

    assert_eq!(response.status, CanisterStatusType::Stopped);

    let deposit_cycles_result = deposit_cycles(arg, 1_000_000_000_000u128).await.unwrap();
    ic_cdk::api::print(format!(
        "deposit_cycles_result: {:?}",
        deposit_cycles_result
    ));

    let delete_canister_result = delete_canister(arg).await.unwrap();
    ic_cdk::api::print(format!(
        "delete_canister_result: {:?}",
        delete_canister_result
    ));

    let response = raw_rand().await.unwrap().0;
    ic_cdk::api::print(format!("response: {:?}", response));

    assert_eq!(response.len(), 32);
}

candid::export_service!();
#[ic_cdk_macros::query(name = "__get_candid_interface_tmp_hack")]
fn export_candid() -> String {
    __export_service()
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    #[ignore]
    fn _write_candid_to_disk() {
        std::fs::write("management_canister.did", export_candid()).unwrap();
    }
}

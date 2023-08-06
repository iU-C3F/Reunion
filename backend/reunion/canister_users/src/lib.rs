use candid::{CandidType, Decode, Deserialize, Encode};
use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory};
use ic_stable_structures::{BoundedStorable, DefaultMemoryImpl, StableBTreeMap, Storable};
use std::{
    borrow::Cow,
    cell::RefCell,
    cmp::{Eq, Ord, PartialEq, PartialOrd},
};

type Memory = VirtualMemory<DefaultMemoryImpl>;

const MAX_SIZE_USERS_KEY: u32 = 100u32;
const MAX_SIZE_USERS_VALUE: u32 = 4000u32;

#[derive(Ord, PartialOrd, Eq, PartialEq, Clone, serde::Deserialize, Debug, CandidType)]
struct User {
    id: candid::Principal,
    icon_url: String,
    display_name: String,
    user_name: String,
    self_introduction: Option<String>,
    homepage_url: Option<String>,
    twitter_url: Option<String>,
    youtube_url: Option<String>,
    tiktok_url: Option<String>,
    created_at: candid::Nat,
    updated_at: candid::Nat,
    delete_flg: bool,
}

#[derive(CandidType, Eq, Ord, PartialOrd, PartialEq, Deserialize, Clone, Debug)]
struct StableBTreeMapUsersKeyType(candid::Principal);

impl Storable for StableBTreeMapUsersKeyType {
    fn to_bytes(&self) -> std::borrow::Cow<[u8]> {
        Cow::Owned(candid::Encode!(self).unwrap())
    }
    fn from_bytes(bytes: Cow<'_, [u8]>) -> Self {
        candid::Decode!(&bytes, Self).unwrap()
    }
}
impl BoundedStorable for StableBTreeMapUsersKeyType {
    const MAX_SIZE: u32 = MAX_SIZE_USERS_KEY;
    const IS_FIXED_SIZE: bool = false;
}

#[derive(CandidType, Ord, PartialOrd, Eq, PartialEq, Debug, Clone, Deserialize)]
struct StableBTreeMapUsersValueType(User);

impl Storable for StableBTreeMapUsersValueType {
    fn to_bytes(&self) -> std::borrow::Cow<[u8]> {
        Cow::Owned(candid::Encode!(self).unwrap())
    }
    fn from_bytes(bytes: Cow<'_, [u8]>) -> Self {
        candid::Decode!(&bytes, Self).unwrap()
    }
}
impl BoundedStorable for StableBTreeMapUsersValueType {
    const MAX_SIZE: u32 = MAX_SIZE_USERS_VALUE;
    const IS_FIXED_SIZE: bool = false;
}

#[derive(CandidType, Ord, PartialOrd, Eq, PartialEq, Debug, Clone, Deserialize)]
struct StableBTreeMapUsersItemType(StableBTreeMapUsersKeyType, StableBTreeMapUsersValueType);

thread_local! {
    // The memory manager is used for simulating multiple memories. Given a `MemoryId` it can
    // return a memory that can be used by stable structures.
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> =
        RefCell::new(MemoryManager::init(DefaultMemoryImpl::default()));

    static MAP_USERS: RefCell<StableBTreeMap<StableBTreeMapUsersKeyType, StableBTreeMapUsersValueType, Memory>> =
    RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(1u8))),
        )
    );
}

/// Retrieves the value associated with the given key if it exists.
fn contains_key(key: candid::Principal) -> bool {
    MAP_USERS.with(|p| p.borrow().contains_key(&StableBTreeMapUsersKeyType(key)))
}
#[ic_cdk_macros::query]
#[candid::candid_method(query)]
fn users_contains_key(key: candid::Principal) -> bool {
    contains_key(key)
}
// ===========================================

// get user data
fn get(key: candid::Principal) -> Option<StableBTreeMapUsersValueType> {
    MAP_USERS.with(|p| p.borrow().get(&StableBTreeMapUsersKeyType(key)))
}
#[ic_cdk_macros::query]
#[candid::candid_method(query)]
fn users_get(key: candid::Principal) -> Option<StableBTreeMapUsersValueType> {
    get(key)
}
// ===========================================

// check btreemap is empty
fn is_empty() -> bool {
    MAP_USERS.with(|p| p.borrow().is_empty())
}
#[ic_cdk_macros::query]
#[candid::candid_method(query)]
fn users_is_empty() -> bool {
    is_empty()
}
// ===========================================

// get btreemap length
fn len() -> u64 {
    MAP_USERS.with(|p| p.borrow().len())
}
#[ic_cdk_macros::query]
#[candid::candid_method(query)]
fn users_len() -> u64 {
    len()
}
// ===========================================

// remove user data
fn remove(key: candid::Principal) -> Option<StableBTreeMapUsersValueType> {
    MAP_USERS.with(|p| p.borrow_mut().remove(&StableBTreeMapUsersKeyType(key)))
}
#[ic_cdk_macros::update]
#[candid::candid_method(update)]
fn users_remove(key: candid::Principal) -> Option<StableBTreeMapUsersValueType> {
    remove(key)
}
// ===========================================

// users registe validation check
#[ic_cdk_macros::query]
#[candid::candid_method(query)]
fn users_registe_validation_check(
    key: candid::Principal,
    value: User,
) -> Result<(candid::Principal, User), String> {
    let mut error_message = String::new();

    // Registered check for key
    let result_contains_key = contains_key(key);
    if result_contains_key {
        error_message.push_str("already registered. ");
    };
    // ====================

    // Check key size
    let key_cloned = StableBTreeMapUsersKeyType(key);
    let key_bytes = key_cloned.to_bytes();
    if MAX_SIZE_USERS_KEY as usize <= key_bytes.len() {
        error_message.push_str(&format!(
            "Key is too large. Expected <= {} bytes, found {} bytes. ",
            MAX_SIZE_USERS_KEY,
            key_bytes.len()
        ));
    }

    // Check value size
    let value_cloned = StableBTreeMapUsersValueType(value.clone());
    let value_bytes = value_cloned.to_bytes();
    if MAX_SIZE_USERS_VALUE as usize <= value_bytes.len() {
        error_message.push_str(&format!(
            "Value is too large. Expected <= {} bytes, found {} bytes. ",
            MAX_SIZE_USERS_VALUE,
            value_bytes.len()
        ));
    }

    // user_name duplication check
    let user_name_check_bool = user_name_duplicate_check(value.user_name.clone());
    if user_name_check_bool {
        error_message.push_str("user_name is already in use. ");
    }

    if error_message == String::new() {
        Ok((key, value))
    } else {
        Err(error_message)
    }
}
// ===========================================

// users registe validation check
#[ic_cdk_macros::query]
#[candid::candid_method(query)]
fn users_update_validation_check(
    key: candid::Principal,
    value: User,
) -> Result<(candid::Principal, User), String> {
    let mut error_message = String::new();

    // Registered check for key
    let result_contains_key = contains_key(key);
    if !result_contains_key {
        error_message.push_str("registration does not exist. ");
    };
    // ====================

    // Check key size
    let key_cloned = StableBTreeMapUsersKeyType(key);
    let key_bytes = key_cloned.to_bytes();
    if MAX_SIZE_USERS_KEY as usize <= key_bytes.len() {
        error_message.push_str(&format!(
            "Key is too large. Expected <= {} bytes, found {} bytes. ",
            MAX_SIZE_USERS_KEY,
            key_bytes.len()
        ));
    }

    // Check value size
    let value_cloned = StableBTreeMapUsersValueType(value.clone());
    let value_bytes = value_cloned.to_bytes();
    if MAX_SIZE_USERS_VALUE as usize <= value_bytes.len() {
        error_message.push_str(&format!(
            "Value is too large. Expected <= {} bytes, found {} bytes. ",
            MAX_SIZE_USERS_VALUE,
            value_bytes.len()
        ));
    }

    if error_message == String::new() {
        Ok((key, value))
    } else {
        Err(error_message)
    }
}
// ===========================================

// registe or update user data
fn insert(key: candid::Principal, value: User) -> Option<StableBTreeMapUsersValueType> {
    MAP_USERS.with(|p| {
        p.borrow_mut().insert(
            StableBTreeMapUsersKeyType(key),
            StableBTreeMapUsersValueType(value),
        )
    })
}
#[ic_cdk_macros::update]
#[candid::candid_method(update)]
fn users_insert(key: candid::Principal, value: User) -> Option<StableBTreeMapUsersValueType> {
    insert(key, value)
}
// ===========================================

// get users data key and value
fn items() -> Vec<StableBTreeMapUsersItemType> {
    MAP_USERS.with(|p| {
        p.borrow()
            .iter()
            .map(|(key, value)| StableBTreeMapUsersItemType(key, value))
            .collect()
    })
}
#[ic_cdk_macros::query]
#[candid::candid_method(query)]
fn users_items() -> Vec<StableBTreeMapUsersItemType> {
    items()
}
// ===========================================

// get users data key only
fn keys() -> Vec<StableBTreeMapUsersKeyType> {
    MAP_USERS.with(|p| p.borrow().iter().map(|(key, _value)| (key)).collect())
}
#[ic_cdk_macros::query]
#[candid::candid_method(query)]
fn users_keys() -> Vec<StableBTreeMapUsersKeyType> {
    keys()
}
// ===========================================

// get users data value only
fn values() -> Vec<StableBTreeMapUsersValueType> {
    MAP_USERS.with(|p| p.borrow().iter().map(|(_key, value)| (value)).collect())
}
#[ic_cdk_macros::query]
#[candid::candid_method(query)]
fn users_values() -> Vec<StableBTreeMapUsersValueType> {
    values()
}
// ===========================================

// user_name duplicate check
fn user_name_duplicate_check(user_name: String) -> bool {
    let mut result = false;

    let values = values();
    for value in values {
        if value.0.user_name == user_name {
            result = true;
            break;
        }
    }

    result
}

#[ic_cdk_macros::query]
#[candid::candid_method(query)]
fn users_user_name_duplicate_check(user_name: String) -> bool {
    user_name_duplicate_check(user_name)
}

// ===========================================

// Generate candid file automatically
// run "cargo test" or "dfx canister call <canister_name> __get_candid_interface_tmp_hack"
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
        std::fs::write("canister_users.did", export_candid()).unwrap();
    }

    // utility function to generate a test user
    fn generate_user(id: &str, delete_flg: bool) -> User {
        User {
            id: candid::Principal::from_text(id).unwrap(),
            icon_url: "https://example.com/icon".to_string(),
            display_name: "display name".to_string(),
            user_name: "user name".to_string(),
            self_introduction: Some("self introduction".to_string()),
            homepage_url: Some("https://example.com/home".to_string()),
            twitter_url: Some("https://twitter.com/username".to_string()),
            youtube_url: Some("https://youtube.com/username".to_string()),
            tiktok_url: Some("https://tiktok.com/username".to_string()),
            created_at: candid::Nat::from(1),
            updated_at: candid::Nat::from(1),
            delete_flg,
        }
    }

    #[test]
    fn test_users_is_empty() {
        // Test when the map is empty
        let result1 = users_is_empty();
        assert!(result1);

        // insert test user
        let id1 = "6wly3-nm3hp-ca4sg-zk4jm-qsodx-ulsvl-ujous-7link-5yrkc-xt4c5-uae";
        let user1 = generate_user(id1, false);
        users_insert(candid::Principal::from_text(id1).unwrap(), user1.clone());

        // not empty
        let result2 = users_is_empty();
        assert!(!result2);
    }

    #[test]
    fn test_users_len() {
        // Test when the map length
        let result = users_len();
        assert_eq!(result, 0);

        // insert test user
        let id1 = "6wly3-nm3hp-ca4sg-zk4jm-qsodx-ulsvl-ujous-7link-5yrkc-xt4c5-uae";
        let user1 = generate_user(id1, false);
        users_insert(candid::Principal::from_text(id1).unwrap(), user1.clone());

        // length is one
        let result = users_len();
        assert_eq!(result, 1);
    }

    #[test]
    fn test_users_contains_key() {
        // user data settings
        let id = "6wly3-nm3hp-ca4sg-zk4jm-qsodx-ulsvl-ujous-7link-5yrkc-xt4c5-uae";
        let user = generate_user(id, false);

        // Before registration
        let result = users_contains_key(user.id);
        assert!(!result);

        users_insert(candid::Principal::from_text(id).unwrap(), user.clone());

        // After registration
        let result = users_contains_key(user.id);
        assert!(result);
    }

    #[test]
    fn test_users_insert_and_get() {
        // user data settings
        let id = "6wly3-nm3hp-ca4sg-zk4jm-qsodx-ulsvl-ujous-7link-5yrkc-xt4c5-uae";
        let user = generate_user(id, false);

        // Before registration
        let result1 = users_contains_key(user.id);
        assert!(!result1);

        users_insert(candid::Principal::from_text(id).unwrap(), user.clone());

        // After registration
        let result2 = users_contains_key(user.id);
        assert!(result2);

        // Check that the registered user and generate_user are the same value
        let result3 = users_get(user.id).unwrap().0;
        assert_eq!(result3, user);
    }

    #[test]
    fn test_users_remove() {
        // user data settings
        let id = "6wly3-nm3hp-ca4sg-zk4jm-qsodx-ulsvl-ujous-7link-5yrkc-xt4c5-uae";
        let user = generate_user(id, false);
        let key = user.id.clone();

        users_insert(candid::Principal::from_text(id).unwrap(), user.clone());

        // Confirm existence of registered user
        let result = users_get(user.id).unwrap().0;
        assert_eq!(result, user);
        assert_eq!(contains_key(key.clone()), true);

        // Test the function
        users_remove(key.clone());
        assert_eq!(users_get(key.clone()), None);
        assert_eq!(contains_key(key.clone()), false);

        // Test removing a non-existent user
        let non_existent_key = candid::Principal::anonymous();
        assert!(users_remove(non_existent_key).is_none());
    }

    #[test]
    fn test_users_keys() {
        // user data settings
        let id1 = "6wly3-nm3hp-ca4sg-zk4jm-qsodx-ulsvl-ujous-7link-5yrkc-xt4c5-uae";
        let user1 = generate_user(id1, false);

        let id2 = "qglqi-4qvds-fg3h5-j3t6g-6n7xm-mhoph-dcglp-oblas-vefiv-sstjq-kae";
        let user2 = generate_user(id2, false);

        let id3 = "fphii-vzpbh-lm7be-ysleh-qtlkf-ma3ta-wqdgp-jyi4r-wlojn-w37ot-4ae";
        let user3 = generate_user(id3, false);

        // insert test data to btreemap
        users_insert(candid::Principal::from_text(id1).unwrap(), user1.clone());
        users_insert(candid::Principal::from_text(id2).unwrap(), user2.clone());
        users_insert(candid::Principal::from_text(id3).unwrap(), user3.clone());

        // expected values
        let mut expected_keys = vec![
            StableBTreeMapUsersKeyType(user1.id),
            StableBTreeMapUsersKeyType(user2.id),
            StableBTreeMapUsersKeyType(user3.id),
        ];

        // actual values
        let mut actual_keys = users_keys();

        expected_keys.sort();
        actual_keys.sort();

        // check actual values
        assert_eq!(expected_keys, actual_keys);
    }

    #[test]
    fn test_users_values() {
        // user data settings
        let id1 = "6wly3-nm3hp-ca4sg-zk4jm-qsodx-ulsvl-ujous-7link-5yrkc-xt4c5-uae";
        let user1 = generate_user(id1, false);

        let id2 = "qglqi-4qvds-fg3h5-j3t6g-6n7xm-mhoph-dcglp-oblas-vefiv-sstjq-kae";
        let user2 = generate_user(id2, false);

        let id3 = "fphii-vzpbh-lm7be-ysleh-qtlkf-ma3ta-wqdgp-jyi4r-wlojn-w37ot-4ae";
        let user3 = generate_user(id3, false);

        // insert test data to btreemap
        users_insert(candid::Principal::from_text(id1).unwrap(), user1.clone());
        users_insert(candid::Principal::from_text(id2).unwrap(), user2.clone());
        users_insert(candid::Principal::from_text(id3).unwrap(), user3.clone());

        // expected values
        let mut expected_values = vec![
            StableBTreeMapUsersValueType(user1),
            StableBTreeMapUsersValueType(user2),
            StableBTreeMapUsersValueType(user3),
        ];

        // actual values
        let mut actual_values = users_values();

        expected_values.sort();
        actual_values.sort();

        // check actual values
        assert_eq!(expected_values, actual_values);
    }

    #[test]
    fn test_users_items() {
        // user data settings
        let id1 = "6wly3-nm3hp-ca4sg-zk4jm-qsodx-ulsvl-ujous-7link-5yrkc-xt4c5-uae";
        let user1 = generate_user(id1, false);

        let id2 = "qglqi-4qvds-fg3h5-j3t6g-6n7xm-mhoph-dcglp-oblas-vefiv-sstjq-kae";
        let user2 = generate_user(id2, false);

        let id3 = "fphii-vzpbh-lm7be-ysleh-qtlkf-ma3ta-wqdgp-jyi4r-wlojn-w37ot-4ae";
        let user3 = generate_user(id3, false);

        // insert test data to btreemap
        users_insert(candid::Principal::from_text(id1).unwrap(), user1.clone());
        users_insert(candid::Principal::from_text(id2).unwrap(), user2.clone());
        users_insert(candid::Principal::from_text(id3).unwrap(), user3.clone());

        // expected values
        let mut expected_items = vec![
            StableBTreeMapUsersItemType(
                StableBTreeMapUsersKeyType(user1.id),
                StableBTreeMapUsersValueType(user1),
            ),
            StableBTreeMapUsersItemType(
                StableBTreeMapUsersKeyType(user2.id),
                StableBTreeMapUsersValueType(user2),
            ),
            StableBTreeMapUsersItemType(
                StableBTreeMapUsersKeyType(user3.id),
                StableBTreeMapUsersValueType(user3),
            ),
        ];

        // actual values
        let mut actual_items = users_items();

        expected_items.sort();
        actual_items.sort();

        // check actual values
        assert_eq!(expected_items, actual_items);
    }
}
// ===========================================

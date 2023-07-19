use candid::{CandidType, Decode, Deserialize, Encode, Principal};
use ic_cdk::api::management_canister::main::*;
use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory};
use ic_stable_structures::{BoundedStorable, DefaultMemoryImpl, StableBTreeMap, Storable};
use std::{
    borrow::Cow,
    cell::RefCell,
    cmp::{Eq, Ord, PartialEq, PartialOrd},
};

type Memory = VirtualMemory<DefaultMemoryImpl>;

const MAX_SIZE_CANISTERS_KEY: u32 = 100u32;
const MAX_SIZE_CANISTERS_VALUE: u32 = 4000u32;

#[derive(Ord, PartialOrd, Eq, PartialEq, Clone, Deserialize, Debug, CandidType)]
pub struct CanistersState {
    pub canister_id: Principal,
    pub project_name: String,
    pub created_canister: Option<CanisterStatusResponse>,
    pub logo_url: Option<String>,
    pub description: Option<String>,
    pub created_at: candid::Nat,
    pub updated_at: candid::Nat,
}

#[derive(CandidType, Eq, Ord, PartialOrd, PartialEq, Deserialize, Clone, Debug)]
pub struct StableBTreeMapCanistersKeyType(pub Principal);

impl Storable for StableBTreeMapCanistersKeyType {
    fn to_bytes(&self) -> std::borrow::Cow<[u8]> {
        Cow::Owned(candid::Encode!(self).unwrap())
    }
    fn from_bytes(bytes: Cow<'_, [u8]>) -> Self {
        candid::Decode!(&bytes, Self).unwrap()
    }
}
impl BoundedStorable for StableBTreeMapCanistersKeyType {
    const MAX_SIZE: u32 = MAX_SIZE_CANISTERS_KEY;
    const IS_FIXED_SIZE: bool = false;
}

#[derive(CandidType, Ord, PartialOrd, Eq, PartialEq, Debug, Clone, Deserialize)]
pub struct StableBTreeMapCanistersValueType(pub CanistersState);

impl Storable for StableBTreeMapCanistersValueType {
    fn to_bytes(&self) -> std::borrow::Cow<[u8]> {
        Cow::Owned(candid::Encode!(self).unwrap())
    }
    fn from_bytes(bytes: Cow<'_, [u8]>) -> Self {
        candid::Decode!(&bytes, Self).unwrap()
    }
}
impl BoundedStorable for StableBTreeMapCanistersValueType {
    const MAX_SIZE: u32 = MAX_SIZE_CANISTERS_VALUE;
    const IS_FIXED_SIZE: bool = false;
}

#[derive(CandidType, Ord, PartialOrd, Eq, PartialEq, Debug, Clone, Deserialize)]
pub struct StableBTreeMapCanistersItemType(
    StableBTreeMapCanistersKeyType,
    StableBTreeMapCanistersValueType,
);

thread_local! {
    // The memory manager is used for simulating multiple memories. Given a `MemoryId` it can
    // return a memory that can be used by stable structures.
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> =
        RefCell::new(MemoryManager::init(DefaultMemoryImpl::default()));

    static MAP_CANISTERS: RefCell<StableBTreeMap<StableBTreeMapCanistersKeyType, StableBTreeMapCanistersValueType, Memory>> =
    RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(1u8))),
        )
    );
}

// registe or update canister data
pub fn insert(
    key: candid::Principal,
    value: CanistersState,
) -> Option<StableBTreeMapCanistersValueType> {
    MAP_CANISTERS.with(|p| {
        p.borrow_mut().insert(
            StableBTreeMapCanistersKeyType(key),
            StableBTreeMapCanistersValueType(value),
        )
    })
}

// get canisters data key and value
pub fn items() -> Vec<StableBTreeMapCanistersItemType> {
    MAP_CANISTERS.with(|p| {
        p.borrow()
            .iter()
            .map(|(key, value)| StableBTreeMapCanistersItemType(key, value))
            .collect()
    })
}
// ===========================================

// get canisters data key only
pub fn keys() -> Vec<StableBTreeMapCanistersKeyType> {
    MAP_CANISTERS.with(|p| p.borrow().iter().map(|(key, _value)| (key)).collect())
}
// ===========================================

// get canisters data value only
pub fn values() -> Vec<StableBTreeMapCanistersValueType> {
    MAP_CANISTERS.with(|p| p.borrow().iter().map(|(_key, value)| (value)).collect())
}
// ===========================================

// get user data
pub fn get(key: candid::Principal) -> Option<StableBTreeMapCanistersValueType> {
    MAP_CANISTERS.with(|p| p.borrow().get(&StableBTreeMapCanistersKeyType(key)))
}
// ===========================================

// remove user data
pub fn remove(key: candid::Principal) -> Option<StableBTreeMapCanistersValueType> {
    MAP_CANISTERS.with(|p| p.borrow_mut().remove(&StableBTreeMapCanistersKeyType(key)))
}
// ===========================================

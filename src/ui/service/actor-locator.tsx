// const canisterId_hello = process.env.NEXT_PUBLIC_HELLO_CANISTER_ID as String;
const canisterId_users = process.env.NEXT_PUBLIC_CANISTER_USERS_CANISTER_ID as String;
const canisterId_management_canister = process.env.NEXT_PUBLIC_MANAGEMENT_CANISTER_CANISTER_ID as String;
const host = process.env.NEXT_PUBLIC_IC_HOST as String;

// importしたいbackendキャニスターがある場合は
// 以下のimportとexportのセットを記述して、componetやpage側でimportすれば利用可能になる
// 参考：src/ui/components/greetButton.tsx

// hello freeting actor
// import {
//   createActor as createHelloActor
// } from "../../declarations/hello"

// export function makeHelloActor() {
//   return makeActor(canisterId_hello, createHelloActor)
// }
// ===================

// users actor 
import {
  createActor as createUsersActor
} from "../../declarations/canister_users"

export function makeUsersActor(canisterId: String = canisterId_users) {
  return makeActor(canisterId, createUsersActor)
}
// ===================

// management canister actor 
import {
  createActor as createManagementCanisterActor
} from "../../declarations/management_canister"

export function makeManagementCanisterActor(canisterId: String = canisterId_management_canister) {
  return makeActor(canisterId, createManagementCanisterActor)
}
// ===================

export const makeActor = (canisterId: String, createActor: any) => {
  console.log('call makeActor. canisterId: ', canisterId);
  return createActor(canisterId, {
    agentOptions: {
      host: host
    }
  })
}

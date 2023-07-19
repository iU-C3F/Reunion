# Internet Computer with Next.js, TypeScript and Material-ui example

## 1. How to use

Clone repository:
```sh
git clone https://github.com/iU-C3F/Reunion.git
cd Reunion
```

## 2. Installation
### 2-1. dfx
Run the following command to install dfx 0.14.0:
```sh
DFX_VERSION=0.14.0 sh -ci "$(curl -fsSL https://sdk.dfinity.org/install.sh)"
```

### 2-2. nodejs
Install [nodejs](https://nodejs.org/ja/download/) suitable for your environment from this site.
(Requires version ^16.15)

Install node modules:
```sh
yarn install # or npm install
```

### 3. Deployment
#### 3-1. Local Deployment Setting
Start up an IC replica:
```sh
# Open a terminal and navigate to your project's root directory, then run the following command to start a local IC replica
dfx start --clean --background
```

#### 3-2. Production and Staging Deployment Setting
read [this spreadsheet](https://docs.google.com/spreadsheets/d/1E0HpCvUlnmyA7xiuphxULQ321dVuHeCsBC_LBvHwB_4/edit#gid=0)

#### 3-3. Run Canister Deployment Local and Produntion(and Staging)
```sh
./deploy_ic.sh
# Choose your deployment environment:
# 1) local
# 2) ic_demo(require Production and Staging Deployment Setting)
# 3) ic_staging(require Production and Staging Deployment Setting)
```

The following output will be displayed, so connect to the frontend URL
```sh
Deployed canisters.
URLs:
  Frontend canister via browser
    frontend: http://127.0.0.1:4943/?canisterId=rrkah-fqaaa-aaaaa-aaaaq-cai
  Backend canister via Candid interface:
    hello: http://127.0.0.1:4943/?canisterId=r7inp-6aaaa-aaaaa-aaabq-cai&id=ryjl3-tyaaa-aaaaa-aaaba-cai
```

if stop local IC replica.
```sh
dfx stop
```
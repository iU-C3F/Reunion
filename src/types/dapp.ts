export type DappContextType = Dapp | null | undefined;
export type DappsContextType = [Dapps];
export type SocialContextType = Social | null | undefined;

export type Dapps = {
  index: String;
  dapp: Dapp;
}

export type Dapp = {
  logo_url: String,
  project_name: String,
  data_social: Array<Social>,
  category_list: Array<String>,
  description: String,
}

export type Social = {
  name: String,
  url: String,
}
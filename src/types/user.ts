import { Principal } from "@dfinity/principal";

export type UserContextType = User | null | undefined;

export type User = {
  id?: string | Principal,
  iconUrl?: string,
  displayName?: string,
  userName?: string,
  selfIntroduction?: string,
  homePageUrl?: string,
  twitterUrl?: string,
  youtubeUrl?: string,
  tiktokUrl?: string,
  createdAt?: number,
  updatedAt?: number,
  isAuthenticated: Boolean,
}

export type InsertUser = {
  id: Principal,
  icon_url: string,
  display_name: string,
  user_name: string,
  self_introduction: [string] | [],
  homepage_url: [string] | [],
  twitter_url: [string] | [],
  youtube_url: [string] | [],
  tiktok_url: [string] | [],
  created_at: number,
  updated_at?: number,
  delete_flg: Boolean,
}

export type inputProfileForm = {
  id: string,
  iconUrl: string,
  displayName: string,
  userName: string,
  selfIntroduction?: string,
  homePageUrl?: string,
  twitterUrl?: string,
  youtubeUrl?: string,
  tiktokUrl?: string,
}
import type { Identity } from '@dfinity/agent';
import { AuthClient, AuthClientLoginOptions } from '@dfinity/auth-client';
import React from 'react';
export * from './modal';
interface InternetIdentityContextState {
    error: string | null;
    authClient: AuthClient | null;
    identityProvider: string;
    isAuthenticated: boolean;
    identity: Identity | null;
    authenticate: () => Promise<void>;
    signout: () => void;
}
export declare const InternetIdentityContext: React.Context<InternetIdentityContextState>;
interface AuthClientOptions extends Omit<AuthClientLoginOptions, 'onSuccess'> {
    onSuccess?: (identity: Identity) => void;
}
interface InternetIdentityProviderProps {
    authClientOptions?: AuthClientOptions;
}
export declare const InternetIdentityProvider: React.FC<IntrinsicAttributes & InternetIdentityProviderProps>;
export declare const useInternetIdentity: () => InternetIdentityContextState;

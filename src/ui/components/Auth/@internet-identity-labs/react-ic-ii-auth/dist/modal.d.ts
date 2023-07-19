import React from 'react';
interface AuthIframeProps extends React.DetailedHTMLProps<React.IframeHTMLAttributes<HTMLIFrameElement>, HTMLIFrameElement> {
    src: string;
    onLoad: () => void;
}
export declare const AuthIframe: React.FC<AuthIframeProps>;
export {};

import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useInternetIdentity } from "@internet-identity-labs/react-ic-ii-auth";

const AuthGuard = ({ children }: { children: React.ReactNode }): any => {
  // status には、authenticated・unauthenticated・loading のいずれかが格納されます
  const { isAuthenticated } = useInternetIdentity();
  const router = useRouter();
  useEffect(() => {
    if (!isAuthenticated)
      router.push("/");
  }, [router, isAuthenticated]);

  if (isAuthenticated) return children;
};

export default AuthGuard;
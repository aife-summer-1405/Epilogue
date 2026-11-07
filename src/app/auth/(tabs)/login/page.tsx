import { Suspense } from "react";
import LoginForm from "@/components/organisms/authentication/LoginForm";
import LoginToast from "@/components/organisms/authentication/LoginToast";

const LoginPage = () => {
  return (
    <>
      <LoginToast />
      <Suspense>
        <LoginForm />
      </Suspense>
    </>
  );
};

export default LoginPage;

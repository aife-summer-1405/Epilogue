import type { FC, ReactNode } from "react";
import HomeLogo from "@/components/atoms/Logo/home-logo";

interface IProps {
  children: ReactNode;
}

const AuthCard: FC<IProps> = ({ children }) => (
  <div className="w-full sm:px-5 sm:py-8 px-3 py-6 rounded-[24px] bg-default-white flex flex-col items-center justify-center sm:gap-8 gap-4 shadow-[0px_50px_100px_0px_#484848]/16">
    <HomeLogo className="w-fit" />
    {children}
  </div>
);

export default AuthCard;

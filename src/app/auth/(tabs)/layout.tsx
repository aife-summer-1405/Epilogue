import type { FC, ReactNode } from "react";
import AuthShell from "@/components/organisms/authentication/AuthShell";

interface IProps {
  children: ReactNode;
}

const TabsLayout: FC<IProps> = ({ children }) => {
  return <AuthShell>{children}</AuthShell>;
};

export default TabsLayout;

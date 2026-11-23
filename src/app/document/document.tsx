import { getHouseDetailById } from "@/services/panel/buyer/reserveManagement.service";
import { cookies } from "next/headers";
import { getCurrentUserAction } from "../actions/user.actions";
import { FC } from "react";
import DashboardDocumentItem from "./documentItem";

interface IProps {
  houseId: string;
}

const Document: FC<IProps> = async ({ houseId }) => {
  const cookieStore = await cookies();
  const houseDetail = await getHouseDetailById(houseId);
  const accessToken = cookieStore.get("accessToken")?.value;
  let userInfo;
  if (accessToken) {
    userInfo = await getCurrentUserAction();
  }
  return (
    <div className="w-full max-w-2xl mx-auto p-6 space-y-4">
      <DashboardDocumentItem houseDetail={houseDetail} userDetail={userInfo} />
    </div>
  );
};

export default Document;

import { Metadata } from "next";
import Document from "../document";

export const metadata: Metadata = {
  title: "قولنامه",
};

interface IProps {
  params: Promise<{ houseId: string }>;
}

const DocumentContent = async ({ params }: IProps) => {
  const { houseId } = await params;

  return <Document houseId={houseId} />;
};

const DashboardDocumentPage = ({ params }: IProps) => {
  return <DocumentContent params={params} />;
};

export default DashboardDocumentPage;

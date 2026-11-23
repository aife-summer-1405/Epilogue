import {
  getBuyerReservedId,
  getHouseDetailById,
} from "@/services/panel/buyer/reserveManagement.service";
import PaymentAddCart from "./PaymentAddCart";
import { FC } from "react";

interface IProps {
  bookingId: string;
}

const AddPayment: FC<IProps> = async ({ bookingId }) => {
  const getReserveInfo = await getBuyerReservedId(bookingId);
  const { booking } = getReserveInfo;
  const houseDetail = await getHouseDetailById(String(booking.houseId));
  const enrichedData = {
    ...booking,
    houseDetail,
  };

  return (
    <div className="h-full w-full">
      <div className="h-20 bg-[#0076DB] w-full"></div>
      <PaymentAddCart houseInfo={enrichedData} />
    </div>
  );
};

export default AddPayment;

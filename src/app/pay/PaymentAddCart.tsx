"use client";

import Image from "next/image";
import Link from "next/link";
import Sep from "@/app/assets/Image/SepLogo.png";
import Shaparak from "@/app/assets/Image/Shaparak-Logo.png";
import { payReserveRequestById } from "@/services/panel/buyer/reserveManagement.service";
import { toast } from "react-toastify";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cash02Icon,
  LockKeyholeIcon,
  Store02Icon,
} from "@hugeicons/core-free-icons";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PayRequestBody } from "@/core/types/panel/buyer/paymentManagement.types";

export interface IUserReserve {
  id: number;
  user_id: number;
  houseId: number;
  reservedDates: [
    {
      value: string;
      inclusive: true;
    },
    {
      value: string;
      inclusive: false;
    },
  ];
  traveler_details: [
    {
      gender: string;
      lastName: string;
      birthDate: string;
      firstName: string;
      nationalId: string;
    },
  ];
  status: string;
  sharedEmail: string;
  sharedMobile: string;
  createdAt: string;
  updatedAt: string;
  house: {
    title: string;
    price: number;
  };
  houseDetail: {
    id: string;
    title: string;
    address: string;
    photos: string[] | null;
    rate: string | null;
    discounted_price: string | null;
    price: string;
    tags: string[];
    last_updated: string;
    capacity: 5;
    location: {
      lat: number;
      lng: number;
    };
    categories: {
      name: string;
    };
    bathrooms: number;
    parking: number;
    rooms: number;
    yard_type: string;
    num_comments: number;
    discount_id: string | null;
    transaction_type: string;
    sellerId: string;
    sellerName: string;
    caption: string;
    favoriteId: string | null;
    bookings: number;
    isFavorite: boolean;
  };
}

interface IProps {
  houseInfo: IUserReserve;
}

const PaymentAddCart: FC<IProps> = ({ houseInfo }) => {
  const [cardNumber, setCardNumber] = useState("");
  const [description, setDescription] = useState<string | null>();
  const router = useRouter();
  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, "");
    const limited = digits.slice(0, 16);
    const formatted = limited.replace(/(\d{4})(?=\d)/g, "$1 ").trim();

    return formatted;
  };
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const formattedValue = formatCardNumber(rawValue);

    setCardNumber(formattedValue);
  };

  const { mutate: payReserveMutate } = useMutation({
    mutationKey: [`PayRequestReserved`],
    mutationFn: (body: PayRequestBody) => payReserveRequestById(body),
    onMutate: () => {
      toast.loading("درحال ارسال درخواست پرداخت", {
        toastId: "DeletingReserveToast",
      });
    },
    onSuccess: () => {
      toast.update("DeletingReserveToast", {
        render: "پرداخت شما با موفقیت انجام شد منتظر تایید پرداخت باشید",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      router.push(`/document/${houseInfo.houseId}`);
    },
    onError: () => {
      toast.update("DeletingReserveToast", {
        render: "پرداخت با خطا روبرو شد",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    },
  });

  return (
    <div className="flex flex-col gap-2 py-3 px-3 mx-auto -mt-10 max-w-[75%] ">
      <div className="flex flex-row justify-center sm:justify-between py-3 px-3 items-center shadow-[0_5px_10px_rgba(0,0,0,0.1)] bg-white rounded-[16px]">
        <div className="w-25 h-fit sm:flex hidden">
          <Image
            src={Sep}
            alt="Shaparak"
            width={110}
            height={100}
            className="w-full h-full object-contain"
          />
        </div>
        <span className="text-[20px] font-extrabold">
          درگاه پرداخت اینترنتی سپ
        </span>
        <div className="w-25 h-fit p-3 sm:flex hidden">
          <Image
            src={Shaparak}
            alt="Shaparak"
            width={100}
            height={100}
            className="w-full h-full object-contain"
          />
        </div>
      </div>
      <div className="flex lg:flex-row flex-col-reverse gap-2.5 w-full mt-3">
        <div className="flex flex-col gap-2 w-full px-3 py-3 bg-white rounded-[16px] shadow-[0_5px_10px_rgba(0,0,0,0.1)]">
          <span className="text-[#0076DB] text-[17px] bg-[#becdda] px-3 py-3 rounded-[12px]">
            اطلاعات کارت خود را وارد کنید
          </span>
          <div className="flex flex-col gap-10 lg:max-w-[75%] w-full mx-auto mt-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[#4e4e4e]">شماره کارت</label>
              <input
                type="text"
                value={cardNumber}
                onChange={handleCardNumberChange}
                placeholder="---- ---- ---- ----"
                maxLength={19}
                className="
                                  bg-[#e4e4e4]
                                  placeholder:text-center 
                                  text-center 
                                  px-2 py-2
                                  border border-[#d3d3d3]
                                  rounded-md 
                                  outline-none 
                                  text-[15px] 
                                  font-mono 
                                  tracking-wider
                                  transition-all
                                "
                dir="ltr"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[#4e4e4e]">شماره شناسایی دوم (CVV2)</label>
              <input
                type="text"
                placeholder="CVV2"
                className="
                                bg-[#e4e4e4]
                                  placeholder:text-center 
                                  text-center 
                                  px-2 py-2
                                  border border-[#d3d3d3]
                                  rounded-md 
                                  outline-none 
                                  text-[15px] 
                                  font-mono 
                                  tracking-wider
                                  transition-all
                                  "
                dir="ltr"
              />
            </div>
            <div className="flex flex-col w-full">
              <label className="text-[#4e4e4e] mb-1.5 mt-1.5">
                تاریخ انقضا
              </label>
              <div className="flex flex-row  gap-4.5 w-full">
                <div className="flex flex-col gap-1.5 w-full">
                  <input
                    type="text"
                    placeholder="ماه"
                    maxLength={2}
                    className="
                                        w-full
                                  bg-[#e4e4e4]
                                  placeholder:text-center 
                                  text-center 
                                  px-2 py-2
                                  border border-[#d3d3d3]
                                  rounded-md 
                                  outline-none 
                                  text-[15px] 
                                  font-mono 
                                  tracking-wider
                                  transition-all
                                "
                    dir="ltr"
                  />
                </div>
                <div className="flex flex-col gap-1.5 w-full">
                  <input
                    type="text"
                    placeholder="سال"
                    maxLength={2}
                    className="
                                        w-full
                                  bg-[#e4e4e4]
                                  placeholder:text-center 
                                  text-center 
                                  px-2 py-2
                                  border border-[#d3d3d3]
                                  rounded-md 
                                  outline-none 
                                  text-[15px] 
                                  font-mono 
                                  tracking-wider
                                  transition-all
                                "
                    dir="ltr"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[#4e4e4e]">رمز دوم</label>
              <input
                type="password"
                placeholder="رمز دوم"
                className="
                                bg-[#e4e4e4]
                                  placeholder:text-center 
                                  text-center 
                                  px-2 py-2
                                  border border-[#d3d3d3]
                                  rounded-md 
                                  outline-none 
                                  text-[15px] 
                                  font-mono 
                                  tracking-wider
                                  transition-all
                                  "
                dir="ltr"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[#4e4e4e]">کد امنیتی</label>
              <input
                type="password"
                placeholder="رمز دوم"
                className="
                                bg-[#e4e4e4]
                                  placeholder:text-center 
                                  text-center 
                                  px-2 py-2
                                  border border-[#d3d3d3]
                                  rounded-md 
                                  outline-none 
                                  text-[15px] 
                                  font-mono 
                                  tracking-wider
                                  transition-all
                                  "
                dir="ltr"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[#4e4e4e]">توضیحات (اختیاری)</label>
              <textarea
                onChange={(e) => setDescription(e.target.value)}
                placeholder="توضیحات"
                className="
                                bg-[#e4e4e4]
                                  placeholder:text-right 
                                  text-right 
                                  px-2 py-2
                                  border border-[#d3d3d3]
                                  rounded-md 
                                  outline-none 
                                  text-[15px] 
                                  font-mono 
                                  tracking-wider
                                  transition-all
                                  "
              />
            </div>
            <div className="flex flex-row items-center gap-1.5">
              <input
                type="checkbox"
                id="saveCart"
                className="
                                cursor-pointer
                                bg-[#e4e4e4]
                                  placeholder:text-center 
                                  checked:bg-[#0076DB]
                                  w-3.75
                                  h-3.75
                                  text-center 
                                  px-2 py-2
                                  border border-[#d3d3d3]
                                  rounded-md 
                                  outline-none 
                                  text-[15px] 
                                  font-mono 
                                  tracking-wider
                                  transition-all
                                  "
                dir="ltr"
              />
              <label
                className="text-[#4e4e4e] cursor-pointer"
                htmlFor="saveCart"
              >
                شماره کارت در درگاه ثبت شود
              </label>
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  const paymentData = {
                    amount: Number(houseInfo.houseDetail.price),
                    description: description
                      ? description
                      : `پرداخت برای خانه ${houseInfo.houseDetail.title}`,
                    callbackUrl: "localhost:3000/panel/reserveManagement/buyer",
                    bookingId: houseInfo.id,
                  };
                  payReserveMutate(paymentData);
                }}
                className="w-full border-16 bg-[#76fc76] px-2 py-2 rounded-[9px] cursor-pointer border-none"
              >
                پرداخت {houseInfo.houseDetail.price} تومان
              </button>
              <Link
                href={"/panel/reserveManagement/buyer"}
                className="w-full text-center border-16 px-2 py-2 rounded-[9px] cursor-pointer border-none text-red-600"
              >
                انصراف
              </Link>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-5 lg:max-w-[55%] w-full h-fit px-3 py-3 bg-white rounded-[16px] shadow-[0_5px_10px_rgba(0,0,0,0.1)]">
          <div className="text-[#0076DB] text-[17px] bg-[#becdda] px-3 py-3 rounded-[12px] flex flex-row justify-between">
            <span>زمان باقی مانده : </span>
            <span>09:24</span>
          </div>
          <div className="flex flex-row gap-3 text-[#999999] items-center">
            <HugeiconsIcon icon={Store02Icon} size={30} />
            <div className="flex flex-col gap-1.5 text-[#999999] ">
              <span className="text-[18px]">پذیرنده</span>
              <span className="font-bold text-[18px] text-[#464646]">
                Epilogue
              </span>
            </div>
          </div>
          <div className="flex flex-row gap-3 text-[#999999] items-center">
            <HugeiconsIcon icon={Cash02Icon} size={30} />
            <div className="flex flex-col gap-1.5 text-[#999999] ">
              <span className="text-[18px]">مبلغ</span>
              <span className="font-bold text-[18px] text-[#464646]">
                {houseInfo.houseDetail.price}
              </span>
            </div>
          </div>
          <div className="flex flex-row gap-3 text-[#999999] items-center">
            <HugeiconsIcon icon={LockKeyholeIcon} size={30} />
            <div className="flex flex-col gap-1.5 text-[#999999] ">
              <span className="text-[18px]">شماره پذیرنده / ترمینال</span>
              <span className="font-bold text-[18px] text-[#464646]">
                123456 / 123456
              </span>
            </div>
          </div>
          <div className="flex flex-row gap-3 text-[#999999] items-center">
            <HugeiconsIcon icon={LockKeyholeIcon} size={30} />
            <div className="flex flex-col gap-1.5 text-[#999999] ">
              <span className="text-[18px]">سایت پذیرنده</span>
              <span className="font-bold text-[18px] text-[#464646]">
                Epilogue.com
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentAddCart;

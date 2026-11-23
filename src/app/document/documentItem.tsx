"use client";
import React, { useRef, useEffect, useState, useMemo, FC } from "react";
import { pdf } from "@react-pdf/renderer";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { uploadContractDocument } from "@/services/panel/buyer/reserveManagement.service";
import DocumentPdf from "./DocumentPDF";
import { Download01Icon, TrashIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { size } from "zod";
import { useMutation } from "@tanstack/react-query";

export interface IUserDetail {
  user: {
    id: string;
    role: string;
    membershipDate: null;
    email: string;
    phoneNumber: string;
    emailVerified: boolean;
    verificationCode: string;
    verificationCodeExpires: object;
    resetCode: null;
    resetCodeExpires: null;
    fullName: string;
    firstName: string;
    lastName: string;
    profilePicture: string;
    createdAt: string;
    updatedAt: string;
  };
  additionalPercentage: number;
}
export interface IHousesDetail {
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
}

interface IProps {
  houseDetail: IHousesDetail;
  userDetail: IUserDetail;
}
const DashboardDocumentItem: FC<IProps> = ({ houseDetail, userDetail }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const router = useRouter();

  const [contractCode, setContractCode] = useState("");
  const [today, setToday] = useState<Date | null>(null);

  useEffect(() => {
    setContractCode(Math.floor(10000 + Math.random() * 90000).toString());
    setToday(new Date());
  }, []);

  const lineColor = "#000000";
  const lineWidth = 6;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const setupContext = () => {
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = lineWidth;
    };
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      canvas.width = rect.width;
      canvas.height = rect.height;
      setupContext();
      ctx.putImageData(imageData, 0, 0);
    };
    setupContext();
    setContext(ctx);
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  const getPoint = (
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e)
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const startDrawing = (
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    if (!context) return;
    setIsDrawing(true);
    const point = getPoint(e);
    context.beginPath();
    context.moveTo(point.x, point.y);
  };

  const draw = (
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    if (!isDrawing || !context) return;
    const point = getPoint(e);
    context.lineTo(point.x, point.y);
    context.stroke();
  };

  const stopDrawing = () => setIsDrawing(false);

  const clearCanvas = () => {
    if (!context || !canvasRef.current) return;
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const { mutate: createContractMutate, isPending } = useMutation({
    mutationKey: ["CreateContract"],

    mutationFn: async () => {
      const canvas = canvasRef.current;

      if (!canvas || !contractCode || !today) {
        throw new Error("اطلاعات قولنامه کامل نیست");
      }

      const signature = canvas.toDataURL("image/png");

      const doc = (
        <DocumentPdf
          houseDetail={houseDetail}
          userDetail={userDetail}
          today={today}
          buyerSignature={signature}
        />
      );

      const blob = await pdf(doc).toBlob();
      const fileName = `document-${contractCode}.pdf`;

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = fileName;
      link.click();

      setTimeout(() => URL.revokeObjectURL(url), 1000);

      const formData = new FormData();
      formData.append("document", blob, fileName);
      formData.append("houseId", houseDetail.id);
      formData.append("documentType", "contract");

      const response = await uploadContractDocument(formData);

      return response;
    },

    onMutate: () => {
      toast.loading("در حال ایجاد و ارسال قولنامه...", {
        toastId: "CreateContractToast",
      });
    },

    onSuccess: () => {
      toast.update("CreateContractToast", {
        render: "قولنامه با موفقیت ایجاد و ذخیره شد",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      router.push("/panel/paymentManagement");
    },

    onError: (error) => {
      toast.update("CreateContractToast", {
        render:
          error instanceof Error
            ? error.message
            : "در ایجاد یا ذخیره قولنامه خطایی رخ داد",
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
    },
  });

  const generateAndSendPDF = () => {
    if (!contractCode || !today) {
      toast.error("اطلاعات قولنامه هنوز آماده نشده است");
      return;
    }

    createContractMutate();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-2xl font-extrabold text-center mb-1 text-gray-800">
        سیستم ثبت امضای دیجیتال
      </h3>
      <p className="text-gray-600 text-center mb-3 font-mono text-lg">
        قولنامه شماره:{" "}
        {contractCode && today
          ? `${contractCode}/${today.getFullYear()}`
          : "در حال آماده‌سازی..."}
      </p>
      <div className="flex flex-row max-[450px]:flex-col  justify-between w-full gap-5 mb-4">
        <div className="w-full flex flex-col gap-2 bg-[#f0f0f0] px-3 py-3 rounded-lg">
          <h4 className="text-purple-700">اطلاعات فروشنده</h4>
          <div className="flex flex-col gap-1">
            <div className="text-[16px] text-black font-bold">
              نام فروشنده :{" "}
              <span className="text-[16px] text-black font-medium">
                {" "}
                {houseDetail.sellerName}
              </span>
            </div>
            <div className="text-[16px] text-black font-bold">
              کد ملی فروشنده :{" "}
              <span className="text-[16px] text-black font-medium">
                {" "}
                {houseDetail.sellerId}3345633
              </span>
            </div>
          </div>
        </div>
        <div className="w-full flex flex-col gap-2 bg-[#f0f0f0] px-3 py-3 rounded-lg">
          <h4 className="text-purple-700">اطلاعات خریدار</h4>
          <div className="flex flex-col gap-1">
            <div className="text-[16px] text-black font-bold">
              نام خریدار :{" "}
              <span className="text-[16px] text-black font-medium">
                {" "}
                {userDetail.user.firstName + " " + userDetail.user.lastName}
              </span>
            </div>
            <div className="text-[16px] text-black font-bold">
              کد ملی خریدار :{" "}
              <span className="text-[16px] text-black font-medium">
                {" "}
                {userDetail.user.id}3345633
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="w-full h-60 border-2 border-gray-300 rounded-lg cursor-crosshair bg-gray-50 touch-none shadow-sm"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        <p className="text-xs text-gray-500 mt-2 text-center">
          با موس یا انگشت امضا کنید
        </p>
      </div>
      <div className="flex gap-3 max-[450px]:flex-col mt-6 justify-between">
        <button
          onClick={clearCanvas}
          className="flex items-center gap-2 max-[450px]:justify-center rounded-lg px-4 py-2 bg-red-500 hover:bg-red-600 text-white transition-colors"
        >
          <HugeiconsIcon icon={TrashIcon} size={16} /> پاک کردن
        </button>
        <button
          onClick={generateAndSendPDF}
          disabled={isPending || !contractCode || !today}
          className="flex items-center max-[450px]:justify-center gap-2 rounded-lg px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors"
        >
          <HugeiconsIcon icon={Download01Icon} size={16} />
          {isPending ? "در حال ایجاد قولنامه..." : "تایید و ایجاد قولنامه"}
        </button>
      </div>
    </div>
  );
};

export default DashboardDocumentItem;

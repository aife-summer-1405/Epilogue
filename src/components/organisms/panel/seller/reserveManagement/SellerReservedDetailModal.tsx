"use client";

import Button from "@/components/atoms/button/Button";
import Modal from "@/components/molecules/modal/Modal";
import ImageFallback from "@/components/molecules/ImageFallBack/ImageFallBack";
import { Skeleton } from "@/components/ui/skeleton";
import useFakeLoading from "@/hooks/useFakeLoading";
import useModalParams from "@/hooks/useModalParams";
import {
  BedDoubleIcon,
  Bathtub01Icon,
  BitcoinBagIcon,
  CarParking01Icon,
  Edit02Icon,
  Home01Icon,
  Location01Icon,
  Sun03Icon,
  UserGroup03Icon,
  WifiIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import SellerPassengersModal from "./SellerPassengersModal";
import SellerPaymentsModal from "./SellerPaymentsModal";
import SellerEditsHistoryModal from "./SellerEditsHistoryModal";

interface ISellerReserveDetail {
  id: number;
  title: string;
  address: string;
  description: string;
  price: string;
  image: string;
  tags: string[];
  specs: { key: string; label: string }[];
}

const getSellerReserveDetail = (id: string): ISellerReserveDetail => ({
  id: Number(id),
  title: "آپارتمان لوکس زعفرانیه",
  address: "خیابان ولیعصر، تهران، منطقه مرکزی",
  description:
    "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد.",
  price: "2,500,000",
  image: "/images/hotel.jpg",
  tags: [
    "مدرن",
    "آپارتمان",
    "آسانسور دار",
    "آسانسور دار",
    "آسانسور دار",
    "آسانسور دار",
    "آسانسور دار",
    "آسانسور دار",
  ],
  specs: [
    { key: "bed", label: "2 خوابه" },
    { key: "bath", label: "2 حمام" },
    { key: "parking", label: "1 پارکینگ" },
    { key: "capacity", label: "6 نفر ظرفیت" },
    { key: "balcony", label: "بالکن" },
    { key: "residential", label: "مسکونی" },
    { key: "kitchen", label: "یخچال و اجاق" },
    { key: "wifi", label: "اینترنت" },
  ],
});

const specIcons: Record<string, typeof BedDoubleIcon> = {
  bed: BedDoubleIcon,
  bath: Bathtub01Icon,
  parking: CarParking01Icon,
  capacity: UserGroup03Icon,
  balcony: Sun03Icon,
  residential: Home01Icon,
  wifi: WifiIcon,
};

const tagClass =
  "bg-orange-500 text-white rounded-[8px] px-3 py-1.5 text-sm font-normal";
const specClass = `${tagClass} flex items-center gap-1.5`;
const buttonClass = "bg-primary-500! text-white rounded-[16px] p-3";

const SellerReservedDetailModal = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { open } = useModalParams();

  const reserveId = searchParams.get("reserveId");
  const reserve = reserveId ? getSellerReserveDetail(reserveId) : null;
  const isLoading = useFakeLoading(reserveId);

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) return;

    const params = new URLSearchParams(searchParams.toString());
    params.delete("reserveId");
    params.delete("modal");
    const query = params.toString();

    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  return (
    <>
      <Modal
        title="جزئیات اقامتگاه"
        contentClassName="sm:max-w-273"
        open={!!reserveId}
        onOpenChange={handleOpenChange}
      >
        {isLoading && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 md:flex-row">
              <Skeleton className="h-52 w-full shrink-0 rounded-[16px] sm:h-72 md:w-1/2" />
              <div className="flex w-full flex-col gap-3 md:w-1/2">
                <Skeleton className="h-7 w-2/3" />
                <Skeleton className="h-5 w-1/2" />
                <div className="flex flex-1 flex-col gap-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
                <Skeleton className="h-7 w-32" />
              </div>
            </div>
            {[5, 6].map((count) => (
              <div key={count} className="flex flex-col gap-3">
                <Skeleton className="h-4 w-20" />
                <div className="flex flex-wrap gap-3">
                  {Array.from({ length: count }, (_, i) => (
                    <Skeleton key={i} className="h-8 w-24 rounded-[8px]" />
                  ))}
                </div>
              </div>
            ))}
            <div className="flex flex-col gap-3">
              <Skeleton className="h-4 w-28" />
              <div className="flex flex-wrap gap-3">
                <Skeleton className="h-12 w-28 rounded-[16px]" />
                <Skeleton className="h-12 w-28 rounded-[16px]" />
                <Skeleton className="h-12 w-36 rounded-[16px]" />
              </div>
            </div>
          </div>
        )}

        {!isLoading && reserve && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="relative h-52 w-full shrink-0 overflow-hidden rounded-[16px] sm:h-72 md:w-1/2">
                <ImageFallback
                  src={reserve.image}
                  alt={reserve.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex w-full min-w-0 flex-col gap-3 md:w-1/2">
                <p className="text-lg font-bold text-default-text sm:text-xl">
                  {reserve.title}
                </p>
                <div className="flex items-center gap-1 text-neutral-dark-200">
                  <HugeiconsIcon
                    icon={Location01Icon}
                    className="size-5 shrink-0"
                  />
                  <span className="text-sm">{reserve.address}</span>
                </div>
                <p className="flex-1 text-sm leading-7 text-default-text">
                  {reserve.description}
                </p>
                <p className="text-default-text">
                  <span className="text-xl font-bold">{reserve.price}</span>{" "}
                  <span className="text-sm">تومان</span>
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-sm font-bold text-default-text">برچسب ها :</p>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {reserve.tags.map((tag, i) => (
                  <span key={i} className={tagClass}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-sm font-bold text-default-text">
                سایر مشخصات :
              </p>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {reserve.specs.map((spec) => (
                  <span key={spec.key} className={specClass}>
                    {specIcons[spec.key] && (
                      <HugeiconsIcon
                        icon={specIcons[spec.key]}
                        className="size-4"
                      />
                    )}
                    {spec.label}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-sm font-bold text-default-text">
                انجام عملیات :
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => open("passengers")}
                  className={buttonClass}
                  startIcon={
                    <HugeiconsIcon
                      icon={UserGroup03Icon}
                      className="size-5 text-white"
                    />
                  }
                >
                  مسافر ها
                </Button>
                <Button
                  onClick={() => open("payments")}
                  className={buttonClass}
                  startIcon={
                    <HugeiconsIcon
                      icon={BitcoinBagIcon}
                      className="size-5 text-white"
                    />
                  }
                >
                  پرداختی ها
                </Button>
                <Button
                  onClick={() => open("edits")}
                  className={buttonClass}
                  startIcon={
                    <HugeiconsIcon
                      icon={Edit02Icon}
                      className="size-5 text-white"
                    />
                  }
                >
                  تاریخچه تغییرات
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <SellerPassengersModal />
      <SellerPaymentsModal />
      <SellerEditsHistoryModal />
    </>
  );
};

export default SellerReservedDetailModal;

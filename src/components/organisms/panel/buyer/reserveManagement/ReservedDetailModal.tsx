"use client";

import Button from "@/components/atoms/button/Button";
import Modal from "@/components/molecules/modal/Modal";
import ImageFallback from "@/components/molecules/ImageFallBack/ImageFallBack";
import { Skeleton } from "@/components/ui/skeleton";
import useFakeLoading from "@/hooks/useFakeLoading";
import {
  BitcoinBagIcon,
  Location01Icon,
  UserGroup03Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useModalParams from "@/hooks/useModalParams";
import PaymentsModal from "./PaymentsModal";
import ReserveHistoryModal from "./ReserveHistoryModal";
import PassengersModal from "./PassengersModal";

const getHome = (id: string) => ({
  id,
  title: "آپارتمان لوکس زعفرانیه",
  address: "خیابان ولیعصر، تهران، منطقه مرکزی",
  description:
    "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است.",
  price: "2,500,000",
  image: "/images/hotel.jpg",
  tags: ["مدرن", "آپارتمان", "آسانسور دار", "آسانسور دار"],
  specs: ["2 خوابه", "2 حمام", "1 پارکینگ", "6 نفر ظرفیت", "بالکن", "مسکونی"],
});

const chipClass =
  "bg-orange-500 text-white rounded-[8px] px-3 py-1.5 text-sm font-normal";

const buttonClass = "bg-primary-500! text-white rounded-[16px] p-3";

const ReservedDetailModal = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { open } = useModalParams();

  const homeId = searchParams.get("homeId");
  const home = homeId ? getHome(homeId) : null;
  const isLoading = useFakeLoading(homeId);

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) return;

    const params = new URLSearchParams(searchParams.toString());
    params.delete("homeId");
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
        open={!!homeId}
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
            <div className="flex flex-col gap-3">
              <Skeleton className="h-4 w-20" />
              <div className="flex flex-wrap gap-3">
                {Array.from({ length: 5 }, (_, i) => (
                  <Skeleton key={i} className="h-8 w-24 rounded-[8px]" />
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Skeleton className="h-4 w-24" />
              <div className="flex flex-wrap gap-3">
                {Array.from({ length: 6 }, (_, i) => (
                  <Skeleton key={i} className="h-8 w-24 rounded-[8px]" />
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Skeleton className="h-4 w-28" />
              <div className="flex flex-wrap gap-3">
                <Skeleton className="h-12 w-28 rounded-[16px]" />
                <Skeleton className="h-12 w-32 rounded-[16px]" />
              </div>
            </div>
          </div>
        )}
        {!isLoading && home && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="relative h-52 w-full shrink-0 overflow-hidden rounded-[16px] sm:h-72 md:w-1/2">
                <ImageFallback
                  src={home.image}
                  alt={home.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex w-full min-w-0 flex-col gap-3 md:w-1/2">
                <p className="text-lg font-bold text-default-text sm:text-xl">
                  {home.title}
                </p>
                <div className="flex items-center gap-1 text-neutral-dark-200">
                  <HugeiconsIcon
                    icon={Location01Icon}
                    className="size-5 shrink-0"
                  />
                  <span className="text-sm">{home.address}</span>
                </div>
                <p className="flex-1 text-sm leading-7 text-default-text">
                  {home.description}
                </p>
                <p className="text-default-text">
                  <span className="text-xl font-bold">{home.price}</span>{" "}
                  <span className="text-sm">تومان</span>
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-sm font-bold text-default-text">برچسب ها :</p>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {home.tags.map((tag, i) => (
                  <span key={i} className={chipClass}>
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
                {home.specs.map((spec) => (
                  <span key={spec} className={chipClass}>
                    {spec}
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
                  onClick={() => open("history")}
                  className={buttonClass}
                  startIcon={
                    <HugeiconsIcon
                      icon={UserGroup03Icon}
                      className="text-white size-5"
                    />
                  }
                >
                  رزرو ها
                </Button>
                <Button
                  onClick={() => open("payments")}
                  className={buttonClass}
                  startIcon={
                    <HugeiconsIcon
                      icon={BitcoinBagIcon}
                      className="text-white size-5"
                    />
                  }
                >
                  پرداختی ها
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <PaymentsModal />
      <ReserveHistoryModal />
      <PassengersModal />
    </>
  );
};

export default ReservedDetailModal;

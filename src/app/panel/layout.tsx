import ImageFallback from "@/components/molecules/ImageFallBack/ImageFallBack";
import { FC } from "react";
import profileImage from "@/app/assets/Image/profile.png";
import profileFallBack from "@/app/assets/Image/profileFallBack.jpg";

interface IProps {
  children: React.ReactNode;
}

const PanelLayout: FC<IProps> = ({ children }) => {
  return (
    <div className="w-11/12 mx-auto flex gap-8 py-8">
      <div className="w-2/10 bg-default-white-bg"></div>
      <div className="w-8/10 flex flex-col gap-8">
        <div className="flex items-center justify-between rounded-[24px] bg-neutral-200 py-2 px-4">
          <div className="flex gap-4 items-center">
            <ImageFallback
              src={profileImage}
              fallbackSrc={profileFallBack}
              alt="پروفایل"
              className="rounded-full size-10"
            />
            <div className="flex flex-col">
              <div className="flex gap-1 items-center">
                <p className="text-[20px] font-normal text-default-black">
                  متین قربانزاده
                </p>
                <span className="font-normal text-[14px] text-primary-500">
                  ( فروشنده )
                </span>
              </div>
              <div className="flex items-center gap-1">
                <p className="text-base font-normal text-default-black">
                  موجودی :
                </p>
                <span className="text-base font-normal text-neutral-dark-300">
                  20,000,000 تومان
                </span>
              </div>
            </div>
          </div>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default PanelLayout;

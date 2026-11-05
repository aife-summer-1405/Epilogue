import React from "react";
import Link from "next/link";
import MortgageRentContent from "@/components/organisms/mortgageRent/MortgageRentContent";
import { IBreadCrumbsList } from "@/core/types/BreadCrumb/breadCrumb.types";
import BreadCrumb from "@/components/molecules/breadcrumb/BreadCrumb";

export const metadata = {
  title: "رهن و اجاره آپارتمان | مشاور املاک",
  description: "جستجو و مشاهده لیست کامل املاک برای رهن و اجاره",
};

const list: IBreadCrumbsList[] = [
  {
    href: "/",
    label: "خانه",
  },
  {
    href: "/mortgage-rent",
    label: "رهن و اجاره",
  },
];

export default function MortgageAndRentPage() {
  return (
    <main
      className="mx-auto flex w-full xl:max-w-11/12 lg:max-w-10/12 max-w-11/12 flex-col gap-12 items-center"
      dir="rtl"
    >
      <BreadCrumb list={list} />
      <MortgageRentContent />
    </main>
  );
}

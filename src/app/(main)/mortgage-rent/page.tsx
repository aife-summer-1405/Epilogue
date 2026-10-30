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
      className="mx-auto flex w-full max-w-7xl flex-col gap-12 items-center px-4 py-6 md:px-8 md:py-8"
      dir="rtl"
    >
      <BreadCrumb list={list} />
      <MortgageRentContent />
    </main>
  );
}

"use client";

import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    InstagramIcon,
    Linkedin01Icon,
    TelegramIcon,
} from "@hugeicons/core-free-icons";

import HomeLogo from "@/components/atoms/Logo/home-logo";

const footerSections = [
    {
        title: "نحوه رزرو اقامتگاه",
        links: [
            { label: "راهنمای رزرو اقامتگاه", href: "/guide/reservation" },
            { label: "شیوه پرداخت", href: "/payment" },
            { label: "لغو رزرو اقامتگاه", href: "/cancellation" },
        ],
    },
    {
        title: "خدمات مشتریان",
        links: [
            { label: "پرسش‌های متداول مهمان", href: "/faq/guest" },
            { label: "پرسش‌های متداول میزبان", href: "/faq/host" },
            { label: "چطور اقامتگاه ثبت کنم؟", href: "/host/register" },
            { label: "حریم شخصی کاربران", href: "/privacy" },
        ],
    },
];

const contactInfo = {
    phones: ["09229167194", "098541612310"],
    email: "Delta@gmail.com",
    address: "گیلان، رشت، میدان آزادی، جنب چهار راه عظیم‌زاده",
};

export default function Footer() {
    return (
        <footer
            className="mx-2 mb-2 rounded-[20px] bg-[#EDEDED] px-5 py-8 text-neutral-950 dark:bg-[#272727] dark:text-white sm:mx-4 sm:px-8 sm:py-10 lg:px-[68px] lg:py-14"
        >
            <div className="mx-auto flex w-full  flex-col gap-8">
                {/* Main Sections */}
                <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between md:gap-6">
                    {/* Brand */}
                    <section className="flex min-w-0 flex-col gap-5 md:order-1 md:w-[35%]">
                        <Link
                            href="/"
                            aria-label="صفحه اصلی"
                            className="w-fit"
                        >
                            <HomeLogo />
                        </Link>

                        <p className="max-w-[480px] text-sm leading-7">
                            ما همراه شما هستیم در مسیر اجاره، خرید و فروش ویلا؛
                            تا با اطمینان و آرامش، تجربه‌ای دلنشین از انتخاب
                            اقامتگاه با سرمایه‌گذاری پایدارماندی داشته باشید.
                        </p>

                        <div className="flex items-center gap-5">
                            <a
                                href="https://telegram.org/"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Telegram"
                                className="transition-colors hover:text-primary-500"
                            >
                                <HugeiconsIcon
                                    icon={TelegramIcon}
                                    size={24}
                                />
                            </a>

                            <a
                                href="https://www.instagram.com/"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Instagram"
                                className="transition-colors hover:text-primary-500"
                            >
                                <HugeiconsIcon
                                    icon={InstagramIcon}
                                    size={24}
                                />
                            </a>
                            <a
                                href="https://www.linkedin.com/"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="LinkedIn"
                                className="transition-colors hover:text-primary-500"
                            >
                                <HugeiconsIcon
                                    icon={Linkedin01Icon}
                                    size={24}
                                />
                            </a>

                        </div>
                    </section>

                    {/* Footer Links */}
                    {footerSections.map((section, index) => (
                        <section
                            key={section.title}
                            className={`flex flex-col gap-4 md:order-${index === 0 ? "1" : "2"} md:min-w-[170px]`}
                        >
                            <h2 className="text-base font-bold text-primary-500">
                                {section.title}
                            </h2>

                            <ul className="flex flex-col gap-3">
                                {section.links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-sm leading-6 transition-colors hover:text-primary-500"
                                        >
                                            <span className="ml-2 text-[20px]">•</span>
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    ))}

                    {/* Contact */}
                    <section className="flex flex-col gap-4 md:order-3 md:min-w-[190px]">
                        <h2 className="text-base font-bold text-primary-500">
                            راه ارتباطی با ما
                        </h2>

                        <div className="flex flex-col gap-3 text-sm leading-6">
                            <p dir="ltr" className="text-right">
                                {contactInfo.phones.join(" - ")}
                            </p>

                            <a
                                href={`mailto:${contactInfo.email}`}
                                className="w-fit transition-colors hover:text-primary-500"
                            >
                                {contactInfo.email}
                            </a>

                            <p>{contactInfo.address}</p>
                        </div>
                    </section>
                </div>

                {/* Copyright */}
                <div className="border-t border-[#C5C5C5] pt-8  text-center dark:border-[#454545] sm:pt-8">
                    <p className="text-sm leading-7 text-[#858997]">
                        تمام حقوق مادی و معنوی این اثر برای برند شما محفوظ است.
                    </p>
                </div>
            </div>
        </footer>
    );
}
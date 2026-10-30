"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

import BackgroundImage from "@/app/assets/Image/Comment.jpg";
import { CommentCard } from "@/components/molecules";
import { useComments } from "@/hooks/queries/landing/useComments";
// import { useComments } from "@/hooks/queries/landing/useComments";

interface Comment {
  id: string;
  house_id: string;
  title: string;
  caption: string;
  rating: string;
  created_at: string;
  user: {
    firstName: string;
    lastName: string;
    profilePicture: string | null;
  };
  house: {
    id: string;
    title: string;
    address: string;
  };
}

interface CommentsResponse {
  comments: Comment[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export default function TestimonialsSection() {
  const { data, isPending, isError } = useComments();

  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const response = data as CommentsResponse | undefined;
  const comments = response?.comments ?? [];

  useEffect(() => {
    const track = trackRef.current;
    const viewport = viewportRef.current;

    if (!track || !viewport || comments.length === 0) return;

    const ctx = gsap.context(() => {
      const getMaxScroll = () =>
        Math.max(0, track.scrollHeight - viewport.clientHeight);

      const animation = gsap.to(track, {
        y: () => -getMaxScroll(),
        duration: 20,
        ease: "none",
        repeat: -1,
        yoyo: true,
        paused: true,
      });

      const updateAnimation = () => {
        animation.invalidate();
        animation.progress(0);
        animation.play();
      };

      updateAnimation();

      const observer = new ResizeObserver(updateAnimation);
      observer.observe(track);
      observer.observe(viewport);

      return () => {
        observer.disconnect();
        animation.kill();
      };
    }, viewport);

    return () => ctx.revert();
  }, [comments.length]);

  const formatDate = (date: string) =>
    new Intl.DateTimeFormat("fa-IR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(date));

  return (
    <section
      className="relative isolate w-full overflow-hidden bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: `url("${BackgroundImage.src}")` }}
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-black/40" />

      <div
        className="
          mx-auto grid w-full grid-cols-1 gap-8 px-5
          md:grid-cols-2 md:items-center md:gap-12 md:px-10
          lg:gap-20 lg:px-[100px]
        "
      >
        <div className="flex min-w-0 flex-col justify-center text-white">
          <h2 className="text-2xl font-bold leading-relaxed md:text-3xl">
            رضایت شما اعتبار ماست
          </h2>

          <p className="mt-5 text-sm leading-8 text-white/90 md:text-base">
            پیدا کردن ویلای مناسب همیشه کار راحتی نیست. ما اینجاییم تا همه چیز
            رو برای شما ساده کنیم. از بین صدها فایل، فقط بهترین و معتبرترین
            گزینه‌ها رو گلچین می‌کنیم تا وقت ارزشمندتون صرف جست‌وجوی بی‌پایان
            نشه. به تجربه‌ی اجاره‌ی راحت و بدون دغدغه خوش اومدید.
          </p>
        </div>

        <div
          ref={viewportRef}
          className="relative h-[560px] min-w-0 overflow-hidden md:h-[650px]"
        >
          {isPending ? (
            <p className="py-12 text-center text-white">
              در حال دریافت نظرات...
            </p>
          ) : isError ? (
            <p className="py-12 text-center text-white">
              دریافت نظرات با خطا مواجه شد.
            </p>
          ) : comments.length === 0 ? (
            <p className="py-12 text-center text-white">
              هنوز نظری ثبت نشده است.
            </p>
          ) : (
            <div ref={trackRef} className="flex flex-col gap-4">
              {comments.map((comment) => {
                const authorName =
                  `${comment.user?.firstName ?? ""} ${
                    comment.user?.lastName ?? ""
                  }`.trim() || "کاربر سایت";

                return (
                  <div key={comment.id} className="w-full shrink-0">
                    <CommentCard
                      content={comment.caption}
                      authorName={authorName}
                      date={formatDate(comment.created_at)}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

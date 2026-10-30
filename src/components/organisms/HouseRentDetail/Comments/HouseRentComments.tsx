"use client";

import { useState } from "react";
import Button from "@/components/atoms/button/Button";
import HouseRentCommentCard from "./HouseRentCommentCard";
import {
    useHouseComments,
    usePostComment,
} from "@/hooks/queries/houses/useHouseComments";
import { HugeiconsIcon } from "@hugeicons/react";
import { StarIcon } from "@hugeicons/core-free-icons";

interface Props {
    houseId: string;
}

export default function HouseRentComments({ houseId }: Props) {
    const [page, setPage] = useState(1);
    const [title, setTitle] = useState("");
    const [caption, setCaption] = useState("");
    const [rating, setRating] = useState(5);

    const {
        data,
        isPending,
        isError,
        isFetching,
    } = useHouseComments(houseId, page);

    const {
        mutate: submitComment,
        isPending: isSubmitting,
        isError: isSubmitError,
        error: submitError,
    } = usePostComment(houseId);

    const comments = data?.comments ?? [];

const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedCaption = caption.trim();

    if (!trimmedTitle || !trimmedCaption || isSubmitting) return;

    submitComment(
        {
            house_id: Number(houseId),
            title: trimmedTitle,
            caption: trimmedCaption,
            rating,
            parent_comment_id: null,
        },
        {
            onSuccess: () => {
                setTitle("");
                setCaption("");
                setRating(5);
                setPage(1);
            },
        }
    );
};

    return (
        <section
            dir="rtl"
            className="w-full"
        >
            <Button className="mb-4" variant="outline" size="md"> نظرات کاربران</Button>
            <div className="w-full min-w-0 rounded-2xl border border-neutral-200 dark:bg-[#272727] bg-[#FFFFFA] p-3 sm:p-5 lg:p-6">

                <div className="mb-5 flex items-center justify-between gap-3">


                    <span className="rounded-full dark:border-[#353535] dark:text-primary-200 border border-blue-200 px-3 py-1 text-xs text-blue-700">
                        {data?.totalCount ?? 0} نظر
                    </span>
                </div>

                <form className="mb-6 space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label
                            htmlFor="house-comment-title"
                            className="mb-2 block text-sm font-medium text-neutral-800"
                        >
                            عنوان نظر
                        </label>

                        <input
                            id="house-comment-title"
                            type="text"
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                            placeholder="مثلاً اقامت خوبی بود"
                            required
                            maxLength={100}
                            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-sm outline-none transition focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="house-comment-caption"
                            className="mb-2 block text-sm font-medium text-neutral-800"
                        >
                            متن نظر
                        </label>

                        <textarea
                            id="house-comment-caption"
                            rows={3}
                            value={caption}
                            onChange={(event) => setCaption(event.target.value)}
                            placeholder="تجربه خود را از این اقامتگاه بنویسید..."
                            required
                            maxLength={2000}
                            className="w-full resize-y rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-sm outline-none transition focus:border-blue-500"
                        />
                    </div>

                    <fieldset>
                        <legend className="mb-2 text-sm font-medium text-neutral-800">
                            امتیاز شما
                        </legend>

                        <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map((value) => (
                                <button
                                    key={value}
                                    type="button"
                                    onClick={() => setRating(value)}
                                    aria-label={`${value} از ۵`}
                                    aria-pressed={rating === value}
                                    className={`flex h-10 w-10 items-center  justify-center rounded-lg border text-sm transition ${rating === value
                                        ? "border-amber-400 bg-amber-50 font-bold text-amber-500"
                                        : "border-neutral-200 text-neutral-500 bg-neutral-50 hover:border-amber-300"
                                        }`}
                                >
                                    {value}          <HugeiconsIcon className="mb-1 pr-1" icon={StarIcon} fill="#f7df0e" size={15} />

                                </button>
                            ))}
                        </div>
                    </fieldset>

                    {isSubmitError && (
                        <p role="alert" className="text-sm text-red-500">
                            {submitError instanceof Error
                                ? submitError.message
                                : "ثبت نظر با خطا مواجه شد. لطفاً دوباره تلاش کنید."}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="rounded-xl bg-blue-700 px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isSubmitting ? "در حال ثبت نظر..." : "ثبت نظر"}
                    </button>
                </form>

                <div className="mb-5 border-t border-neutral-100" />

                {isPending ? (
                    <p className="py-8 text-center text-sm text-neutral-500">
                        در حال دریافت نظرات...
                    </p>
                ) : isError ? (
                    <div className="py-6 text-center">
                        <p className="text-sm text-red-500">
                            دریافت نظرات با خطا مواجه شد.
                        </p>

                        <button
                            type="button"
                            onClick={() => setPage(1)}
                            className="mt-3 text-sm text-blue-700 underline"
                        >
                            تلاش مجدد
                        </button>
                    </div>
                ) : comments.length === 0 ? (
                    <p className="py-8 text-center text-sm text-neutral-500">
                        هنوز نظری برای این اقامتگاه ثبت نشده است.
                    </p>
                ) : (
                    <div className="space-y-2">
                        {comments.map((comment, index) => (
                            <HouseRentCommentCard
                                key={comment.id}
                                comment={comment}
                                index={index}
                            />
                        ))}
                    </div>
                )}

                {!isPending &&
                    !isError &&
                    data &&
                    data.currentPage < data.totalPages && (
                        <div className="mt-5 flex justify-center">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={isFetching}
                                onClick={() => setPage((current) => current + 1)}
                            >
                                {isFetching ? "در حال دریافت..." : "مشاهده بیشتر"}
                            </Button>
                        </div>
                    )}
            </div>

        </section>
    );
}
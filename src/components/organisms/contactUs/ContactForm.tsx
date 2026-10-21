"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TextareaInput from "@/components/molecules/inputs/TextareaInput";
import Button from "@/components/atoms/button/Button";
import TextInput from "@/components/molecules/inputs/textInput/TextInput";
import { submitContactMessage } from "@/app/actions/contactUs/contactUs.actions";
import {
  ContactFormValues,
  contactSchema,
} from "@/lib/validations/contactUs/contact";

export default function ContactForm() {
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit, reset } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      fullName: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsLoading(true);

    const apiPayload = {
      title: `Message From: ${data.fullName} (${data.email})`,
      message: data.message,
    };

    const result = await submitContactMessage(apiPayload);

    if (result.success) {
      console.log("Successfully sent!");
      reset();
    } else {
      console.log("did not send!");
    }

    setIsLoading(false);
  };

  return (
    <div className="flex flex-col rounded-[2rem] bg-default-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
      <h3 className="mb-8 text-center text-xl font-bold text-default-text">
        با ما در ارتباط باشید
      </h3>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <TextInput
          name="fullName"
          control={control}
          placeholder="نام و نام خانوادگی"
          variableName="fullMd"
        />
        <TextInput
          name="email"
          control={control}
          placeholder="ایمیل"
          variableName="fullMd"
        />
        <TextareaInput
          name="message"
          control={control}
          placeholder="پیام شما"
          variableName="mdMd"
        />
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={isLoading}
          className="mt-4 w-full bg-[#1e3a8a] text-white hover:bg-blue-900 disabled:opacity-70"
        >
          {isLoading ? "در حال ارسال..." : "ارسال درخواست شما"}
        </Button>
      </form>
    </div>
  );
}

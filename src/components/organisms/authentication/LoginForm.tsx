"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LockKeyIcon, User02Icon } from "@hugeicons/core-free-icons";
import Button from "@/components/atoms/button/Button";
import TextInput from "@/components/molecules/inputs/textInput/TextInput";
import { loginSchema } from "@/lib/validations/authentication/auth";
import SignButton from "@/components/atoms/Sign-button/signButton";
import GithubIcon from "@/app/assets/icons/GithubIcon";
import GoogleIcon from "@/app/assets/icons/GoogleIcon";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { loginAction } from "@/app/actions/auth/auth.actions";
import { useRouter } from "next/navigation";
import { LoginValues } from "@/core/types/auth.types";
import { useEffect, useTransition } from "react";
import { oauthSignInAction } from "@/app/actions/auth/oauth.actions";

const LoginForm = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [isOauthPending, startOauth] = useTransition();
  const handleOauth = (provider: "google" | "github") =>
    startOauth(() => oauthSignInAction(provider));

  const { control, handleSubmit, reset } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["LoginUser"],
    mutationFn: loginAction,
    onSuccess: async (result) => {
      if (result.success) {
        toast.success("ورود به حساب کاربری با موفقیت انجام شد.");
        await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
        router.replace("/");
        router.refresh();
      } else {
        toast.error(result.message);
      }
    },
    onError: () => {
      toast.error("مشکلی در فرایند ورود پیش آمد لطفا مجدد تلاش کنید.");
    },
  });

  const onSubmit = (data: LoginValues) => mutate(data);

  useEffect(() => {
    return () => reset();
  }, [reset]);

  return (
    <>
      <div className="flex flex-row items-center justify-between sm:gap-4 gap-2 w-full">
        <SignButton
          text="Github"
          icon={<GithubIcon />}
          disabled={isOauthPending}
          onClick={() => handleOauth("github")}
        />
        <SignButton
          text="Google"
          icon={<GoogleIcon />}
          disabled={isOauthPending}
          onClick={() => handleOauth("google")}
        />
      </div>
      <div className="flex items-center justify-center gap-3.5 w-full">
        <div className="h-0.5 2xl:w-4/10 xl:w-3/10 sm:w-4/10 w-3/10 bg-linear-to-r from-neutral-900/94 from-6% to-neutral-900/0 to-100%" />
        <span className="font-semibold 2xl:text-base xl:text-[14px] sm:text-base text-[12px] leading-6 text-neutral-900">
          یا میتونید
        </span>
        <div className="h-0.5 2xl:w-4/10 xl:w-3/10 sm:w-4/10 w-3/10 bg-linear-to-l from-neutral-900/94 from-6% to-neutral-900/0 to-100%" />
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col sm:gap-6 gap-4 w-full"
      >
        <TextInput<LoginValues>
          control={control}
          name="email"
          type="text"
          variableName="fullSm"
          icons={User02Icon}
          placeholder="ایمیل خود را وارد کنید"
        />
        <TextInput<LoginValues>
          control={control}
          name="password"
          type="password"
          variableName="fullSm"
          icons={LockKeyIcon}
          placeholder="رمز عبور خود را وارد کنید"
          description={
            <Link href="/auth/forgot-password">
              رمز عبور خود را فراموش کرده اید ؟
            </Link>
          }
        />
        <Button disabled={isPending} type="submit" variant="primary" size="lg">
          <p className="sm:text-base text-[14px]">
            {isPending ? "در حال ارسال درخواست" : "ورود به حساب کاربری"}
          </p>
        </Button>
      </form>
    </>
  );
};

export default LoginForm;

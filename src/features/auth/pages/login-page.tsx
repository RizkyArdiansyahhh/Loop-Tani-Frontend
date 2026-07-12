"use client";
import { Controller, useForm } from "react-hook-form";
import { loginFormSchema, LoginFormSchema } from "../forms/login";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CutoutCard from "@/components/ui/cutout-card";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { useTranslations } from "next-intl";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { useLoginForm } from "../hooks/use-login-form";
import ButtonAuthGoogle from "../components/button-auth-google";

const LoginPage = () => {
  const t = useTranslations("auth.login");
  const { form, onSubmit } = useLoginForm();

  return (
    <div className="flex h-screen w-screen flex-col p-4 gap-4 md:flex-row">
      {/* Mobile Top Image (hidden on md+) */}
      <div className="w-full h-40 sm:h-48 shrink-0 md:hidden overflow-hidden rounded-[24px] relative">
        <Image
          src="/images/auth-1.jpg"
          alt="Auth Banner"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
      </div>

      {/* Form side */}
      <div className="flex h-full w-full flex-col overflow-y-auto md:w-1/2">
        <div>
          <Image
            src="/images/logo-putih.png"
            alt="Logo"
            width={100}
            height={18}
            priority
          />
        </div>

        <div className="flex flex-1 w-full items-center justify-center py-8  lg:pt-10">
          <div className="w-full max-w-md px-2 sm:px-4 ">
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2 sm:text-3xl">
                {t("title")}
              </h1>
              <p className="text-sm sm:text-md">{t("description")}</p>
            </div>

            <div className="w-full">
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
              >
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-rhf-input-username">
                        Email
                      </FieldLabel>
                      <Input
                        {...field}
                        id="form-rhf-input-username"
                        aria-invalid={fieldState.invalid}
                        placeholder={t("email.placeholder")}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                ></Controller>
                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-rhf-input-username">
                        Password
                      </FieldLabel>
                      <Input
                        {...field}
                        id="form-rhf-input-username"
                        aria-invalid={fieldState.invalid}
                        placeholder={t("password.placeholder")}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                ></Controller>
                <div className="flex items-center justify-between">
                  <Controller
                    name="remember"
                    control={form.control}
                    render={({ field }) => (
                      <Field orientation="horizontal">
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          id="checkout-7j9-same-as-shipping-wgm"
                        />
                        <FieldLabel
                          htmlFor="checkout-7j9-same-as-shipping-wgm"
                          className="font-normal"
                        >
                          {t("rememberMe")}
                        </FieldLabel>
                      </Field>
                    )}
                  ></Controller>
                  <Link
                    href={"/forgot-password"}
                    className="text-primary text-sm text-right"
                  >
                    {t("forgotPassword")}
                  </Link>
                </div>

                <div className="mt-8 flex flex-col gap-4">
                  <Button className="w-full h-10" type="submit">
                    {t("button")}
                  </Button>
                  <ButtonAuthGoogle type="login" />
                  <div className="flex items-center gap-2 justify-center text-sm">
                    <p>{t("noAccount")}</p>
                    <Link
                      className="font-semibold text-primary underline"
                      href={"/register"}
                    >
                      {t("register")}
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Image side — visible on tablet & desktop (md+) */}
      <div className="hidden h-full w-1/2 md:block">
        <CutoutCard
          image="/images/auth-1.jpg"
          label="Featured"
          className="w-full h-full"
        />
      </div>
    </div>
  );
};

export default LoginPage;

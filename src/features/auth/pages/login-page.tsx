"use client";

import { Controller } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { useLoginForm } from "../hooks/use-login-form";
import ButtonAuthGoogle from "../components/button-auth-google";
import { AuthCarousel } from "../components/auth-carousel";

const LoginPage = () => {
  const t = useTranslations("auth.login");
  const { form, onSubmit } = useLoginForm();

  return (
    <div className="flex h-screen w-screen flex-col p-4 gap-4 md:flex-row bg-background">
      {/* Mobile Top Carousel Banner (hidden on md+) */}
      <div className="w-full h-56 shrink-0 md:hidden">
        <AuthCarousel className="w-full h-full" />
      </div>

      {/* Form side */}
      <div className="flex h-full w-full flex-col overflow-y-auto md:w-1/2 p-2 md:p-6">
        <div>
          <Image
            src="/images/logo-putih.png"
            alt="Logo"
            width={100}
            height={18}
            priority
          />
        </div>

        <div className="flex flex-1 w-full items-center justify-center py-6 lg:pt-10">
          <div className="w-full max-w-md px-2 sm:px-4">
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2 sm:text-3xl text-foreground">
                {t("title")}
              </h1>
              <p className="text-sm sm:text-md text-muted-foreground">{t("description")}</p>
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
                />
                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-rhf-input-password">
                        Password
                      </FieldLabel>
                      <Input
                        {...field}
                        type="password"
                        id="form-rhf-input-password"
                        aria-invalid={fieldState.invalid}
                        placeholder={t("password.placeholder")}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
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
                  />
                  <Link
                    href={"/forgot-password"}
                    className="text-primary text-sm text-right hover:underline"
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
                    <p className="text-muted-foreground">{t("noAccount")}</p>
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

      {/* Image side — Auth Carousel visible on tablet & desktop (md+) */}
      <div className="hidden h-full w-1/2 md:block">
        <AuthCarousel className="w-full h-full" />
      </div>
    </div>
  );
};

export default LoginPage;

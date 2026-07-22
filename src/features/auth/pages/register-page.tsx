"use client";

import { Controller } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { useRegisterForm } from "../hooks/use-register-form";
import ButtonAuthGoogle from "../components/button-auth-google";
import { AuthCarousel } from "../components/auth-carousel";

const RegisterPage = () => {
  const t = useTranslations("auth.register");
  const { form, onSubmit } = useRegisterForm();

  return (
    <div className="flex h-screen w-screen flex-col p-4 gap-4 md:flex-row bg-background">
      {/* Mobile Top Banner (hidden on md+) */}
      <div className="w-full h-56 shrink-0 md:hidden">
        <AuthCarousel className="w-full h-full" />
      </div>

      {/* Image side — visible on tablet & desktop (md+) */}
      <div className="hidden h-full w-1/2 md:block">
        <AuthCarousel className="w-full h-full" />
      </div>

      {/* Form side */}
      <div className="flex h-full w-full flex-col justify-between overflow-y-auto md:w-1/2 p-2 md:p-6">
        <div>
          <Image
            src="/images/logo-putih.png"
            alt="Logo"
            width={100}
            height={18}
            priority
          />
        </div>

        <div className="flex flex-1 w-full items-center justify-center py-6 lg:pt-6">
          <div className="w-full max-w-md px-2 sm:px-4 flex flex-col justify-center">
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2 text-foreground">{t("title")}</h1>
              <p className="text-md text-muted-foreground">{t("description")}</p>
            </div>

            <div className="w-full">
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
              >
                {/* Full Name */}
                <Controller
                  name="name"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-register-name">
                        {t("name.label")}
                      </FieldLabel>
                      <Input
                        {...field}
                        id="form-register-name"
                        aria-invalid={fieldState.invalid}
                        placeholder={t("name.placeholder")}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* Email */}
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-register-email">
                        {t("email.label")}
                      </FieldLabel>
                      <Input
                        {...field}
                        id="form-register-email"
                        aria-invalid={fieldState.invalid}
                        placeholder={t("email.placeholder")}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* Password */}
                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-register-password">
                        {t("password.label")}
                      </FieldLabel>
                      <Input
                        {...field}
                        type="password"
                        id="form-register-password"
                        aria-invalid={fieldState.invalid}
                        placeholder={t("password.placeholder")}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* Confirm Password */}
                <Controller
                  name="confirmPassword"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-register-confirmPassword">
                        {t("confirmPassword.label")}
                      </FieldLabel>
                      <Input
                        {...field}
                        type="password"
                        id="form-register-confirmPassword"
                        aria-invalid={fieldState.invalid}
                        placeholder={t("confirmPassword.placeholder")}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* Agree Checkbox */}
                <Controller
                  name="agree"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field
                      orientation="horizontal"
                      data-invalid={fieldState.invalid}
                    >
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        id="form-register-agree"
                      />
                      <FieldLabel
                        htmlFor="form-register-agree"
                        className="font-normal text-sm cursor-pointer text-muted-foreground"
                      >
                        {t("agreeTerms")}
                      </FieldLabel>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <div className="mt-4 flex flex-col gap-4">
                  <Button
                    className="w-full h-10"
                    type="submit"
                    isLoading={form.formState.isSubmitting}
                    disabled={
                      !form.formState.isValid || form.formState.isSubmitting
                    }
                  >
                    {t("button")}
                  </Button>
                  <ButtonAuthGoogle type="register" />
                  <div className="flex items-center gap-2 justify-center text-sm">
                    <p className="text-muted-foreground">{t("haveAccount")}</p>
                    <Link
                      className="font-semibold text-primary underline"
                      href={"/login"}
                    >
                      {t("login")}
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

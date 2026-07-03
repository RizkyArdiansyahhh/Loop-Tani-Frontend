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
import {  useTranslations } from "next-intl";


const LoginPage = () => {
  const t = useTranslations("auth.login");
  const form = useForm<LoginFormSchema>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginFormSchema),
  });
  

  const onSubmit = (data: LoginFormSchema) => {
    console.log('oke')

  };

  return (
    <div className="w-screen h-screen flex flex-row p-4 gap-4">
      <div className="w-1/2 h-full flex items-center justify-center ">
      <LanguageSwitcher></LanguageSwitcher>
        <div className="w-[50%] h-[50%]">
          <h1>{t("title")}</h1>
          <form onSubmit={form.handleSubmit(onSubmit)}>
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
                    placeholder="shadcn"
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
                    placeholder="********"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            ></Controller>

            <Button className="w-full bg-foreground" type="submit">
              Login
            </Button>
          </form>
        </div>

      </div>

      <div className="w-1/2 h-full">
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

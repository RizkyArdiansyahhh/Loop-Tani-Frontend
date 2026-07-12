import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginFormSchema, LoginFormSchema } from "../forms/login";
import { authClient, useAuthError } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";

export const useLoginForm = () => {
  const router = useRouter();
  const { getErrorMessage } = useAuthError();
  const form = useForm<LoginFormSchema>({
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
    resolver: zodResolver(loginFormSchema),
  });

  const onSubmit = async (data: LoginFormSchema) => {
    try {
      const { error } = await authClient.signIn.email({
        email: data.email,
        password: data.password,
        rememberMe: data.remember,
      });

      if (error) {
        console.log("LOGIN ERROR:", error);
        toast.error(getErrorMessage(error.code));
        return;
      }

      toast.success("Login berhasil!");
      router.push("/");
    } catch (err: any) {
      toast.error(err?.message || getErrorMessage("generic"));
    }
  };

  return {
    form,
    onSubmit,
  };
};

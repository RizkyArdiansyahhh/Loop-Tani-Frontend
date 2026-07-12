import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerFormSchema, RegisterFormSchema } from "../forms/register";
import { authClient, useAuthError } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";

export const useRegisterForm = () => {
  const router = useRouter();
  const { getErrorMessage } = useAuthError();
  const form = useForm<RegisterFormSchema>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      agree: false,
    },
    resolver: zodResolver(registerFormSchema),
  });

  const onSubmit = async (data: RegisterFormSchema) => {
    try {
      const { error } = await authClient.signUp.email({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      if (error) {
        toast.error(getErrorMessage(error.code));
        return;
      }

      toast.success("Successfully registered! Please verify your email.");
      router.push("/login");
    } catch (err: any) {
      toast.error(
        err?.message || getErrorMessage("generic"),
      );
    }
  };

  return {
    form,
    onSubmit,
  };
};

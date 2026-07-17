import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginFormSchema, LoginFormSchema } from "../forms/login";
import { authClient, useAuthError } from "@/lib/auth-client";
import { getProfile } from "@/features/profile/api/get-profile";
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

      // Fetch user profile to check roles
      const profile = await getProfile();
      console.log("LOGIN SUCCESS! Profile details:", profile);
      toast.success("Login berhasil!");
      
      if (profile?.roles?.includes("ADMIN")) {
        console.log("Redirecting to /admin as ADMIN");
        router.push("/admin");
      } else {
        console.log("Redirecting to / as normal user");
        router.push("/");
      }
    } catch (err: any) {
      console.error("LOGIN EXCEPTION:", err);
      toast.error(err?.message || getErrorMessage("generic"));
    }
  };

  return {
    form,
    onSubmit,
  };
};

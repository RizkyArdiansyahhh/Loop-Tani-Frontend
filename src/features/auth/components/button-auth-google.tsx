"use client";

import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { signInGoogle, useAuthError } from "@/lib/auth-client";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

interface ButtonAuthGoogleProps {
  type: "register" | "login";
}

const ButtonAuthGoogle = ({ type }: ButtonAuthGoogleProps) => {
  const t = useTranslations(`auth.${type}`);
  const { getErrorMessage } = useAuthError();

  const handleLoginGoogle = async () => {
    const { error } = await signInGoogle();

    if (error) {
      toast.error(getErrorMessage(error.code));
    }
  };

  return (
    <Button
      className="w-full h-10"
      type="button"
      variant="outline"
      onClick={handleLoginGoogle}
    >
      <FcGoogle className="mr-4 h-6 w-6" />
      {t("google")}
    </Button>
  );
};

export default ButtonAuthGoogle;

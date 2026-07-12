import { createAuthClient } from "better-auth/react";
import { useTranslations } from "next-intl";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const useAuthError = () => {
  const t = useTranslations("auth.errors");

  const getErrorMessage = (code?: string | null) => {
    if (!code) return t("generic");

    const knownCodes = [
      "USER_ALREADY_EXISTS",
      "INVALID_EMAIL_OR_PASSWORD",
      "EMAIL_NOT_VERIFIED",
      "PASSWORD_TOO_SHORT",
      "INVALID_EMAIL",
      "FAILED_TO_SEND_VERIFICATION_EMAIL",
      "SESSION_EXPIRED",
      "UNAUTHORIZED",
      "USER_NOT_FOUND",
      "INVALID_LINK",
      "LINK_EXPIRED",
      "TOO_MANY_REQUESTS",
      "INTERNAL_SERVER_ERROR",
    ];

    if (knownCodes.includes(code)) {
      return t(code);
    }

    return t("generic");
  };

  return { getErrorMessage };
};

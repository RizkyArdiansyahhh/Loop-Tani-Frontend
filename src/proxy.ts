import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except for the ones starting with:
  // - api (API routes)
  // - _next (Next.js internals)
  // - public files with extensions (e.g. favicon.ico, images, etc.)
  matcher: ["/((?!api|_next|.*\\..*|favicon.ico).*)"],
};

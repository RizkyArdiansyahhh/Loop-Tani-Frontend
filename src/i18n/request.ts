import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = (await requestLocale) ?? routing.defaultLocale;
  const safeLocale = ["id", "en"].includes(locale) ? locale : "id";

  // Dynamically import all json files for the locale
  const [
    analyzer,
    admin,
    auth,
    fertilizer,
    navbar,
    panduan,
    profile,
    seller,
    about,
    home,
  ] = await Promise.all([
    import(`../../messages/${safeLocale}/analyzer.json`).then(m => m.default).catch(() => ({})),
    import(`../../messages/${safeLocale}/admin.json`).then(m => m.default).catch(() => ({})),
    import(`../../messages/${safeLocale}/auth.json`).then(m => m.default).catch(() => ({})),
    import(`../../messages/${safeLocale}/fertilizer.json`).then(m => m.default).catch(() => ({})),
    import(`../../messages/${safeLocale}/navbar.json`).then(m => m.default).catch(() => ({})),
    import(`../../messages/${safeLocale}/panduan.json`).then(m => m.default).catch(() => ({})),
    import(`../../messages/${safeLocale}/profile.json`).then(m => m.default).catch(() => ({})),
    import(`../../messages/${safeLocale}/seller.json`).then(m => m.default).catch(() => ({})),
    import(`../../messages/${safeLocale}/about.json`).then(m => m.default).catch(() => ({})),
    import(`../../messages/${safeLocale}/home.json`).then(m => m.default).catch(() => ({})),
  ]);

  return {
    locale: safeLocale,
    messages: {
      ...analyzer,
      ...admin,
      ...auth,
      ...fertilizer,
      ...navbar,
      ...panduan,
      ...profile,
      ...seller,
      ...about,
      ...home,
    },
  };
});

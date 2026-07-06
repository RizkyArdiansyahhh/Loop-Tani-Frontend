import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import fs from "fs";
import path from "path";

function loadMessages(locale: string) {
  const safeLocale = ["id", "en"].includes(locale) ? locale : "id";

  const dir = path.join(process.cwd(), "messages", safeLocale);

  console.log("LOADED MESSAGES:", safeLocale);

  const files = fs.readdirSync(dir);

  return files.reduce((acc, file) => {
    const content = JSON.parse(fs.readFileSync(path.join(dir, file), "utf-8"));

    return {
      ...acc,
      ...content,
    };
  }, {});
}

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = (await requestLocale) ?? routing.defaultLocale;

  return {
    locale,
    messages: loadMessages(locale),
  };
});

import "server-only";
import { cookies } from "next/headers";
import { i18n, type Locale } from "~/i18n-config";

const dictionaries = {
  en: () => import("~/dictionaries/en.json").then((module) => module.default),
  sv: () => import("~/dictionaries/sv.json").then((module) => module.default),
};

export const getDictionary = async () => {
  return dictionaries[await getLocale()]();
};

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const storedLocale = cookieStore.get("lang")?.value;
  const locale =
    storedLocale && i18n.locales.includes(storedLocale as Locale)
      ? storedLocale
      : i18n.defaultLocale;
  return locale as Locale;
}

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;

export type StatusDictionary = Dictionary["taskStatus"];

export type TypeDictionary = Dictionary["taskType"];

export type TaskTableHeaderDictionary = Dictionary["taskPage"]["columns"];

export const i18n = {
  defaultLocale: "en",
  locales: ["en", "sv"],
  domains: [
    {
      domain: "planner.gyback.com",
      defaultLocale: "en",
      locales: ["en", "sv"],
    },
    {
      domain: "planner.gyback.se",
      defaultLocale: "sv",
      locales: ["en", "sv"],
    },
  ],
} as const;

export type Locale = (typeof i18n)["locales"][number];

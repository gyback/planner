import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { enGB, svSE } from "@clerk/localizations";
import { i18n } from "~/i18n-config";
import { cookies } from "next/headers";
import { ThemeProvider } from "~/components/theme-provider";
import { ModeToggle } from "~/components/theme-mode-toggle";

export const metadata: Metadata = {
  title: "Planner",
  description: "Task management app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = await cookies();
  const lang = cookieStore.get("lang")?.value ?? i18n.defaultLocale;
  return (
    <html lang={lang} className={`${geist.variable}`}>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClerkProvider localization={lang === "sv" ? svSE : enGB}>
            <TRPCReactProvider>
              <header className="flex items-center justify-end gap-4 p-4">
                <ModeToggle />
                <SignedOut>
                  <SignInButton />
                </SignedOut>
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </header>
              {children}
            </TRPCReactProvider>
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

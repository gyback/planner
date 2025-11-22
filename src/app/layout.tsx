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
    <ClerkProvider localization={lang === "sv" ? svSE : enGB}>
      <html lang={lang} className={`${geist.variable}`}>
        <body>
          <TRPCReactProvider>
            <header>
              <SignedOut>
                <SignInButton />
                <SignUpButton>
                  <button className="text-ceramic-white h-10 cursor-pointer rounded-full bg-[#6c47ff] px-4 text-sm font-medium sm:h-12 sm:px-5 sm:text-base">
                    Sign Up
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </header>
            {children}
          </TRPCReactProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

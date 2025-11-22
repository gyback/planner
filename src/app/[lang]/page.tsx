import { api, HydrateClient } from "~/trpc/server";
import { SignedOut } from "@clerk/nextjs";
import WelcomePage from "~/app/[lang]/welcomePage";
import type { Locale } from "~/i18n-config";

export default async function Home() {
  void api.task.getLatestList.prefetch();
  return (
    <HydrateClient>
      <SignedOut>
        <WelcomePage />
      </SignedOut>
    </HydrateClient>
  );
}

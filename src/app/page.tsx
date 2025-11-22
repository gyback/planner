import { api, HydrateClient } from "~/trpc/server";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import WelcomePage from "./welcomePage";

export default async function Home() {
  void api.task.getLatestList.prefetch();
  return (
    <HydrateClient>
      <SignedOut>
        <WelcomePage />
      </SignedOut>
      <SignedIn>Dashboard</SignedIn>
    </HydrateClient>
  );
}

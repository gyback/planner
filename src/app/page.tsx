import { SignedIn, SignedOut } from "@clerk/nextjs";
import WelcomePage from "./welcome";
import Dashboard from "./dashboard";

export default async function Home() {
  return (
    <>
      <SignedOut>
        <WelcomePage />
      </SignedOut>
      <SignedIn>
        <Dashboard />
      </SignedIn>
    </>
  );
}

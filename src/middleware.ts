import { clerkMiddleware } from "@clerk/nextjs/server";
import { composeMiddlewares } from "~/middlewares/middlewareHandler";
import { localeMiddleware } from "~/middlewares/localeMiddleware";

const middlewares = [clerkMiddleware, localeMiddleware];
export default composeMiddlewares({
  auth: clerkMiddleware(),
  locale: localeMiddleware(),
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

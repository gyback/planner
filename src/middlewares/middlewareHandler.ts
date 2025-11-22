import { NextFetchEvent, type NextMiddleware, NextRequest } from "next/server";
import type { NextMiddlewareResult } from "next/dist/server/web/types";

// Source - https://stackoverflow.com/questions/76603369/how-to-use-multiple-middlewares-in-next-js-using-the-middleware-ts-file
// Posted by agate
// Retrieved 2025-11-22, License - CC BY-SA 4.0

export const composeMiddlewares = (middlewares: {
  [key: string]: NextMiddleware;
}) => {
  return (req: NextRequest, event: NextFetchEvent) => {
    const parsedMiddlewares = Object.entries(middlewares);
    const initialResponse: Promise<NextMiddlewareResult> =
      Promise.resolve(undefined);

    return parsedMiddlewares.reduce(
      (prevPromise, [middlewareName, middleware]) => {
        return prevPromise.then((res) => {
          if (res?.status != undefined) {
            console.debug(`[middleware][short-circuited] - ${middlewareName}`);
            return res;
          } else {
            console.debug(`[middleware] - ${middlewareName}`);
            return middleware(req, event);
          }
        });
      },
      initialResponse,
    );
  };
};

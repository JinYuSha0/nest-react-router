import type { TypedResponse, TypedDeferredData } from "@remix-run/node";
import {
  useLoaderData as useRemixLoaderData,
  useActionData as useRemixActionData,
} from "@remix-run/react";
export { usePromiseSubmit } from "./client/usePromiseSubmit";

export type AnyFunction = (...args: any) => any;

type ExcludeNever<T> = T extends TypedResponse<never> ? never : T;

export type RemixReturnType<T, P extends keyof T> = T[P] extends AnyFunction
  ? Awaited<ReturnType<T[P]>> extends TypedResponse
    ? ExcludeNever<Awaited<ReturnType<Awaited<ReturnType<T[P]>>["json"]>>>
    : Awaited<ReturnType<T[P]>> extends TypedDeferredData<any>
      ? ExcludeNever<Awaited<ReturnType<T[P]>>>["data"]
      : ExcludeNever<Awaited<ReturnType<T[P]>>>
  : never;

export type LoaderReturnType<
  T extends { loader?: AnyFunction } & object,
  P extends keyof T = "loader",
> = RemixReturnType<T, P>;

export type ActionReturnType<
  T extends { action?: AnyFunction } & object,
  P extends keyof T = "action",
> = RemixReturnType<T, P>;

export const useLoaderData = <
  T extends { loader?: AnyFunction } & object,
  P extends keyof T = "loader",
>(
  ...args: any
): LoaderReturnType<T, P> => useRemixLoaderData.apply(null, args);

export const useActionData = <
  T extends { action?: AnyFunction } & object,
  P extends keyof T = "action",
>(
  ...args: any
): ActionReturnType<T, P> => useRemixActionData.apply(null, args);

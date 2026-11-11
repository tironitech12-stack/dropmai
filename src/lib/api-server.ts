import { cookies } from "next/headers";
import { apiFetch } from "./api";

/** Server-only helper: forwards dropmai_session to the Nest API. */
export async function apiFetchServer<T = unknown>(
  path: string,
  options: RequestInit & { json?: unknown } = {},
): Promise<T> {
  const jar = await cookies();
  const session = jar.get("dropmai_session")?.value;
  return apiFetch<T>(path, {
    ...options,
    cookieHeader: session ? `dropmai_session=${session}` : undefined,
  });
}

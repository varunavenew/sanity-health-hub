/** Next.js `notFound()` throws an error with this digest — must not be swallowed. */
export function isNotFoundError(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "digest" in err &&
    (err as { digest?: string }).digest === "NEXT_NOT_FOUND"
  );
}

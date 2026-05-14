// Ambient Deno typings for editor — runtime is provided by the Edge Function host.
declare namespace Deno {
  export const env: {
    get(key: string): string | undefined;
  };
  export function serve(handler: (req: Request) => Response | Promise<Response>): void;
}

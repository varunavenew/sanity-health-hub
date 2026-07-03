import { cva } from "class-variance-authority";

/** Dark header nav triggers — matches shadcn NavigationMenu with CMedical styling. */
export const siteNavMenuTriggerStyle = cva(
  "group inline-flex h-10 w-max items-center justify-center rounded-full bg-transparent px-3 py-1.5 text-sm font-light text-white transition-colors hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-white/10 data-[state=open]:bg-white/10",
);

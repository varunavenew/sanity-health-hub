import { cva } from "class-variance-authority";

/** Dark header nav triggers — matches reference desktop header (avenewdemo). */
export const siteNavMenuTriggerStyle = cva(
  "block bg-transparent px-1.5 lg:px-3 py-1.5 text-xs lg:text-sm font-light text-white rounded-2xl md:rounded-full transition-all hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-white/10 data-[state=open]:bg-white/10",
);

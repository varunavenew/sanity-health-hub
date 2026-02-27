import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-4 pointer-events-auto w-full", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-6 sm:space-x-6 sm:space-y-0 w-full",
        month: "space-y-6 w-full",
        caption: "flex justify-center pt-2 relative items-center",
        caption_label: "text-lg font-semibold text-foreground",
        nav: "space-x-2 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-10 w-10 bg-transparent p-0 opacity-70 hover:opacity-100 hover:bg-accent transition-all",
        ),
        nav_button_previous: "absolute left-2",
        nav_button_next: "absolute right-2",
        table: "w-full border-collapse",
        head_row: "flex w-full justify-between",
        head_cell: "text-muted-foreground rounded-md flex-1 h-10 font-medium text-sm flex items-center justify-center",
        row: "flex w-full mt-1 justify-between",
        cell: "h-12 flex-1 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20 flex items-center justify-center",
        day: cn(buttonVariants({ variant: "ghost" }), "h-11 w-11 p-0 font-medium aria-selected:opacity-100 hover:bg-accent/50 transition-colors rounded-lg"),
        day_range_end: "day-range-end",
        day_selected:
          "bg-brand-dark text-white hover:bg-brand-dark hover:text-white focus:bg-brand-dark focus:text-white shadow-md rounded-lg font-semibold",
        day_today: "border-2 border-primary text-foreground font-semibold",
        day_outside:
          "day-outside text-muted-foreground opacity-40 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-30 cursor-not-allowed",
        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ..._props }) => <ChevronLeft className="h-5 w-5" />,
        IconRight: ({ ..._props }) => <ChevronRight className="h-5 w-5" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };

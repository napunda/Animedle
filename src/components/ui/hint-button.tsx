import React from "react";
import { cva } from "class-variance-authority";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { InfoIcon } from "lucide-react";

export interface HintButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  hintAvailable?: boolean;
  children: React.ReactNode;
  toolTipText?: string;
}
export const HintButton = ({
  hintAvailable = false,
  children,
  toolTipText,
  ...props
}: HintButtonProps) => {
  const buttonVariants = cva("grid place-items-center gap-3 hover:bg-inherit", {
    variants: {
      hintAvailable: {
        true: "opacity-100 pointer-events-auto cursor-pointer",
        false: "opacity-40 pointer-events-none cursor-default",
      },
    },
    defaultVariants: {
      hintAvailable: hintAvailable,
    },
  });
  return (
    <>
      {hintAvailable && (
        <div {...props} className={buttonVariants({ hintAvailable })}>
          {children}
        </div>
      )}
      {!hintAvailable && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="cursor-default">
              <div {...props} className={buttonVariants({ hintAvailable })}>
                {children}
              </div>
            </TooltipTrigger>
            <TooltipContent className="grid place-items-center" side="bottom">
              <InfoIcon className="h-[1.3rem] w-[1.3rem]" />
              <span className="mt-1 text-sm">{toolTipText}</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </>
  );
};

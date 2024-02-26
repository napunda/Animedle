import { Loader2 } from "lucide-react";

export const LoadingSpinner = ({ className }: { className?: string }) => (
  <Loader2
    className={"h-[3rem] w-[3rem] animate-spin text-primary " + className}
  />
);

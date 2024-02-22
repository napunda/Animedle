import { useRef, useEffect } from "react";
import { Fancybox as NativeFancybox } from "@fancyapps/ui";
import { OptionsType } from "@fancyapps/ui/types/Fancybox/options";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

interface FancyboxProps {
  delegate?: string;
  options?: Partial<OptionsType>;
}

const Fancybox = ({ delegate, options }: FancyboxProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;

    NativeFancybox.bind(
      container,
      delegate ?? "[data-fancybox]",
      options ?? {}
    );

    return () => {
      NativeFancybox.unbind(container);
    };
  }, [delegate, options]);

  return <div ref={containerRef}></div>;
};
const showFancybox = (items: string[]) => {
  NativeFancybox.show(items.map((item) => ({ src: item })));
};
export { Fancybox, showFancybox };

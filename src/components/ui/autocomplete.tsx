import React, {
  useRef,
  useEffect,
  ForwardRefExoticComponent,
  forwardRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";

export interface AutocompleteProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  options: IOptions[];
  onSelectOption: (option: IOptions) => void;
  setInputValue: (value: string) => void;
}

export interface IOptions {
  id: number;
  title: string;
}

export const Autocomplete: ForwardRefExoticComponent<AutocompleteProps> =
  forwardRef<HTMLInputElement, AutocompleteProps>(
    (
      { className, type, options, onSelectOption, setInputValue, ...props },
      ref
    ) => {
      const inputRef = useRef<HTMLInputElement>(null);
      const listRef = useRef<HTMLUListElement>(null);
      const [optionsState, setOptionsState] = useState<IOptions[]>(options);
      const [highlightedOption, setHighlightedOption] = useState<number | null>(
        null
      );

      const handleOptionSelect = (option: string) => {
        if (inputRef.current) {
          setInputValue(option);
          const selectedOption = optionsState.find((o) => o.title === option);
          if (selectedOption) {
            onSelectOption(selectedOption);
          }
        }
        setOptionsState([]);
      };

      const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const keysActions: { [key: string]: () => void } = {
          ArrowDown: () => {
            setHighlightedOption((prev) =>
              prev === null || prev === optionsState.length - 1 ? 0 : prev + 1
            );
          },
          ArrowUp: () => {
            setHighlightedOption((prev) =>
              prev === null || prev === 0 ? optionsState.length - 1 : prev - 1
            );
          },
          Enter: () => {
            if (highlightedOption !== null) {
              handleOptionSelect(optionsState[highlightedOption].title);
              setHighlightedOption(null);
              setOptionsState([]);
            }
          },
        };

        const action = keysActions[e.key];
        if (action) {
          e.preventDefault();
          action();
        }
      };

      const handleOnBlur = () => {
        setTimeout(() => {
          setOptionsState([]);
        }, 200);
      };
      const handleOnFocus = () => {
        setTimeout(() => {
          const inputValue = inputRef.current?.value?.toLowerCase() ?? "";
          const foundOption = options.find(
            (option) => option.title.toLowerCase() === inputValue
          );

          if (!foundOption) {
            setOptionsState(options);
          }
        }, 200);
      };

      useEffect(() => {
        if (ref) {
          if (typeof ref === "function") {
            ref(inputRef.current);
          } else {
            ref.current = inputRef.current;
          }
        }
      }, [ref]);

      useEffect(() => {
        setOptionsState(options);
      }, [options]);

      useEffect(() => {
        if (highlightedOption !== null && listRef.current) {
          const highlightedItem = listRef.current.childNodes[
            highlightedOption
          ] as HTMLLIElement;

          if (highlightedItem) {
            highlightedItem.scrollIntoView({
              behavior: "smooth",
              block: "nearest",
            });
          }
        }
      }, [highlightedOption]);

      return (
        <div className="relative w-full">
          <input
            type={type}
            className={cn(
              "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
              className
            )}
            ref={inputRef}
            onKeyDown={handleKeyDown}
            onBlur={handleOnBlur}
            onFocus={handleOnFocus}
            {...props}
          />
          {optionsState.length > 0 && (
            <ul
              ref={listRef}
              className="absolute z-10 mt-1 w-full bg-card shadow-sm border max-h-[12rem] overflow-y-auto overflow-x-hidden"
            >
              {optionsState.map(({ id, title }, index) => (
                <li key={id}>
                  <button
                    className={cn(
                      "px-3 py-2 cursor-pointer hover:bg-primary transition-colors select-none w-full text-left ",
                      highlightedOption === index && "bg-primary text-white"
                    )}
                    onClick={() => handleOptionSelect(title)}
                    onMouseEnter={() => setHighlightedOption(index)}
                  >
                    <p className="text-ellipsis line-clamp-1">{title}</p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      );
    }
  );
Autocomplete.displayName = "Autocomplete";

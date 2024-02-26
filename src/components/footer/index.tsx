import { useReducer } from "react";
import { useLocation } from "react-router-dom";
import { useConfigStore } from "@/stores/ConfigState";
import { Button } from "../ui/button";
import { Dialog } from "./components/dialog";
import { HelpCircle } from "lucide-react";
import TwitterIcon from "@/assets/img/icons/twitter-icon.svg";
import BymeacoffeIcon from "@/assets/img/icons/bymeacoffe-icon.svg";
import { cva } from "class-variance-authority";

export const Footer = () => {
  const [openDialog, toggleDialog] = useReducer((state) => !state, false);
  const { content } = useConfigStore();
  const isHome = useLocation().pathname === "/";

  const buttons = {
    Bymeacoffe: {
      icon: BymeacoffeIcon,
      alt: "BymeacoffeIcon",
      anchor: content?.buymeacoffee ?? "",
      name: "buymeacoffee-button",
    },
    Twitter: {
      icon: TwitterIcon,
      alt: "TwitterIcon",
      anchor: content?.twitter ?? "",
      name: "twitter-button",
    },
  };

  const footerVariants = cva(
    "gap-6 pointer-events-none p-5 sm:p-8 sm:gap-8 flex items-center",
    {
      variants: {
        isHome: {
          true: "justify-center sm:fixed sm:inset-x-0 sm:bottom-0",
          false:
            "justify-center md:justify-end lg:fixed lg:inset-x-0 lg:bottom-0",
        },
        defaultVariants: {
          isHome,
        },
      },
    }
  );

  return (
    <footer className={footerVariants({ isHome })}>
      {Object.entries(buttons).map(([key, { icon, alt, anchor, name }]) => (
        <a key={key} href={anchor} target="_blank" rel="noopener noreferrer">
          <Button
            className="rounded-full pointer-events-auto"
            variant="ghost"
            size="icon"
            name={name}
          >
            <img
              alt={alt}
              src={icon}
              className="sm:h-[1.4rem] sm:w-[1.4rem] h-[1.2rem] w-[1.2rem] dark:filter dark:invert"
            />
          </Button>
        </a>
      ))}
      <Button
        className="rounded-full pointer-events-auto"
        variant="ghost"
        size="icon"
        onClick={toggleDialog}
        name="help-button"
      >
        <HelpCircle className="sm:h-[1.4rem] sm:w-[1.4rem] h-[1.2rem] w-[1.2rem]" />
      </Button>
      <Dialog open={openDialog} setOpenDialog={toggleDialog} />
    </footer>
  );
};

import { useReducer } from "react";
import { useLocation } from "react-router-dom";
import { useConfigStore } from "@/stores/ConfigState";
import { Button } from "../ui/button";
import { Dialog } from "./components/dialog";
import { HelpCircle } from "lucide-react";
import TwitterIcon from "@/assets/img/icons/twitter-icon.svg";
import BymeacoffeIcon from "@/assets/img/icons/bymeacoffe-icon.svg";

export const Footer = () => {
  const [openDialog, toggleDialog] = useReducer((state) => !state, false);
  const { content } = useConfigStore();
  const isHome = useLocation().pathname === "/";

  const buttons = {
    Bymeacoffe: {
      icon: BymeacoffeIcon,
      alt: "BymeacoffeIcon",
      anchor: content?.buymeacoffee ?? "",
    },
    Twitter: {
      icon: TwitterIcon,
      alt: "TwitterIcon",
      anchor: content?.twitter ?? "",
    },
  };

  return (
    <footer
      className={
        `fixed inset-x-0 bottom-0 p-8 flex items-center gap-8` +
        (isHome ? ` justify-center` : ` justify-end`)
      }
    >
      {Object.entries(buttons).map(([key, { icon, alt, anchor }]) => (
        <a key={key} href={anchor} target="_blank" rel="noopener noreferrer">
          <Button className="rounded-full" variant="ghost" size="icon">
            <img
              alt={alt}
              src={icon}
              className="h-[1.4rem] w-[1.4rem] dark:filter dark:invert"
            />
          </Button>
        </a>
      ))}
      <Button
        className="rounded-full"
        variant="ghost"
        size="icon"
        onClick={toggleDialog}
      >
        <HelpCircle className="h-[1.4rem] w-[1.4rem]" />
      </Button>
      <Dialog open={openDialog} setOpenDialog={toggleDialog} />
    </footer>
  );
};

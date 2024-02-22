import ArrowUpIcon from "@/assets/img/icons/arrow_up_icon.svg";
import ArrowDownIcon from "@/assets/img/icons/arrow_down_icon.svg";
import CheckIcon from "@/assets/img/icons/check_icon.svg";
import XMarkIcon from "@/assets/img/icons/xmark_icon.svg";
import {
  Dialog as DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";

interface DialogAlertProps {
  open: boolean;
  setOpenDialog: (open: boolean) => void;
}

export const Dialog = ({ open, setOpenDialog }: DialogAlertProps) => {
  const { t } = useTranslation();
  return (
    <DialogRoot open={open} onOpenChange={setOpenDialog}>
      <DialogContent
        className="max-w-xl"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="font-extrabold text-xl">
            {t("home.infoDialog.title")}
          </DialogTitle>
        </DialogHeader>
        <div className="text-sm">
          <p className="mb-2">
            <strong className="font-bold">
              {t("home.infoDialog.subTitles.one")}
            </strong>
          </p>
          <ul>
            <li>{t("home.infoDialog.content.one")}</li>
          </ul>
          <p className="my-2">
            <strong className="font-bold">
              {t("home.infoDialog.subTitles.two")}
            </strong>
          </p>
          <ul>
            <li>{t("home.infoDialog.content.one")}</li>
          </ul>
          <p className="my-2">
            <strong className="font-bold">
              {t("home.infoDialog.subTitles.three")}
            </strong>
          </p>
          <ul>
            <li>{t("home.infoDialog.content.three")}</li>
            <ul>
              <li>{t("home.infoDialog.content.four")}</li>
              <li>{t("home.infoDialog.content.five")}</li>
              <li>{t("home.infoDialog.content.six")}</li>
            </ul>
          </ul>
          <p className="my-2">
            <strong className="font-bold">
              {t("home.infoDialog.subTitles.four")}
            </strong>
          </p>
          <ul>
            <li>{t("home.infoDialog.content.seven")}</li>
          </ul>
          <p className="my-2">
            <strong className="font-bold">
              {t("home.infoDialog.subTitles.five")}
            </strong>
          </p>
          <ul className="flex gap-y-3 flex-col">
            <li className="flex gap-2">
              <img
                className="h-[1.5rem] w-[1.5rem] dark:filter dark:invert"
                src={ArrowUpIcon}
                alt="icon"
              />
              <span>{t("home.infoDialog.content.eight")}</span>
            </li>
            <li className="flex gap-2">
              <img
                className="h-[1.5rem] w-[1.5rem] dark:filter dark:invert"
                src={ArrowDownIcon}
                alt="icon"
              />
              <span>{t("home.infoDialog.content.nine")}</span>
            </li>
            <li className="flex gap-2">
              <img
                className="h-[1.5rem] w-[1.5rem] dark:filter dark:invert"
                src={XMarkIcon}
                alt="icon"
              />
              <span>{t("home.infoDialog.content.ten")}</span>
            </li>
            <li className="flex gap-2">
              <img
                className="h-[1.5rem] w-[1.5rem] dark:filter dark:invert"
                src={CheckIcon}
                alt="icon"
              />
              <span>{t("home.infoDialog.content.eleven")}</span>
            </li>
          </ul>
          <p className="my-2">
            <strong className="font-bold">
              {t("home.infoDialog.subTitles.six")}
            </strong>
          </p>
          <ul>
            <li>{t("home.infoDialog.content.twelve")}</li>
          </ul>
        </div>
      </DialogContent>
    </DialogRoot>
  );
};

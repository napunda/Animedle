import { ModeToggle } from "./mode-toggle";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { LangToggle } from "./lang-toggle";

export const Header = () => {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const lang = navigator.language;
    i18n.changeLanguage(lang);
    document.documentElement.lang = lang;
  }, [i18n]);

  return (
    <header className="fixed flex justify-end items-center gap-3 w-full p-3">
      <ModeToggle
        lightLabel={t("home.themeButton.light")}
        darkLabel={t("home.themeButton.dark")}
        systemLabel={t("home.themeButton.system")}
      />
      <LangToggle />
    </header>
  );
};

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslation from "./locales/en.json";
import ptTranslation from "./locales/pt.json";
import esTranslation from "./locales/es.json";
import frTranslation from "./locales/fr.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: enTranslation },
    pt: { translation: ptTranslation },
    es: { translation: esTranslation },
    fr: { translation: frTranslation },
  },
  lng: "en",
  fallbackLng: "en",

  interpolation: {
    escapeValue: false,
  },
});

export default i18n;

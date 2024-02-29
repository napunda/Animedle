import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useConfigStore } from "@/stores/ConfigState";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

export const HomePage = () => {
  const { t } = useTranslation();
  const { content: homeContent, isLoading } = useConfigStore();

  return (
    <div className="h-screen">
      {!isLoading && homeContent ? (
        <div className="h-full flex justify-center items-center flex-col">
          <LazyLoadImage
            effect="opacity"
            className="h-80 drop-shadow-md dark:drop-shadow-none"
            src={
              homeContent.img
                ? import.meta.env.VITE_BASE_URL_STATIC + homeContent.img
                : ""
            }
            alt={homeContent.name ?? ""}
          />

          <Link to="/play" className="mt-10">
            <Button className="h-[4rem] w-[10rem]">
              <span className="font-bold text-xl mr-2">{t("home.button")}</span>
              <Play />
            </Button>
          </Link>
        </div>
      ) : (
        <div className="h-full flex justify-center items-center">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
};

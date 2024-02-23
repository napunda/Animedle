import { useReducer, useState } from "react";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { Music, Image, Film } from "lucide-react";
import { AudioPlayer } from "@/components/audio-player";
import { HintButton } from "@/components/hint-button";
import { Fancybox, showFancybox } from "@/components/fancy-box";
import { IStartGameContent } from "../Play.page";
import { useTranslation } from "react-i18next";
import {
  IHintOpeningContent,
  IHintScenesContent,
  IHintScreenshotsContent,
} from "../interfaces/hints";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface HintsWrapperProps {
  dailyAnimeConfig: IStartGameContent | undefined;
  fetchHintOpening: (animeId: string) => Promise<IHintOpeningContent>;
  fetchHintScenes: (animeId: string) => Promise<IHintScenesContent>;
  fetchHintScreenshots: (animeId: string) => Promise<IHintScreenshotsContent>;
}

const BASE_URL = import.meta.env.VITE_BASE_URL_STATIC;

export const HintsWrapper = ({
  dailyAnimeConfig,
  fetchHintOpening,
  fetchHintScenes,
  fetchHintScreenshots,
}: HintsWrapperProps) => {
  const { t } = useTranslation();
  const [hints, setHints] = useState<{
    opening?: string | null;
    screenshots?: string[] | null;
    scenes?: string | null;
  }>();

  const [showDialogOpening, toggleShowDialogOpening] = useReducer(
    (state) => !state,
    false
  );

  const handleShowHintScenes = async () => {
    if (!dailyAnimeConfig?.anime) return;
    const scenes = hints?.scenes;
    if (scenes && scenes !== "") {
      showFancybox([scenes]);
      return;
    }
    try {
      const { scenes } = await fetchHintScenes(dailyAnimeConfig.anime);
      setHints({
        ...hints,
        scenes: BASE_URL + scenes,
      });
      showFancybox([BASE_URL + scenes]);
    } catch (error) {
      console.error("Error fetching hint scenes:", error);
    }
  };

  const handleShowHintOpening = async () => {
    if (!dailyAnimeConfig?.anime) return;
    const opening = hints?.opening;
    if (opening && opening !== "") {
      toggleShowDialogOpening();
      return;
    }
    try {
      const { opening } = await fetchHintOpening(dailyAnimeConfig.anime);
      setHints({
        ...hints,
        opening: BASE_URL + opening,
      });
      toggleShowDialogOpening();
    } catch (error) {
      console.error("Error fetching hint opening:", error);
    }
  };

  const handleShowHintScreenshots = async () => {
    if (!dailyAnimeConfig?.anime) return;
    const screenshots = hints?.screenshots;
    if (screenshots && screenshots.length > 0) {
      showFancybox(screenshots);
      return;
    }
    try {
      const { screenshots } = await fetchHintScreenshots(
        dailyAnimeConfig.anime
      );
      const screenshotPaths = screenshots.list.map((s) => BASE_URL + s.path);

      setHints({ ...hints, screenshots: screenshotPaths });

      if (screenshotPaths.length > 0) {
        showFancybox(screenshotPaths);
      }
    } catch (error) {
      console.error("Error fetching hint screenshots:", error);
    }
  };

  return (
    <>
      <Card className="p-5 mt-8">
        <CardHeader className="p-0 pb-8">
          <CardTitle className="text-center text-lg">
            {t("play.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-3 gap-12">
            <HintButton
              hintAvailable={true}
              onClick={handleShowHintOpening}
              toolTipText={t("play.hints.opening.tooltip")}
            >
              <Music className="h-[2rem] w-[2rem] text-primary" />
              <span className=" font-semibold select-none text-center text-xs sm:text-sm ">
                {t("play.hints.opening.title")}
              </span>
            </HintButton>
            <HintButton
              onClick={handleShowHintScreenshots}
              hintAvailable={true}
              toolTipText={t("play.hints.screenshots.tooltip")}
            >
              <Image className="h-[2rem] w-[2rem] text-primary" />
              <span className="font-semibold select-none text-center text-xs sm:text-sm">
                {t("play.hints.screenshots.title")}
              </span>
            </HintButton>
            <HintButton
              onClick={handleShowHintScenes}
              hintAvailable={true}
              toolTipText={t("play.hints.scenes.tooltip")}
            >
              <Film className="h-[2rem] w-[2rem] text-primary" />
              <span className=" font-semibold select-none text-center text-xs sm:text-sm ">
                {t("play.hints.scenes.title")}
              </span>
            </HintButton>
          </div>
        </CardContent>
      </Card>
      <Fancybox
        options={{
          Carousel: {
            infinite: true,
          },
        }}
      />
      <Dialog open={showDialogOpening} onOpenChange={toggleShowDialogOpening}>
        <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle className="text-center font-extrabold text-xl">
              {t("play.hints.opening.content")}
            </DialogTitle>
          </DialogHeader>
          <AudioPlayer autoPlay audio={hints?.opening ?? ""} />
        </DialogContent>
      </Dialog>
    </>
  );
};

import { useEffect, useReducer } from "react";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { Music, Image, Film } from "lucide-react";
import { AudioPlayer } from "@/components/audio-player";
import { HintButton } from "@/components/hint-button";
import { Fancybox, showFancybox } from "@/components/fancy-box";
import { IGameSettingsContent } from "@/interfaces/game";
import { useTranslation } from "react-i18next";
import { IGameHints, IHintAvailable } from "../../../interfaces/hints";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

interface HintsWrapperProps {
  dailyAnimeConfig: IGameSettingsContent | null;
  hints?: IGameHints | null;
  hintAvailable?: IHintAvailable | null;
}

const BASE_URL = import.meta.env.VITE_BASE_URL_STATIC;

export const HintsWrapper = ({
  dailyAnimeConfig,
  hints,
  hintAvailable,
}: HintsWrapperProps) => {
  const { t } = useTranslation();
  const [showDialogOpening, toggleShowDialogOpening] = useReducer(
    (state) => !state,
    false
  );

  const handleShowHintScenes = async () => {
    if (!dailyAnimeConfig?.anime || !hintAvailable?.scenes) return;
    const scenes = hints?.scenes?.scenes;
    if (scenes) showFancybox([BASE_URL + scenes]);
  };
  const handleShowHintScreenshots = async () => {
    if (!dailyAnimeConfig?.anime || !hintAvailable?.screenshots) return;

    const screenshotPaths = hints?.screenshots?.screenshots?.list.map(
      (s) => BASE_URL + s.path
    );
    if (screenshotPaths) {
      showFancybox(screenshotPaths);
    }
  };

  const { toast } = useToast();

  useEffect(() => {
    if (hintAvailable?.opening) {
      toast({
        title: t("play.hints.opening.title"),
        description: t("play.hints.opening.description"),
        duration: 5000,
      });
    }
  }, [hintAvailable?.opening, t, toast]);

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
              hintAvailable={hintAvailable?.opening ?? false}
              onClick={toggleShowDialogOpening}
              toolTipText={t("play.hints.opening.tooltip")}
            >
              <Music className="h-[2rem] w-[2rem] text-primary" />
              <span className=" font-semibold select-none text-center text-xs sm:text-sm ">
                {t("play.hints.opening.title")}
              </span>
            </HintButton>
            <HintButton
              onClick={handleShowHintScreenshots}
              hintAvailable={hintAvailable?.screenshots ?? false}
              toolTipText={t("play.hints.screenshots.tooltip")}
            >
              <Image className="h-[2rem] w-[2rem] text-primary" />
              <span className="font-semibold select-none text-center text-xs sm:text-sm">
                {t("play.hints.screenshots.title")}
              </span>
            </HintButton>
            <HintButton
              onClick={handleShowHintScenes}
              hintAvailable={hintAvailable?.scenes ?? false}
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
          <AudioPlayer
            autoPlay
            audio={BASE_URL + (hints?.opening?.opening ?? "")}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

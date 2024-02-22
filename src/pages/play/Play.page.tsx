import { LoadingSpinner } from "@/components/loading-spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useConfigStore } from "@/stores/ConfigState";
import { Link } from "react-router-dom";
import { Music, Image, Film, Play } from "lucide-react";
import { Autocomplete, IOptions } from "@/components/ui/autocomplete";
import { axiosService } from "@/services/axios.service";
import React, { useReducer, useState } from "react";
import { Button } from "@/components/ui/button";
import { Fancybox, showFancybox } from "@/components/fancy-box";
import { useQuery } from "@tanstack/react-query";
import { HintButton } from "@/components/ui/hint-button";
import { AudioPlayer } from "@/components/audio-player";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface IAnimeTitle {
  id: number;
  title: string;
}

interface IStartGameContent {
  anime: string;
  totalDailyGuessers: number;
  sessionId: string;
}

interface IScreenshot {
  id: number;
  path: string;
  title: string | null;
}

interface IHintScreenshotsContent {
  screenshots: {
    featured: string | null;
    list: IScreenshot[];
  };
}

interface IHintOpeningContent {
  opening: string;
}

interface IHintScenesContent {
  scenes: string;
}

export const PlayPage = () => {
  const { content: configContent, isLoading } = useConfigStore();
  const [animeTitles, setAnimeTitles] = useState<IOptions[]>([]);
  const [titleSelect, setTitleSelect] = useState<IAnimeTitle>(
    {} as IAnimeTitle
  );
  const [hints, setHints] = useState<{
    opening?: string | null;
    screenshots?: string[] | null;
    scenes?: string | null;
  }>();

  const [showDialogOpening, toggleShowDialogOpening] = useReducer(
    (state) => !state,
    false
  );

  async function fetchAnimeTitles(autoCompleteInput: string, guesses: string) {
    const { data } = await axiosService.get("/animes-titles", {
      params: { q: autoCompleteInput, guesses: guesses },
    });

    setAnimeTitles(data);
  }

  async function fetchStartGame(): Promise<IStartGameContent> {
    return (await axiosService.get<IStartGameContent>("/play/start")).data;
  }
  const { data: dailyAnimeConfig } = useQuery({
    queryKey: ["startGame"],
    queryFn: fetchStartGame,
  });

  async function fetchHintScreenshots(animeId: string) {
    return (
      await axiosService.get<IHintScreenshotsContent>(
        `/hints/screenshots/${animeId}`
      )
    ).data;
  }
  async function fetchHintOpening(animeId: string) {
    return (
      await axiosService.get<IHintOpeningContent>(`/hints/opening/${animeId}`)
    ).data;
  }

  async function fetchHintScenes(animeId: string) {
    return (
      await axiosService.get<IHintScenesContent>(`/hints/scenes/${animeId}`)
    ).data;
  }

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
        scenes: import.meta.env.VITE_BASE_URL_STATIC + scenes,
      });
      showFancybox([import.meta.env.VITE_BASE_URL_STATIC + scenes]);
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
        opening: import.meta.env.VITE_BASE_URL_STATIC + opening,
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
      const screenshotPaths = screenshots.list.map(
        (s) => import.meta.env.VITE_BASE_URL_STATIC + s.path
      );

      setHints({ ...hints, screenshots: screenshotPaths });

      if (screenshotPaths.length > 0) {
        showFancybox(screenshotPaths);
      }
    } catch (error) {
      console.error("Error fetching hint screenshots:", error);
    }
  };

  function onInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const inputValue = event.target.value;
    if (!inputValue || inputValue === "") {
      setAnimeTitles([]);
      return;
    }
    fetchAnimeTitles(event.target.value, "");
  }

  function submitAnswer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    console.log(titleSelect);
  }

  return (
    <>
      {!isLoading && configContent ? (
        <div className="pt-8 container grid place-items-center sm:c">
          <Link to="/">
            <img
              className="h-[13rem] w-[13rem]"
              src={
                configContent?.img
                  ? import.meta.env.VITE_BASE_URL_STATIC + configContent?.img
                  : ""
              }
              alt={configContent?.name ?? ""}
            />
          </Link>
          <div>
            <Card className="p-5 mt-8">
              <CardHeader className="p-0 pb-8">
                <CardTitle className="text-center text-lg">
                  Adivinhe o anime de hoje!
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="grid grid-cols-3 gap-12">
                  <HintButton
                    hintAvailable={true}
                    onClick={handleShowHintOpening}
                    toolTipText="Liberado após 3 palpites!"
                  >
                    <Music className="h-[2rem] w-[2rem] text-primary" />
                    <span className=" font-semibold select-none text-center text-xs sm:text-sm ">
                      Ouvir Abertura
                    </span>
                  </HintButton>
                  <HintButton
                    onClick={handleShowHintScreenshots}
                    hintAvailable={true}
                    toolTipText="Liberado após 5 palpites!"
                  >
                    <Image className="h-[2rem] w-[2rem] text-primary" />
                    <span className="font-semibold select-none text-center text-xs sm:text-sm">
                      Ver Screenshots
                    </span>
                  </HintButton>
                  <HintButton
                    onClick={handleShowHintScenes}
                    hintAvailable={true}
                    toolTipText="Liberado após 8 palpites!"
                  >
                    <Film className="h-[2rem] w-[2rem] text-primary" />
                    <span className=" font-semibold select-none text-center text-xs sm:text-sm ">
                      Assistir Cenas
                    </span>
                  </HintButton>
                </div>
              </CardContent>
            </Card>
            <form onSubmit={submitAnswer} className="flex pt-8">
              <Autocomplete
                className="w-full h-[3rem] text-lg"
                placeholder="Take a guess..."
                options={animeTitles}
                onChange={onInputChange}
                onSelectOption={(option: IOptions) => {
                  setTitleSelect(option);
                }}
              />
              <Button
                className="h-[3rem] w-auto ml-5"
                disabled={!titleSelect.title}
                type="submit"
              >
                <Play className="w-[1.5rem] h-[1.5rem]" />
              </Button>
            </form>
          </div>
          <Fancybox
            options={{
              Carousel: {
                infinite: true,
              },
            }}
          />
          <Dialog
            open={showDialogOpening}
            onOpenChange={toggleShowDialogOpening}
          >
            <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
              <DialogHeader>
                <DialogTitle className="text-center font-extrabold text-xl">
                  Ouça a abertura:
                </DialogTitle>
              </DialogHeader>
              <AudioPlayer autoPlay audio={hints?.opening ?? ""} />
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <div className="h-screen flex justify-center items-center">
          <LoadingSpinner />
        </div>
      )}
    </>
  );
};

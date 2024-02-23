import { LoadingSpinner } from "@/components/loading-spinner";
import { useConfigStore } from "@/stores/ConfigState";
import { Link } from "react-router-dom";
import { Autocomplete, IOptions } from "@/components/ui/autocomplete";
import { axiosService } from "@/services/axios.service";
import { ChangeEvent, FormEvent, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { HintsWrapper } from "./components/hints-wrapper";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  IHintOpeningContent,
  IHintScenesContent,
  IHintScreenshotsContent,
} from "./interfaces/hints";
export interface IAnimeTitle {
  id: number;
  title: string;
}

export interface IStartGameContent {
  anime: string;
  totalDailyGuessers: number;
  sessionId: string;
}

export const PlayPage = () => {
  const { t } = useTranslation();
  const { content: configContent, isLoading } = useConfigStore();
  const [animeTitles, setAnimeTitles] = useState<IOptions[]>([]);
  const [titleSelect, setTitleSelect] = useState<IAnimeTitle>(
    {} as IAnimeTitle
  );

  async function fetchStartGame(): Promise<IStartGameContent> {
    return (await axiosService.get<IStartGameContent>("/play/start")).data;
  }

  const { data: dailyAnimeConfig } = useQuery({
    queryKey: ["startGame"],
    queryFn: fetchStartGame,
  });

  async function fetchAnimeTitles(autoCompleteInput: string, guesses: string) {
    const { data } = await axiosService.get("/animes-titles", {
      params: { q: autoCompleteInput, guesses: guesses },
    });

    setAnimeTitles(data);
  }

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

  function onInputChange(event: ChangeEvent<HTMLInputElement>) {
    const inputValue = event.target.value;
    if (!inputValue || inputValue === "") {
      setAnimeTitles([]);
      return;
    }
    fetchAnimeTitles(event.target.value, "");
  }

  function submitAnswer(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    console.log(titleSelect);
  }

  return (
    <>
      {!isLoading && configContent ? (
        <div className="pt-8 container grid place-items-center">
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
            <HintsWrapper
              fetchHintOpening={fetchHintOpening}
              fetchHintScenes={fetchHintScenes}
              fetchHintScreenshots={fetchHintScreenshots}
              dailyAnimeConfig={dailyAnimeConfig}
            />
            <form onSubmit={submitAnswer} className="flex pt-8">
              <Autocomplete
                className="w-full h-[3rem] text-md"
                placeholder={t("play.input")}
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
        </div>
      ) : (
        <div className="h-screen flex justify-center items-center">
          <LoadingSpinner />
        </div>
      )}
    </>
  );
};

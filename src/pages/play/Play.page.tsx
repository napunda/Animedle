import { LoadingSpinner } from "@/components/loading-spinner";
import { useConfigStore } from "@/stores/ConfigState";
import { Link } from "react-router-dom";
import { Autocomplete, IOptions } from "@/components/ui/autocomplete";
import { axiosService } from "@/services/axios.service";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { HintsWrapper } from "./components/hints-wrapper";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useDebounce } from "use-debounce";
import {
  IHintOpeningContent,
  IHintScenesContent,
  IHintScreenshotsContent,
} from "./interfaces/hints";
import { AnimesList } from "./components/animes-list";
import { IAnimeContent } from "./interfaces/anime";

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
  const [autoCompleteInput, setAutoCompleteInput] = useState<string>("");
  const [animeTitles, setAnimeTitles] = useState<IOptions[]>([]);
  const [guesses, setGuesses] = useState<number[]>([]);
  const [isLoadingAnimes, setIsLoadingAnimes] = useState<boolean>(false);
  const [animesGuesses, setAnimesGuesses] = useState<IAnimeContent[]>([]);
  const [titleSelect, setTitleSelect] = useState<IAnimeTitle>(
    {} as IAnimeTitle
  );

  const [debouncedAutoCompleteInput] = useDebounce(autoCompleteInput, 500);
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAutoCompleteInput(event.target.value);
  };

  async function fetchStartGame(): Promise<IStartGameContent> {
    return (await axiosService.get<IStartGameContent>("/play/start")).data;
  }

  const { data: dailyAnimeConfig } = useQuery({
    queryKey: ["startGame"],
    queryFn: fetchStartGame,
  });

  const fetchAnime = async (animeId: string) => {
    return (await axiosService.get<IAnimeContent>(`/anime/${animeId}`)).data;
  };

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

  function submitAnswer(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!titleSelect.title) return;
    setIsLoadingAnimes(true);

    fetchAnime(titleSelect.id.toString())
      .then((anime) => {
        setAnimesGuesses((prev) => [anime, ...prev]);
        setGuesses((prev) => [anime.id, ...prev]);
      })
      .finally(() => {
        setAnimeTitles([]);
        setTitleSelect({} as IAnimeTitle);
        setIsLoadingAnimes(false);
        setAutoCompleteInput("");
      });
  }

  useEffect(() => {
    if (!debouncedAutoCompleteInput || titleSelect.id) {
      setAnimeTitles([]);
      return;
    }
    fetchAnimeTitles(debouncedAutoCompleteInput, guesses.join(","));
  }, [debouncedAutoCompleteInput, guesses, titleSelect]);

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
                placeholder={t("play.input")}
                setInputValue={setAutoCompleteInput}
                value={autoCompleteInput}
                className="w-full h-[3rem] text-md"
                options={animeTitles}
                onChange={handleInputChange}
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
          <AnimesList animes={animesGuesses} isLoading={isLoadingAnimes} />
        </div>
      ) : (
        <div className="h-screen flex justify-center items-center">
          <LoadingSpinner />
        </div>
      )}
    </>
  );
};

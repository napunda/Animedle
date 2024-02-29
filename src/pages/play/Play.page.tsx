import { LoadingSpinner } from "@/components/loading-spinner";
import { useConfigStore } from "@/stores/ConfigState";
import { Link } from "react-router-dom";
import { Autocomplete, IOptions } from "@/components/ui/autocomplete";
import { axiosService } from "@/services/axios.service";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { HintsWrapper } from "./components/hints-wrapper";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useDebounce } from "use-debounce";
import { AnimesList } from "./components/animes-list";
import { IAnimeContent } from "../../interfaces/anime";
import { useGameStore } from "@/stores/GameState";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

export interface IAnimeTitle {
  id: number;
  title: string;
}

export const PlayPage = () => {
  const { t } = useTranslation();
  const { content: configContent, isLoading } = useConfigStore();
  const [autoCompleteInput, setAutoCompleteInput] = useState<string>("");
  const [animeTitles, setAnimeTitles] = useState<IOptions[]>([]);
  const [isLoadingAnimes, setIsLoadingAnimes] = useState<boolean>(false);
  const [titleSelect, setTitleSelect] = useState<IAnimeTitle>(
    {} as IAnimeTitle
  );
  const {
    addGuess,
    content: { settings, animesGuesses, hints, hintAvailable },
  } = useGameStore();

  const [debouncedAutoCompleteInput] = useDebounce(autoCompleteInput, 250);
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAutoCompleteInput(event.target.value);
  };

  const fetchAnime = async (animeId: string) => {
    return (await axiosService.get<IAnimeContent>(`/anime/${animeId}`)).data;
  };

  async function fetchAnimeTitles(autoCompleteInput: string, guesses: string) {
    const { data } = await axiosService.get("/animes-titles", {
      params: { q: autoCompleteInput, guesses: guesses },
    });

    setAnimeTitles(data);
  }

  function submitAnswer(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!titleSelect.title) return;
    setIsLoadingAnimes(true);

    fetchAnime(titleSelect.id.toString())
      .then((anime) => {
        addGuess(anime);
      })
      .finally(() => {
        setAnimeTitles([]);
        setTitleSelect({} as IAnimeTitle);
        setIsLoadingAnimes(false);
        setAutoCompleteInput("");
      });
  }

  useEffect(() => {
    if (!debouncedAutoCompleteInput) {
      return;
    }
    if (titleSelect.id || titleSelect.title) {
      setAnimeTitles([]);
      return;
    }
    const guessesListIds =
      animesGuesses?.map((guess) => guess.id).join(",") ?? "";
    fetchAnimeTitles(debouncedAutoCompleteInput, guessesListIds);
  }, [debouncedAutoCompleteInput, titleSelect, animesGuesses]);

  return (
    <>
      {!isLoading && configContent ? (
        <div className="pt-8 container grid place-items-center">
          <Link to="/">
            <LazyLoadImage
              effect="opacity"
              className="h-[13rem] w-[13rem] drop-shadow-md dark:drop-shadow-none"
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
              hints={hints}
              dailyAnimeConfig={settings}
              hintAvailable={hintAvailable}
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

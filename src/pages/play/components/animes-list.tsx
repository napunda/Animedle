import { Card, CardContent } from "@/components/ui/card";
import { IAnimeContent } from "../interfaces/anime";
import { LoadingSpinner } from "@/components/loading-spinner";
import ArrowDownIcon from "@/assets/img/icons/arrow_down_icon.svg";
import ArrowUpIcon from "@/assets/img/icons/arrow_up_icon.svg";
import CheckIcon from "@/assets/img/icons/check_icon.svg";
import XMarkIcon from "@/assets/img/icons/xmark_icon.svg";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import styles from "./animes-list.module.css";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface IAnimesListProps {
  animes: IAnimeContent[];
  isLoading: boolean;
}

interface IAnimeColumnProps {
  value: string | number;
  imgSource: string;
}
interface IAnimesColumnsWrapperProps {
  anime: IAnimeContent;
}

const animesHeaders = [
  "Obra",
  "Gênero",
  "Episódios",
  "Estúdio",
  "Nota",
  "Temporada",
  "Ano",
  "Finalizado",
];
const gridCols = {
  gridTemplateColumns: `repeat(${animesHeaders.length}, 1fr)`,
};

const AnimeColumn = ({ value, imgSource }: IAnimeColumnProps) => {
  const isString = typeof value === "string";
  const hasMoreThanTwoWords = isString && value.split(" ").length >= 2;

  return (
    <div
      className={
        "flex items-center justify-center flex-col gap-5 " +
        styles.anime_list_item
      }
    >
      {hasMoreThanTwoWords ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <span className="text-center text-sm font-bold line-clamp-1">
                {value}
              </span>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <span className="text-center text-sm font-bold">{value}</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <span className="text-center text-sm font-bold line-clamp-1">
          {value}
        </span>
      )}
      <img
        alt={imgSource}
        src={imgSource}
        className={
          styles.anime_list_img + " w-[2rem] h-[2rem] dark:filter dark:invert"
        }
      />
    </div>
  );
};

const AnimesColumnsWrapper = ({ anime }: IAnimesColumnsWrapperProps) => {
  const getIconSource = (value: string) => {
    const icons: { [key: string]: string } = {
      xmark: XMarkIcon,
      check: CheckIcon,
      arrow_up: ArrowUpIcon,
      arrow_down: ArrowDownIcon,
    };

    return icons[value];
  };
  return (
    <div
      key={anime.id}
      className={
        "max-w-[740px] w-[100%] grid gap-5 p-4 " + styles.anime_list_wrapper
      }
      style={gridCols}
    >
      <div className="flex flex-col justify-center items-center">
        <LazyLoadImage
          src={
            import.meta.env.VITE_BASE_URL_STATIC + anime.img + "?resize=1&w=120"
          }
          width={72}
          height={96}
          effect="blur"
          alt={anime.title}
          className="w-[72px] aspect-retract"
        />

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <span className="text-center text-xs font-bold line-clamp-2 min-h-[2rem] mt-1">
                {anime.title}
              </span>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <span className="text-center text-sm font-bold">
                {anime.title}
              </span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <AnimeColumn
        value={anime.genre.value.title}
        imgSource={getIconSource(anime.genre.daily.icon)}
      />
      <AnimeColumn
        value={anime.episodes.value}
        imgSource={getIconSource(anime.episodes.daily.icon)}
      />
      <AnimeColumn
        value={anime.studio.value.title}
        imgSource={getIconSource(anime.studio.daily.icon)}
      />
      <AnimeColumn
        value={anime.rating.value}
        imgSource={getIconSource(anime.rating.daily.icon)}
      />
      <AnimeColumn
        value={anime.season.value.title}
        imgSource={getIconSource(anime.season.daily.icon)}
      />
      <AnimeColumn
        value={anime.release_year.value}
        imgSource={getIconSource(anime.release_year.daily.icon)}
      />
      <AnimeColumn
        value={anime.finished.value ? "Sim" : "Não"}
        imgSource={getIconSource(anime.finished.daily.icon)}
      />
    </div>
  );
};
const AnimesList = ({ animes, isLoading }: IAnimesListProps) => {
  return (
    <>
      <Card className="mt-8">
        <CardContent className="p-4">
          <div className={"grid gap-5 "} style={gridCols}>
            {animesHeaders.map((header) => (
              <span key={header} className="text-sm text-center">
                {header}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
      {isLoading && <LoadingSpinner className="mt-8" />}
      {animes.map((anime) => (
        <AnimesColumnsWrapper key={anime.id} anime={anime} />
      ))}
    </>
  );
};

export { AnimesList };

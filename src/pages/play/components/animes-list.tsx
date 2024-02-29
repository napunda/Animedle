import { Card, CardContent } from "@/components/ui/card";
import { IAnimeContent } from "../../../interfaces/anime";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import styles from "./animes-list.module.css";

import {
  ArrowDownIcon,
  ArrowUpIcon,
  CheckIcon,
  XMarkIcon,
} from "@/components/comparison-icons";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SkeletonAnime } from "./skeleton-anime";
import { ReactElement } from "react";

interface IAnimesListProps {
  animes?: IAnimeContent[] | null;
  isLoading: boolean;
}

interface IAnimeColumnProps {
  value: string | number;
  icon: ReactElement;
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

const AnimeColumn = ({ value, icon }: IAnimeColumnProps) => {
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
      {icon}
    </div>
  );
};

const AnimesColumnsWrapper = ({ anime }: IAnimesColumnsWrapperProps) => {
  const getIcon = (value: string) => {
    const icons: { [key: string]: ReactElement } = {
      xmark: (
        <XMarkIcon
          className={
            styles.anime_list_img +
            " w-[2rem] h-[2rem] stroke-primary dark:opacity-50 dark:stroke-white"
          }
        />
      ),
      check: (
        <CheckIcon
          className={
            styles.anime_list_img +
            " w-[2rem] h-[2rem] fill-primary dark:fill-white"
          }
        />
      ),
      arrow_up: (
        <ArrowUpIcon
          className={
            styles.anime_list_img +
            " w-[2rem] h-[2rem] stroke-primary dark:opacity-50 dark:stroke-white"
          }
        />
      ),
      arrow_down: (
        <ArrowDownIcon
          className={
            styles.anime_list_img +
            " w-[2rem] h-[2rem] stroke-primary dark:opacity-50 dark:stroke-white "
          }
        />
      ),
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
        icon={getIcon(anime.genre.daily.icon)}
      />
      <AnimeColumn
        value={anime.episodes.value}
        icon={getIcon(anime.episodes.daily.icon)}
      />
      <AnimeColumn
        value={anime.studio.value.title}
        icon={getIcon(anime.studio.daily.icon)}
      />
      <AnimeColumn
        value={anime.rating.value}
        icon={getIcon(anime.rating.daily.icon)}
      />
      <AnimeColumn
        value={anime.season.value.title}
        icon={getIcon(anime.season.daily.icon)}
      />
      <AnimeColumn
        value={anime.release_year.value}
        icon={getIcon(anime.release_year.daily.icon)}
      />
      <AnimeColumn
        value={anime.finished.value ? "Sim" : "Não"}
        icon={getIcon(anime.finished.daily.icon)}
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
      {!isLoading && <SkeletonAnime />}
      {animes?.map((anime) => (
        <AnimesColumnsWrapper key={anime.id} anime={anime} />
      ))}
    </>
  );
};

export { AnimesList };

import { IAnimeTitle } from "@/interfaces/anime";
import { axiosService } from "@/services/axios.service";
import { useQuery } from "@tanstack/react-query";

interface IAnimesTitlesProps {
  q: string;
  guesses: string;
}
async function fetchData({ q, guesses }: IAnimesTitlesProps) {
  return await axiosService.get<IAnimeTitle[]>("/animes-titles", {
    params: { q, guesses },
  });
}

export function AnimesTitlesApi({ q, guesses }: IAnimesTitlesProps) {
  return useQuery({
    queryKey: ["animes-titles", q, guesses],
    queryFn: () => fetchData({ q, guesses }),
    enabled: !!q && !!guesses,
  });
}

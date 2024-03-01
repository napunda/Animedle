import { IHintOpeningContent } from "@/interfaces/hints";
import { axiosService } from "@/services/axios.service";

export async function OpeningApi(animeId: string) {
  return (
    await axiosService.get<IHintOpeningContent>(`/hints/opening/${animeId}`)
  ).data;
}

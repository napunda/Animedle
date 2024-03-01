import { IHintScenesContent } from "@/interfaces/hints";
import { axiosService } from "@/services/axios.service";

export async function ScenesApi(animeId: string) {
  return (
    await axiosService.get<IHintScenesContent>(`/hints/scenes/${animeId}`)
  ).data;
}

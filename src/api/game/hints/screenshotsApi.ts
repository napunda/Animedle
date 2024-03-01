import { IHintScreenshotsContent } from "@/interfaces/hints";
import { axiosService } from "@/services/axios.service";

export async function ScreenshotsApi(animeId: string) {
  return (
    await axiosService.get<IHintScreenshotsContent>(
      `/hints/screenshots/${animeId}`
    )
  ).data;
}

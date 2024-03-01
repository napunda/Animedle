import { IGameSettingsContent } from "@/interfaces/game";
import { axiosService } from "@/services/axios.service";

export async function startGameApi() {
  return (await axiosService.get<IGameSettingsContent>("/play/start")).data;
}

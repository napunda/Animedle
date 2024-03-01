import { ContentConfigResponse } from "@/interfaces/configs";
import { axiosService } from "@/services/axios.service";

export async function ConfigsApi() {
  try {
    const response = await axiosService.get<ContentConfigResponse>("/configs");
    return response.data;
  } catch (error) {
    throw new Error("Erro ao buscar dados da API: " + error);
  }
}
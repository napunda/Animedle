import { create } from "zustand";
import { axiosService } from "@/services/axios.service";
import { useQuery } from "@tanstack/react-query";

export interface ContentConfigResponse {
  img: string | null;
  name: string | null;
  short_name: string | null;
  icon: string | null;
  share: string | null;
  instagram: string | null;
  twitter: string | null;
  buymeacoffee: string | null;
}

interface ConfigState {
  content: ContentConfigResponse | null;
  isLoading: boolean;
  isError: boolean;
  fetchData: () => Promise<void>;
}

const configStore = create<ConfigState>((set) => ({
  content: null,
  isLoading: true,
  isError: false,
  fetchData: async () => {
    try {
      const response = await axiosService.get<ContentConfigResponse>(
        "/configs"
      );
      set({ content: response.data, isLoading: false, isError: false });
    } catch (error) {
      console.error("Erro ao buscar dados da API:", error);
      set({ isLoading: false, isError: true });
    }
  },
}));

export const useConfigStore = () => {
  const { content, isLoading, isError, fetchData } = configStore();

  useQuery({
    queryKey: ["content"],
    queryFn: fetchData,
    enabled: !content && !isLoading && !isError,
  });

  return { content, isLoading, isError, fetchData };
};

import { create } from "zustand";
import { useQuery } from "@tanstack/react-query";
import { ContentConfigResponse } from "@/interfaces/configs";
import { ConfigsApi } from "@/api/configs";
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
    const data = await ConfigsApi();
    if (!data) set({ isError: true });
    if (data) {
      set({ content: data, isLoading: false });
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

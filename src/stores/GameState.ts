import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { axiosService } from "@/services/axios.service";
import { useQuery } from "@tanstack/react-query";
import {
  IGameHints,
  IHintScreenshotsContent,
  IHintScenesContent,
  IHintOpeningContent,
  IHintAvailable,
} from "@/interfaces/hints";
import { IAnimeContent } from "@/interfaces/anime";
import { IGameSettingsContent } from "@/interfaces/game";

interface IGameState {
  isLoading: boolean;
  content: {
    settings: IGameSettingsContent | null;
    hints?: IGameHints | null;
    animesGuesses?: IAnimeContent[] | null;
    hintAvailable?: IHintAvailable | null;
  };
  start: () => Promise<void>;
  addGuess: (anime: IAnimeContent) => void;

  setHintAvailableOpening: (available: boolean) => void;
  setHintAvailableScreenshots: (available: boolean) => void;
  setHintAvailableScenes: (available: boolean) => void;

  setHintOpening: (opening: IHintOpeningContent) => void;
  setHintScreenshots: (screenshots: IHintScreenshotsContent) => void;
  setHintScenes: (scenes: IHintScenesContent) => void;
}

async function fetchHintOpening(animeId: string) {
  return (
    await axiosService.get<IHintOpeningContent>(`/hints/opening/${animeId}`)
  ).data;
}

async function fetchHintScreenshots(animeId: string) {
  return (
    await axiosService.get<IHintScreenshotsContent>(
      `/hints/screenshots/${animeId}`
    )
  ).data;
}

async function fetchHintScenes(animeId: string) {
  return (
    await axiosService.get<IHintScenesContent>(`/hints/scenes/${animeId}`)
  ).data;
}

let isSubscribed = false;
const gameStore = create(
  persist<IGameState>(
    (set) => ({
      isLoading: true,
      content: {
        settings: null,
      },
      start: async () => {
        try {
          const response = await axiosService.get<IGameSettingsContent>(
            "/play/start"
          );

          set((state) => {
            return {
              content: { ...state.content, settings: response.data },
              isLoading: false,
            };
          });
        } catch (error) {
          console.error("Erro ao buscar dados da API:", error);
          set({ isLoading: false });
        }
      },
      addGuess: (anime) => {
        set((state) => {
          return {
            content: {
              ...state.content,
              animesGuesses: state.content.animesGuesses
                ? [anime, ...state.content.animesGuesses]
                : [anime],
            },
          };
        });
      },

      setHintAvailableOpening: (available) => {
        set((state) => {
          return {
            content: {
              ...state.content,
              hintAvailable: {
                ...state.content.hintAvailable,
                opening: available,
              },
            },
          };
        });
      },
      setHintAvailableScreenshots: (available) => {
        set((state) => {
          return {
            content: {
              ...state.content,
              hintAvailable: {
                ...state.content.hintAvailable,
                screenshots: available,
              },
            },
          };
        });
      },
      setHintAvailableScenes: (available) => {
        set((state) => {
          return {
            content: {
              ...state.content,
              hintAvailable: {
                ...state.content.hintAvailable,
                scenes: available,
              },
            },
          };
        });
      },

      setHintOpening: (opening) => {
        set((state) => {
          return {
            content: {
              ...state.content,
              hints: {
                ...state.content.hints,
                opening: opening,
              },
            },
          };
        });
      },
      setHintScreenshots: (screenshots) => {
        set((state) => {
          return {
            content: {
              ...state.content,
              hints: {
                ...state.content.hints,
                screenshots: screenshots,
              },
            },
          };
        });
      },
      setHintScenes: (scenes) => {
        set((state) => {
          return {
            content: {
              ...state.content,
              hints: {
                ...state.content.hints,
                scenes: scenes,
              },
            },
          };
        });
      },
    }),
    {
      name: "game-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

if (!isSubscribed) {
  gameStore.subscribe((state) => {
    const {
      setHintOpening,
      setHintScreenshots,
      setHintScenes,
      content: { hintAvailable, settings, hints },
    } = state;

    if (!settings) return;

    if (hintAvailable?.opening && !hints?.opening) {
      fetchHintOpening(settings.anime).then((opening) => {
        setHintOpening(opening);
      });
    }
    if (hintAvailable?.screenshots && !hints?.screenshots) {
      fetchHintScreenshots(settings.anime).then((screenshots) => {
        setHintScreenshots(screenshots);
      });
    }
    if (hintAvailable?.scenes && !hints?.scenes) {
      fetchHintScenes(settings.anime).then((scenes) => {
        setHintScenes(scenes);
      });
    }
  });

  isSubscribed = true;
}

gameStore.subscribe((state) => {
  const {
    setHintAvailableOpening,
    setHintAvailableScenes,
    setHintAvailableScreenshots,
    content: { animesGuesses, hintAvailable },
  } = state;

  if (!hintAvailable?.opening && animesGuesses?.length === 3) {
    setHintAvailableOpening(true);
  }
  if (!hintAvailable?.screenshots && animesGuesses?.length === 5) {
    setHintAvailableScreenshots(true);
  }
  if (!hintAvailable?.scenes && animesGuesses?.length === 8) {
    setHintAvailableScenes(true);
  }

  if (
    hintAvailable?.opening &&
    hintAvailable?.screenshots &&
    hintAvailable?.scenes
  ) {
    return;
  }
});

export const useGameStore = () => {
  const { start, addGuess, isLoading, content } = gameStore();

  useQuery({
    queryKey: ["startGame"],
    queryFn: start,
    enabled: !content.settings && !isLoading,
  });

  return { start, addGuess, isLoading, content };
};

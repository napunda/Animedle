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
  setHintAvailable: {
    opening: (available: boolean) => void;
    screenshots: (available: boolean) => void;
    scenes: (available: boolean) => void;
  };
  setHints: {
    opening: (opening: IHintOpeningContent) => void;
    screenshots: (screenshots: IHintScreenshotsContent) => void;
    scenes: (scenes: IHintScenesContent) => void;
  };
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
      setHintAvailable: {
        opening: (available) => {
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
        screenshots: (available) => {
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
        scenes: (available) => {
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
      },
      setHints: {
        opening: (opening) => {
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
        screenshots: (screenshots) => {
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
        scenes: (scenes) => {
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
      setHints,
      content: { hintAvailable, settings, hints },
    } = state;

    if (!settings) return;

    if (hintAvailable?.opening && !hints?.opening) {
      fetchHintOpening(settings.anime).then((opening) => {
        setHints.opening(opening);
      });
    }
    if (hintAvailable?.screenshots && !hints?.screenshots) {
      fetchHintScreenshots(settings.anime).then((screenshots) => {
        setHints.screenshots(screenshots);
      });
    }
    if (hintAvailable?.scenes && !hints?.scenes) {
      fetchHintScenes(settings.anime).then((scenes) => {
        setHints.scenes(scenes);
      });
    }
  });

  isSubscribed = true;
}

gameStore.subscribe((state) => {
  const {
    setHintAvailable,
    content: { animesGuesses, hintAvailable },
  } = state;

  if (!hintAvailable?.opening && animesGuesses?.length === 3) {
    setHintAvailable.opening(true);
  }
  if (!hintAvailable?.screenshots && animesGuesses?.length === 5) {
    setHintAvailable.screenshots(true);
  }
  if (!hintAvailable?.scenes && animesGuesses?.length === 8) {
    setHintAvailable.scenes(true);
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
  const { start, addGuess, setHintAvailable, isLoading, content } = gameStore();

  useQuery({
    queryKey: ["startGame"],
    queryFn: start,
    enabled: !content.settings && !isLoading,
  });

  return { start, addGuess, setHintAvailable, isLoading, content };
};

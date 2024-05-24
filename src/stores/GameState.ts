import { create } from "zustand";
import { persist } from "zustand/middleware";
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
import { startGameApi } from "@/api/animes/startGameApi";
import { OpeningApi, ScenesApi, ScreenshotsApi } from "@/api/game/hints";
import { toast } from "sonner";
import { MusicIcon, ImageIcon, FilmIcon } from "lucide-react";
import React from "react";
import i18n from "@/i18n";

interface IGameState {
  isLoading: boolean;
  content: {
    settings: IGameSettingsContent | null;
    hints?: IGameHints | null;
    animesGuesses?: IAnimeContent[] | null;
    hintAvailable?: IHintAvailable | null;
    guessed: boolean;
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

let isSubscribed = false;
const gameStore = create(
  persist<IGameState>(
    (set) => ({
      isLoading: true,
      content: {
        settings: null,
        guessed: false,
      },
      start: async () => {
        try {
          const response = await startGameApi();
          set((state) => {
            const storageAnime = state.content.settings?.anime;
            const responseAnime = response.anime;

            if (storageAnime !== responseAnime) {
              return {
                content: {
                  settings: response,
                  hints: null,
                  animesGuesses: null,
                  hintAvailable: null,
                  guessed: false,
                },
                isLoading: false,
              };
            }
            return {
              content: { ...state.content, settings: response },
              isLoading: false,
            };
          });
        } catch (error) {
          console.error("Erro ao carregar jogo", error);
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
      OpeningApi(settings.anime).then((opening) => {
        setHintOpening(opening);
      });
    }
    if (hintAvailable?.screenshots && !hints?.screenshots) {
      ScreenshotsApi(settings.anime).then((screenshots) => {
        setHintScreenshots(screenshots);
      });
    }
    if (hintAvailable?.scenes && !hints?.scenes) {
      ScenesApi(settings.anime).then((scenes) => {
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

    toast(i18n.t("play.tips.opening.title"), {
      className: "border d-flex items-center gap-4",
      description: i18n.t("play.tips.opening.content"),
      duration: 5000,
      icon: React.createElement(MusicIcon, null),
      cancel: {
        label: "Ok",
        onClick: () => toast.dismiss(),
      },
    });
  }
  if (!hintAvailable?.screenshots && animesGuesses?.length === 5) {
    setHintAvailableScreenshots(true);

    toast(i18n.t("play.tips.screenshots.title"), {
      className: "border d-flex items-center gap-4",
      description: i18n.t("play.tips.screenshots.content"),
      duration: 5000,
      icon: React.createElement(ImageIcon, null),
      cancel: {
        label: "Ok",
        onClick: () => toast.dismiss(),
      },
    });
  }
  if (!hintAvailable?.scenes && animesGuesses?.length === 8) {
    setHintAvailableScenes(true);

    toast(i18n.t("play.tips.scenes.title"), {
      className: "border d-flex items-center gap-4",
      description: i18n.t("play.tips.scenes.content"),
      duration: 5000,
      icon: React.createElement(FilmIcon, null),
      cancel: {
        label: "Ok",
        onClick: () => toast.dismiss(),
      },
    });
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

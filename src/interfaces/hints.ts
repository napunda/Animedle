export interface IScreenshot {
  id: number;
  path: string;
  title: string | null;
}

export interface IHintScreenshotsContent {
  screenshots: {
    featured: string | null;
    list: IScreenshot[];
  };
}

export interface IHintOpeningContent {
  opening: string;
}

export interface IHintScenesContent {
  scenes: string;
}

export interface IGameHints {
  opening?: IHintOpeningContent | null;
  scenes?: IHintScenesContent | null;
  screenshots?: IHintScreenshotsContent | null;
}

export interface IHintAvailable {
  opening?: boolean | null;
  scenes?: boolean | null;
  screenshots?: boolean | null;
}

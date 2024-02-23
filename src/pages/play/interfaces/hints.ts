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

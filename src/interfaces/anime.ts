export interface IAnimeContent {
  id: number;
  img: string;
  title: string;
  genre: Genre;
  episodes: Episodes;
  rating: Rating;
  studio: Genre;
  season: Genre;
  release_year: Episodes;
  finished: Finished;
}

export interface Episodes {
  value: number;
  daily: Daily;
}

export interface Daily {
  correct: boolean;
  icon: string;
}

export interface Genre {
  value: Value;
  daily: Daily;
}

export interface Value {
  id: number;
  title: string;
}

export interface Rating {
  value: string;
  daily: Daily;
}
export interface Finished {
  value: boolean;
  daily: Daily;
}

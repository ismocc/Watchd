import { Log } from './log';
import { SavedMovie } from './movie';

export interface Stats {
  filmsWatched: number;
  thisYear: number;
  hoursWatched: number;
  avgRating: number | null;
  ratingSpread: number[];
  recent: Log[];
  favorites: SavedMovie[];
}

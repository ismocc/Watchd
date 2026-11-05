import { SavedMovie } from './movie';

export interface Log {
  id: number;
  tmdbId: number;
  watchedDate: string;
  rating: number | null;
  review: string | null;
  liked: boolean;
  rewatch: boolean;
  createdAt: string;
  movie: SavedMovie;
}

export interface LogInput {
  tmdbId?: number;
  watchedDate: string;
  rating: number | null;
  review: string;
  liked: boolean;
  rewatch: boolean;
}

import { SavedMovie } from './movie';

export interface ListItem {
  id: number;
  listId: number;
  tmdbId: number;
  position: number;
  movie: SavedMovie;
}

export interface List {
  id: number;
  name: string;
  description: string | null;
  createdAt: string;
  items?: ListItem[];
  _count?: { items: number };
}

export interface Movie {
  id: number;
  title: string;
  posterPath: string | null;
  releaseDate: string;
  voteAverage: number;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profilePath: string | null;
}

export interface MovieDetails extends Movie {
  backdropPath: string | null;
  overview: string;
  runtime: number | null;
  tagline: string;
  genres: string[];
  director: string | null;
  cast: CastMember[];
}

export interface SavedMovie {
  tmdbId: number;
  title: string;
  posterPath: string | null;
  releaseDate: string | null;
  runtime: number | null;
}

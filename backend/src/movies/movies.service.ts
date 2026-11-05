import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const TMDB_URL = 'https://api.themoviedb.org/3';

@Injectable()
export class MoviesService {
  constructor(private prisma: PrismaService) {}

  async trending() {
    const data = await this.tmdb('/trending/movie/week');
    return data.results.map((m: any) => this.toMovie(m));
  }

  async search(query: string) {
    if (!query?.trim()) {
      return [];
    }
    const data = await this.tmdb('/search/movie', { query });
    return data.results.map((m: any) => this.toMovie(m));
  }

  async details(id: number) {
    const m = await this.tmdb(`/movie/${id}`, { append_to_response: 'credits' });
    const director = m.credits?.crew?.find((c: any) => c.job=== 'Director');

    return {
      ...this.toMovie(m),
      backdropPath: m.backdrop_path,
      overview: m.overview,
      runtime: m.runtime,
      tagline: m.tagline,
      genres: m.genres?.map((g: any) => g.name) ?? [],
      director: director?.name ?? null,
      cast: (m.credits?.cast ?? []).slice(0, 12).map((c: any) => ({
        id: c.id,
        name: c.name,
        character: c.character,
        profilePath: c.profile_path,
      })),
    };
  }

  // saves the movie in our db the first time someone logs it / adds it to a list
  // so we dont have to hit tmdb evry time we show the diary
  async ensureMovie(tmdbId: number) {
    const cached = await this.prisma.movie.findUnique({ where: { tmdbId } })
    if (cached) return cached


    const m = await this.tmdb(`/movie/${tmdbId}`);
    return this.prisma.movie.upsert({
      where: { tmdbId },
      update: {},
      create: {
        tmdbId,
        title: m.title,
        posterPath: m.poster_path,
        releaseDate: m.release_date || null,
        runtime: m.runtime || null,
      },
    });
  }

  private toMovie(m: any) {
    return {
      id: m.id,
      title: m.title,
      posterPath: m.poster_path,
      releaseDate: m.release_date,
      voteAverage: m.vote_average,
    };
  }

  private async tmdb(path: string, params: Record<string, string> = {}) {
    const url = new URL(TMDB_URL + path);
    url.searchParams.set('api_key', process.env.TMDB_API_KEY ?? '');
    for (const key in params) url.searchParams.set(key, params[key]);

    const res = await fetch(url)
    if (res.status === 404) {
      throw new NotFoundException('movie not found');
    }
    if (!res.ok) {
      throw new Error(`TMDB error ${res.status} on ${path}`);
    }
    return res.json();
  }
}

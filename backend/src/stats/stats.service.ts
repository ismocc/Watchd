import { Injectable } from '@nestjs/common';
import { Movie } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) {}

  async forUser(userId: number) {
    const logs = await this.prisma.log.findMany({
      where: { userId },
      include: { movie: true },
      orderBy: [{ watchedDate: 'desc' }, { createdAt: 'desc' }],
    });

    const year = new Date().getFullYear();
    const films = new Set(logs.map((l) => l.tmdbId));
    const thisYear = logs.filter((l) => l.watchedDate.getUTCFullYear() === year).length;
    const minutes = logs.reduce((total,l) => total + (l.movie.runtime ?? 0), 0);

    const rated = logs.filter((l) => l.rating !== null)
    const avgRating = rated.length
      ? Math.round((rated.reduce((total, l) => total + l.rating!, 0) / rated.length) * 100) / 100
      : null;

    // 10 buckets for the bar chart, 0.5 stars -> index 0 ... 5 stars -> index 9
    const ratingSpread = Array(10).fill(0);
    for (const l of rated) ratingSpread[l.rating! * 2 - 1]++;

    // liked movies, no duplicates if you liked a rewatch too
    const favorites: Movie[] = [];
    const seen = new Set<number>();
    for (const l of logs) {
      if (l.liked && !seen.has(l.tmdbId)) {
        seen.add(l.tmdbId);
        favorites.push(l.movie);
      }
    }

    return {
      filmsWatched: films.size,
      thisYear,
      hoursWatched: Math.round(minutes / 60),
      avgRating,
      ratingSpread,
      recent: logs.slice(0, 8),
      favorites,
    };
  }
}

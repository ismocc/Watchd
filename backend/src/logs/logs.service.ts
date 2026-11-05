import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MoviesService } from '../movies/movies.service';
import { CreateLogDto } from './dto/create-log.dto';
import { UpdateLogDto } from './dto/update-log.dto';

@Injectable()
export class LogsService {
  constructor(
    private prisma: PrismaService,
    private moviesService: MoviesService,
  ) {}

  findAll(userId: number, tmdbId?: number) {
    return this.prisma.log.findMany({
      where: { userId, tmdbId },
      include: { movie: true },
      orderBy: [{ watchedDate: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async create(userId: number, dto: CreateLogDto) {
    await this.moviesService.ensureMovie(dto.tmdbId);
    return this.prisma.log.create({
      data: {
        userId,
        tmdbId: dto.tmdbId,
        watchedDate: new Date(dto.watchedDate),
        rating: dto.rating ?? null,
        review: dto.review?.trim() || null,
        liked: dto.liked ?? false,
        rewatch: dto.rewatch ?? false,
      },
      include: { movie: true },
    });
  }

  async update(userId: number, id: number, dto: UpdateLogDto) {
    await this.findOwn(userId, id);
    return this.prisma.log.update({
      where: { id },
      data: {
        watchedDate: dto.watchedDate ? new Date(dto.watchedDate) : undefined,
        rating: dto.rating,
        review: dto.review === undefined ? undefined : dto.review.trim() || null,
        liked: dto.liked,
        rewatch: dto.rewatch,
      },
      include: { movie: true },
    });
  }

  async remove(userId: number, id: number) {
    await this.findOwn(userId, id);
    await this.prisma.log.delete({ where: { id } });
    return { deleted: true };
  }

  private async findOwn(userId: number, id: number) {
    const log = await this.prisma.log.findFirst({ where: { id, userId } });
    if (!log) {
      throw new NotFoundException('log not found');
    }
    return log;
  }
}

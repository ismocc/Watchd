import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MoviesService } from '../movies/movies.service';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';

@Injectable()
export class ListsService {
  constructor(
    private prisma: PrismaService,
    private moviesService: MoviesService,
  ) {}

  findAll(userId: number) {
    return this.prisma.list.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { items: true } },
        items: { take: 4, orderBy: { position: 'asc' }, include: { movie: true } },
      },
    });
  }

  async findOne(userId: number, id: number) {
    const list = await this.prisma.list.findFirst({
      where: { id, userId },
      include: { items: { orderBy: { position: 'asc' }, include: { movie: true } } },
    });
    if (!list) {
      throw new NotFoundException('list not found');
    }
    return list;
  }

  create(userId: number, dto: CreateListDto) {
    return this.prisma.list.create({
      data: { userId, name: dto.name.trim(), description: dto.description?.trim() || null },
    });
  }

  async update(userId: number, id: number, dto: UpdateListDto) {
    await this.findOwn(userId, id);
    return this.prisma.list.update({
      where: { id },
      data: {
        name: dto.name?.trim(),
        description: dto.description === undefined ? undefined : dto.description.trim() || null,
      },
    });
  }

  async remove(userId: number, id: number) {
    await this.findOwn(userId, id);
    await this.prisma.list.delete({ where: { id } });
    return { deleted: true };
  }

  async addItem(userId: number, id: number, tmdbId: number) {
    await this.findOwn(userId, id);

    const existing = await this.prisma.listItem.findUnique({
      where: { listId_tmdbId: { listId: id, tmdbId } },
    });
    if (existing) {
      throw new ConflictException('this movie is already in the list');
    }

    await this.moviesService.ensureMovie(tmdbId);

    // new movies go at the end of the list
    const last = await this.prisma.listItem.findFirst({
      where: { listId: id },
      orderBy: { position: 'desc' }
    })

    return this.prisma.listItem.create({
      data: { listId: id, tmdbId, position: last ? last.position+1 : 1 },
      include: { movie: true },
    });
  }

  async removeItem(userId: number, id: number, tmdbId: number) {
    await this.findOwn(userId, id);
    const result = await this.prisma.listItem.deleteMany({ where: { listId: id, tmdbId } });
    if (result.count === 0) {
      throw new NotFoundException('movie is not in this list');
    }
    return { deleted: true };
  }


  // makes sure the list exists AND belongs to this user, otherwise anyone could edit anyones lists
  private async findOwn(userId: number, id: number) {
    const list = await this.prisma.list.findFirst({ where: { id, userId } });
    if (!list) throw new NotFoundException('list not found');
    return list;
  }
}

import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { UserId } from '../auth/user-id.decorator';
import { ListsService } from './lists.service';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { AddItemDto } from './dto/add-item.dto';

@UseGuards(AuthGuard)
@Controller('lists')
export class ListsController {
  constructor(private listsService: ListsService) {}

  @Get()
  findAll(@UserId() userId: number) {
    return this.listsService.findAll(userId);
  }

  @Post()
  create(@UserId() userId: number, @Body() dto: CreateListDto) {
    return this.listsService.create(userId, dto);
  }

  @Get(':id')
  findOne(@UserId() userId: number, @Param('id', ParseIntPipe) id: number) {
    return this.listsService.findOne(userId, id);
  }

  @Patch(':id')
  update(@UserId() userId: number, @Param('id', ParseIntPipe) id: number, @Body() dto: UpdateListDto) {
    return this.listsService.update(userId, id, dto);
  }

  @Delete(':id')
  remove(@UserId() userId: number, @Param('id', ParseIntPipe) id: number) {
    return this.listsService.remove(userId, id);
  }

  @Post(':id/items')
  addItem(@UserId() userId: number, @Param('id', ParseIntPipe) id: number, @Body() dto: AddItemDto) {
    return this.listsService.addItem(userId, id, dto.tmdbId);
  }

  @Delete(':id/items/:tmdbId')
  removeItem(
    @UserId() userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Param('tmdbId', ParseIntPipe) tmdbId: number,
  ) {
    return this.listsService.removeItem(userId, id, tmdbId);
  }
}

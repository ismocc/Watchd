import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { UserId } from '../auth/user-id.decorator';
import { LogsService } from './logs.service';
import { CreateLogDto } from './dto/create-log.dto';
import { UpdateLogDto } from './dto/update-log.dto';

@UseGuards(AuthGuard)
@Controller('logs')
export class LogsController {
  constructor(private logsService: LogsService) {}

  @Get()
  findAll(@UserId() userId: number, @Query('movie', new ParseIntPipe({ optional: true })) movie?: number) {
    return this.logsService.findAll(userId, movie);
  }

  @Post()
  create(@UserId() userId: number, @Body() dto: CreateLogDto) {
    return this.logsService.create(userId, dto);
  }

  @Patch(':id')
  update(@UserId() userId: number, @Param('id', ParseIntPipe) id: number, @Body() dto: UpdateLogDto) {
    return this.logsService.update(userId, id, dto);
  }

  @Delete(':id')
  remove(@UserId() userId: number, @Param('id', ParseIntPipe) id: number) {
    return this.logsService.remove(userId, id);
  }
}

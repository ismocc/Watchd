import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {
  constructor(private moviesService: MoviesService) {}

  @Get('trending')
  trending() {
    return this.moviesService.trending();
  }

  @Get('search')
  search(@Query('q') q: string) {
    return this.moviesService.search(q);
  }

  @Get(':id')
  details(@Param('id', ParseIntPipe) id: number) {
    return this.moviesService.details(id);
  }
}

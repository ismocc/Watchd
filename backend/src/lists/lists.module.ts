import { Module } from '@nestjs/common';
import { MoviesModule } from '../movies/movies.module';
import { ListsController } from './lists.controller';
import { ListsService } from './lists.service';

@Module({
  imports: [MoviesModule],
  controllers: [ListsController],
  providers: [ListsService],
})
export class ListsModule {}

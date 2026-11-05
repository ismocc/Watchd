import { Module } from '@nestjs/common';
import { MoviesModule } from '../movies/movies.module';
import { LogsController } from './logs.controller';
import { LogsService } from './logs.service';

@Module({
  imports: [MoviesModule],
  controllers: [LogsController],
  providers: [LogsService],
})
export class LogsModule {}

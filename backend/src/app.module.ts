import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { MoviesModule } from './movies/movies.module';
import { LogsModule } from './logs/logs.module';
import { ListsModule } from './lists/lists.module';
import { StatsModule } from './stats/stats.module';

@Module({
  imports: [PrismaModule, AuthModule, MoviesModule, LogsModule, ListsModule, StatsModule],
})
export class AppModule {}

import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { UserId } from '../auth/user-id.decorator';
import { StatsService } from './stats.service';

@UseGuards(AuthGuard)
@Controller('stats')
export class StatsController {
  constructor(private statsService: StatsService) {}

  @Get('me')
  me(@UserId() userId: number) {
    return this.statsService.forUser(userId);
  }
}

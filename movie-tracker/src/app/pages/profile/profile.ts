import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../services/auth';
import { StatsService } from '../../services/stats';
import { Stats } from '../../models/stats';
import { StarsPipe } from '../../pipes/stars-pipe';
import { errorMessage } from '../../utils/error-message';

@Component({
  selector: 'app-profile',
  imports: [DatePipe, DecimalPipe, RouterLink, StarsPipe],
  templateUrl: './profile.html',
})
export class Profile implements OnInit {
  private statsService = inject(StatsService);
  auth = inject(AuthService);

  stats = signal<Stats | null>(null);
  error = signal('');
  ratings = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

  maxSpread = computed(() => Math.max(1, ...(this.stats()?.ratingSpread ?? [])));

  ngOnInit() {
    this.statsService.getMyStats().subscribe({
      next: (stats) => this.stats.set(stats),
      error: (err: HttpErrorResponse) => this.error.set(errorMessage(err)),
    });
  }

  barHeight(count: number) {
    return `${Math.max(2, (count / this.maxSpread()) * 100)}%`;
  }
}

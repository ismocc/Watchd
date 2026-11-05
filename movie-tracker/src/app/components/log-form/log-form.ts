import { Component, EventEmitter, Input, OnInit, Output, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { StarRating } from '../star-rating/star-rating';
import { LogsService } from '../../services/logs';
import { Log, LogInput } from '../../models/log';
import { errorMessage } from '../../utils/error-message';

@Component({
  selector: 'app-log-form',
  imports: [FormsModule, StarRating],
  templateUrl: './log-form.html',
})
export class LogForm implements OnInit {
  private logsService = inject(LogsService);

  @Input() tmdbId: number = 0;
  @Input() title: string = '';
  @Input() year: string | null = null;
  @Input() poster: string | null = null;
  @Input() log: Log | null = null;
  @Input() seenBefore = false;
  @Output() saved = new EventEmitter<Log>();
  @Output() closed = new EventEmitter<void>();

  today = new Date().toLocaleDateString('en-CA');
  watchedDate = this.today;
  rating: number | null = null;
  review = '';
  liked = false;
  rewatch = false;

  saving = signal(false);
  error = signal('');

  ngOnInit() {
    if (this.log) {
      this.title = this.log.movie.title;
      this.year = this.log.movie.releaseDate;
      this.poster = this.log.movie.posterPath;
      this.watchedDate = this.log.watchedDate.slice(0, 10);
      this.rating = this.log.rating;
      this.review = this.log.review ?? '';
      this.liked = this.log.liked;
      this.rewatch = this.log.rewatch;
    } else {
      this.rewatch = this.seenBefore;
    }
  }

  save() {
    const data: LogInput = {
      watchedDate: this.watchedDate,
      rating: this.rating,
      review: this.review,
      liked: this.liked,
      rewatch: this.rewatch,
    };

    this.saving.set(true);
    this.error.set('');

    const request = this.log
      ? this.logsService.updateLog(this.log.id, data)
      : this.logsService.createLog({ ...data, tmdbId: this.tmdbId });

    request.subscribe({
      next: (log) => {
        this.saving.set(false);
        this.saved.emit(log);
      },
      error: (err: HttpErrorResponse) => {
        this.saving.set(false);
        this.error.set(errorMessage(err));
      },
    });
  }
}

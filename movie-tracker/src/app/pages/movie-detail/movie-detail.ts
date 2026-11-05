import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { MovieService } from '../../services/movie';
import { LogsService } from '../../services/logs';
import { ListsService } from '../../services/lists';
import { MovieDetails } from '../../models/movie';
import { Log } from '../../models/log';
import { List } from '../../models/list';
import { LogForm } from '../../components/log-form/log-form';
import { StarsPipe } from '../../pipes/stars-pipe';
import { errorMessage } from '../../utils/error-message';

@Component({
  selector: 'app-movie-detail',
  imports: [FormsModule, DatePipe, LogForm, StarsPipe],
  templateUrl: './movie-detail.html',
})
export class MovieDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private movieService = inject(MovieService);
  private logsService = inject(LogsService);
  private listsService = inject(ListsService);

  movie = signal<MovieDetails | null>(null);
  logs = signal<Log[]>([]);
  lists = signal<List[]>([]);
  error = signal('');
  showLogForm = signal(false);
  listMessage = signal('');
  selectedList: number | null = null;

  lastRating = computed(() => this.logs().find((log) => log.rating)?.rating ?? null);
  liked = computed(() => this.logs().some((log) => log.liked));

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.movieService.getMovie(id).subscribe({
      next: (movie) => this.movie.set(movie),
      error: (err: HttpErrorResponse) => this.error.set(errorMessage(err)),
    });
    this.logsService.getLogsForMovie(id).subscribe((logs) => this.logs.set(logs));
    this.listsService.getLists().subscribe((lists) => this.lists.set(lists));
  }

  onLogged() {
    this.router.navigate(['/diary']);
  }

  addToList() {
    const movie = this.movie();
    const list = this.lists().find((l) => l.id === Number(this.selectedList));
    if (!movie || !list) return;

    this.listsService.addMovie(list.id, movie.id).subscribe({
      next: () => this.listMessage.set(`Added to ${list.name}`),
      error: (err: HttpErrorResponse) => this.listMessage.set(errorMessage(err)),
    });
  }
}

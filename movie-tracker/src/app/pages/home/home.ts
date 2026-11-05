import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MovieCard } from '../../components/movie-card/movie-card';
import { MovieService } from '../../services/movie';
import { Movie } from '../../models/movie';
import { errorMessage } from '../../utils/error-message';

@Component({
  selector: 'app-home',
  imports: [MovieCard],
  templateUrl: './home.html',
})
export class Home implements OnInit {
  private movieService = inject(MovieService);

  movies = signal<Movie[]>([]);
  query = signal('');
  loading = signal(true);
  error = signal('');
  private timer?: ReturnType<typeof setTimeout>;

  ngOnInit() {
    this.loadTrending();
  }

  onSearch(event: Event) {
    const query = (event.target as HTMLInputElement).value.trim();
    clearTimeout(this.timer);

    if (query.length === 0) {
      this.query.set('');
      this.loadTrending();
      return;
    }
    if (query.length < 2) return;

    // wait till they stop typing so we dont spam the api on every key
    this.timer = setTimeout(() => this.search(query), 400)
  }

  private loadTrending() {
    this.loading.set(true);
    this.movieService.getTrending().subscribe({
      next: (movies) => this.show(movies),
      error: (err: HttpErrorResponse) => this.fail(err),
    });
  }

  private search(query: string) {
    this.loading.set(true);
    this.query.set(query);
    this.movieService.searchMovies(query).subscribe({
      next: (movies) => this.show(movies),
      error: (err: HttpErrorResponse) => this.fail(err),
    });
  }

  private show(movies: Movie[]){
    this.movies.set(movies);
    this.error.set('')
    this.loading.set(false);
  }

  private fail(err: HttpErrorResponse) {
    this.error.set(errorMessage(err));
    this.loading.set(false);
  }
}

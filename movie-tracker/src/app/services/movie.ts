import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { enviroment } from '../../enviroment/enviroment';
import { Movie, MovieDetails } from '../models/movie';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private http = inject(HttpClient);
  private url = `${enviroment.apiUrl}/movies`;

  getTrending() {
    return this.http.get<Movie[]>(`${this.url}/trending`);
  }

  searchMovies(query: string) {
    return this.http.get<Movie[]>(`${this.url}/search`, { params: { q: query } });
  }

  getMovie(id: number) {
    return this.http.get<MovieDetails>(`${this.url}/${id}`);
  }
}

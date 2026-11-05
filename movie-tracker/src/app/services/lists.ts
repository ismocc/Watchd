import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { enviroment } from '../../enviroment/enviroment';
import { List, ListItem } from '../models/list';

@Injectable({
  providedIn: 'root',
})
export class ListsService {
  private http = inject(HttpClient);
  private url = `${enviroment.apiUrl}/lists`;

  getLists() {
    return this.http.get<List[]>(this.url);
  }

  getList(id: number) {
    return this.http.get<List>(`${this.url}/${id}`);
  }

  createList(name: string, description: string) {
    return this.http.post<List>(this.url, { name, description });
  }

  updateList(id: number, name: string, description: string) {
    return this.http.patch<List>(`${this.url}/${id}`, { name, description });
  }

  deleteList(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }

  addMovie(listId: number, tmdbId: number) {
    return this.http.post<ListItem>(`${this.url}/${listId}/items`, { tmdbId });
  }

  removeMovie(listId: number, tmdbId: number) {
    return this.http.delete(`${this.url}/${listId}/items/${tmdbId}`);
  }
}

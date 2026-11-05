import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { enviroment } from '../../enviroment/enviroment';
import { Log, LogInput } from '../models/log';

@Injectable({
  providedIn: 'root',
})
export class LogsService {
  private http = inject(HttpClient);
  private url = `${enviroment.apiUrl}/logs`;

  getLogs() {
    return this.http.get<Log[]>(this.url);
  }

  getLogsForMovie(tmdbId: number) {
    return this.http.get<Log[]>(this.url, { params: { movie: tmdbId } });
  }

  createLog(log: LogInput) {
    return this.http.post<Log>(this.url, log);
  }

  updateLog(id: number, log: LogInput) {
    return this.http.patch<Log>(`${this.url}/${id}`, log);
  }

  deleteLog(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }
}

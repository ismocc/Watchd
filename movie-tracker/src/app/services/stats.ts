import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { enviroment } from '../../enviroment/enviroment';
import { Stats } from '../models/stats';

@Injectable({
  providedIn: 'root',
})
export class StatsService {
  private http = inject(HttpClient);

  getMyStats() {
    return this.http.get<Stats>(`${enviroment.apiUrl}/stats/me`);
  }
}

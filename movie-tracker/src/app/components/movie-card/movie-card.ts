import { Component, Input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-movie-card',
  imports: [DecimalPipe, RouterLink],
  templateUrl: './movie-card.html',
})
export class MovieCard {
  @Input() id: number = 0;
  @Input() title: string = '';
  @Input() year: string | null = '';
  @Input() poster: string | null = null;
  @Input() rating: number | null = null;
}

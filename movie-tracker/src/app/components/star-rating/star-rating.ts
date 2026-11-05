import { Component, EventEmitter, Input, Output, signal } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  imports: [],
  templateUrl: './star-rating.html',
})
export class StarRating {
  @Input() value: number | null = null;
  @Output() valueChange = new EventEmitter<number | null>();

  stars = [1, 2, 3, 4, 5];
  hover = signal<number | null>(null);

  fill(star: number) {
    const current = this.hover() ?? this.value ?? 0;
    if (current >= star) return '100%';
    if (current >= star - 0.5) return '50%';
    return '0%';
  }

  pick(rating: number) {
    this.value = this.value === rating ? null : rating;
    this.hover.set(null);
    this.valueChange.emit(this.value);
  }
}

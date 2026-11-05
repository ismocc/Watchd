import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stars',
})
export class StarsPipe implements PipeTransform {
  transform(rating: number | null | undefined): string {
    if (!rating) return '';
    return '★'.repeat(Math.floor(rating)) + (rating % 1 ? '½' : '');
  }
}

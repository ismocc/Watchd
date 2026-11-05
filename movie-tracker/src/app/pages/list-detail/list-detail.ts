import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ListsService } from '../../services/lists';
import { List } from '../../models/list';
import { MovieCard } from '../../components/movie-card/movie-card';
import { errorMessage } from '../../utils/error-message';

@Component({
  selector: 'app-list-detail',
  imports: [FormsModule, RouterLink, MovieCard],
  templateUrl: './list-detail.html',
})
export class ListDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private listsService = inject(ListsService);

  list = signal<List | null>(null);
  error = signal('');
  editing = signal(false);
  name = '';
  description = '';

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.listsService.getList(id).subscribe({
      next: (list) => this.list.set(list),
      error: (err: HttpErrorResponse) => this.error.set(errorMessage(err)),
    });
  }

  startEdit() {
    const list = this.list();
    if (!list) return;
    this.name = list.name;
    this.description = list.description ?? '';
    this.editing.set(true);
  }

  save() {
    const list = this.list();
    if (!list || !this.name.trim()) return;
    this.listsService.updateList(list.id, this.name, this.description).subscribe((updated) => {
      this.list.set({ ...list, name: updated.name, description: updated.description });
      this.editing.set(false);
    });
  }

  deleteList() {
    const list = this.list();
    if (!list || !confirm(`Delete "${list.name}"? This can't be undone.`)) return;
    this.listsService.deleteList(list.id).subscribe(() => this.router.navigate(['/lists']));
  }

  removeMovie(tmdbId: number) {
    const list = this.list();
    if (!list) return;
    this.listsService.removeMovie(list.id, tmdbId).subscribe(() => {
      this.list.set({ ...list, items: list.items?.filter((item) => item.tmdbId !== tmdbId) });
    });
  }
}

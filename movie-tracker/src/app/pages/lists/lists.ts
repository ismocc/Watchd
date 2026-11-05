import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ListsService } from '../../services/lists';
import { List } from '../../models/list';
import { errorMessage } from '../../utils/error-message';

@Component({
  selector: 'app-lists',
  imports: [FormsModule, RouterLink],
  templateUrl: './lists.html',
})
export class Lists implements OnInit {
  private listsService = inject(ListsService);
  private router = inject(Router);

  lists = signal<List[]>([]);
  loading = signal(true);
  showForm = signal(false);
  error = signal('');
  name = '';
  description = '';

  ngOnInit() {
    this.listsService.getLists().subscribe({
      next: (lists) => {
        this.lists.set(lists);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set(errorMessage(err));
        this.loading.set(false);
      },
    });
  }

  create() {
    if (!this.name.trim()) return;
    this.listsService.createList(this.name, this.description).subscribe({
      next: (list) => this.router.navigate(['/lists', list.id]),
      error: (err: HttpErrorResponse) => this.error.set(errorMessage(err)),
    });
  }
}

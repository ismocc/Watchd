import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { LogsService } from '../../services/logs';
import { Log } from '../../models/log';
import { LogForm } from '../../components/log-form/log-form';
import { StarsPipe } from '../../pipes/stars-pipe';
import { errorMessage } from '../../utils/error-message';

@Component({
  selector: 'app-diary',
  imports: [DatePipe, RouterLink, LogForm, StarsPipe],
  templateUrl: './diary.html',
})
export class Diary implements OnInit {
  private logsService = inject(LogsService);

  logs = signal<Log[]>([]);
  loading = signal(true);
  error = signal('');
  editing = signal<Log | null>(null);

  months = computed(() => {
    const groups: { label: string; logs: Log[] }[] = [];
    for (const log of this.logs()) {
      const label = new Date(log.watchedDate).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
      });
      const last = groups[groups.length - 1];
      if (last && last.label === label) {
        last.logs.push(log);
      } else {
        groups.push({ label, logs: [log] });
      }
    }
    return groups;
  });

  ngOnInit() {
    this.load();
  }

  load() {
    this.logsService.getLogs().subscribe({
      next: (logs) => {
        this.logs.set(logs);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set(errorMessage(err));
        this.loading.set(false);
      },
    });
  }

  onSaved() {
    this.editing.set(null);
    this.load();
  }

  remove(log: Log) {
    if (!confirm(`Delete your log of ${log.movie.title}?`)) return;
    this.logsService.deleteLog(log.id).subscribe(() => {
      this.logs.update((logs) => logs.filter((l) => l.id !== log.id));
    });
  }
}

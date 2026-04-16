import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HistoryService } from '../../services/history.service';
import { ToastService } from '../../services/toast.service';
import { HistoryEntry } from '../../models/models';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="history-page">
      <div class="container">
        <!-- Header -->
        <div class="page-header fade-in">
          <div class="header-left">
            <div class="section-label">Records</div>
            <h1>Conversion History</h1>
            <p>All your past calculations in one place.</p>
          </div>
          <div class="header-right">
            @if (entries().length > 0) {
              <button class="btn-danger btn" (click)="confirmClear()">
                <svg viewBox="0 0 20 20" fill="currentColor" width="16"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
                Clear All
              </button>
            }
            <a routerLink="/converter" class="btn-primary btn">
              <svg viewBox="0 0 20 20" fill="currentColor" width="16"><path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"/></svg>
              New Conversion
            </a>
          </div>
        </div>

        <!-- Confirm Clear Dialog -->
        @if (showConfirm()) {
          <div class="confirm-overlay" (click)="showConfirm.set(false)">
            <div class="confirm-box" (click)="$event.stopPropagation()">
              <div class="confirm-icon">🗑️</div>
              <h3>Clear History?</h3>
              <p>This will permanently delete all {{ entries().length }} records.</p>
              <div class="confirm-actions">
                <button class="btn-ghost btn" (click)="showConfirm.set(false)">Cancel</button>
                <button class="btn-danger btn" (click)="clearHistory()">Delete All</button>
              </div>
            </div>
          </div>
        }

        <!-- Stats bar -->
        @if (entries().length > 0) {
          <div class="stats-bar fade-in">
            @for (s of stats; track s.label) {
              <div class="stat-item">
                <span class="stat-val">{{ s.value }}</span>
                <span class="stat-lbl">{{ s.label }}</span>
              </div>
            }
          </div>
        }

        <!-- Entries -->
        @if (entries().length === 0) {
          <div class="empty-state fade-in">
            <div class="empty-icon">📊</div>
            <h3>No history yet</h3>
            <p>Your conversion records will appear here once you start calculating.</p>
            <a routerLink="/converter" class="btn-accent btn">Start Converting</a>
          </div>
        } @else {
          <div class="entries-list fade-in">
            @for (entry of paginatedEntries(); track entry.id) {
              <div class="entry-card">
                <div class="entry-left">
                  <div class="entry-icon" [style.background]="getTypeColor(entry.unitType)">
                    <span [innerHTML]="getTypeIcon(entry.unitType)"></span>
                  </div>
                </div>
                <div class="entry-body">
                  <div class="entry-op-row">
                    <span class="op-pill" [attr.data-op]="entry.operation">{{ entry.operation | titlecase }}</span>
                    <span class="type-pill">{{ entry.unitType | titlecase }}</span>
                  </div>
                  <div class="entry-result">{{ entry.result }}</div>
                  <div class="entry-input-row">
                    <span>{{ entry.value1 }} {{ entry.unit1 }}</span>
                    @if (entry.value2 !== undefined && entry.unit2) {
                      <span class="arrow-sep">→</span>
                      <span>{{ entry.value2 }} {{ entry.unit2 }}</span>
                    }
                  </div>
                </div>
                <div class="entry-time">
                  <div class="time-date">{{ entry.timestamp | date:'MMM d' }}</div>
                  <div class="time-clock">{{ entry.timestamp | date:'HH:mm' }}</div>
                </div>
              </div>
            }
          </div>

          <!-- Pagination -->
          @if (totalPages > 1) {
            <div class="pagination">
              <button class="page-btn" (click)="prevPage()" [disabled]="currentPage === 1">
                ←
              </button>
              @for (p of pageNumbers; track p) {
                <button class="page-btn" [class.active]="p === currentPage" (click)="currentPage = p">
                  {{ p }}
                </button>
              }
              <button class="page-btn" (click)="nextPage()" [disabled]="currentPage === totalPages">
                →
              </button>
            </div>
          }
        }
      </div>
    </div>
  `,
  styles: [`
    .history-page { padding: 40px 0 80px; min-height: calc(100vh - 70px); }
    .container { max-width: 900px; margin: 0 auto; padding: 0 24px; }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 32px;
      flex-wrap: wrap;
      gap: 16px;
    }
    .section-label { font-size: 0.75rem; font-family: 'Syne', sans-serif; font-weight: 700; color: var(--accent); letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 10px; }
    h1 { font-size: 2.2rem; margin-bottom: 8px; }
    p { color: var(--text-2); }
    .header-right { display: flex; gap: 10px; align-items: center; }

    .btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; border-radius: var(--radius); font-family: 'Syne', sans-serif; font-weight: 600; font-size: 0.88rem; cursor: pointer; transition: all 0.2s; }
    .btn-primary { background: linear-gradient(135deg, var(--primary), var(--primary-d)); color: white; &:hover { opacity: 0.9; } }
    .btn-accent { background: linear-gradient(135deg, var(--accent), var(--accent-d)); color: var(--bg); font-weight: 700; &:hover { opacity: 0.9; } }
    .btn-ghost { border: 1.5px solid var(--border-2); color: var(--text-2); &:hover { border-color: var(--primary); color: var(--text-1); } }
    .btn-danger { background: rgba(255,107,107,0.12); color: var(--warn); border: 1px solid rgba(255,107,107,0.25); &:hover { background: rgba(255,107,107,0.2); } }

    /* Stats */
    .stats-bar {
      display: flex;
      gap: 0;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      overflow: hidden;
      margin-bottom: 28px;
    }
    .stat-item {
      flex: 1;
      padding: 18px;
      text-align: center;
      border-right: 1px solid var(--border);
      &:last-child { border-right: none; }
    }
    .stat-val { display: block; font-family: 'Syne', sans-serif; font-size: 1.5rem; font-weight: 800; color: var(--primary-l); }
    .stat-lbl { font-size: 0.75rem; color: var(--text-3); font-weight: 500; }

    /* Empty */
    .empty-state {
      text-align: center;
      padding: 80px 24px;
      .empty-icon { font-size: 3.5rem; margin-bottom: 20px; }
      h3 { font-size: 1.5rem; margin-bottom: 12px; }
      p { color: var(--text-2); margin-bottom: 28px; }
    }

    /* Entry cards */
    .entries-list { display: flex; flex-direction: column; gap: 12px; }
    .entry-card {
      display: flex;
      align-items: center;
      gap: 18px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 20px;
      transition: all 0.2s;
      &:hover { border-color: var(--border-2); transform: translateX(3px); }
    }
    .entry-icon {
      width: 46px; height: 46px;
      border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .entry-body { flex: 1; min-width: 0; }
    .entry-op-row { display: flex; gap: 8px; margin-bottom: 8px; }
    .op-pill {
      padding: 2px 10px;
      border-radius: 999px;
      font-size: 0.72rem;
      font-family: 'Syne', sans-serif;
      font-weight: 700;
      letter-spacing: 0.05em;
      background: rgba(108,99,255,0.15);
      color: var(--primary-l);
    }
    .type-pill {
      padding: 2px 10px;
      border-radius: 999px;
      font-size: 0.72rem;
      font-family: 'Syne', sans-serif;
      font-weight: 600;
      background: rgba(0,229,195,0.1);
      color: var(--accent);
    }
    .entry-result {
      font-family: 'Syne', sans-serif;
      font-weight: 700;
      font-size: 0.95rem;
      color: var(--text-1);
      margin-bottom: 6px;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .entry-input-row {
      font-size: 0.8rem;
      color: var(--text-3);
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .arrow-sep { color: var(--text-3); }
    .entry-time {
      text-align: right;
      flex-shrink: 0;
    }
    .time-date { font-size: 0.8rem; font-weight: 600; color: var(--text-2); font-family: 'Syne', sans-serif; }
    .time-clock { font-size: 0.75rem; color: var(--text-3); margin-top: 2px; }

    /* Pagination */
    .pagination {
      display: flex;
      justify-content: center;
      gap: 8px;
      margin-top: 32px;
    }
    .page-btn {
      min-width: 38px; height: 38px;
      display: flex; align-items: center; justify-content: center;
      background: var(--surface);
      border: 1.5px solid var(--border);
      border-radius: 8px;
      color: var(--text-2);
      font-family: 'Syne', sans-serif;
      font-weight: 600;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.2s;
      &:hover:not(:disabled) { border-color: var(--primary); color: var(--primary-l); }
      &.active { background: var(--primary); border-color: var(--primary); color: white; }
      &:disabled { opacity: 0.35; cursor: not-allowed; }
    }

    /* Confirm overlay */
    .confirm-overlay {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.6);
      backdrop-filter: blur(6px);
      z-index: 200;
      display: flex; align-items: center; justify-content: center;
    }
    .confirm-box {
      background: var(--bg-3);
      border: 1px solid var(--border-2);
      border-radius: var(--radius-lg);
      padding: 40px;
      text-align: center;
      max-width: 360px;
      animation: fadeIn 0.2s ease;
      .confirm-icon { font-size: 2.5rem; margin-bottom: 16px; }
      h3 { font-size: 1.4rem; margin-bottom: 10px; }
      p { color: var(--text-2); font-size: 0.9rem; margin-bottom: 28px; }
    }
    .confirm-actions { display: flex; gap: 12px; justify-content: center; }
  `]
})
export class HistoryComponent implements OnInit {
  private histSvc = inject(HistoryService);
  private toast   = inject(ToastService);

  entries    = signal<HistoryEntry[]>([]);
  showConfirm = signal(false);
  currentPage = 1;
  readonly perPage = 8;

  get totalPages() { return Math.ceil(this.entries().length / this.perPage); }
  get pageNumbers() { return Array.from({ length: this.totalPages }, (_, i) => i + 1); }
  get paginatedEntries() {
    return signal(this.entries().slice((this.currentPage - 1) * this.perPage, this.currentPage * this.perPage));
  }

  get stats() {
    const e = this.entries();
    const ops = [...new Set(e.map(x => x.operation))];
    const types = [...new Set(e.map(x => x.unitType))];
    return [
      { value: e.length, label: 'Total Records' },
      { value: ops.length, label: 'Operations Used' },
      { value: types.length, label: 'Unit Types' },
    ];
  }

  ngOnInit() { this.loadEntries(); }

  loadEntries() { this.entries.set(this.histSvc.getUserHistory()); }

  confirmClear() { this.showConfirm.set(true); }

  clearHistory() {
    this.histSvc.clearUserHistory();
    this.entries.set([]);
    this.showConfirm.set(false);
    this.currentPage = 1;
    this.toast.show('History cleared', 'info');
  }

  prevPage() { if (this.currentPage > 1) this.currentPage--; }
  nextPage() { if (this.currentPage < this.totalPages) this.currentPage++; }

  getTypeColor(type: string): string {
    const m: Record<string, string> = {
      length: 'rgba(167,139,250,0.2)', temperature: 'rgba(248,113,113,0.2)',
      volume: 'rgba(52,211,153,0.2)', weight: 'rgba(251,191,36,0.2)'
    };
    return m[type] ?? 'rgba(108,99,255,0.15)';
  }

  getTypeIcon(type: string): string {
    const icons: Record<string, string> = {
      length:      `<svg viewBox="0 0 24 24" fill="none" stroke="#a78bfa" stroke-width="2" width="22" height="22"><path d="M3 12h18M3 6h4m-4 12h4M17 6h4M17 18h4"/></svg>`,
      temperature: `<svg viewBox="0 0 24 24" fill="none" stroke="#f87171" stroke-width="2" width="22" height="22"><path d="M14 14.76V3.5a2.5 2.5 0 00-5 0v11.26a4.5 4.5 0 105 0z"/></svg>`,
      volume:      `<svg viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2" width="22" height="22"><path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/></svg>`,
      weight:      `<svg viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2" width="22" height="22"><circle cx="12" cy="5" r="2"/><path d="M12 7v4M8 21H4l2-8h12l2 8h-4M8 21h8"/></svg>`,
    };
    return icons[type] ?? '';
  }
}

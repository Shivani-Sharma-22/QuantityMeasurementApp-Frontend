import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-wrap">
      @for (t of toast.toasts(); track t.id) {
        <div class="toast toast--{{ t.type }}" (click)="toast.remove(t.id)">
          <span class="toast-icon">
            @if (t.type === 'success') { ✓ }
            @else if (t.type === 'error') { ✕ }
            @else { ℹ }
          </span>
          {{ t.message }}
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-wrap {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      pointer-events: none;
    }
    .toast {
      pointer-events: all;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 14px 20px;
      border-radius: var(--radius);
      font-size: 0.9rem;
      font-weight: 500;
      backdrop-filter: blur(12px);
      cursor: pointer;
      animation: slideUp 0.3s cubic-bezier(0.4,0,0.2,1);
      min-width: 280px;
      max-width: 380px;
      box-shadow: var(--shadow-lg);
    }
    .toast-icon {
      width: 22px; height: 22px;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 0.8rem;
      font-weight: 700;
      flex-shrink: 0;
    }
    .toast--success {
      background: rgba(0,214,143,0.15);
      border: 1px solid rgba(0,214,143,0.3);
      color: var(--success);
      .toast-icon { background: rgba(0,214,143,0.2); }
    }
    .toast--error {
      background: rgba(255,107,107,0.15);
      border: 1px solid rgba(255,107,107,0.3);
      color: var(--warn);
      .toast-icon { background: rgba(255,107,107,0.2); }
    }
    .toast--info {
      background: rgba(108,99,255,0.15);
      border: 1px solid rgba(108,99,255,0.3);
      color: var(--primary-l);
      .toast-icon { background: rgba(108,99,255,0.2); }
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class ToastContainerComponent {
  toast = inject(ToastService);
}

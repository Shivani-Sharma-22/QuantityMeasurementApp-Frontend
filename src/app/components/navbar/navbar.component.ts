import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <div class="nav-inner">
        <a routerLink="/home" class="brand">
          <div class="brand-icon">
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="10" fill="url(#grad1)"/>
              <path d="M8 22L14 10L18 17L21 13L24 22" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="14" cy="10" r="1.5" fill="#00e5c3"/>
              <circle cx="21" cy="13" r="1.5" fill="#00e5c3"/>
              <defs>
                <linearGradient id="grad1" x1="0" y1="0" x2="32" y2="32">
                  <stop offset="0%" stop-color="#6c63ff"/>
                  <stop offset="100%" stop-color="#3b35c4"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span class="brand-name">QuantityMeasure</span>
        </a>

        <div class="nav-right">
          @if (auth.isLoggedIn()) {
            <a routerLink="/home" routerLinkActive="active" class="nav-link">
              <svg viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/></svg>
              Home
            </a>
            <a routerLink="/history" routerLinkActive="active" class="nav-link">
              <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/></svg>
              History
            </a>
            <div class="user-badge">
              <span class="avatar">{{ auth.currentUser()?.name?.charAt(0)?.toUpperCase() }}</span>
              <span class="uname">{{ auth.currentUser()?.name }}</span>
            </div>
            <button class="btn-ghost btn-sm" (click)="logout()">
              <svg viewBox="0 0 20 20" fill="currentColor" width="16"><path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clip-rule="evenodd"/></svg>
              Logout
            </button>
          } @else {
            <a routerLink="/auth/login" class="nav-link">Login</a>
            <a routerLink="/auth/signup" class="btn-primary btn-sm">Get Started</a>
          }
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      position: fixed;
      top: 0; left: 0; right: 0;
      z-index: 1000;
      background: rgba(11,14,26,0.85);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--border);
      height: 70px;
    }
    .nav-inner {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 24px;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;
    }
    .brand-icon svg { width: 36px; height: 36px; display: block; }
    .brand-name {
      font-family: 'Syne', sans-serif;
      font-weight: 800;
      font-size: 1.15rem;
      background: linear-gradient(90deg, var(--text-1), var(--primary-l));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .nav-right {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-shrink: 0;
    }
    .nav-link {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 12px;
      border-radius: 8px;
      color: var(--text-2);
      font-family: 'Syne', sans-serif;
      font-weight: 500;
      font-size: 0.88rem;
      transition: all 0.2s;
      white-space: nowrap;
      text-decoration: none;
      svg { width: 15px; height: 15px; flex-shrink: 0; }
      &:hover { color: var(--text-1); background: var(--surface); }
      &.active { color: var(--primary-l); background: rgba(108,99,255,0.1); }
    }
    .user-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 5px 10px 5px 5px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 999px;
      margin-left: 4px;
      flex-shrink: 0;
    }
    .avatar {
      width: 26px; height: 26px;
      background: linear-gradient(135deg, var(--primary), var(--accent));
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.72rem;
      font-weight: 700;
      font-family: 'Syne', sans-serif;
      color: #fff;
      flex-shrink: 0;
    }
    .uname {
      font-size: 0.82rem;
      font-weight: 500;
      color: var(--text-2);
      max-width: 90px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .btn-sm {
      padding: 8px 14px;
      font-size: 0.83rem;
      border-radius: 8px;
      white-space: nowrap;
      flex-shrink: 0;
      cursor: pointer;
    }
    .btn-primary {
      background: linear-gradient(135deg, var(--primary), var(--primary-d));
      color: #fff;
      font-family: 'Syne', sans-serif;
      font-weight: 600;
      transition: all 0.2s;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      &:hover { opacity: 0.9; transform: translateY(-1px); }
    }
    .btn-ghost {
      border: 1.5px solid var(--border-2);
      color: var(--text-2);
      font-family: 'Syne', sans-serif;
      font-weight: 600;
      font-size: 0.83rem;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: transparent;
      padding: 8px 14px;
      border-radius: 8px;
      cursor: pointer;
      white-space: nowrap;
      flex-shrink: 0;
      svg { flex-shrink: 0; }
      &:hover { border-color: var(--warn); color: var(--warn); background: rgba(255,107,107,0.08); }
    }
    @media (max-width: 640px) {
      .uname { display: none; }
      .nav-link span { display: none; }
      .brand-name { display: none; }
    }
  `]
})
export class NavbarComponent {
  auth = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  logout() {
    this.auth.logout();
    this.toast.show('Logged out successfully', 'info');
    this.router.navigate(['/auth/login']);
  }
}

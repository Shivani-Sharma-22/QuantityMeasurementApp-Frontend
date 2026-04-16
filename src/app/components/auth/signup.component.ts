import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-bg">
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="grid"></div>
      </div>

      <div class="auth-card fade-in">
        <div class="auth-logo">
          <div class="logo-icon">
            <svg viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="10" fill="url(#g2)"/>
              <path d="M8 22L14 10L18 17L21 13L24 22" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="14" cy="10" r="1.5" fill="#00e5c3"/>
              <circle cx="21" cy="13" r="1.5" fill="#00e5c3"/>
              <defs>
                <linearGradient id="g2" x1="0" y1="0" x2="32" y2="32">
                  <stop offset="0%" stop-color="#6c63ff"/>
                  <stop offset="100%" stop-color="#3b35c4"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span class="logo-text">QuantityMeasure</span>
        </div>

        <h2>Create account</h2>
        <p class="sub">Join to start converting and tracking measurements.</p>

        @if (errorMsg()) {
          <div class="alert alert-error"><span>⚠</span> {{ errorMsg() }}</div>
        }
        @if (successMsg()) {
          <div class="alert alert-success"><span>✓</span> {{ successMsg() }}</div>
        }

        <div class="form">
          <div class="input-group">
            <label>Full Name</label>
            <div class="input-wrap">
              <svg class="input-icon" viewBox="0 0 20 20" fill="currentColor" width="16"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/></svg>
              <input type="text" [(ngModel)]="name" placeholder="Your full name" [class.has-error]="submitted && !name" />
            </div>
          </div>

          <div class="input-group">
            <label>Email</label>
            <div class="input-wrap">
              <svg class="input-icon" viewBox="0 0 20 20" fill="currentColor" width="16"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/></svg>
              <input type="email" [(ngModel)]="email" placeholder="you@example.com" [class.has-error]="submitted && !email" />
            </div>
          </div>

          <div class="input-group">
            <label>Password</label>
            <div class="input-wrap">
              <svg class="input-icon" viewBox="0 0 20 20" fill="currentColor" width="16"><path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/></svg>
              <input [type]="showPw1 ? 'text' : 'password'" [(ngModel)]="password" placeholder="Min. 6 characters" [class.has-error]="submitted && password.length < 6" />
              <button class="eye-btn" type="button" (click)="showPw1 = !showPw1">{{ showPw1 ? '🙈' : '👁' }}</button>
            </div>
            <div class="pw-strength" *ngIf="password.length > 0">
              <div class="strength-bar">
                <div class="strength-fill" [style.width.%]="pwStrength.pct" [style.background]="pwStrength.color"></div>
              </div>
              <span class="strength-label" [style.color]="pwStrength.color">{{ pwStrength.label }}</span>
            </div>
          </div>

          <div class="input-group">
            <label>Confirm Password</label>
            <div class="input-wrap">
              <svg class="input-icon" viewBox="0 0 20 20" fill="currentColor" width="16"><path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/></svg>
              <input [type]="showPw2 ? 'text' : 'password'" [(ngModel)]="confirm" placeholder="Repeat password" [class.has-error]="submitted && confirm !== password" />
              <button class="eye-btn" type="button" (click)="showPw2 = !showPw2">{{ showPw2 ? '🙈' : '👁' }}</button>
            </div>
          </div>

          <button class="submit-btn" (click)="signUp()" [class.loading]="isLoading">
            @if (isLoading) {
              <span class="spinner"></span> Creating account...
            } @else {
              Create Account →
            }
          </button>
        </div>

        <div class="auth-footer">
          Already have an account?
          <a routerLink="/auth/login">Sign in</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; padding: 24px; }
    .auth-bg { position: absolute; inset: 0; pointer-events: none; }
    .orb { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.3; }
    .orb-1 { width: 500px; height: 500px; background: radial-gradient(circle, var(--accent), transparent 70%); top: -100px; left: -100px; animation: float 9s ease-in-out infinite; }
    .orb-2 { width: 350px; height: 350px; background: radial-gradient(circle, var(--primary), transparent 70%); bottom: -50px; right: -50px; animation: float 11s ease-in-out infinite reverse; }
    .grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px); background-size: 60px 60px; }

    .auth-card { position: relative; z-index: 1; background: var(--surface); border: 1px solid var(--border); border-radius: 20px; padding: 36px 32px; width: 100%; max-width: 400px; box-shadow: var(--shadow-lg); margin: 0 auto; }
    .auth-logo { display: flex; align-items: center; gap: 9px; margin-bottom: 20px; svg { width: 30px; height: 30px; } }
    .logo-text { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1rem; background: linear-gradient(90deg, var(--text-1), var(--primary-l)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    h2 { font-size: 1.55rem; margin-bottom: 5px; }
    .sub { color: var(--text-2); font-size: 0.86rem; margin-bottom: 18px; line-height: 1.5; }

    .alert { display: flex; align-items: center; gap: 8px; padding: 10px 13px; border-radius: 8px; font-size: 0.83rem; margin-bottom: 14px; animation: fadeIn 0.25s ease; }
    .alert-error { background: rgba(255,107,107,0.12); border: 1px solid rgba(255,107,107,0.25); color: var(--warn); }
    .alert-success { background: rgba(0,214,143,0.12); border: 1px solid rgba(0,214,143,0.25); color: var(--success); }

    .form { display: flex; flex-direction: column; gap: 13px; }
    .input-group { display: flex; flex-direction: column; gap: 5px; label { font-family: 'Syne', sans-serif; font-size: 0.7rem; font-weight: 700; color: var(--text-3); text-transform: uppercase; letter-spacing: 0.07em; } }
    .input-wrap { position: relative; }
    .input-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--text-3); pointer-events: none; }
    input { width: 100%; padding: 11px 38px 11px 38px; background: var(--bg-2); border: 1.5px solid var(--border); border-radius: 9px; color: var(--text-1); font-size: 0.9rem; outline: none; transition: border-color 0.2s, box-shadow 0.2s; font-family: 'DM Sans', sans-serif; &:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(108,99,255,0.12); } &.has-error { border-color: var(--warn); } &::placeholder { color: var(--text-3); } }
    .eye-btn { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; font-size: 0.82rem; opacity: 0.55; line-height: 1; &:hover { opacity: 1; } }

    .pw-strength { display: flex; align-items: center; gap: 8px; margin-top: 5px; }
    .strength-bar { flex: 1; height: 3px; background: var(--border); border-radius: 999px; overflow: hidden; }
    .strength-fill { height: 100%; border-radius: 999px; transition: width 0.3s, background 0.3s; }
    .strength-label { font-size: 0.7rem; font-weight: 600; font-family: 'Syne', sans-serif; }

    .submit-btn { width: 100%; padding: 13px; background: linear-gradient(135deg, var(--accent), var(--accent-d)); color: var(--bg); border: none; border-radius: 9px; font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.93rem; cursor: pointer; transition: all 0.25s; display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 6px; box-shadow: 0 4px 16px rgba(0,229,195,0.3); &:hover { transform: translateY(-1px); box-shadow: 0 6px 24px rgba(0,229,195,0.45); } &.loading { opacity: 0.7; cursor: not-allowed; pointer-events: none; } }
    .spinner { width: 16px; height: 16px; border: 2px solid rgba(0,0,0,0.2); border-top-color: var(--bg); border-radius: 50%; animation: spin 0.7s linear infinite; }
    .auth-footer { text-align: center; margin-top: 18px; font-size: 0.83rem; color: var(--text-3); a { color: var(--primary-l); font-weight: 600; &:hover { text-decoration: underline; } } }

    @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-25px); } }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class SignupComponent {
  private auth   = inject(AuthService);
  private router = inject(Router);
  private toast  = inject(ToastService);

  name     = '';
  email    = '';
  password = '';
  confirm  = '';
  showPw1  = false;
  showPw2  = false;
  isLoading = false;
  submitted = false;
  errorMsg  = signal('');
  successMsg = signal('');

  get pwStrength() {
    const p = this.password;
    if (p.length < 4) return { pct: 20, color: '#ff6b6b', label: 'Weak' };
    if (p.length < 6) return { pct: 45, color: '#fbbf24', label: 'Fair' };
    if (p.length < 10 || !/[A-Z]/.test(p)) return { pct: 65, color: '#60a5fa', label: 'Good' };
    return { pct: 100, color: '#00d68f', label: 'Strong' };
  }

  signUp() {
    this.submitted = true;
    this.errorMsg.set('');
    if (!this.name || !this.email || !this.password) { this.errorMsg.set('All fields are required.'); return; }
    if (this.password.length < 6) { this.errorMsg.set('Password must be at least 6 characters.'); return; }
    if (this.password !== this.confirm) { this.errorMsg.set('Passwords do not match.'); return; }

    this.isLoading = true;
    setTimeout(() => {
      const res = this.auth.signUp(this.name, this.email, this.password);
      if (res.success) {
        this.successMsg.set('Account created! Redirecting...');
        this.toast.show('Account created successfully! 🎉', 'success');
        setTimeout(() => this.router.navigate(['/auth/login']), 1200);
      } else {
        this.errorMsg.set(res.message);
      }
      this.isLoading = false;
    }, 700);
  }
}

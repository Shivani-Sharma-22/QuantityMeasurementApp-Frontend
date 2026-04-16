import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="home">
      <!-- Hero -->
      <section class="hero">
        <div class="hero-bg">
          <div class="orb orb-1"></div>
          <div class="orb orb-2"></div>
          <div class="grid-lines"></div>
        </div>
        <div class="container hero-content fade-in">
          <div class="hero-badge">
            <span class="badge-dot"></span>
            Precision Unit Conversion
          </div>
          <h1 class="hero-title">
            Measure. Convert.<br>
            <span class="gradient-text">Calculate Everything.</span>
          </h1>
          <p class="hero-sub">
            The all-in-one quantity measurement tool for Length, Temperature, Volume, and Weight.
            Add, subtract, compare, divide — all in one elegant workspace.
          </p>
          <div class="hero-actions">
            <a routerLink="/converter" class="btn-accent btn">
              <svg viewBox="0 0 20 20" fill="currentColor" width="18"><path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"/></svg>
              Start Converting
            </a>
            <a routerLink="/history" class="btn-ghost btn">
              View History
            </a>
          </div>
          <div class="hero-stats">
            <div class="stat"><span class="stat-num">4</span><span class="stat-label">Unit Types</span></div>
            <div class="stat-div"></div>
            <div class="stat"><span class="stat-num">5</span><span class="stat-label">Operations</span></div>
            <div class="stat-div"></div>
            <div class="stat"><span class="stat-num">20+</span><span class="stat-label">Units</span></div>
          </div>
        </div>
      </section>

      <!-- Features -->
      <section class="features">
        <div class="container">
          <div class="section-label">What You Can Do</div>
          <h2 class="section-title">Powerful Operations</h2>
          <div class="features-grid">
            @for (op of operations; track op.name) {
              <div class="feature-card">
                <div class="feature-icon" [style.background]="op.bg">
                  <span>{{ op.icon }}</span>
                </div>
                <h3>{{ op.name }}</h3>
                <p>{{ op.desc }}</p>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- Unit Types -->
      <section class="unit-types">
        <div class="container">
          <div class="section-label">Categories</div>
          <h2 class="section-title">Supported Unit Types</h2>
          <div class="units-grid">
            @for (unit of unitTypes; track unit.type) {
              <div class="unit-card" (click)="goToConverter(unit.type)">
                <div class="unit-visual">
                  <div class="unit-icon-wrap" [style.background]="unit.gradBg">
                    <span class="unit-svg" [innerHTML]="unit.svg"></span>
                  </div>
                  <div class="unit-glow" [style.background]="unit.glow"></div>
                </div>
                <div class="unit-info">
                  <h3>{{ unit.label }}</h3>
                  <p>{{ unit.units }}</p>
                </div>
                <div class="unit-arrow">
                  <svg viewBox="0 0 20 20" fill="currentColor" width="18"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
                </div>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="cta-section">
        <div class="container">
          <div class="cta-card">
            <div class="cta-orb"></div>
            <h2>Ready to start measuring?</h2>
            <p>Dive into the converter and explore all unit operations.</p>
            <a routerLink="/converter" class="btn-accent btn">
              Open Converter →
            </a>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .home { overflow-x: hidden; }

    /* Hero */
    .hero {
      position: relative;
      min-height: 88vh;
      display: flex;
      align-items: center;
      overflow: hidden;
    }
    .hero-bg {
      position: absolute;
      inset: 0;
      pointer-events: none;
    }
    .orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.35;
    }
    .orb-1 {
      width: 600px; height: 600px;
      background: radial-gradient(circle, var(--primary), transparent 70%);
      top: -200px; right: -100px;
      animation: float 8s ease-in-out infinite;
    }
    .orb-2 {
      width: 400px; height: 400px;
      background: radial-gradient(circle, var(--accent), transparent 70%);
      bottom: -100px; left: 100px;
      animation: float 10s ease-in-out infinite reverse;
    }
    .grid-lines {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
      background-size: 60px 60px;
    }
    .hero-content {
      position: relative;
      z-index: 1;
      padding: 80px 24px;
      max-width: 760px;
    }
    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 16px;
      background: rgba(108,99,255,0.15);
      border: 1px solid rgba(108,99,255,0.3);
      border-radius: 999px;
      font-size: 0.82rem;
      font-weight: 600;
      font-family: 'Syne', sans-serif;
      color: var(--primary-l);
      letter-spacing: 0.05em;
      margin-bottom: 28px;
    }
    .badge-dot {
      width: 7px; height: 7px;
      background: var(--accent);
      border-radius: 50%;
      animation: pulse-glow 2s infinite;
    }
    .hero-title {
      font-size: clamp(2.5rem, 6vw, 4.5rem);
      line-height: 1.1;
      margin-bottom: 24px;
    }
    .gradient-text {
      background: linear-gradient(135deg, var(--primary-l), var(--accent));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .hero-sub {
      font-size: 1.15rem;
      color: var(--text-2);
      max-width: 560px;
      margin-bottom: 36px;
      line-height: 1.7;
    }
    .hero-actions {
      display: flex;
      gap: 14px;
      flex-wrap: wrap;
      margin-bottom: 48px;
    }
    .hero-stats {
      display: flex;
      align-items: center;
      gap: 24px;
    }
    .stat { display: flex; flex-direction: column; gap: 2px; }
    .stat-num {
      font-family: 'Syne', sans-serif;
      font-size: 1.6rem;
      font-weight: 800;
      background: linear-gradient(90deg, var(--text-1), var(--primary-l));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .stat-label { font-size: 0.78rem; color: var(--text-3); font-weight: 500; }
    .stat-div { width: 1px; height: 36px; background: var(--border-2); }

    /* Sections */
    .features, .unit-types { padding: 80px 0; }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
    .section-label {
      font-size: 0.75rem;
      font-family: 'Syne', sans-serif;
      font-weight: 700;
      color: var(--accent);
      letter-spacing: 0.12em;
      text-transform: uppercase;
      margin-bottom: 12px;
    }
    .section-title {
      font-size: clamp(1.6rem, 3vw, 2.5rem);
      margin-bottom: 48px;
      color: var(--text-1);
    }

    /* Features grid */
    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 20px;
    }
    .feature-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 28px 22px;
      transition: all 0.3s;
      &:hover {
        border-color: var(--border-2);
        transform: translateY(-4px);
        box-shadow: var(--shadow);
      }
      h3 { font-size: 1rem; margin: 16px 0 8px; color: var(--text-1); }
      p { font-size: 0.85rem; color: var(--text-3); line-height: 1.5; }
    }
    .feature-icon {
      width: 48px; height: 48px;
      border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
      font-size: 1.3rem;
    }

    /* Units grid */
    .units-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 20px;
    }
    .unit-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 24px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 18px;
      transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
      position: relative;
      overflow: hidden;
      &:hover {
        border-color: var(--primary);
        transform: translateY(-3px);
        box-shadow: var(--glow);
        .unit-arrow { transform: translateX(4px); opacity: 1; }
        .unit-glow { opacity: 0.6; }
      }
    }
    .unit-visual { position: relative; flex-shrink: 0; }
    .unit-icon-wrap {
      width: 56px; height: 56px;
      border-radius: 14px;
      display: flex; align-items: center; justify-content: center;
    }
    .unit-svg { display: flex; align-items: center; justify-content: center; }
    .unit-glow {
      position: absolute;
      inset: -6px;
      border-radius: 20px;
      filter: blur(16px);
      opacity: 0;
      z-index: -1;
      transition: opacity 0.3s;
    }
    .unit-info {
      flex: 1;
      h3 { font-size: 1.05rem; margin-bottom: 4px; }
      p { font-size: 0.8rem; color: var(--text-3); }
    }
    .unit-arrow {
      color: var(--text-3);
      opacity: 0.5;
      transition: all 0.3s;
      flex-shrink: 0;
    }

    /* CTA */
    .cta-section { padding: 60px 0 100px; }
    .cta-card {
      position: relative;
      background: linear-gradient(135deg, rgba(108,99,255,0.15), rgba(0,229,195,0.08));
      border: 1px solid rgba(108,99,255,0.25);
      border-radius: 24px;
      padding: 60px;
      text-align: center;
      overflow: hidden;
      h2 { font-size: 2rem; margin-bottom: 12px; }
      p { color: var(--text-2); margin-bottom: 32px; font-size: 1.05rem; }
    }
    .cta-orb {
      position: absolute;
      width: 400px; height: 400px;
      background: radial-gradient(circle, rgba(108,99,255,0.3), transparent 70%);
      top: -150px; left: 50%;
      transform: translateX(-50%);
      filter: blur(60px);
      pointer-events: none;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0) scale(1); }
      50% { transform: translateY(-30px) scale(1.05); }
    }

    @media (max-width: 600px) {
      .hero-content { padding: 60px 16px; }
      .features-grid, .units-grid { grid-template-columns: 1fr 1fr; }
      .cta-card { padding: 36px 24px; }
      .hero-stats { gap: 16px; }
    }
  `]
})
export class HomeComponent {
  constructor(private router: Router) {}

  operations = [
    { name: 'Convert',   icon: '⇄', bg: 'rgba(108,99,255,0.15)', desc: 'Seamlessly convert between any units of the same type.' },
    { name: 'Add',       icon: '+', bg: 'rgba(0,229,195,0.15)',  desc: 'Add two quantities together with mixed units.' },
    { name: 'Subtract',  icon: '−', bg: 'rgba(255,107,107,0.15)', desc: 'Find the difference between two measurements.' },
    { name: 'Compare',   icon: '≷', bg: 'rgba(255,183,0,0.15)',  desc: 'Compare which value is greater or smaller.' },
    { name: 'Divide',    icon: '÷', bg: 'rgba(138,43,226,0.15)', desc: 'Calculate the ratio between two quantities.' },
  ];

  unitTypes = [
    {
      type: 'length', label: 'Length', units: 'meter · cm · km · inch · foot · mile',
      gradBg: 'linear-gradient(135deg, rgba(108,99,255,0.3), rgba(108,99,255,0.1))',
      glow: 'rgba(108,99,255,0.4)',
      svg: `<svg viewBox="0 0 24 24" fill="none" stroke="#a78bfa" stroke-width="2" width="28" height="28"><path d="M3 12h18M3 6h4m-4 12h4M17 6h4M17 18h4"/></svg>`
    },
    {
      type: 'temperature', label: 'Temperature', units: 'Celsius · Fahrenheit · Kelvin',
      gradBg: 'linear-gradient(135deg, rgba(255,107,107,0.3), rgba(255,107,107,0.1))',
      glow: 'rgba(255,107,107,0.4)',
      svg: `<svg viewBox="0 0 24 24" fill="none" stroke="#f87171" stroke-width="2" width="28" height="28"><path d="M14 14.76V3.5a2.5 2.5 0 00-5 0v11.26a4.5 4.5 0 105 0z"/></svg>`
    },
    {
      type: 'volume', label: 'Volume', units: 'Liter · mL · m³ · gallon · cup',
      gradBg: 'linear-gradient(135deg, rgba(0,229,195,0.3), rgba(0,229,195,0.1))',
      glow: 'rgba(0,229,195,0.4)',
      svg: `<svg viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2" width="28" height="28"><path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/></svg>`
    },
    {
      type: 'weight', label: 'Weight', units: 'kg · gram · pound · ounce · ton',
      gradBg: 'linear-gradient(135deg, rgba(251,191,36,0.3), rgba(251,191,36,0.1))',
      glow: 'rgba(251,191,36,0.4)',
      svg: `<svg viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2" width="28" height="28"><circle cx="12" cy="5" r="2"/><path d="M12 7v4M8 21H4l2-8h12l2 8h-4M8 21h8"/></svg>`
    },
  ];

  goToConverter(type: string) {
    this.router.navigate(['/converter'], { queryParams: { type } });
  }
}

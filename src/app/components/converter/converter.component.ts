import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ConversionService } from '../../services/conversion.service';
import { HistoryService } from '../../services/history.service';
import { ToastService } from '../../services/toast.service';
import { Operation, UnitType, UNITS } from '../../models/models';

@Component({
  selector: 'app-converter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="converter-page">
      <div class="container">
        <div class="page-header fade-in">
          <div class="section-label">Converter</div>
          <h1>Unit Converter</h1>
          <p>Select a category, choose your operation, and calculate.</p>
        </div>

        <!-- Step 1: Unit Type -->
        <div class="step-section fade-in">
          <div class="step-header">
            <span class="step-num">01</span>
            <span class="step-title">Choose Category</span>
          </div>
          <div class="unit-type-grid">
            @for (u of unitTypes; track u.type) {
              <button class="type-card" [class.selected]="selectedType === u.type"
                (click)="selectType(u.type)">
                <span class="type-icon" [innerHTML]="u.svg"></span>
                <span class="type-label">{{ u.label }}</span>
                @if (selectedType === u.type) {
                  <span class="check-badge">✓</span>
                }
              </button>
            }
          </div>
        </div>

        @if (selectedType) {
          <!-- Step 2: Operation -->
          <div class="step-section fade-in">
            <div class="step-header">
              <span class="step-num">02</span>
              <span class="step-title">Choose Operation</span>
            </div>
            <div class="ops-row">
              @for (op of operations; track op.value) {
                <button class="op-btn" [class.selected]="selectedOp === op.value"
                  (click)="selectOp(op.value)">
                  <span class="op-icon">{{ op.icon }}</span>
                  <span>{{ op.label }}</span>
                </button>
              }
            </div>
          </div>

          <!-- Step 3: Inputs -->
          <div class="step-section fade-in">
            <div class="step-header">
              <span class="step-num">03</span>
              <span class="step-title">Enter Values</span>
            </div>
            <div class="inputs-grid">
              <!-- FROM -->
              <div class="input-panel">
                <div class="panel-label">FROM</div>
                <div class="input-group">
                  <label>Value</label>
                  <input type="number" [(ngModel)]="value1" placeholder="0" class="val-input" />
                </div>
                <div class="input-group">
                  <label>Unit</label>
                  <select [(ngModel)]="unit1">
                    @for (u of availableUnits; track u.symbol) {
                      <option [value]="u.symbol">{{ u.label }} ({{ u.symbol }})</option>
                    }
                  </select>
                </div>
              </div>

              <!-- Operator Badge -->
              <div class="op-divider">
                <div class="op-circle">{{ currentOpIcon }}</div>
              </div>

              <!-- TO / Second Value -->
              <div class="input-panel">
                <div class="panel-label">{{ selectedOp === 'convert' ? 'TO' : 'VALUE 2' }}</div>
                @if (selectedOp !== 'convert') {
                  <div class="input-group">
                    <label>Value</label>
                    <input type="number" [(ngModel)]="value2" placeholder="0" class="val-input" />
                  </div>
                }
                <div class="input-group">
                  <label>Unit</label>
                  <select [(ngModel)]="unit2">
                    @for (u of availableUnits; track u.symbol) {
                      <option [value]="u.symbol">{{ u.label }} ({{ u.symbol }})</option>
                    }
                  </select>
                </div>
              </div>
            </div>

            <!-- Target unit for non-convert ops -->
            @if (selectedOp !== 'convert' && selectedOp !== 'divide' && selectedOp !== 'compare') {
              <div class="target-unit-row">
                <div class="input-group">
                  <label>Result Unit</label>
                  <select [(ngModel)]="targetUnit" class="target-select">
                    @for (u of availableUnits; track u.symbol) {
                      <option [value]="u.symbol">{{ u.label }} ({{ u.symbol }})</option>
                    }
                  </select>
                </div>
              </div>
            }
          </div>

          <!-- Calculate -->
          <div class="calc-section fade-in">
            <button class="calc-btn" (click)="calculate()" [class.loading]="isLoading">
              @if (isLoading) {
                <span class="spinner"></span>
              } @else {
                <svg viewBox="0 0 20 20" fill="currentColor" width="18"><path fill-rule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-3 3a1 1 0 100 2h.01a1 1 0 100-2H10zm-4 1a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1zm1-4a1 1 0 100 2h.01a1 1 0 100-2H7zm2 1a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm4-4a1 1 0 100 2h.01a1 1 0 100-2H13zM9 9a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zM7 8a1 1 0 000 2h.01a1 1 0 000-2H7z" clip-rule="evenodd"/></svg>
              }
              Calculate
            </button>
          </div>

          <!-- Result -->
          @if (result) {
            <div class="result-section fade-in">
              <div class="result-card">
                <div class="result-tag">
                  <span class="tag-dot"></span>
                  Result
                </div>
                <div class="result-value">{{ result }}</div>
                <div class="result-meta">
                  <span class="meta-badge" [style.background]="currentTypeColor">{{ selectedType | titlecase }}</span>
                  <span class="meta-badge op-badge">{{ selectedOp | titlecase }}</span>
                </div>
              </div>
            </div>
          }
        }
      </div>
    </div>
  `,
  styles: [`
    .converter-page { padding: 40px 0 80px; min-height: calc(100vh - 70px); }
    .container { max-width: 900px; margin: 0 auto; padding: 0 24px; }

    .page-header {
      margin-bottom: 48px;
      .section-label { font-size: 0.75rem; font-family: 'Syne', sans-serif; font-weight: 700; color: var(--accent); letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 10px; }
      h1 { font-size: 2.5rem; margin-bottom: 10px; }
      p { color: var(--text-2); font-size: 1rem; }
    }

    .step-section {
      margin-bottom: 36px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 28px;
    }
    .step-header {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 24px;
    }
    .step-num {
      font-family: 'Syne', sans-serif;
      font-size: 0.7rem;
      font-weight: 800;
      color: var(--primary-l);
      letter-spacing: 0.1em;
      background: rgba(108,99,255,0.15);
      padding: 4px 10px;
      border-radius: 6px;
    }
    .step-title {
      font-family: 'Syne', sans-serif;
      font-weight: 700;
      font-size: 1rem;
      color: var(--text-1);
    }

    /* Unit Type Cards */
    .unit-type-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 14px;
    }
    .type-card {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      padding: 20px 12px;
      background: var(--bg-2);
      border: 2px solid var(--border);
      border-radius: var(--radius);
      cursor: pointer;
      transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
      font-family: 'Syne', sans-serif;
      &:hover {
        border-color: var(--primary);
        background: rgba(108,99,255,0.08);
        transform: translateY(-2px);
      }
      &.selected {
        border-color: var(--primary);
        background: rgba(108,99,255,0.12);
        box-shadow: 0 0 20px rgba(108,99,255,0.2);
      }
    }
    .type-icon { display: flex; }
    .type-label { font-size: 0.85rem; font-weight: 600; color: var(--text-2); }
    .check-badge {
      position: absolute;
      top: 8px; right: 8px;
      width: 18px; height: 18px;
      background: var(--primary);
      border-radius: 50%;
      font-size: 0.65rem;
      display: flex; align-items: center; justify-content: center;
      color: white;
      font-weight: 700;
    }

    /* Operations */
    .ops-row {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }
    .op-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      background: var(--bg-2);
      border: 2px solid var(--border);
      border-radius: var(--radius);
      color: var(--text-2);
      font-family: 'Syne', sans-serif;
      font-weight: 600;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.2s;
      &:hover { border-color: var(--accent); color: var(--accent); background: rgba(0,229,195,0.06); }
      &.selected { border-color: var(--accent); color: var(--accent); background: rgba(0,229,195,0.1); box-shadow: 0 0 16px rgba(0,229,195,0.15); }
    }
    .op-icon { font-size: 1.1rem; }

    /* Inputs */
    .inputs-grid {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      gap: 20px;
      align-items: start;
    }
    .input-panel {
      background: var(--bg-2);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 20px;
    }
    .panel-label {
      font-family: 'Syne', sans-serif;
      font-size: 0.7rem;
      font-weight: 800;
      letter-spacing: 0.12em;
      color: var(--primary-l);
      margin-bottom: 16px;
    }
    .input-group {
      display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px;
      label { font-family: 'Syne', sans-serif; font-size: 0.75rem; font-weight: 600; color: var(--text-3); text-transform: uppercase; letter-spacing: 0.06em; }
    }
    .val-input, select {
      width: 100%;
      padding: 11px 14px;
      background: var(--bg-3);
      border: 1.5px solid var(--border);
      border-radius: 8px;
      color: var(--text-1);
      font-size: 1rem;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
      &:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(108,99,255,0.12); }
      option { background: var(--bg-3); }
    }
    .op-divider {
      display: flex;
      align-items: center;
      justify-content: center;
      padding-top: 52px;
    }
    .op-circle {
      width: 44px; height: 44px;
      background: linear-gradient(135deg, var(--primary), var(--primary-d));
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 1.3rem;
      font-family: 'Syne', sans-serif;
      font-weight: 700;
      color: white;
      box-shadow: 0 0 20px rgba(108,99,255,0.4);
    }
    .target-unit-row {
      margin-top: 20px;
      max-width: 320px;
      .input-group { margin-bottom: 0; }
    }
    .target-select { width: 100%; }

    /* Calc button */
    .calc-section { display: flex; justify-content: center; margin: 8px 0 28px; }
    .calc-btn {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 16px 48px;
      background: linear-gradient(135deg, var(--primary), var(--primary-d));
      color: white;
      border-radius: var(--radius);
      font-family: 'Syne', sans-serif;
      font-weight: 700;
      font-size: 1rem;
      letter-spacing: 0.03em;
      cursor: pointer;
      transition: all 0.25s;
      box-shadow: 0 4px 24px rgba(108,99,255,0.4);
      &:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(108,99,255,0.55); }
      &:active { transform: scale(0.98); }
      &.loading { opacity: 0.7; cursor: not-allowed; }
    }
    .spinner {
      width: 18px; height: 18px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }

    /* Result */
    .result-section { margin-top: 0; }
    .result-card {
      background: linear-gradient(135deg, rgba(0,229,195,0.08), rgba(108,99,255,0.08));
      border: 1px solid rgba(0,229,195,0.25);
      border-radius: var(--radius-lg);
      padding: 36px;
      text-align: center;
      animation: resultPop 0.4s cubic-bezier(0.34,1.56,0.64,1);
    }
    .result-tag {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 0.75rem;
      font-family: 'Syne', sans-serif;
      font-weight: 700;
      color: var(--accent);
      letter-spacing: 0.1em;
      text-transform: uppercase;
      margin-bottom: 16px;
    }
    .tag-dot {
      width: 7px; height: 7px;
      background: var(--accent);
      border-radius: 50%;
    }
    .result-value {
      font-family: 'Syne', sans-serif;
      font-size: clamp(1.3rem, 3vw, 2rem);
      font-weight: 800;
      color: var(--text-1);
      margin-bottom: 20px;
      word-break: break-word;
    }
    .result-meta {
      display: flex;
      gap: 8px;
      justify-content: center;
    }
    .meta-badge {
      padding: 4px 14px;
      border-radius: 999px;
      font-size: 0.75rem;
      font-family: 'Syne', sans-serif;
      font-weight: 600;
      opacity: 0.85;
    }
    .op-badge {
      background: rgba(108,99,255,0.15);
      color: var(--primary-l);
    }

    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes resultPop {
      from { opacity: 0; transform: scale(0.94); }
      to   { opacity: 1; transform: scale(1); }
    }

    @media (max-width: 700px) {
      .unit-type-grid { grid-template-columns: repeat(2, 1fr); }
      .inputs-grid { grid-template-columns: 1fr; }
      .op-divider { padding-top: 0; transform: rotate(90deg); }
    }
  `]
})
export class ConverterComponent implements OnInit {
  private convSvc  = inject(ConversionService);
  private histSvc  = inject(HistoryService);
  private toast    = inject(ToastService);
  private route    = inject(ActivatedRoute);

  selectedType: UnitType | null = null;
  selectedOp: Operation = 'convert';
  value1 = 0;
  value2 = 0;
  unit1  = '';
  unit2  = '';
  targetUnit = '';
  result = '';
  isLoading = false;

  unitTypes = [
    { type: 'length' as UnitType, label: 'Length',
      svg: `<svg viewBox="0 0 24 24" fill="none" stroke="#a78bfa" stroke-width="2" width="32" height="32"><path d="M3 12h18M3 6h4m-4 12h4M17 6h4M17 18h4"/></svg>` },
    { type: 'temperature' as UnitType, label: 'Temperature',
      svg: `<svg viewBox="0 0 24 24" fill="none" stroke="#f87171" stroke-width="2" width="32" height="32"><path d="M14 14.76V3.5a2.5 2.5 0 00-5 0v11.26a4.5 4.5 0 105 0z"/></svg>` },
    { type: 'volume' as UnitType, label: 'Volume',
      svg: `<svg viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2" width="32" height="32"><path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/></svg>` },
    { type: 'weight' as UnitType, label: 'Weight',
      svg: `<svg viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2" width="32" height="32"><circle cx="12" cy="5" r="2"/><path d="M12 7v4M8 21H4l2-8h12l2 8h-4M8 21h8"/></svg>` },
  ];

  operations = [
    { value: 'convert'  as Operation, label: 'Convert',  icon: '⇄' },
    { value: 'add'      as Operation, label: 'Add',      icon: '+' },
    { value: 'subtract' as Operation, label: 'Subtract', icon: '−' },
    { value: 'compare'  as Operation, label: 'Compare',  icon: '≷' },
    { value: 'divide'   as Operation, label: 'Divide',   icon: '÷' },
  ];

  get availableUnits() {
    return this.selectedType ? UNITS[this.selectedType] : [];
  }

  get currentOpIcon(): string {
    return this.operations.find(o => o.value === this.selectedOp)?.icon ?? '⇄';
  }

  get currentTypeColor(): string {
    const colors: Record<UnitType, string> = {
      length: 'rgba(167,139,250,0.2)', temperature: 'rgba(248,113,113,0.2)',
      volume: 'rgba(52,211,153,0.2)', weight: 'rgba(251,191,36,0.2)'
    };
    return this.selectedType ? colors[this.selectedType] : '';
  }

  ngOnInit() {
    this.route.queryParams.subscribe(p => {
      if (p['type']) this.selectType(p['type'] as UnitType);
    });
  }

  selectType(type: UnitType) {
    this.selectedType = type;
    const units = UNITS[type];
    this.unit1 = units[0].symbol;
    this.unit2 = units[1]?.symbol ?? units[0].symbol;
    this.targetUnit = units[0].symbol;
    this.result = '';
  }

  selectOp(op: Operation) {
    this.selectedOp = op;
    this.result = '';
  }

  calculate() {
    if (!this.selectedType) { this.toast.show('Please select a unit type', 'error'); return; }
    if (isNaN(this.value1)) { this.toast.show('Please enter a valid value', 'error'); return; }

    this.isLoading = true;
    setTimeout(() => {
      try {
        const tgt = (this.selectedOp === 'convert') ? this.unit2 :
                    (this.selectedOp === 'divide' || this.selectedOp === 'compare') ? this.unit1 :
                    this.targetUnit;

        this.result = this.convSvc.calculate(
          this.selectedOp, this.value1, this.unit1, this.value2 ?? 0, this.unit2, this.selectedType!, tgt
        );

        this.histSvc.addEntry(
          this.selectedType!, this.selectedOp,
          this.value1, this.unit1, this.result, this.value2, this.unit2
        );
        this.toast.show('Calculation complete!', 'success');
      } catch (e) {
        this.toast.show('Calculation error. Check your inputs.', 'error');
      }
      this.isLoading = false;
    }, 400);
  }
}

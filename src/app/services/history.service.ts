import { Injectable } from '@angular/core';
import { HistoryEntry, Operation, UnitType } from '../models/models';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class HistoryService {
  private readonly KEY = 'qma_history';

  constructor(private auth: AuthService) {}

  private getAll(): HistoryEntry[] {
    const raw = localStorage.getItem(this.KEY);
    if (!raw) return [];
    const entries = JSON.parse(raw) as HistoryEntry[];
    return entries.map(e => ({ ...e, timestamp: new Date(e.timestamp) }));
  }

  private saveAll(entries: HistoryEntry[]): void {
    localStorage.setItem(this.KEY, JSON.stringify(entries));
  }

  getUserHistory(): HistoryEntry[] {
    const user = this.auth.currentUser();
    if (!user) return [];
    return this.getAll()
      .filter(e => e.userId === user.id)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  addEntry(
    unitType: UnitType, operation: Operation,
    value1: number, unit1: string,
    result: string, value2?: number, unit2?: string
  ): void {
    const user = this.auth.currentUser();
    if (!user) return;
    const all = this.getAll();
    const entry: HistoryEntry = {
      id: Date.now().toString(),
      userId: user.id,
      unitType, operation, value1, unit1, value2, unit2, result,
      timestamp: new Date()
    };
    all.push(entry);
    this.saveAll(all);
  }

  clearUserHistory(): void {
    const user = this.auth.currentUser();
    if (!user) return;
    const filtered = this.getAll().filter(e => e.userId !== user.id);
    this.saveAll(filtered);
  }
}

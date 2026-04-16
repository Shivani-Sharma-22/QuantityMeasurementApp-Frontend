import { Injectable, signal } from '@angular/core';
import { User } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly USERS_KEY = 'qma_users';
  private readonly CURRENT_KEY = 'qma_current_user';

  currentUser = signal<User | null>(this.loadCurrentUser());

  private loadCurrentUser(): User | null {
    const raw = localStorage.getItem(this.CURRENT_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  private getUsers(): User[] {
    const raw = localStorage.getItem(this.USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  private saveUsers(users: User[]): void {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  signUp(name: string, email: string, password: string): { success: boolean; message: string } {
    const users = this.getUsers();
    if (users.find(u => u.email === email)) {
      return { success: false, message: 'Email already registered.' };
    }
    const user: User = { id: Date.now().toString(), name, email, password };
    users.push(user);
    this.saveUsers(users);
    return { success: true, message: 'Account created successfully!' };
  }

  login(email: string, password: string): { success: boolean; message: string } {
    const users = this.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) return { success: false, message: 'Invalid email or password.' };
    localStorage.setItem(this.CURRENT_KEY, JSON.stringify(user));
    this.currentUser.set(user);
    return { success: true, message: 'Login successful!' };
  }

  logout(): void {
    localStorage.removeItem(this.CURRENT_KEY);
    this.currentUser.set(null);
  }

  isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }
}

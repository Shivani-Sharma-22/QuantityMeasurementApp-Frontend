import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent),
    canActivate: [authGuard]
  },
  {
    path: 'converter',
    loadComponent: () => import('./components/converter/converter.component').then(m => m.ConverterComponent),
    canActivate: [authGuard]
  },
  {
    path: 'history',
    loadComponent: () => import('./components/history/history.component').then(m => m.HistoryComponent),
    canActivate: [authGuard]
  },
  {
    path: 'auth',
    children: [
      { path: 'login',  loadComponent: () => import('./components/auth/login.component').then(m => m.LoginComponent) },
      { path: 'signup', loadComponent: () => import('./components/auth/signup.component').then(m => m.SignupComponent) },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'home' }
];

import { Routes } from '@angular/router';
import { authGuard } from '../shared/guards/auth-guard';
import { Login } from '../components/login/login';
import { Chat } from '../components/chat/chat';

export const routes: Routes = [
  {
    path: '',
    component: Chat,
    canActivate: [authGuard],
  },
  {
    path: 'login',
    component: Login
  },
  {
    path: '**',
    redirectTo: ''
  }
];

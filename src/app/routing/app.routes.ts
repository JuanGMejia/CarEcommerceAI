import { Routes } from '@angular/router';
import { authGuard } from '../shared/guards/auth-guard';
import { Login } from '../components/login/login';
import { ChatAlfred } from '../components/chat/chat-alfred';

export const routes: Routes = [
  {
    path: '',
    component: ChatAlfred,
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

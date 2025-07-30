import { Routes } from '@angular/router';
import { authGuard } from '../shared/guards/auth-guard';
import { Login } from '../components/login/login';
import { Chat } from '../components/chat/chat';
import { ChatAlfred } from '../components/chat/chat-alfred';

export const routes: Routes = [
  {
    path: '',
    component: ChatAlfred,
    canActivate: [authGuard],
  },
  {
    path: 'chat',
    component: Chat,
    canActivate: [authGuard],
  },
  {
    path: 'alfred',
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

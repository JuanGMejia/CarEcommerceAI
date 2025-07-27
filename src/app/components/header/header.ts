import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MsalService } from '@azure/msal-angular';

@Component({
  selector: 'app-header',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIcon
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header implements OnInit {
  private msalService = inject(MsalService);
  isLoggedIn = signal<boolean>(false)

  ngOnInit(): void {
    this.isLoggedIn.set(this.msalService.instance.getAllAccounts()?.length > 0);
  }

  logout(): void {
    this.msalService.logoutRedirect({ postLogoutRedirectUri: '/' });
  }
}

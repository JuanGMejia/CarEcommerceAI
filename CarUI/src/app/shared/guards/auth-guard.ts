import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';

export const authGuard: CanActivateFn = (route, state) => {
  const isLogged = inject(MsalService).instance.getAllAccounts().length > 0;
  if (isLogged) {
    return true;
  } else {
    inject(Router).navigate(['/login']);
    return false;
  }
};

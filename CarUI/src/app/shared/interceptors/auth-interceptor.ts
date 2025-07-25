import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { MsalService } from '@azure/msal-angular';
import { from } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { CLIENT_ID } from '../../authentication/msal.config';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const msalService = inject(MsalService);
  const account = msalService.instance.getActiveAccount() ?? msalService.instance.getAllAccounts()[0];

  if (!account) {
    return next(req); // no user session — proceed without auth header
  }

  return from(
    msalService.acquireTokenSilent({
      account,
      scopes: [`api://${CLIENT_ID}/user.read`] // replace with your actual scope
    })
  ).pipe(
    switchMap((result) => {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${result.idToken}`
        }
      });
      return next(authReq);
    }),
    catchError(() => next(req)) // fallback to original request if token fetch fails
  );
};

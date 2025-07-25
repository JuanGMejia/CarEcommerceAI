import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { AuthFactory } from './app/authentication/msal.config';
import { MSAL_INSTANCE } from '@azure/msal-angular';

async function main() {
  const msalInstance = AuthFactory();
  await msalInstance.initialize(); // ✅ Required to avoid the error

  // Handle redirect and restore session
  await msalInstance.handleRedirectPromise().then((result) => {
    if (result?.account) {
      msalInstance.setActiveAccount(result.account);
    } else {
      const accounts = msalInstance.getAllAccounts();
      if (accounts.length > 0) {
        msalInstance.setActiveAccount(accounts[0]); // restore session ✅
      }
    }
  });

  await bootstrapApplication(App, {
    ...appConfig,
    providers: [
      ...appConfig.providers!,
      { provide: MSAL_INSTANCE, useValue: msalInstance }
    ]
  });
}

main().catch(err => console.error(err));

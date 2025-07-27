import { PublicClientApplication } from '@azure/msal-browser';

export const CLIENT_ID = '';
export const TENANT_ID = '';

export function AuthFactory(): PublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: CLIENT_ID, // from Azure Portal
      redirectUri: 'http://localhost:4200',
      authority: `https://login.microsoftonline.com/${TENANT_ID}` // or your tenant ID
    },
    cache: {
      cacheLocation: 'localStorage',
      storeAuthStateInCookie: true
    }
  });
}

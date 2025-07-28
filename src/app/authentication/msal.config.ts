import { PublicClientApplication } from '@azure/msal-browser';

export const CLIENT_ID = (window as any).__env?.CLIENT_ID;
export const TENANT_ID = (window as any).__env?.TENANT_ID;

export function AuthFactory(): PublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: CLIENT_ID, // from Azure Portal
      redirectUri: 'https://test-car-ecommerce-fe-eddhaefjawbnhsa6.chilecentral-01.azurewebsites.net',
      authority: `https://login.microsoftonline.com/${TENANT_ID}` // or your tenant ID
    },
    cache: {
      cacheLocation: 'localStorage',
      storeAuthStateInCookie: true
    }
  });
}

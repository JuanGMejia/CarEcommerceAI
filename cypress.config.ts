import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: 'https://car-ecommerce-ui-bvewdmhzdng6araf.canadacentral-01.azurewebsites.net/',
    experimentalModifyObstructiveThirdPartyCode: true,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});

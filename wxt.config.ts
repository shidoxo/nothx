import { defineConfig } from 'wxt';

export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    permissions: ['storage'],
    host_permissions: ['*://*.twitter.com/*', '*://*.x.com/*']
  }
});

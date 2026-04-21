import { defineConfig } from 'cypress'

export default defineConfig({
  defaultCommandTimeout: 10000, // 10 seconds for all commands
  pageLoadTimeout: 60000,       // 60 seconds for page loads
  e2e: {
  },
})

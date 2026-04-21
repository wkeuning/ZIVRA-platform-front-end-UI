# Zivra Platform Frontend

This is the frontend for the Zivra Platform, built with React, TypeScript, and Vite. It includes features like authentication, patient management, game reviews, and more. The project uses modern tools and libraries such as TailwindCSS, Jotai, and Radix UI.

## Features

- **Authentication**: Login and role-based access control.
- **Patient Management**: View and manage patient details.
- **Game Management**: Review and approve/reject games.
- **Testing**: Includes Cypress for E2E tests and Vitest for unit tests.

(API documentation is available at: https://zivra-backend.azurewebsites.net/docs/)

## Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Git](https://git-scm.com/)

## Setup Instructions
Requirements:
-	Code editor
-	Nodejs


1. Clone the repository

2. Install dependencies:
   ```bash
   npm install
   ```

3.	Open AppConfig.ts and change the apiUrl to the correct url where the backend is running.
4.	Run the frontend by typing “npm run dev” in the terminal


## Credentials for the platform

> ⚠️ For development / testing only  
> These accounts contain sessions, games, and other test data.

---

### Therapist accounts
```
Email: therapeut@zivra.com
Password: Therapeut1!

Email: test2@test2.com
Password: Test123!
```

---

### Patient accounts
```
Email: Leon@ptient.com
Password: wornuujoveUNUJOVR573/

Email: ninalune@yes.com
Password: Password10!
```


## Scripts

- `npm run dev`: Start the development server.
- `npm run build`: Build the app for production.
- `npm run preview`: Preview the production build.
- `npm run lint`: Run ESLint to check for code issues.
- `npm run test:vitest`: Run unit tests using Vitest.

## Testing

### Cypress (E2E Tests)

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Run Cypress tests:
   ```bash
   npx cypress open
   ```

   Or run headless tests:
   ```bash
   npx cypress run
   ```

### Vitest (Unit Tests)

Run unit tests:
```bash
npm run test:vitest
```

## Project Structure

- **`src`**: Contains the main application code.
  - **`components`**: Reusable UI components.
  - **`pages`**: Page-level components for routing.
  - **`services`**: API service logic.
  - **`states`**: State management using Jotai.
  - **`hooks`**: Custom React hooks.
  - **`configs`**: Configuration files.
  - **`tests`**: Unit and integration tests.
- **`public`**: Static assets like the manifest file.
- **`cypress`**: End-to-end tests using Cypress.


## Full Dependency List

Below is a list of all npm packages used in this project, with their versions as specified in `package.json`:

<details>
<summary>Click to expand</summary>

```json
{
  "dependencies": {
    "axios": "^1.6.7",
    "jotai": "^2.7.1",
    "radix-ui": "^1.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.23.0",
    "three": "^0.160.0"
  },
  "devDependencies": {
    "@types/node": "^20.11.30",
    "@types/react": "^18.2.70",
    "@types/react-dom": "^18.2.23",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.19",
    "cypress": "^13.6.6",
    "eslint": "^8.57.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-react": "^7.34.1",
    "eslint-plugin-react-hooks": "^4.6.0",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.3",
    "typescript": "^5.4.5",
    "vite": "^5.2.10",
    "vitest": "^1.4.0"
  }
}
```
</details>


## License

This work is licensed under a [Creative Commons Attribution-NonCommercial 4.0 International License](https://creativecommons.org/licenses/by-nc/4.0/).

[![License: CC BY-NC 4.0](https://licensebuttons.net/l/by-nc/4.0/80x15.png)](https://creativecommons.org/licenses/by-nc/4.0/)

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```



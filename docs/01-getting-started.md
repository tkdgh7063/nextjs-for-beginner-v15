# Getting Started

## 1. Installation

### Manual installation

#### 1. Install Required Packages

Run the following command to install Next.js, React, and React-DOM:

```bash
npm i next@latest react@latest react-dom@latest
```

#### 2. Add Scripts to `package.json`

Add the following scripts to the `scripts` section of your `package.json` file:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "lint:fix": "eslint --fix"
  }
}
```

These scripts correspond to the different stages of application development:

- `next dev`: Starts the development server.
- `next build`: Builds the application for production.
- `next start`: Starts the production server.
- `eslint`: Runs ESLint.

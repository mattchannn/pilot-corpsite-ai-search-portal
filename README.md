<!-- omit from toc -->
# Corpsite AI Search Portal

![Test workflow](https://github.com/wtchnm/Vitamin/actions/workflows/test.yml/badge.svg) [![License](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/wtchnm/Vitamin/blob/main/LICENSE)

<!-- omit from toc -->
## Table of Content

- [Features](#features)
- [How this project is created?](#how-this-project-is-created)
- [Build app](#build-app)
- [Scripts](#scripts)

## Features

- [Vite 6](https://vitejs.dev) with [React 19](https://reactjs.org), [TypeScript 5](https://www.typescriptlang.org) and [absolute imports](https://github.com/aleclarson/vite-tsconfig-paths).
- [Tailwind CSS v4](https://tailwindcss.com) for easy stylization.
- [Biome V2](https://next.biomejs.dev) for linting, formatting and automatic import sorting.
- Write unit and integration tests with [Vitest 3](https://vitest.dev/) and [Testing Library 16](https://testing-library.com/).
- Write e2e tests with [Playwright 1.52](https://www.cypress.io).

## How this project is created?

This repository is created using this [GitHub template](https://github.com/wtchnm/Vitamin). You can auto generate the template [here](https://github.com/wtchnm/Vitamin/generate)

Alternatively, you can use [degit](https://github.com/Rich-Harris/degit) to clone the template

```bash
npx degit wtchnm/Vitamin #main my-app
```

## Build app

Login to Vercel

```bash
vercel login
```

Deploy

```bash
vercel
```

## Scripts

- `pnpm dev` - start a development server with hot reload.
- `pnpm build` - build for production. The generated files will be on the `dist` folder.
- `pnpm preview` - locally preview the production build.
- `pnpm test` - run unit and integration tests related to changed files based on git.
- `pnpm test:ci` - run all unit and integration tests in CI mode.
- `pnpm test:e2e` - run all e2e tests with Playwright.
- `pnpm test:e2e:ci` - run all e2e tests headlessly.
- `pnpm format` - format all files with Biome Formatter.
- `pnpm lint` - runs TypeScript and Biome.
- `pnpm validate` - runs `lint`, `test:ci` and `test:e2e:ci`.
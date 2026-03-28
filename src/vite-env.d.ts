/// <reference types="vite/client" />

// https://vite.dev/guide/env-and-mode#intellisense-for-typescript
interface ImportMetaEnv {
	readonly VITE_AI_SUMMARY_API_URL: string
	readonly VITE_AI_SEARCH_API_URL: string
}

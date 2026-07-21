/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SELL4ME_API_URL?: string
  readonly VITE_SELL4ME_STORE_ID?: string
  readonly VITE_SELL4ME_API_KEY?: string
  readonly VITE_SELL4ME_CURRENCY?: string
  readonly VITE_SELL4ME_STORE_NAME?: string
  readonly VITE_SELL4ME_STORE_USERNAME?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SERVER?: string
  readonly VITE_SHOW_COMMIT?: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare const __COMMMIT_HASH__: string

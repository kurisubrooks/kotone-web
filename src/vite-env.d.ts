/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SERVER: string?
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare const __COMMMIT_HASH__: string

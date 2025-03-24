/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly SERVER: string?
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

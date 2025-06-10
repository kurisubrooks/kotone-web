import { SetActivity } from '@xhayper/discord-rpc'

export {}

declare global {
  interface Window {
    electron: boolean
    api: {
      rpc: {
        setActivity: (activity: SetActivity) => void
        clearActivity: () => void
      }
    }
  }
}

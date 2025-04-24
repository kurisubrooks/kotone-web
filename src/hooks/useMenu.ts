import { MouseEvent } from 'react'
import { create } from 'zustand'
import Item from 'jellyfin-api/lib/types/media/Item'

type Types = 'track' | 'album' | 'artist'

interface MenuStore {
  showMenu: boolean

  x: number
  y: number
  type: Types
  data?: Item

  setMenu: (event: MouseEvent, type: Types, data?: Item) => void
  hideMenu: () => void
}

const useMenu = create<MenuStore>()((set, get) => ({
  showMenu: false,

  x: 0,
  y: 0,
  type: 'track',
  data: undefined,

  setMenu: (event, type, data) => {
    set(() => ({
      showMenu: true,
      x: event.pageX,
      y: event.pageY,
      type: type,
      data: data,
    }))
  },
  hideMenu: () => {
    if (get().showMenu) set(() => ({ showMenu: false }))
  },
}))

export default useMenu

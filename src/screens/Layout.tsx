import { useEffect } from 'react'
import { Outlet } from 'react-router'
import NavBar from '../components/NavBar'
import FloatingPlayer from '../components/FloatingPlayer/FloatingPlayer'
import AudioPlayer from '../components/AudioPlayer'
import Menu from '../components/Menu/Menu'
import useLibrary from '../hooks/useLibrary'
import useSettings from '../hooks/useSettings'
import useMenu from '../hooks/useMenu'
import useViews from '../api/useViews'
import useItems from '../api/useItems'
import { cn } from '../lib/cn'

const Layout = () => {
  const library = useLibrary()
  const settings = useSettings()
  const { showMenu, hideMenu } = useMenu()

  const views = useViews()
  useEffect(() => {
    if (views.data) {
      library.setViews(views.data)
      const ids = {}
      for (let i = 0; i < views.data.length; i++) {
        // @ts-expect-error won't be undefined
        ids[views.data[i].CollectionType] = views.data[i].Id
      }
      library.setViewIDs(ids)
    }
  }, [views.data])

  const musicView =
    library.viewIDs && 'music' in library.viewIDs ? library.viewIDs.music : null

  const albums = useItems(
    {
      ParentId: musicView!,
      SortBy: 'Name',
      SortOrder: 'Ascending',
      IncludeItemTypes: 'MusicAlbum',
      Recursive: true,
    },
    !!musicView && settings.useLibrary,
  )
  useEffect(() => {
    if (albums.data) console.log('ALBUM LIBRARY SET')
    if (albums.data) library.setAlbums(albums.data.Items)
  }, [albums.data])

  const songs = useItems(
    {
      SortBy: 'Name',
      SortOrder: 'Ascending',
      IncludeItemTypes: 'Audio',
      Recursive: true,
      Fields: 'MediaSources',
    },
    settings.useLibrary,
  )
  useEffect(() => {
    if (albums.data) console.log('SONG LIBRARY SET')
    if (songs.data) library.setSongs(songs.data.Items)
  }, [songs.data])

  useEffect(() => {
    const handleClick = () => hideMenu()
    const handleContext = (e: MouseEvent) => e.preventDefault()
    document.addEventListener('click', handleClick)
    if (process.env.NODE_ENV !== 'development')
      document.addEventListener('contextmenu', handleContext)
    return () => {
      document.removeEventListener('click', handleClick)
      if (process.env.NODE_ENV !== 'development')
        document.addEventListener('contextmenu', handleContext)
    }
  }, [])

  return (
    <>
      <div className="flex w-full flex-col">
        <NavBar />

        <div
          className={cn(
            'h-full w-full overflow-x-hidden',
            !showMenu ? 'overflow-y-scroll' : 'overflow-y-hidden',
          )}
        >
          <Outlet />
        </div>

        <FloatingPlayer />
        <Menu />
      </div>
      <AudioPlayer />
    </>
  )
}

export default Layout

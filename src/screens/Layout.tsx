import { useEffect, useMemo } from 'react'
import { Outlet, useLocation } from 'react-router'
import NavBar from '../components/NavBar'
import FloatingPlayer from '../components/FloatingPlayer/FloatingPlayer'
import AudioPlayer from '../components/AudioPlayer'
import Menu from '../components/Menu/Menu'
import useLibrary from '../hooks/useLibrary'
import useSettings from '../hooks/useSettings'
import useQueue from '../hooks/useQueue'
import useMenu from '../hooks/useMenu'
import useTheme from '../hooks/useTheme'
import useViews from '../api/useViews'
import useItems from '../api/useItems'
import { cn } from '../lib/cn'
import { Blurhash } from 'react-blurhash'
import isDesktop from '../lib/isDesktop'
import RPC from '../components/RPC'

const Layout = () => {
  const { setViews, setViewIDs, setAlbums, setSongs, viewIDs } = useLibrary()
  const settings = useSettings()
  const queue = useQueue()
  const { showMenu, hideMenu } = useMenu()
  const theme = useTheme()
  const location = useLocation()
  const playerScreen = location.pathname.split('/')[1] === 'player'

  // Debug re-renders
  console.log('Layout re-render', {
    themeId: theme.id,
    isReady: theme.isReady,
    hasCustomLayout: !!theme.customLayout,
    pathname: location.pathname,
  })

  const track = queue.queue.length > 0 ? queue.queue[queue.track] : undefined
  const blurhash = track
    ? 'Primary' in track.ImageBlurHashes
      ? track.ImageBlurHashes.Primary[
          'Primary' in track.ImageTags
            ? track.ImageTags.Primary
            : track.AlbumPrimaryImageTag
        ]
      : null
    : null

  const views = useViews()
  useEffect(() => {
    if (views.data) {
      setViews(views.data)
      const ids = {}
      for (let i = 0; i < views.data.length; i++) {
        ids[views.data[i].CollectionType] = views.data[i].Id
      }
      setViewIDs(ids)
    }
  }, [views.data, setViews, setViewIDs])

  const musicView = viewIDs && 'music' in viewIDs ? viewIDs.music : null

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
    if (albums.data) setAlbums(albums.data.Items)
  }, [albums.data, setAlbums])

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
    if (songs.data) setSongs(songs.data.Items)
  }, [albums.data, songs.data, setSongs])

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
  }, [hideMenu])

  // Had to memo this so it doesn't re-render hehe
  const CustomLayout = useMemo(() => {
    return theme.customLayout && theme.isReady ? theme.customLayout : null
  }, [theme.customLayout, theme.isReady])

  // Use custom layout if it exists
  if (CustomLayout) {
    return <CustomLayout />
  }

  // TODO: maybe move this to the default theme or gut this file
  // to not render anything outside of handling theme layout loading?

  return (
    <>
      <div
        className={cn(
          'font-default flex w-full flex-col overflow-hidden',
          !playerScreen && 'bg-gradient',
        )}
      >
        {playerScreen && (
          <div className="bg-surface absolute -z-100 h-screen w-full overflow-hidden">
            {blurhash && (
              <>
                <div className="bg-overlay absolute -z-90 h-screen w-full" />
                <Blurhash
                  hash={blurhash}
                  width="100%"
                  height="100%"
                  className="-z-100"
                />
              </>
            )}
          </div>
        )}

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
      {isDesktop && <RPC />}
    </>
  )
}

export default Layout

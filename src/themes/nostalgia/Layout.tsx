import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router'
import NavBar from '../../components/NavBar'
import AudioPlayer from '../../components/AudioPlayer'
import Menu from '../../components/Menu/Menu'
import useLibrary from '../../hooks/useLibrary'
import useSettings from '../../hooks/useSettings'
import useQueue from '../../hooks/useQueue'
import useMenu from '../../hooks/useMenu'
import useViews from '../../api/useViews'
import useItems from '../../api/useItems'
import { cn } from '../../lib/cn'
import { Blurhash } from 'react-blurhash'
import isDesktop from '../../lib/isDesktop'
import RPC from '../../components/RPC'
import SidebarPlayer from './components/SidebarPlayer'

const NostalgiaLayout = () => {
  const { setViews, setViewIDs, setAlbums, setSongs, viewIDs } = useLibrary()
  const settings = useSettings()
  const queue = useQueue()
  const { showMenu, hideMenu } = useMenu()
  const location = useLocation()
  const playerScreen = location.pathname.split('/')[1] === 'player'

  // Debug re-renders
  // console.log('NostalgiaLayout re-render', {
  //   pathname: location.pathname,
  //   showMenu,
  //   queueLength: queue.queue.length,
  // })

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
    if (albums.data) console.log('ALBUM LIBRARY SET (Nostalgia)')
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
    if (songs.data) console.log('SONG LIBRARY SET (Nostalgia)')
    if (songs.data) setSongs(songs.data.Items)
  }, [songs.data, setSongs, albums.data])

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

  return (
    <>
      <div className="bg-gradient flex h-screen w-full">
        {/* Main content area */}
        <div className="flex flex-1 flex-col overflow-hidden">
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

          <Menu />
        </div>

        {/* Side-positioned player proof-of-concept */}
        <div className="bg-card border-border flex h-full w-80 flex-col border-l">
          <SidebarPlayer />

          <div className="flex-1 overflow-y-auto p-4">
            <h4 className="text-secondary-foreground mb-3 text-sm font-medium">
              Queue
            </h4>
            <div className="space-y-2">
              {queue.queue.slice(0, 10).map((item, index) => (
                <div
                  key={index}
                  className={cn(
                    'rounded p-2 text-xs',
                    index === queue.track
                      ? 'bg-primary/20 text-primary-foreground'
                      : 'text-muted-foreground hover:bg-surface',
                  )}
                >
                  <div className="font-medium">{item.Name}</div>
                  <div className="text-muted-foreground">
                    {item.AlbumArtist}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AudioPlayer />
      {isDesktop && <RPC />}
    </>
  )
}

export default NostalgiaLayout

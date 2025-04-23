import { Link } from 'react-router'
import useLibrary from '../hooks/useLibrary'
import useQueue from '../hooks/useQueue'
import usePlayer from '../hooks/usePlayer'
import useItems from '../api/useItems'
import useLatest from '../api/useLatest'
import SquareListItem from '../components/SquareListItem'
import TrackListItem from '../components/TrackListItem'

const Home = () => {
  const library = useLibrary()
  const queue = useQueue()
  const { play } = usePlayer()

  const musicView =
    library.viewIDs && 'music' in library.viewIDs ? library.viewIDs.music : null
  const playlistView =
    library.viewIDs && 'playlists' in library.viewIDs
      ? library.viewIDs.playlists
      : null

  const playlists = useItems(
    {
      ParentId: playlistView!,
      SortBy: 'PlayCount,SortName',
      SortOrder: 'Descending',
      Limit: 5,
    },
    !!playlistView,
  )
  const frequent = useItems({
    SortBy: 'PlayCount',
    SortOrder: 'Descending',
    IncludeItemTypes: 'Audio',
    Recursive: true,
    Filter: 'IsPlayed',
    Limit: 4,
    Fields: 'MediaSources',
  })
  const recentlyPlayed = useItems(
    {
      SortBy: 'DatePlayed',
      SortOrder: 'Descending',
      IncludeItemTypes: 'Audio',
      Recursive: true,
      Filter: 'IsPlayed',
      Limit: 4,
      Fields: 'MediaSources',
    },
    !!musicView,
  )
  const recentlyAdded = useLatest(musicView!, { Limit: 50 }, !!musicView)

  return (
    <div className="player-padding flex flex-col gap-4 p-4">
      {!playlists.isLoading && playlists.data && (
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-medium">Playlists</h2>
          <div className="flex gap-4 overflow-x-scroll">
            {playlists.data.Items.map((item) => (
              <Link key={'playlist_' + item.Id} to={'/playlist/' + item.Id}>
                <SquareListItem item={item} />
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4 md:flex-row">
        {!frequent.isLoading && frequent.data && (
          <div className="flex flex-1 flex-col">
            <h2 className="text-2xl font-medium">Frequently Played</h2>
            {frequent.data.Items.map((item, index) => (
              <TrackListItem
                key={'rp_' + index}
                item={item}
                onClick={() => {
                  queue.setQueue([item])
                  play()
                }}
                playing={item.Id === queue.trackID}
              />
            ))}
          </div>
        )}

        {!recentlyPlayed.isLoading && recentlyPlayed.data && (
          <div className="flex flex-1 flex-col">
            <h2 className="text-2xl font-medium">Recently Played</h2>
            {recentlyPlayed.data.Items.map((item, index) => (
              <TrackListItem
                key={'rp_' + index}
                item={item}
                onClick={() => {
                  queue.setQueue([item])
                  play()
                }}
                playing={item.Id === queue.trackID}
              />
            ))}
          </div>
        )}
      </div>

      {!recentlyAdded.isLoading && recentlyAdded.data && (
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-medium">Recently Added</h2>
          <div className="flex gap-4 overflow-x-scroll">
            {recentlyAdded.data.map((item) => (
              <Link key={'ra_' + item.Id} to={'/album/' + item.Id}>
                <SquareListItem item={item} />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Home

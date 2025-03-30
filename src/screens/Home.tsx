import { Link } from 'react-router'
import useClient from '../hooks/useClient'
import useLibrary from '../hooks/useLibrary'
import useItems from '../api/useItems'
import useLatest from '../api/useLatest'
import SquareListItem from '../components/SquareListItem'

const Home = () => {
  const client = useClient()
  const library = useLibrary()

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
    Limit: 2,
    Fields: 'MediaSources',
  })
  const recentlyPlayed = useItems(
    {
      SortBy: 'DatePlayed',
      SortOrder: 'Descending',
      IncludeItemTypes: 'Audio',
      Recursive: true,
      Filter: 'IsPlayed',
      Limit: 2,
      Fields: 'MediaSources',
    },
    !!musicView,
  )
  const recentlyAdded = useLatest(musicView!, { Limit: 10 }, !!musicView)

  return (
    <div className="flex flex-col gap-4 p-4">
      {!playlists.isLoading && playlists.data && (
        <div className="flex flex-col gap-1">
          <div className="text-2xl font-medium">Playlists</div>
          <div className="flex gap-4">
            {playlists.data.Items.map((item) => (
              <Link key={'playlist_' + item.Id} to={'/playlist/' + item.Id}>
                <SquareListItem item={item} />
              </Link>
            ))}
          </div>
        </div>
      )}

      {!recentlyAdded.isLoading && recentlyAdded.data && (
        <div className="flex flex-col gap-1">
          <div className="text-2xl font-medium">Recently Added</div>
          <div className="flex gap-4">
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

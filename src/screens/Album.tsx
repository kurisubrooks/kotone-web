import { useParams } from 'react-router'
import { FixedSizeList } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import useClient from '../hooks/useClient'
import useSingleItem from '../api/useSingleItem'
import useItems from '../api/useItems'
import ticksToTime from '../lib/ticksToTime'
import TrackListItem from '../components/TrackListItem'
import useQueue from '../hooks/useQueue'
import useProgress from '../hooks/usePlayer'

const Album = () => {
  const { album: albumParam } = useParams()
  const client = useClient()
  const queue = useQueue()
  const player = useProgress()

  const album = useSingleItem(albumParam)
  const { data, isLoading } = useItems({
    ParentId: albumParam,
    SortBy: 'ParentIndexNumber,IndexNumber,Name',
    Fields: 'MediaSources',
  })

  const playlist = album.data?.Type === 'Playlist'
  const image = client.server + '/Items/' + albumParam + '/Images/Primary'

  return (
    <div className="h-full px-4 pt-4">
      <div className="flex h-full gap-4">
        <img
          src={image}
          className="round aspect-square h-96 w-96 object-cover"
        />

        {album.data && !album.isLoading && data && !isLoading && (
          <div className="flex w-full flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div className="text-4xl font-bold">{album.data.Name}</div>
              <div className="text-secondary text-2xl font-medium">
                {album.data.AlbumArtist}
              </div>
              <div className="flex gap-4">
                <div>
                  {album.data.ChildCount +
                    ' song' +
                    (album.data.ChildCount !== 1 ? 's' : '')}
                </div>
                <div>{ticksToTime(album.data.RunTimeTicks, true)}</div>
                {'ProductionYear' in album.data && (
                  <div>{album.data.ProductionYear}</div>
                )}
              </div>
            </div>

            <div className="flex shrink grow basis-auto">
              <AutoSizer>
                {({ height, width }) => (
                  <FixedSizeList
                    width={width}
                    height={height}
                    itemCount={data.Items.length}
                    itemSize={72}
                  >
                    {({ index, style }) => (
                      <TrackListItem
                        item={data.Items[index]}
                        showAlbumArt={playlist}
                        showArtist={
                          playlist ||
                          data.Items[index].Artists.join() !==
                            album.data.AlbumArtist
                        }
                        trackNumber={!playlist}
                        style={style}
                        onClick={() => {
                          const current = queue.trackID
                          queue.setQueue(data.Items, index)
                          if (data.Items[index].Id === current) player.play()
                        }}
                        playing={data.Items[index].Id === queue.trackID}
                      />
                    )}
                  </FixedSizeList>
                )}
              </AutoSizer>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Album

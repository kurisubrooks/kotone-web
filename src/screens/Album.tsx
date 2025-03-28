import { useParams } from 'react-router'
import useClient from '../hooks/useClient'
import useSingleItem from '../api/useSingleItem'
import useItems from '../api/useItems'
import ticksToTime from '../lib/ticksToTime'

const Album = () => {
  const { album: albumParam } = useParams()
  const client = useClient()

  const album = useSingleItem(albumParam)
  const { data, isLoading } = useItems({
    ParentId: albumParam,
    SortBy: 'ParentIndexNumber,IndexNumber,Name',
    Fields: 'MediaSources',
  })

  const image = client.server + '/Items/' + albumParam + '/Images/Primary'

  return (
    <div className="p-4">
      <div className="flex gap-4">
        <img
          src={image}
          className="round aspect-square h-72 w-72 object-cover"
        />

        {album.data && !album.isLoading && data && !isLoading && (
          <div className="flex flex-col gap-4">
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

            <div>
              {data?.Items.map((item, index) => (
                <div key={index}>
                  {item.IndexNumber} {item.Name}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Album

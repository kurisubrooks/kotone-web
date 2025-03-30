import Item from 'jellyfin-api/lib/types/media/Item'
import { CSSProperties } from 'react'
import useClient from '../hooks/useClient'
import ticksToTime from '../lib/ticksToTime'

interface Props {
  item: Item
  showAlbumArt?: boolean
  showArtist?: boolean
  showDuration?: boolean
  trackNumber?: boolean
  style?: CSSProperties
  onClick?: MouseEventHandler<HTMLDivElement>
  onContextMenu?: MouseEventHandler<HTMLDivElement>
}

const TrackListItem = ({
  item,
  showAlbumArt = true,
  showArtist = true,
  showDuration = true,
  trackNumber = false,
  style,
  onClick,
  onContextMenu,
}: Props) => {
  const client = useClient()

  const image =
    'Primary' in item.ImageTags
      ? client.server + '/Items/' + item.Id + '/Images/Primary?maxHeight=96'
      : 'AlbumPrimaryImageTag' in item && item.AlbumPrimaryImageTag
        ? client.server +
          '/Items/' +
          item.AlbumId +
          '/Images/Primary?maxHeight=96'
        : null

  return (
    <div
      style={style}
      className="round flex h-18 gap-4 py-1 transition hover:cursor-pointer hover:bg-zinc-100/20"
      onClick={onClick}
      onContextMenu={onContextMenu}
    >
      {trackNumber && !showAlbumArt && (
        <div className="flex w-16 items-center justify-center">
          {item.IndexNumber}
        </div>
      )}
      {showAlbumArt && !trackNumber && (
        <img
          src={image}
          className="round aspect-square h-16 w-16 object-cover"
        />
      )}
      <div className="flex grow flex-col justify-center">
        <div className="line-clamp-1 font-medium">{item.Name}</div>
        {showArtist && (
          <div className="text-secondary clamp-1">
            {item.Type === 'MusicAlbum'
              ? item.AlbumArtist
              : item.Artists.join(', ')}
          </div>
        )}
      </div>
      {showDuration && (
        <div className="flex items-center pr-4">
          {ticksToTime(item.RunTimeTicks)}
        </div>
      )}
    </div>
  )
}

export default TrackListItem

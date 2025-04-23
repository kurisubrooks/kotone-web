import { CSSProperties, MouseEventHandler, useState } from 'react'
import Item from 'jellyfin-api/lib/types/media/Item'
import useClient from '../hooks/useClient'
import ticksToTime from '../lib/ticksToTime'
import Icon from './Icon'
import { getBlurHashAverageColor } from 'fast-blurhash'
import tinycolor from 'tinycolor2'

interface Props {
  item: Item
  showAlbumArt?: boolean
  showArtist?: boolean
  showDuration?: boolean
  trackNumber?: boolean
  playing?: boolean
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
  playing = false,
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

  const blurhash =
    'Primary' in item.ImageBlurHashes
      ? item.ImageBlurHashes.Primary[
          'Primary' in item.ImageTags
            ? item.ImageTags.Primary
            : item.AlbumPrimaryImageTag
        ]
      : null
  const color = blurhash ? getBlurHashAverageColor(blurhash) : null
  const hoverStyle: CSSProperties = {
    backgroundColor: color
      ? tinycolor({
          r: color[0],
          g: color[1],
          b: color[2],
          a: 0.4,
        }).toHex8String()
      : '#f4f4f560',
  }

  const [focus, setFocus] = useState<boolean>(false)

  return (
    <div style={style} className="flex h-18 w-full py-1">
      <div
        className="round group flex h-16 w-full gap-4 py-1 transition hover:cursor-pointer"
        onClick={onClick}
        onContextMenu={onContextMenu}
        style={focus ? hoverStyle : {}}
        onMouseEnter={() => setFocus(true)}
        onMouseLeave={() => setFocus(false)}
      >
        {trackNumber && !showAlbumArt && (
          <div className="flex w-16 items-center justify-center">
            {playing ? <Icon icon="equalizer" size={24} /> : item.IndexNumber}
          </div>
        )}
        {showAlbumArt && !trackNumber && (
          <div className="relative flex w-16 items-center justify-center">
            <img
              src={image!}
              className="round aspect-square h-16 w-16 object-cover transition group-hover:brightness-125"
            />
            {playing && (
              <div className="round absolute flex h-16 w-16 items-center justify-center bg-zinc-900/60">
                <Icon icon="equalizer" size={24} />
              </div>
            )}
          </div>
        )}
        <div className="flex grow basis-0 flex-col justify-center">
          <div className="line-clamp-1 font-medium">{item.Name}</div>
          {showArtist && (
            <div className="text-secondary line-clamp-1">
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
    </div>
  )
}

export default TrackListItem

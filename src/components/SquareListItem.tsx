import { CSSProperties, MouseEventHandler, useState } from 'react'
import Item from 'jellyfin-api/lib/types/media/Item'
import useClient from '../hooks/useClient'
import { getBlurHashAverageColor } from 'fast-blurhash'
import tinycolor from 'tinycolor2'

interface Props {
  item: Item
  style?: CSSProperties
  onClick?: MouseEventHandler<HTMLDivElement>
  onContextMenu?: MouseEventHandler<HTMLDivElement>
}

const SquareListItem = ({ item, style, onClick, onContextMenu }: Props) => {
  const client = useClient()

  const image =
    'Primary' in item.ImageTags
      ? client.server + '/Items/' + item.Id + '/Images/Primary?maxHeight=256'
      : 'AlbumPrimaryImageTag' in item && item.AlbumPrimaryImageTag
        ? client.server +
          '/Items/' +
          item.AlbumId +
          '/Images/Primary?maxHeight=256'
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
    <div
      className="group round flex flex-col gap-1 transition"
      onClick={onClick}
      onContextMenu={onContextMenu}
      style={{ ...style, ...(focus && hoverStyle) }}
      onMouseEnter={() => setFocus(true)}
      onMouseLeave={() => setFocus(false)}
    >
      <img
        src={image!}
        className="round aspect-square h-48 w-48 object-cover transition group-hover:brightness-125"
      />
      <div className="flex w-48 flex-col px-2 py-1">
        <div className="line-clamp-2 font-medium">{item.Name}</div>
        {'AlbumArtist' in item && (
          <div className="text-secondary line-clamp-1">{item.AlbumArtist}</div>
        )}
      </div>
    </div>
  )
}

export default SquareListItem

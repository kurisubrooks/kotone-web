import { CSSProperties, MouseEventHandler, useState } from 'react'
import Item from 'jellyfin-api/lib/types/media/Item'
import useClient from '../hooks/useClient'
import { getBlurHashAverageColor } from 'fast-blurhash'
import cardColor from '../lib/cardColor'

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
  const average = blurhash ? getBlurHashAverageColor(blurhash) : null
  const color = average
    ? cardColor({ r: average[0], g: average[1], b: average[2] })
    : '#f4f4f560'
  const hoverStyle: CSSProperties = {
    backgroundColor: color,
    outlineColor: color,
  }

  const [focus, setFocus] = useState<boolean>(false)

  return (
    <div
      className="group round my-2 flex flex-col gap-1 outline-8 outline-transparent transition outline-solid"
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
      <div className="flex w-48 flex-col">
        <div className="line-clamp-2 font-medium">{item.Name}</div>
        {'AlbumArtist' in item && (
          <div className="text-secondary line-clamp-1">{item.AlbumArtist}</div>
        )}
      </div>
    </div>
  )
}

export default SquareListItem

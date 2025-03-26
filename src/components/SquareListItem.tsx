import { MouseEventHandler } from 'react'
import Item from 'jellyfin-api/lib/types/media/Item'
import useClient from '../hooks/useClient'

interface Props {
  item: Item
  onClick?: MouseEventHandler<HTMLDivElement>
  onContextMenu?: MouseEventHandler<HTMLDivElement>
}

const SquareListItem = ({ item, onClick, onContextMenu }: Props) => {
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

  return (
    <div
      className="group round flex flex-col gap-1"
      onClick={onClick}
      onContextMenu={onContextMenu}
    >
      <img
        src={image!}
        className="round aspect-square h-48 w-48 object-cover transition group-hover:scale-105 group-hover:brightness-125"
      />
      <div className="flex flex-col">
        <div className="font-medium">{item.Name}</div>
        {'AlbumArtist' in item && (
          <div className="text-secondary">{item.AlbumArtist}</div>
        )}
      </div>
    </div>
  )
}

export default SquareListItem

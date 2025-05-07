import { CSSProperties, MouseEventHandler, useState } from 'react'
import Item from 'jellyfin-api/lib/types/media/Item'
import useClient from '../hooks/useClient'
import ticksToTime from '../lib/ticksToTime'
import Icon from './Icon'
import { getBlurHashAverageColor } from 'fast-blurhash'
import tinycolor from 'tinycolor2'
import useFavItem from '../api/useFavItem'
import { cn } from '../lib/cn'
import { DraggableProvided } from '@hello-pangea/dnd'
import useQueue from '../hooks/useQueue'

interface Props {
  item: Item
  showAlbumArt?: boolean
  showArtist?: boolean
  showDuration?: boolean
  showLike?: boolean | string
  trackNumber?: boolean
  playing?: boolean
  provided?: DraggableProvided
  dragging?: boolean
  index?: number
  style?: CSSProperties
  onClick?: MouseEventHandler<HTMLDivElement>
  onContextMenu?: MouseEventHandler<HTMLDivElement>
}

const TrackListItem = ({
  item,
  showAlbumArt = true,
  showArtist = true,
  showDuration = true,
  showLike = false,
  trackNumber = false,
  playing = false,
  provided,
  dragging = false,
  index,
  style,
  onClick,
  onContextMenu,
}: Props) => {
  const client = useClient()
  const queue = useQueue()
  const favItem = useFavItem(
    item.Id,
    typeof showLike === 'string' ? showLike : item.AlbumId,
  )

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
    <div
      className={cn('flex h-18 w-full py-1', dragging && 'text-w')}
      ref={provided ? provided.innerRef : undefined}
      {...provided?.draggableProps}
      style={{ ...provided?.draggableProps.style, ...style }}
    >
      <div
        className="round group flex h-16 w-full py-1 transition hover:cursor-pointer"
        onClick={onClick}
        onContextMenu={onContextMenu}
        style={focus || dragging ? hoverStyle : {}}
        onMouseEnter={() => setFocus(true)}
        onMouseLeave={() => setFocus(false)}
      >
        {trackNumber && !showAlbumArt && (
          <div className="flex w-16 items-center justify-center">
            {playing ? <Icon icon="equalizer" size={24} /> : item.IndexNumber}
          </div>
        )}
        {showAlbumArt && !trackNumber && (
          <div className="relative mr-4 flex w-16 items-center justify-center">
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
        <div className="flex flex-1 flex-col justify-center">
          <div className="line-clamp-1 font-medium">{item.Name}</div>
          {showArtist && (
            <div
              className={cn(
                'line-clamp-1',
                dragging ? 'text-zinc-100/60' : 'text-secondary',
              )}
            >
              {item.Type === 'MusicAlbum'
                ? item.AlbumArtist
                : item.Artists.join(', ')}
            </div>
          )}
        </div>
        {showLike && (
          <div className="flex w-12 items-center">
            <Icon
              icon="favorite"
              filled={item.UserData.IsFavorite}
              className="hover:bg-highlight rounded-full p-2 transition"
              onClick={(e) => {
                favItem.mutate(item.UserData.IsFavorite)
                e.stopPropagation()
              }}
            />
          </div>
        )}
        {showDuration && (
          <div className="mx-4 flex items-center">
            {ticksToTime(item.RunTimeTicks)}
          </div>
        )}
        {index !== undefined && (
          <div className="flex items-center">
            <Icon
              icon="close"
              className="hover:bg-highlight rounded-full p-2 transition"
              onClick={(e) => {
                queue.removeQueue(index)
                e.stopPropagation()
              }}
            />
          </div>
        )}
        {provided && (
          <div
            className="flex w-12 items-center justify-center hover:cursor-grab"
            onClick={(e) => {
              e.stopPropagation()
            }}
            {...provided?.dragHandleProps}
          >
            <Icon icon="reorder" />
          </div>
        )}
      </div>
    </div>
  )
}

export default TrackListItem

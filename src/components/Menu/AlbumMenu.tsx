import useMenu from '../../hooks/useMenu'
import useQueue from '../../hooks/useQueue'
import usePlayer from '../../hooks/usePlayer'
import useItems from '../../api/useItems'
import { useNavigate } from 'react-router'
import Option from './Option'
import Separator from './Separator'

const AlbumMenu = () => {
  const menu = useMenu()
  const queue = useQueue()
  const { play } = usePlayer()
  const navigate = useNavigate()

  const album = menu.data!
  const { data, isLoading } = useItems({
    ParentId: album.Id,
    SortBy: 'ParentIndexNumber,IndexNumber,Name',
    Fields: 'MediaSources',
  })

  const waiting = isLoading || !data
  const playlist = album.Type === 'Playlist'

  return (
    <div className="flex flex-col">
      <Option
        text={playlist ? 'Play Playlist' : 'Play Album'}
        icon="play_arrow"
        iconFilled
        onClick={() => {
          if (!waiting) queue.setQueue(data.Items)
          play()
        }}
        disabled={waiting}
      />
      <Option
        text={playlist ? 'Shuffle Playlist' : 'Shuffle Album'}
        icon="shuffle"
        onClick={() => {
          if (!waiting)
            queue.setQueue([...data!.Items].sort(() => Math.random() - 0.5))
          play()
        }}
        disabled={waiting}
      />
      <Option
        text="Play Next"
        icon="playlist_play"
        onClick={() => {
          if (!waiting) queue.nextQueue(data!.Items)
        }}
        disabled={waiting}
      />
      <Option
        text="Add to Queue"
        icon="playlist_add"
        onClick={() => {
          if (!waiting) queue.addQueue(data!.Items)
        }}
        disabled={waiting}
      />
      <Separator />
      <Option text="Add to Playlist" icon="playlist_add" disabled />

      {!playlist && (
        <>
          <Separator />
          <Option
            text="View Album"
            icon="album"
            onClick={() => {
              navigate('/album/' + album.Id)
            }}
          />
          <Option text="View Artist" icon="artist" iconFilled disabled />
        </>
      )}

      {playlist && (
        <>
          <Separator />
          <Option
            text="Delete Playlist"
            icon="playlist_remove"
            iconFilled
            disabled
          />
        </>
      )}
    </div>
  )
}

export default AlbumMenu

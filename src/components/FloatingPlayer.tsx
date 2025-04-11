import useClient from '../hooks/useClient'
import useQueue from '../hooks/useQueue'
import usePlayer from '../hooks/usePlayer'
import Icon from './Icon'

const FloatingPlayer = () => {
  const client = useClient()
  const queue = useQueue()
  const player = usePlayer()

  const track = queue.queue.length > 0 ? queue.queue[queue.track] : undefined
  const image = track
    ? 'Primary' in track.ImageTags
      ? client.server + '/Items/' + track.Id + '/Images/Primary?maxHeight=96'
      : 'AlbumPrimaryImageTag' in track && track.AlbumPrimaryImageTag
        ? client.server +
          '/Items/' +
          track.AlbumId +
          '/Images/Primary?maxHeight=96'
        : null
    : null

  return (
    track && (
      <div className="absolute bottom-4 flex w-full justify-center">
        <div className="text-w round flex w-lg items-center bg-pink-800/40">
          <div className="flex grow gap-4">
            <div className="round bg-w h-16 w-16">
              <img
                src={image!}
                className="round aspect-square h-16 w-16 object-cover"
              />
            </div>
            <div className="flex flex-col justify-center">
              <div className="text-xl font-medium">{track?.Name}</div>
              <div className="text-zinc-100/80">
                {track?.Artists.join(', ')}
              </div>
            </div>
          </div>
          <div className="flex gap-2 px-4">
            <Icon
              icon={player.isPlaying ? 'pause' : 'play_arrow'}
              size={32}
              filled
              onClick={() => {
                player.playpause()
              }}
              className="hover:cursor-pointer"
            />
            <Icon
              icon="skip_next"
              size={32}
              filled
              onClick={() => {
                queue.nextTrack()
              }}
              className="hover:cursor-pointer"
            />
          </div>
        </div>
      </div>
    )
  )
}

export default FloatingPlayer

import Icon from '../components/Icon'
import useClient from '../hooks/useClient'
import useQueue from '../hooks/useQueue'
import usePlayer from '../hooks/usePlayer'
import useDimensions from '../hooks/useDimensions'
import LargeButton from '../components/Player/LargeButton'
import Progress from '../components/Player/Progress'
import Queue from './Queue'

const Player = () => {
  const client = useClient()
  const queue = useQueue()
  const player = usePlayer()
  const { width, height } = useDimensions()

  const track = queue.queue.length > 0 ? queue.queue[queue.track] : undefined
  const image = track
    ? 'Primary' in track.ImageTags
      ? client.server + '/Items/' + track.Id + '/Images/Primary'
      : 'AlbumPrimaryImageTag' in track && track.AlbumPrimaryImageTag
        ? client.server + '/Items/' + track.AlbumId + '/Images/Primary'
        : null
    : null

  const maxImageSize = Math.min(width / 2, (height / 10) * 4.5)

  return track ? (
    <div className="text-w flex h-full flex-row">
      <div className="flex flex-1 flex-col items-center p-4">
        <div
          className="flex flex-col justify-between gap-4"
          style={{
            maxWidth: maxImageSize,
            maxHeight: maxImageSize,
          }}
        >
          <img
            src={image!}
            className="round-2 aspect-square object-cover"
            style={{
              maxWidth: maxImageSize,
              maxHeight: maxImageSize,
            }}
          />

          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold">{track.Name}</h1>
            <h2 className="text-2xl font-medium text-zinc-100/60">
              {track.Artists.join(', ')}
            </h2>
            {track.Name !== track.Album && (
              <h3 className="text-2xl text-zinc-100/60">{track.Album}</h3>
            )}
          </div>

          <Progress />

          <div className="flex flex-row items-center justify-evenly">
            <LargeButton
              icon="skip_previous"
              onClick={() => queue.prevTrack()}
            />
            <LargeButton
              icon={player.isPlaying ? 'pause' : 'play_arrow'}
              large
              onClick={() => player.playpause()}
            />
            <LargeButton icon="skip_next" onClick={() => queue.nextTrack()} />
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        <Queue />
      </div>
    </div>
  ) : (
    <div></div>
  )
}

export default Player

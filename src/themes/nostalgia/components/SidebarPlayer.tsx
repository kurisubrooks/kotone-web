import useClient from '@/hooks/useClient'
import useQueue from '@/hooks/useQueue'
import useProgress from '@/hooks/usePlayer'
import { useNavigate } from 'react-router'

const SidebarPlayer = () => {
  const client = useClient()
  const queue = useQueue()
  const player = useProgress()
  const navigate = useNavigate()

  const track = queue.queue.length > 0 ? queue.queue[queue.track] : undefined
  const image = track
    ? 'Primary' in track.ImageTags
      ? `${client.server}/Items/${track.Id}/Images/Primary?maxHeight=240&quality=90`
      : 'AlbumPrimaryImageTag' in track && track.AlbumPrimaryImageTag
        ? `${client.server}/Items/${track.AlbumId}/Images/Primary?maxHeight=240&quality=90`
        : null
    : null

  return (
    <div className="border-border border-b p-4">
      <h3 className="text-primary-foreground mb-2 text-lg font-medium">
        Now Playing
      </h3>
      {track ? (
        <div className="space-y-3">
          <div
            className="rounded-theme bg-surface group relative aspect-square cursor-pointer overflow-hidden"
            onClick={() => navigate('/player')}
          >
            {image ? (
              <img
                src={image}
                className="aspect-square h-full w-full object-cover"
                alt={track.Name}
              />
            ) : (
              <div className="from-primary/20 to-secondary/20 flex h-full w-full items-center justify-center bg-gradient-to-br">
                <span className="material-symbols-rounded text-4xl opacity-50">
                  music_note
                </span>
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
              <span className="material-symbols-rounded text-5xl text-white">
                open_in_full
              </span>
            </div>
          </div>
          <div className="space-y-1 text-center">
            <div
              className="text-primary truncate text-sm font-medium"
              title={track.Name}
            >
              {track.Name}
            </div>
            <div
              className="text-secondary-foreground truncate text-xs"
              title={track.AlbumArtist || track.Artists?.join(', ')}
            >
              {track.AlbumArtist || track.Artists?.join(', ')}
            </div>
          </div>
          <div className="flex items-center justify-center space-x-2 pt-2">
            <button
              className="bg-surface hover:bg-primary/20 text-primary-foreground flex size-10 items-center justify-center rounded-full transition-colors hover:scale-110"
              onClick={() => queue.prevTrack()}
              aria-label="Previous Track"
            >
              <span className="material-symbols-rounded flex">
                skip_previous
              </span>
            </button>
            <button
              className="bg-primary text-background flex size-14 items-center justify-center rounded-full transition-transform hover:scale-110"
              onClick={() => player.playpause()}
              aria-label={player.isPlaying ? 'Pause' : 'Play'}
            >
              <span className="material-symbols-rounded flex text-4xl!">
                {player.isPlaying ? 'pause' : 'play_arrow'}
              </span>
            </button>
            <button
              className="bg-surface hover:bg-primary/20 text-primary-foreground flex size-10 items-center justify-center rounded-full transition-colors hover:scale-110"
              onClick={() => queue.nextTrack()}
              aria-label="Next Track"
            >
              <span className="material-symbols-rounded flex">skip_next</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex h-48 items-center justify-center text-center">
          <p className="text-muted-foreground text-sm">No track playing</p>
        </div>
      )}
    </div>
  )
}

export default SidebarPlayer

import { useEffect } from 'react'
import useClient from '../hooks/useClient'
import useSettings from '../hooks/useSettings'
import usePlayer from '../hooks/usePlayer'
import useProgress from '../hooks/useProgress'
import useQueue from '../hooks/useQueue'
import ActivityType from '../types/ActivityType'
import { ticksToSecs } from '../lib/ticksToTime'

const RPC = () => {
  const client = useClient()
  const settings = useSettings()
  const queue = useQueue()
  const { isPlaying } = usePlayer()
  const { progress } = useProgress()
  const track = queue.queue.length > 0 ? queue.queue[queue.track] : undefined

  useEffect(() => {
    if (track) {
      window.api.rpc.setActivity({
        type: ActivityType.Listening,
        name: track.Artists.join(', '),
        details: track.Name,
        state: track.Artists.join(', '),
        largeImageText: track.Album,
        startTimestamp: Date.now() - progress * 1000,
        endTimestamp: isPlaying
          ? Date.now() +
            ticksToSecs(track.RunTimeTicks) * 1000 -
            progress * 1000
          : undefined,
      })
    } else {
      window.api.rpc.clearActivity()
    }
  }, [track, isPlaying])

  return <div className="hidden" />
}

export default RPC

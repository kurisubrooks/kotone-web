import { sessions } from 'jellyfin-api'
import ProgressQuery, {
  ProgressStoppedQuery,
} from 'jellyfin-api/lib/types/queries/ProgressQuery'

import useClient from '../hooks/useClient'
import usePlayer from '../hooks/usePlayer'
import useQueue from '../hooks/useQueue'
import useProgress from '../hooks/useProgress'
import secsToTicks from './secsToTicks'

export const playing = async (
  event: 'timeupdate' | 'pause' | 'unpause' | undefined,
  itemID?: string,
) => {
  const client = useClient.getState()
  const player = usePlayer.getState()
  const queue = useQueue.getState()
  const { progress } = useProgress.getState()

  const payload: ProgressQuery = {
    CanSeek: true,
    ItemId: itemID ?? queue.trackID,
    MediaSourceId: itemID ?? queue.trackID,
    EventName: event,
    IsPaused: !player.isPlaying,
    IsMuted: false,
    VolumeLevel: 100,
    PositionTicks: Math.round(secsToTicks(progress)),
    PlayMethod: 'Transcode',
    RepeatMode:
      queue.repeat === 'off'
        ? 'RepeatNone'
        : queue.repeat === 'queue'
          ? 'RepeatAll'
          : 'RepeatOne',
  }
  if (event === undefined) {
    await sessions.playing(client.api, payload)
  } else {
    await sessions.playingProgress(client.api, payload)
  }
}

export const stopped = async (
  itemID?: string,
  position?: number,
  failed: boolean = false,
) => {
  const queue = useQueue.getState()
  const payload: ProgressStoppedQuery = {
    ItemId: itemID ?? queue.trackID,
    MediaSourceId: itemID ?? queue.trackID,
    PositionTicks: secsToTicks(position),
    Failed: failed,
  }
  await sessions.playingStopped(useClient.getState().api, payload)
}

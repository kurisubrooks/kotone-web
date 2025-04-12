import { DOMAttributes, useEffect, useRef, useState } from 'react'
import useClient from '../hooks/useClient'
import useQueue from '../hooks/useQueue'
import emitter, { Event } from '../lib/emitter'
import usePlayer from '../hooks/usePlayer'

const AudioPlayer = () => {
  const client = useClient()
  const queue = useQueue()
  const player = usePlayer()
  const audioRef = useRef<HTMLAudioElement>(null)
  const [autoplay, setAutoplay] = useState<boolean>(false)
  const [metadata, setMetadata] = useState<MediaMetadata>()

  if (metadata && 'mediaSession' in navigator) {
    navigator.mediaSession.metadata = metadata
  }

  const track = queue.queue.length > 0 ? queue.queue[queue.track] : undefined
  const image = track
    ? 'Primary' in track.ImageTags
      ? client.server + '/Items/' + track.Id + '/Images/Primary?maxHeight=512'
      : 'AlbumPrimaryImageTag' in track && track.AlbumPrimaryImageTag
        ? client.server + '/Items/' + track.AlbumId + '/Images/Primary?512'
        : null
    : null
  useEffect(() => {
    if (track && image) {
      setMetadata(
        new MediaMetadata({
          title: track.Name,
          artist: track.Artists.join(', '),
          album: track.Album,
          artwork: [{ src: image! }],
        }),
      )
    }
  }, [track, image])

  const audioSource =
    queue.queue.length > 0
      ? client.server +
        '/Audio/' +
        queue.trackID +
        '/universal?userId=' +
        client.user +
        '&deviceId=' +
        client.deviceID +
        '&maxStreamingBitrate=140000000' +
        '&container=opus,webm|opus,ts|mp3,mp3,aac,m4a|aac,m4b|aac,flac,webma,webm|webma,wav,ogg' +
        '&transcodingContainer=ts' +
        '&transcodingProtocol=hls' +
        '&audioCodec=aac' +
        '&apiKey=' +
        client.token
      : undefined

  useEffect(() => {
    emitter.on('play', event)
    emitter.on('pause', event)
    emitter.onp('seek', seek)
    return () => {
      emitter.off('play', event)
      emitter.off('pause', event)
      emitter.off('seek', seek)
    }
  }, [])

  const event = (event: Event) => {
    console.log('EVENT', event)
    if (event === 'play') audioRef.current?.play()
    if (event === 'pause') audioRef.current?.pause()
  }

  const seek = (payload: number) => {
    audioRef.current?.fastSeek(payload)
  }

  const audioEvents: DOMAttributes<HTMLAudioElement> = {
    onPlay: () => {
      player.setIsPlaying(true)
      player.setIsBuffering(false)
    },
    onPause: () => {
      player.setIsPlaying(false)
    },
    onEnded: () => {
      queue.nextTrack()
    },
    onWaiting: () => {
      console.log('WAITING')
      player.setIsBuffering(true)
    },
    onTimeUpdate: (e) => {
      player.setProgress(e.currentTarget.currentTime)
    },
    onLoadedMetadata: (e) => {
      player.setDuration(e.currentTarget.duration)
    },
  }

  useEffect(() => {
    if (queue.hasHydrated) {
      setTimeout(() => {
        setAutoplay(true)
      }, 100)
    }
  }, [queue.hasHydrated])

  return (
    <audio
      ref={audioRef}
      src={audioSource}
      preload="auto"
      autoPlay={autoplay}
      loop={queue.repeat === 'track'}
      {...audioEvents}
    />
  )
}

export default AudioPlayer

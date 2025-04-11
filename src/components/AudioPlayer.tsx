import { DOMAttributes, useEffect, useRef } from 'react'
import useClient from '../hooks/useClient'
import useQueue from '../hooks/useQueue'
import emitter, { Event } from '../lib/events'
import usePlayer from '../hooks/usePlayer'

const AudioPlayer = () => {
  const client = useClient()
  const queue = useQueue()
  const player = usePlayer()
  const audioRef = useRef<HTMLAudioElement>(null)

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
    return () => {
      emitter.off('play', event)
      emitter.off('pause', event)
    }
  }, [])

  const event = (event: Event) => {
    console.log('EVENT', event)
    if (event === 'play') audioRef.current?.play()
    if (event === 'pause') audioRef.current?.pause()
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
  }

  return (
    <audio
      ref={audioRef}
      src={audioSource}
      autoPlay={player.autoplay}
      loop={queue.repeat === 'track'}
      {...audioEvents}
    />
  )
}

export default AudioPlayer

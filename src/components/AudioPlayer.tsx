import { useAudioPlayerContext } from 'react-use-audio-player'

const AudioPlayer = () => {
  const { player } = useAudioPlayerContext()

  // player.on('end', () => {
  //   console.log('PLAYBACK END')
  // })

  return <div />
}

export default AudioPlayer

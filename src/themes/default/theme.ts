export default {
  id: 'default',
  name: 'Default',
  description: 'Default theme for Kotone',
  theme: {
    text: {
      font: "'Nunito', 'M PLUS Rounded 1c'",
      fontSize: '16px',
      fontWeight: 'normal',
      lineHeight: '1.5',
    },
    colours: {
      background: 'unset', // use 'unset' if you want to use gradient
      'background-gradient-direction': '160deg',
      'background-gradient-from': 'var(--color-purple-400)',
      'background-gradient-to': 'var(--color-pink-400)',
      foreground: '#FFF',
      surface: 'var(--color-white)',
      'surface-foreground': 'var(--color-black)',
      card: 'var(--color-white)',
      'card-foreground': 'var(--color-black)',

      primary: 'var(--color-rose-800)',
      'primary-foreground': 'var(--color-rose-950)',
      secondary: '#0F0',
      'secondary-foreground': 'rgba(255, 255, 255, 0.35)',
      muted: '#5D3A5B',
      'muted-foreground': 'rgba(0, 0, 0, 0.5)',
      accent: 'var(--color-pink-800)',
      'accent-foreground': 'var(--color-white)',

      overlay: 'rgba(42, 13, 46, 0.8)',
      border: 'var(--color-pink-800)',
      input: 'var(--color-pink-800)',
      selection: 'var(--color-rose-500)',
      'selection-foreground': '#FFF',
    },
    icons: 'material-round', // material-solid,material-round,material-outline
    borderRadius: '10px',
  },
  elements: {
    nowPlayingBar: {
      floating: false,
      position: 'bottom', // top,bottom,side
      backgroundStyle: 'solid', // solid,gradient,imageBlur
      style: {
        icon: '#ffcc00',
        background: '#000000',
        progressBar: '#ff9900',
        progressBarTrack: '#333333',
      },
      playerControls: {
        position: 'center', // left,center,right
        buttons: {
          play: true,
          pause: true,
          stop: false,
          next: true,
          previous: true,
          fastForward: false,
          rewind: false,
          repeat: false,
          shuffle: false,
        },
        buttonPosition: ['shuffle', 'previous', 'playPause', 'next', 'repeat'],
      },
      showTrackInfo: true,
      showProgressBar: true,
      showVolumeControls: true,
      showPlaybackControls: true,
      showPlaylistButton: true,
      showLyricsButton: true,
      showQueueButton: true,
    },
  },
}

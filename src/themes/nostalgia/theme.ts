export default {
  id: 'nostalgia',
  name: 'Nostalgia',
  description: 'An alternate theme for Kotone by Kurisu :3',
  theme: {
    text: {
      font: 'Inter',
      fontSize: '16px',
    },
    colours: {
      background: '#2d1810', // use 'unset' if you want to use gradient
      'background-gradient-direction': '160deg',
      'background-gradient-from': '#2d1810',
      'background-gradient-to': '#2d1810',
      foreground: '#f4e4d0',
      surface: '#3d251a',
      'surface-foreground': '#f4e4d0',
      card: '#4a2f20',
      'card-foreground': '#f4e4d0',

      primary: '#d4935a',
      'primary-foreground': '#d4935a',
      secondary: '#a67c52',
      'secondary-foreground': '#f4e4d0',
      muted: '#6b4a36',
      'muted-foreground': '#b8966f',
      accent: '#c8854d',
      'accent-foreground': '#f4e4d0',

      overlay: 'rgba(45, 24, 16, 0.9)',
      border: '#6b4a36',
      input: '#6b4a36',
      selection: '#d4935a',
      'selection-foreground': '#2d1810',
    },
    icons: 'material-round', // material-solid,material-round,material-outline
    borderRadius: '0px',
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

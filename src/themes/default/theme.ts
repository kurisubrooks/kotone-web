export default {
  id: 'default',
  name: 'Default',
  description: 'Default theme for Kotone',
  theme: {
    text: {
      font: "'Inter', 'Noto Sans JP', sans-serif",
      fontSize: '16px',
      fontWeight: 'normal',
      lineHeight: '1.5',
    },
    colours: {
      'background-image': 'linear-gradient(160deg, #c084fc, #f472b6)', // Gradient from purple-400 to pink-400
      background: '#2A0D2E',
      foreground: '#F8E7F9',
      surface: '#4B164D',
      'surface-foreground': '#EAD8EB',
      card: '#6D214F',
      'card-foreground': '#F8E7F9',

      primary: '#C71585',
      'primary-foreground': '#FFFFFF',
      secondary: '#8A2BE2',
      'secondary-foreground': '#FFFFFF',
      muted: '#5D3A5B',
      'muted-foreground': '#BCA0BA',
      accent: '#DA70D6',
      'accent-foreground': '#2A0D2E',

      overlay: 'rgba(42, 13, 46, 0.8)',
      border: '#8A2BE2',
      input: '#4B164D',
      selection: '#C71585',
      'selection-foreground': '#FFFFFF',
    },
    icons: 'material-round', // material-solid,material-round,material-outline
    borderRadius: '8px',
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

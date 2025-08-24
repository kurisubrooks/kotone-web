// JSON Schema
export interface ThemeConfig {
  id: string
  name: string
  description?: string
  theme?: {
    text?: TextConfig
    colours?: ColourConfig
    icons?: 'material-solid' | 'material-round' | 'material-outline'
    borderRadius?: string
  }
  elements?: {
    nowPlayingBar?: NowPlayingBarConfig
  }
}

// Definitions
export interface TextConfig {
  font?: string
  fontSize?: string
  fontWeight?: string
  lineHeight?: string
}

export interface ColourConfig {
  background?: string
  surface?: string
  card?: string
  overlay?: string
  primary?: string
  secondary?: string
  textPrimary?: string
  textSecondary?: string
  textMuted?: string
}

export interface NowPlayingBarConfig {
  floating?: boolean
  position?: 'top' | 'bottom' | 'side'
  backgroundStyle?: 'solid' | 'gradient' | 'imageBlur'
  style?: {
    icon?: string
    background?: string
    progressBar?: string
    progressBarTrack?: string
  }
  playerControls?: PlayerControlsConfig
  showTrackInfo?: boolean
  showProgressBar?: boolean
  showVolumeControls?: boolean
  showPlaybackControls?: boolean
  showPlaylistButton?: boolean
  showLyricsButton?: boolean
  showQueueButton?: boolean
}

export interface PlayerControlsConfig {
  position?: 'left' | 'center' | 'right'
  buttons?: {
    play?: boolean
    pause?: boolean
    stop?: boolean
    next?: boolean
    previous?: boolean
    fastForward?: boolean
    rewind?: boolean
    repeat?: boolean
    shuffle?: boolean
  }
  buttonPosition?: Array<
    | 'shuffle'
    | 'previous'
    | 'playPause'
    | 'next'
    | 'repeat'
    | 'fastForward'
    | 'rewind'
  >
}

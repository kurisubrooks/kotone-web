import type { ThemeConfig } from '../types/ThemeTypes'

// Apply theme variables to CSS custom properties
export const applyThemeVariables = (theme: ThemeConfig): void => {
  const root = document.documentElement

  // Colour variables
  if (theme.theme?.colours) {
    Object.entries(theme.theme.colours).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value)
    })
  }

  // Font/text variables
  if (theme.theme?.text) {
    const { font, fontSize, fontWeight, lineHeight } = theme.theme.text
    if (font) root.style.setProperty('--font-sans', font)
    if (fontSize) root.style.setProperty('--font-size', fontSize)
    if (fontWeight) root.style.setProperty('--font-weight', fontWeight)
    if (lineHeight) root.style.setProperty('--line-height', lineHeight)
  }

  // Border radius
  if (theme.theme?.borderRadius) {
    root.style.setProperty('--radius', theme.theme.borderRadius)
  }

  // Icon styles
  if (theme.theme?.icons) {
    root.style.setProperty('--icons', theme.theme.icons)
  }

  // Now playing bar styles
  if (theme.elements?.nowPlayingBar) {
    const { style, floating, position, backgroundStyle } =
      theme.elements.nowPlayingBar

    if (style) {
      Object.entries(style).forEach(([key, value]) => {
        root.style.setProperty(`--player-${key}`, value)
      })
    }

    if (floating !== undefined) {
      root.style.setProperty('--player-floating', floating.toString())
    }

    if (position) {
      root.style.setProperty('--player-position', position)
    }

    if (backgroundStyle) {
      root.style.setProperty('--player-background-style', backgroundStyle)
    }
  }
}

// Remove theme variables (on cleanup)
export const removeThemeVariables = (): void => {
  const root = document.documentElement
  const computedStyles = getComputedStyle(root)

  // TODO: make this not a pre-defined array or at least
  // put this somewhere more visible
  const themeProperties = [
    '--background',
    '--foreground',
    '--surface',
    '--surface-foreground',
    '--card',
    '--card-foreground',
    '--primary',
    '--primary-foreground',
    '--secondary',
    '--secondary-foreground',
    '--muted',
    '--muted-foreground',
    '--accent',
    '--accent-foreground',
    '--overlay',
    '--border',
    '--input',
    '--selection',
    '--selection-foreground',
    '--font-family',
    '--font-size',
    '--font-weight',
    '--line-height',
    '--icons',
    '--radius',
  ]

  // Remove theme properties
  themeProperties.forEach((property) => {
    root.style.removeProperty(property)
  })

  // Remove player properties
  Array.from(computedStyles).forEach((property) => {
    if (property.startsWith('--player-')) {
      root.style.removeProperty(property)
    }
  })
}

// Get variable value by theme key
export const getThemeVariable = (key: string): string => {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(`--${key}`)
    .trim()
}

// Set individual theme variable
export const setThemeVariable = (key: string, value: string): void => {
  document.documentElement.style.setProperty(`--${key}`, value)
}

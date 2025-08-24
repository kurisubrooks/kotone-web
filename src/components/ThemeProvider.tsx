import React, { useEffect, useMemo, type ReactNode } from 'react'
import useTheme from '../hooks/useTheme'
import { applyThemeVariables, removeThemeVariables } from '../lib/themeUtils'

interface ThemeProviderProps {
  children: ReactNode
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const theme = useTheme()

  const themeConfig = useMemo(() => {
    if (!theme.isReady || !theme.theme) return null

    return {
      id: theme.id,
      name: theme.name,
      description: theme.description,
      theme: theme.theme,
      elements: theme.elements,
    }
  }, [
    theme.isReady,
    theme.id,
    theme.name,
    theme.description,
    theme.theme,
    theme.elements,
  ])

  // Apply variables when theme changes
  useEffect(() => {
    if (themeConfig) {
      removeThemeVariables()
      applyThemeVariables(themeConfig) // doesnt seem to need to be awaited so idk

      // Apply Theme ID as a class to the root element for CSS targeting
      // idk if there is a better or more necessary way to do this in react
      document.documentElement.classList.remove(
        ...Array.from(document.documentElement.classList).filter((cls) =>
          cls.startsWith('theme-'),
        ),
      )
      document.documentElement.classList.add(`theme-${themeConfig.id}`)

      console.info(`Applied theme: ${themeConfig.name} (${themeConfig.id})`)
    }
  }, [themeConfig])

  // Show a loading state while the theme is loading
  if (!theme.hasHydrated) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black">
        <div className="text-white">Loading theme...</div>
      </div>
    )
  }

  // Show an error state if the theme failed to load
  if (theme.isError) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-red-900">
        <div className="text-center text-white">
          <h2 className="mb-2 text-xl font-bold">Theme Loading Error</h2>
          <p>Failed to load theme: {theme.currentThemeId}</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="theme-root min-h-screen transition-all duration-300"
      data-theme={theme.id}
    >
      {children}
    </div>
  )
}

export default ThemeProvider

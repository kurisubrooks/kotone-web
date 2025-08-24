import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { useQuery, useQueries } from '@tanstack/react-query'
import { useMemo, useCallback, useEffect } from 'react'
import type { ThemeConfig } from '../types/ThemeTypes'
import type { ComponentType } from 'react'

const themeModules = import.meta.glob('../themes/*/theme.ts')
const layoutModules = import.meta.glob('../themes/*/Layout.tsx')

const DEFAULT_THEME_ID = 'default'

// Dynamically generate themes
const AVAILABLE_THEMES = Object.keys(themeModules).map((path) => {
  // Extracts 'default' from '../themes/default/theme.ts'
  return path.split('/')[2]
})
export type AvailableTheme = (typeof AVAILABLE_THEMES)[number]

interface ThemeStore {
  currentThemeId: string
  themes: Record<string, ThemeConfig>
  customLayouts: Record<string, ComponentType | null>
  initialized: boolean

  setTheme: (themeId: string) => void
  addTheme: (theme: ThemeConfig) => void
  setCustomLayout: (themeId: string, layout: ComponentType | null) => void
  initialize: () => void

  hasHydrated: boolean
  setHasHydrated: (state: boolean) => void
}

const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      currentThemeId: DEFAULT_THEME_ID,
      themes: {},
      customLayouts: {},
      initialized: false,

      setTheme: (themeId) => {
        set({ currentThemeId: themeId })
      },

      addTheme: (theme) => {
        set((state) => ({
          themes: { ...state.themes, [theme.id]: theme },
        }))
      },

      setCustomLayout: (themeId, layout) => {
        set((state) => ({
          customLayouts: { ...state.customLayouts, [themeId]: layout },
        }))
      },

      initialize: () => {
        set({ initialized: true })
      },

      hasHydrated: false,
      setHasHydrated: (state) => set({ hasHydrated: state }),
    }),
    {
      name: 'theme',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
      partialize: (state) => ({ currentThemeId: state.currentThemeId }),
    },
  ),
)

// Load theme into memory
const fetchTheme = async (themeId: string): Promise<ThemeConfig> => {
  try {
    const themePath = `../themes/${themeId}/theme.ts`
    if (!themeModules[themePath]) {
      throw new Error(`Theme file not found for ${themeId}`)
    }

    // Dynamically import the theme module
    const themeModule = (await themeModules[themePath]()) as {
      default: ThemeConfig
    }
    const themeData: ThemeConfig = themeModule.default

    if (!themeData.id || !themeData.name) {
      throw new Error('Invalid theme structure')
    }

    return themeData
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to load theme ${themeId}: ${error.message}`)
    }
    throw new Error(`Failed to load theme ${themeId}: Unknown error`)
  }
}

// Dynamically import custom layouts
const composeLayoutFromTheme = async (
  themeId: string,
): Promise<ComponentType | null> => {
  try {
    const layoutPath = `../themes/${themeId}/Layout.tsx`
    if (!layoutModules[layoutPath]) {
      console.info('No custom layout found for theme', themeId)
      return null
    }
    const layoutModule = (await layoutModules[layoutPath]()) as {
      default: ComponentType
    }
    return layoutModule.default
  } catch {
    // Layout is optional, return null if not found
    console.info('No custom layout found for theme:', themeId)
    return null
  }
}

export const useLoadTheme = (themeId: string, enabled: boolean = true) => {
  const addTheme = useThemeStore((state) => state.addTheme)

  const query = useQuery({
    queryKey: ['theme', themeId],
    queryFn: () => fetchTheme(themeId),
    enabled: enabled,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days
  })

  useEffect(() => {
    if (query.isSuccess && query.data) {
      addTheme(query.data)
    }
  }, [query.isSuccess, query.data, addTheme])

  if (query.error) console.error(`Error loading theme ${themeId}:`, query.error)

  return query
}

// Load multiple themes
export const useLoadThemes = (themeIds: string[], enabled: boolean = true) => {
  const queries = useQueries({
    queries: themeIds.map((themeId) => ({
      queryKey: ['theme', themeId],
      queryFn: () => fetchTheme(themeId),
      enabled: enabled,
      staleTime: 1000 * 60 * 60 * 24, // 24 hours
      gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days
    })),
  })

  const isLoading = queries.some((q) => q.isLoading)
  const themes = queries
    .filter((q) => q.isSuccess && q.data)
    .map((q) => q.data as ThemeConfig)

  return {
    isLoading,
    themes,
  }
}

const useTheme = () => {
  const {
    currentThemeId,
    themes,
    customLayouts,
    initialized,
    hasHydrated,
    setTheme,
    addTheme,
    setCustomLayout,
    initialize,
  } = useThemeStore()

  // Load the default theme
  const defaultThemeQuery = useLoadTheme(
    DEFAULT_THEME_ID,
    hasHydrated && !themes[DEFAULT_THEME_ID],
  )

  // Load current theme (if it's different from default and not loaded)
  const currentThemeQuery = useLoadTheme(
    currentThemeId,
    hasHydrated &&
      currentThemeId !== DEFAULT_THEME_ID &&
      !themes[currentThemeId],
  )

  const currentTheme = themes[currentThemeId]
  const currentLayout = customLayouts[currentThemeId]
  const isLoading = defaultThemeQuery.isLoading || currentThemeQuery.isLoading
  const isError = defaultThemeQuery.isError || currentThemeQuery.isError

  // Initialize when default theme is loaded
  if (!initialized && defaultThemeQuery.isSuccess && hasHydrated) {
    initialize()
  }

  const isReady = hasHydrated && initialized && !isLoading && !!currentTheme

  // Load custom layout
  useEffect(() => {
    if (isReady && customLayouts[currentThemeId] === undefined) {
      composeLayoutFromTheme(currentThemeId).then((layout) => {
        setCustomLayout(currentThemeId, layout)
      })
    }
  }, [isReady, currentThemeId, customLayouts, setCustomLayout])

  // Load theme
  const loadTheme = useCallback(
    async (themeId: string): Promise<boolean> => {
      try {
        const themeData = await fetchTheme(themeId)
        addTheme(themeData)

        // Try to load custom layout
        const customLayout = await composeLayoutFromTheme(themeId)
        setCustomLayout(themeId, customLayout)

        return true
      } catch (error) {
        console.error(`Error loading theme ${themeId}:`, error)
        return false
      }
    },
    [addTheme, setCustomLayout],
  )

  // Load multiple
  const loadThemes = useCallback(
    async (themeIds: string[]): Promise<void> => {
      const loadPromises = themeIds.map((id) => loadTheme(id))
      await Promise.allSettled(loadPromises)
    },
    [loadTheme],
  )
  const allThemes = useMemo(() => Object.values(themes), [themes])

  return useMemo(
    () => ({
      // ThemeConfig
      id: currentTheme?.id || DEFAULT_THEME_ID,
      name: currentTheme?.name || 'Default Theme',
      description: currentTheme?.description,
      theme: currentTheme?.theme,
      elements: currentTheme?.elements,
      customLayout: currentLayout,

      // States
      isLoading,
      isError,
      initialized,
      hasHydrated,
      isReady,
      isCurrentThemeLoaded: !!currentTheme,

      // Actions
      setTheme,
      addTheme,
      setCustomLayout,
      loadTheme,
      loadThemes,
      composeLayoutFromTheme,
      allThemes,
      availableThemes: AVAILABLE_THEMES,
      currentThemeId,
    }),
    [
      currentTheme,
      currentLayout,
      isLoading,
      isError,
      initialized,
      hasHydrated,
      isReady,
      setTheme,
      addTheme,
      setCustomLayout,
      loadTheme,
      loadThemes,
      allThemes,
      currentThemeId,
    ],
  )
}

export default useTheme

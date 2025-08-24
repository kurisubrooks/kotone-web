import React from 'react'
import useTheme from '../hooks/useTheme'
import { cn } from '../lib/cn'

interface ThemeSelectorProps {
  className?: string
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ className }) => {
  const theme = useTheme()

  const handleThemeChange = (themeId: string) => {
    theme.setTheme(themeId)
  }

  if (!theme.isReady) {
    return (
      <div className={cn('text-muted-foreground', className)}>
        Loading themes...
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="text-secondary-foreground text-sm font-medium">
        Select Theme
      </div>

      <div className="grid grid-cols-1 gap-2">
        {theme.availableThemes.map((themeId) => {
          const isSelected = theme.currentThemeId === themeId
          const themeData = theme.allThemes.find((t) => t.id === themeId)

          return (
            <button
              key={themeId}
              onClick={() => handleThemeChange(themeId)}
              className={cn(
                'flex items-center justify-between rounded p-3',
                'border-2 transition-all duration-200',
                'hover:bg-surface',
                isSelected
                  ? 'border-primary bg-card'
                  : 'bg-surface border-transparent',
              )}
            >
              <div className="flex flex-col items-start">
                <div
                  className={cn(
                    'font-medium',
                    isSelected
                      ? 'text-primary-foreground'
                      : 'text-secondary-foreground',
                  )}
                >
                  {themeData?.name || themeId}
                </div>
                {themeData?.description && (
                  <div className="text-muted-foreground text-sm">
                    {themeData.description}
                  </div>
                )}
              </div>

              {isSelected && (
                <div className="bg-primary flex h-4 w-4 items-center justify-center rounded-full">
                  <div className="h-2 w-2 rounded-full bg-white" />
                </div>
              )}
            </button>
          )
        })}
      </div>

      <div className="bg-surface mt-4 rounded p-3">
        <div className="text-muted-foreground text-xs">
          Current: {theme.name}
        </div>
        {theme.customLayout && (
          <div className="text-primary-foreground mt-1 text-xs">
            Custom Layout Active
          </div>
        )}
      </div>
    </div>
  )
}

export default ThemeSelector

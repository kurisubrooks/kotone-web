import { Outlet } from 'react-router'
import useSettings from '../hooks/useSettings'
import { cn } from '../lib/cn'

const Layout = () => {
  const settings = useSettings()

  return (
    <div
      className={cn(
        'bg-primary text-primary flex h-screen',
        settings.dark && 'dark',
      )}
    >
      <Outlet />
    </div>
  )
}

export default Layout

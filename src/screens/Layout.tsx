import { Outlet, useNavigate, useParams } from 'react-router'
import useSettings from '../hooks/useSettings'
import { cn } from '../lib/cn'
import { useEffect } from 'react'
import useClient from '../hooks/useClient'

const Layout = () => {
  const settings = useSettings()
  const client = useClient()
  const navigate = useNavigate()
  const { server: serverParam } = useParams()

  useEffect(() => {
    if (client.hasHydrated) {
      if (client.client) {
        navigate('/home')
      } else if (
        !client.client &&
        client.server &&
        client.user &&
        client.token
      ) {
        // resetClient()
      } else {
        if (import.meta.env.SERVER) {
          navigate('/signin')
        } else if (!serverParam) {
          navigate('/server')
        }
      }
    }
  }, [client.hasHydrated, client.client])

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

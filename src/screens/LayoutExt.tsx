import { useEffect } from 'react'
import { Outlet, useNavigate, useParams } from 'react-router'
import useSettings from '../hooks/useSettings'
import { cn } from '../lib/cn'
import { UAParser } from 'ua-parser-js'
import useClient from '../hooks/useClient'

const LayoutExt = () => {
  const settings = useSettings()
  const client = useClient()
  const navigate = useNavigate()
  const { server: serverParam } = useParams()
  const { browser } = UAParser(window.navigator.userAgent)

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
        resetClient()
      } else {
        if (import.meta.env.VITE_SERVER) {
          navigate('/signin')
        } else if (!serverParam) {
          navigate('/server')
        }
      }
    }
  }, [client.hasHydrated, client.client])

  const resetClient = async () => {
    const clientName = 'Kotone Web'
    const deviceName = browser.name ?? 'Unknown'
    const deviceID = 'kotone-web_'
    const clientVer = '1.0.0'
    client.setClient({
      server: client.server!,
      clientName: clientName,
      deviceName: deviceName,
      deviceID: deviceID,
      version: clientVer,
      user: client.user!,
      token: client.token!,
    })
    console.log('CLIENT RESET')
  }

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

export default LayoutExt

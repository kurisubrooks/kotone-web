import useClient from '../hooks/useClient'
import useSettings from '../hooks/useSettings'
import Icon from './Icon'

const NavBar = () => {
  const client = useClient()
  const settings = useSettings()

  return (
    <div className="flex justify-between gap-4 px-6 py-2">
      <div />

      <div className="flex items-center">
        <input
          type="text"
          placeholder="Search..."
          className="bg-w text-b w-md rounded-l-2xl px-4 py-1.5"
        />
        <div className="bg-w text-b flex h-full items-center rounded-r-2xl px-2">
          <Icon icon="search" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div
          onClick={() => {
            client.signout()
          }}
        >
          <Icon icon="logout" />
        </div>
        <div
          onClick={() => {
            settings.setDark(!settings.dark)
          }}
        >
          <Icon icon={settings.dark ? 'light_mode' : 'dark_mode'} />
        </div>
        <div>
          <Icon icon="settings" />
        </div>
      </div>
    </div>
  )
}

export default NavBar

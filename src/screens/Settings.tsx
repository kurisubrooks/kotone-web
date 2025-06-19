import SettingsOption from '../components/SettingsOption'
import Switch from '../components/Switch'
import useSettings from '../hooks/useSettings'
import isDesktop from '../lib/isDesktop'

const Settings = () => {
  const settings = useSettings()

  return (
    <div className="player-padding px-4 pt-4">
      <div className="text-4xl font-bold">Settings</div>

      <div className="flex flex-col gap-2 py-2">
        <SettingsOption
          title="Audio Normalization"
          description="Normalizes volume of each track"
          icon="headphones"
          right={<Switch state={settings.gain} />}
          onClick={() => settings.setGain(!settings.gain)}
        />

        {isDesktop() && (
          <>
            <SettingsOption
              title="Discord Rich Presence"
              description="Send current track info to Discord"
              icon="artist"
              filled
              right={<Switch state={settings.RPC} />}
              onClick={() => settings.setRPC(!settings.RPC)}
            />
            <SettingsOption
              title="RPC Image Proxy"
              description="Use a different server URL for the album art"
              icon="filter"
              right={<Switch state={settings.RPCProxy} />}
              onClick={() => settings.setRPCProxy(!settings.RPCProxy)}
            />
            <SettingsOption
              title="RPC Image Proxy URL"
              description="The proxy server URL"
              icon="filter"
              right={
                <input
                  type="text"
                  onChange={(e) => settings.setRPCProxyURL(e.target.value)}
                  defaultValue={settings.RPCProxyURL}
                  placeholder="https://"
                  className="bg-w text-b flex-1 grow rounded-2xl px-4 py-1.5"
                />
              }
            />
          </>
        )}
      </div>
    </div>
  )
}

export default Settings

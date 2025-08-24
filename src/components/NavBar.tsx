import { useRef } from 'react'
import { useNavigate } from 'react-router'
import { useDebouncedCallback } from 'use-debounce'
import useClient from '../hooks/useClient'
import useSettings from '../hooks/useSettings'
import useSearch from '../hooks/useSearch'
import Icon from './Icon'

const NavBar = () => {
  const client = useClient()
  const settings = useSettings()
  const navigate = useNavigate()
  const search = useSearch()

  const searchRef = useRef<HTMLInputElement>(null)
  const setQuery = useDebouncedCallback((query: string) => {
    if (query) {
      search.setQuery(query)
      navigate('/search')
    }
  }, 200)

  return (
    <div className="flex justify-between gap-8 px-6 py-2">
      <div className="flex items-center gap-4">
        <Icon
          icon="arrow_back"
          onClick={() => {
            navigate(-1)
          }}
          className="hover:cursor-pointer"
        />
        <Icon
          icon="home"
          onClick={() => {
            navigate('/')
          }}
          filled
          className="hover:cursor-pointer"
        />
        <Icon
          icon="album"
          onClick={() => {
            navigate('/albums')
          }}
          className="hover:cursor-pointer"
        />
      </div>

      <div className="flex grow items-center">
        <input
          ref={searchRef}
          type="text"
          placeholder="Search..."
          className="grow rounded-l-2xl bg-white px-4 py-1.5 text-black"
          onChange={(e) => setQuery(e.target.value)}
        />
        <div
          className="flex h-full items-center bg-white px-2 text-black hover:cursor-pointer"
          onClick={() => {
            if (searchRef.current) searchRef.current.value = ''
            searchRef.current?.focus()
          }}
        >
          <Icon icon="close" />
        </div>
        <div
          className="flex h-full items-center rounded-r-2xl bg-white px-2 text-black hover:cursor-pointer"
          onClick={() => {
            const query = searchRef.current!.value
            if (query) {
              search.setQuery(query)
              navigate('/search')
            }
          }}
        >
          <Icon icon="search" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Icon
          icon="logout"
          onClick={() => {
            client.signout()
          }}
          className="hover:cursor-pointer"
        />
        <Icon
          icon={settings.dark ? 'light_mode' : 'dark_mode'}
          onClick={() => {
            settings.setDark(!settings.dark)
          }}
          filled
          className="hover:cursor-pointer"
        />
        <Icon icon="settings" onClick={() => navigate('/settings')} />
      </div>

      {(process.env.NODE_ENV === 'development' ||
        import.meta.env.VITE_SHOW_COMMIT) && (
        <div className="flex items-center font-mono text-sm">
          {__COMMMIT_HASH__}
        </div>
      )}
    </div>
  )
}

export default NavBar

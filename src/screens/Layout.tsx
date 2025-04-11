import { useEffect } from 'react'
import { Outlet } from 'react-router'
import NavBar from '../components/NavBar'
import FloatingPlayer from '../components/FloatingPlayer'
import useLibrary from '../hooks/useLibrary'
import useViews from '../api/useViews'
import AudioPlayer from '../components/AudioPlayer'

const Layout = () => {
  const library = useLibrary()

  const views = useViews()
  useEffect(() => {
    if (views.data) {
      library.setViews(views.data)
      let ids = {}
      for (let i = 0; i < views.data.length; i++) {
        ids[views.data[i].CollectionType] = views.data[i].Id
      }
      library.setViewIDs(ids)
    }
  }, [views.data])

  return (
    <>
      <div className="flex w-full flex-col">
        <NavBar />

        <Outlet />

        <FloatingPlayer />
      </div>
      <AudioPlayer />
    </>
  )
}

export default Layout

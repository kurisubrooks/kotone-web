import { Outlet } from 'react-router'
import NavBar from '../components/NavBar'
import FloatingPlayer from '../components/FloatingPlayer'

const Layout = () => {
  return (
    <div className="flex w-full flex-col">
      <NavBar />

      <Outlet />

      <FloatingPlayer />
    </div>
  )
}

export default Layout

import { Outlet } from 'react-router'

const Layout = () => {
  return (
    <div className="flex h-screen">
      <Outlet />
    </div>
  )
}

export default Layout

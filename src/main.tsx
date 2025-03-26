import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'

import './index.css'
import LayoutExt from './screens/LayoutExt'
import Splash from './screens/Splash'
import Server from './screens/Server'
import Signin from './screens/Signin'
// import Signout from './screens/Signout'
import Layout from './screens/Layout'
import Home from './screens/Home'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route element={<LayoutExt />}>
        <Route index element={<Splash />} />
        <Route path="server" element={<Server />} />
        <Route path="signin/:server?" element={<Signin />} />
        {/* <Route path="signout" element={<Signout />} /> */}

        <Route element={<Layout />}>
          <Route path="home" element={<Home />} />
          {/* <Route path="albums" element={<AlbumList />} />
          <Route path="album/:album" element={<Album />} />
          <Route path="playlists" element={<AlbumList />} />
          <Route path="playlist/:album" element={<Album />} />
          <Route path="artists" element={<ArtistList />} />
          <Route path="artist/:artist" element={<Artist />} />
          <Route path="songs" element={<SongList />} /> */}
        </Route>
      </Route>
    </Routes>
  </BrowserRouter>,
)

import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'

import './index.css'
import Layout from './screens/Layout'
import Splash from './screens/Splash'
import Home from './screens/Home'
import Server from './screens/Server'
import Signin from './screens/Signin'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Splash />} />
        <Route path="home" element={<Home />} />
        <Route path="server" element={<Server />} />
        <Route path="signin/:server?" element={<Signin />} />
        {/* <Route path="signout" element={<Signout />} /> */}

        {/* <Route path="albums" element={<AlbumList />} />
        <Route path="album/:album" element={<Album />} />
        <Route path="playlists" element={<AlbumList />} />
        <Route path="playlist/:album" element={<Album />} />
        <Route path="artists" element={<ArtistList />} />
        <Route path="artist/:artist" element={<Artist />} />
        <Route path="songs" element={<SongList />} /> */}
      </Route>
    </Routes>
  </BrowserRouter>,
)

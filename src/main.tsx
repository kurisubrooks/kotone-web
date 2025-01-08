import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'

import './index.css'
import Layout from './screens/Layout'
import Home from './screens/Home'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      {/* <Route path="signin" element={<Signin />} />
      <Route path="signout" element={<Signout />} /> */}

      <Route element={<Layout />}>
        <Route index element={<Home />} />
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

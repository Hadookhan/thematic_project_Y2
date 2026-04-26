import { Routes, Route } from 'react-router-dom';
import ScrollToTop from "./components/ScrollToTop";
import Home from './pages/Home';
import Browse from './pages/Browse';
import Search from './pages/Search';
import Actors_Directors from './pages/Actors_Directors';
import Movie from './pages/Movie';
// import Navbar from './components/navbar'

function App() {

  return (
    <>
    {/* <Navbar /> */}
    <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/search" element={<Search />} />
          <Route path="/person/:personId" element={<Actors_Directors />} />
          {/* movie could also be quieried into the info endpoint (such like actors and directors are) */}
          <Route path="/movie/:movieId" element={<Movie />} />
        </Routes>
    {/* <Footer /> */}
    </>
  )
}

export default App;

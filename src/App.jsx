import { Routes, Route } from 'react-router-dom';
import ScrollToTop from "./components/ScrollToTop";
import Home from './pages/Home';
import Browse from './pages/Browse';
import Search from './pages/Search';
import Actors from './pages/Actors';
import Directors from './pages/Directors';

function App() {

  return (
    <>
    {/* <Navbar /> */}
    <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/search" element={<Search />} />
          <Route path="/actors" element={<Actors />} />
          <Route path="/directors" element={<Directors />} />
        </Routes>
    {/* <Footer /> */}
    </>
  )
}

export default App;

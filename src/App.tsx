import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import GlossaryPage from './pages/GlossaryPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/tentang" element={<AboutPage />} />
          <Route path="/glosarium" element={<GlossaryPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
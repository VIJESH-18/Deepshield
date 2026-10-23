import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Analyze from './pages/Analyze';
import Results from './pages/Results';
import History from './pages/History';
import Reports from './pages/Reports';
import Methodology from './pages/Methodology';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/analyze" element={<Analyze />} />
          <Route path="/results/:id" element={<Results />} />
          <Route path="/history" element={<History />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/methodology" element={<Methodology />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import LandingPage from './pages/LandingPage'
import BloodWorkAnalysis from './pages/BloodWorkAnalysis'
import HealthDashboard from './pages/HealthDashboard'
import HospitalFinder from './pages/HospitalFinder'
import HealthInsights from './pages/HealthInsights'
import { HealthProvider } from './store/healthStore'

function App() {
  return (
    <HealthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<LandingPage />} />
            <Route path="analysis" element={<BloodWorkAnalysis />} />
            <Route path="dashboard" element={<HealthDashboard />} />
            <Route path="hospitals" element={<HospitalFinder />} />
            <Route path="insights" element={<HealthInsights />} />
          </Route>
        </Routes>
      </Router>
    </HealthProvider>
  )
}

export default App

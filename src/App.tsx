import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import CenterLayout from './layouts/CenterLayout'
import IntroductionTab from './pages/tabs/IntroductionTab'
import ToursTab from './pages/tabs/ToursTab'
import PricingTab from './pages/tabs/PricingTab'
import ReviewsTab from './pages/tabs/ReviewsTab'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/:centerId" element={<CenterLayout />}>
        <Route index element={<Navigate to="introduction" replace />} />
        <Route path="introduction" element={<IntroductionTab />} />
        <Route path="tours" element={<ToursTab />} />
        <Route path="pricing" element={<PricingTab />} />
        <Route path="reviews" element={<ReviewsTab />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App

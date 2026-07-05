import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from '../pages/HomePage'
import BranchPage from '../pages/BranchPage'
import AuthPage from '../pages/AuthPage'
import ProfilePage from '../pages/ProfilePage'

const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/profile" element={<ProfilePage />} />

      {/* Philippines */}
      <Route path="/philippines/cebu" element={<BranchPage />} />
      <Route path="/philippines/bohol" element={<BranchPage />} />

      {/* Malaysia */}
      <Route path="/malaysia/kota-kinabalu" element={<BranchPage />} />

      {/* Indonesia */}
      <Route path="/indonesia/bali" element={<BranchPage />} />

      {/* Legacy/Fallback redirects */}
      <Route path="/cebu" element={<Navigate to="/philippines/cebu" replace />} />
      <Route path="/bohol" element={<Navigate to="/philippines/bohol" replace />} />
      <Route path="/kota-kinabalu" element={<Navigate to="/malaysia/kota-kinabalu" replace />} />
      <Route path="/bali" element={<Navigate to="/indonesia/bali" replace />} />

      {/* Catch-all redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRouter

import Navigation from './components/Navigation'
import Footer from './components/Footer'
import SocialFloatingButtons from './components/common/SocialFloatingButtons'
import VerticalLocationSelector from './components/common/VerticalLocationSelector'
import AppRouter from './components/AppRouter'

import ScrollToTop from './components/ScrollToTop'
import { AuthProvider } from './contexts/AuthContext'

function App() {
  return (
    <AuthProvider>
      <div className="relative min-h-screen overflow-hidden bg-[#022c43] text-slate-50 selection:bg-parks-gold selection:text-ocean-dark">
        <ScrollToTop />
        <Navigation />
        <VerticalLocationSelector />
        <main>
          <AppRouter />
        </main>
        <Footer />
        <SocialFloatingButtons />
      </div>
    </AuthProvider>
  )
}

export default App

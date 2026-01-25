import Navigation from './components/Navigation'
import Footer from './components/Footer'
import SocialFloatingButtons from './components/common/SocialFloatingButtons'
import AppRouter from './components/AppRouter'

import ScrollToTop from './components/ScrollToTop'

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 relative selection:bg-parks-gold selection:text-ocean-dark">
      <ScrollToTop />
      <Navigation />
      <main>
        <AppRouter />
      </main>
      <Footer />
      <SocialFloatingButtons />
    </div>
  )
}

export default App

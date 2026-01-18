import React, { useState } from 'react'
import Navigation from './components/Navigation'
import HeroSection from './components/HeroSection'
import VideoGallerySection from './components/VideoGallerySection'
import ReviewsSection from './components/ReviewsSection'
import WhyUsSection from './components/WhyUsSection'
import LocationsSection from './components/LocationsSection'
import TimelineSection from './components/TimelineSection'
import PriceComparisonSection from './components/PriceComparisonSection'
import EventsSection from './components/EventsSection'
import Footer from './components/Footer'
import SocialFloatingButtons from './components/common/SocialFloatingButtons'

function App() {
  const [activeTab, setActiveTab] = useState('home')
  const [isTransitioning, setIsTransitioning] = useState(false)

  const handleTabChange = (newTab: string) => {
    if (newTab !== activeTab) {
      setIsTransitioning(true)
      // Scroll to top smoothly
      window.scrollTo({ top: 0, behavior: 'smooth' })
      setTimeout(() => {
        setActiveTab(newTab)
        setIsTransitioning(false)
      }, 150)
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <>
            <HeroSection />
            <VideoGallerySection />
            <ReviewsSection />
          </>
        )
      case 'why-us':
        return <WhyUsSection />
      case 'locations':
        return <LocationsSection />
      case 'schedule':
        return <TimelineSection />
      case 'pricing':
        return <PriceComparisonSection />
      case 'events':
        return <EventsSection />
      default:
        return <HeroSection />
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 relative selection:bg-parks-gold selection:text-ocean-dark">
      <Navigation activeTab={activeTab} onTabChange={handleTabChange} />
      <div
        className={`transition-all duration-300 ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
          }`}
      >
        {renderContent()}
      </div>
      <Footer />
      <SocialFloatingButtons />
    </div>
  )
}

export default App

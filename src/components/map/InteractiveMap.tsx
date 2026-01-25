import React, { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { DIVING_LOCATIONS } from '../../data/diving-locations'
import { useNavigate } from 'react-router-dom'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { useLanguage } from '../../contexts/LanguageContext'

// Fix for default marker icon issues in React Leaflet
import 'leaflet/dist/leaflet.css'

// 상수 정의
const DESKTOP_BREAKPOINT = '(min-width: 768px)'

// Map Controller to handle flyTo animations and auto-popups
const MapController = ({
  selectedLocationId,
  markerRefs
}: {
  selectedLocationId: string | null
  markerRefs: React.MutableRefObject<Map<string, L.Marker>>
}) => {
  const map = useMap()

  useEffect(() => {
    if (selectedLocationId) {
      const location = DIVING_LOCATIONS.find(loc => loc.id === selectedLocationId)
      if (location) {
        // Offset latitude further north so the marker appears even lower on the screen
        // This gives more room for the popup below the navigation bar
        const offsetLat = location.coordinates.lat + 0.08

        // Fly to offset location
        map.flyTo([offsetLat, location.coordinates.lng], 10, {
          duration: 1.5
        })

        // Open popup automatically
        const marker = markerRefs.current.get(selectedLocationId)
        if (marker) {
          setTimeout(() => {
            marker.openPopup()
          }, 1000) // Delay to wait for the pan/zoom animation to progress
        }
      }
    }
  }, [selectedLocationId, map, markerRefs])

  return null
}

const InteractiveMap: React.FC = () => {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const isDesktop = useMediaQuery(DESKTOP_BREAKPOINT)
  const [selectedLocationId, setSelectedLocationId] = React.useState<string | null>(null)
  const markerRefs = useRef<Map<string, L.Marker>>(new Map())

  // Center map on South East Asia
  const centerPosition: [number, number] = [5.0, 120.0]
  const zoomLevel = isDesktop ? 5 : 4

  const handleLocationClick = (locationId: string) => {
    setSelectedLocationId(locationId)
  }

  const handleNavigate = (path: string) => {
    navigate(path)
  }

  // Create custom icon for markers
  const createCustomIcon = (icon: string, color: string) => {
    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div class="relative group cursor-pointer">
          <div class="absolute -inset-2 bg-gradient-to-r ${color} rounded-full opacity-75 group-hover:opacity-100 blur transition duration-200 animate-pulse"></div>
          <div class="relative w-10 h-10 bg-slate-900 border-2 border-white rounded-full flex items-center justify-center text-2xl shadow-xl transform transition duration-200 group-hover:scale-110">
            ${icon}
          </div>
          <div class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-slate-900"></div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 48], // Point adjusts to bottom center
      popupAnchor: [0, -50],
    })
  }

  return (
    <div className="relative w-full">
      {/* 지도 제목 섹션 */}
      <div className="text-center mb-8">
        <h3 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
          {t.locations.title}
        </h3>
        <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto">
          {t.locations.description1} {t.locations.description2}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Map Container */}
        <div className="lg:col-span-2 h-[300px] sm:h-[400px] lg:h-[450px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative z-0">
          <MapContainer
            center={centerPosition}
            zoom={zoomLevel}
            scrollWheelZoom={false}
            className="w-full h-full bg-slate-900"
            attributionControl={false}
          >
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              className="map-tiles-filter"
            />

            <MapController selectedLocationId={selectedLocationId} markerRefs={markerRefs} />

            {DIVING_LOCATIONS.map((location, index) => {
              const locT = t.locations.locations[index]
              return (
                <Marker
                  key={location.id}
                  position={[location.coordinates.lat, location.coordinates.lng]}
                  icon={createCustomIcon(location.icon, location.color)}
                  ref={(el) => {
                    if (el) markerRefs.current.set(location.id, el)
                  }}
                  eventHandlers={{
                    click: () => handleLocationClick(location.id)
                  }}
                >
                  <Popup className="custom-popup">
                    <div className="text-center p-1 md:p-2 min-w-[140px] md:min-w-[200px]">
                      <h3 className="font-display font-bold text-sm md:text-lg mb-0.5 md:mb-1">{locT.name} ({locT.nameKo})</h3>
                      <p className="text-[10px] md:text-sm text-gray-600 mb-2 md:mb-3">{locT.description}</p>
                      <button
                        onClick={() => handleNavigate(location.path)}
                        className="w-full px-3 py-1.5 md:px-4 md:py-2 bg-slate-900 text-white text-[10px] md:text-sm font-bold rounded-lg hover:bg-slate-800 transition-colors"
                      >
                        {t.nav.locationInfo}
                      </button>
                    </div>
                  </Popup>
                </Marker>
              )
            })}
          </MapContainer>

          <div className="absolute bottom-1 right-1 bg-black/50 px-2 py-1 rounded text-[10px] text-white/50 z-[1000] pointer-events-none">
            © OpenStreetMap contributors
          </div>
        </div>

        {/* Sidebar List */}
        <div className="hidden lg:flex flex-col gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
          {DIVING_LOCATIONS.map((location, index) => {
            const locT = t.locations.locations[index]
            return (
              <div
                key={location.id}
                onClick={() => handleLocationClick(location.id)}
                className={`
                  text-left p-5 rounded-xl border transition-all duration-300 group cursor-pointer relative
                  ${selectedLocationId === location.id
                    ? 'bg-white/10 border-parks-gold/50 shadow-lg scale-[1.02]'
                    : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'
                  }
                `}
              >
                <div className="flex items-center gap-4">
                  <div className={`
                      w-12 h-12 rounded-full flex items-center justify-center text-2xl bg-gradient-to-br ${location.color} shadow-lg group-hover:scale-110 transition-transform
                  `}>
                    {location.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-lg">{locT.name}</h4>
                    <p className="text-slate-400 text-sm">{locT.nameKo}</p>
                  </div>
                </div>
                <p className="mt-3 text-slate-300 text-sm leading-relaxed border-t border-white/5 pt-3 mb-3">
                  {locT.description}
                </p>

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleNavigate(location.path)
                  }}
                  className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-slate-300 transition-colors flex items-center justify-center gap-2 group-hover:border-white/20 z-10 relative"
                >
                  <span>{t.nav.locationInfo}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Mobile grid for locations (below map) */}
      <div className="lg:hidden grid grid-cols-2 gap-2 mt-4">
        {DIVING_LOCATIONS.map((location, index) => {
          const locT = t.locations.locations[index]
          return (
            <div
              key={location.id}
              onClick={() => handleLocationClick(location.id)}
              className={`
                text-left p-3 rounded-xl border transition-all duration-300 cursor-pointer
                ${selectedLocationId === location.id
                  ? 'bg-white/10 border-parks-gold/50'
                  : 'glass-card border-white/5'
                }
              `}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{location.icon}</span>
                <div className="min-w-0">
                  <h4 className="font-bold text-white text-sm truncate">{locT.name}</h4>
                  <p className="text-[10px] text-slate-400 truncate">{locT.description}</p>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleNavigate(location.path)
                }}
                className="w-full py-1.5 bg-parks-gold text-ocean-dark font-bold rounded-lg text-[10px] transition-all flex items-center justify-center gap-1"
              >
                <span>{t.nav.locationInfo}</span>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          )
        })}
      </div>

      <style>{`
        .map-tiles-filter {
          filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%);
        }
        .leaflet-popup-content-wrapper {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 1rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        }
        .leaflet-popup-tip {
          background: rgba(255, 255, 255, 0.95);
        }
      `}</style>
    </div>
  )
}

export default React.memo(InteractiveMap)

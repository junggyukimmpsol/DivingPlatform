import React, { useRef, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { DIVING_LOCATIONS } from '../../data/diving-locations'
import { useNavigate } from 'react-router-dom'
import { useMediaQuery } from '../../hooks/useMediaQuery'

// Fix for default marker icon issues in React Leaflet
import 'leaflet/dist/leaflet.css'

// 상수 정의
const DESKTOP_BREAKPOINT = '(min-width: 768px)'

// Map Controller to handle flyTo animations
const MapController = ({
  selectedLocationId
}: {
  selectedLocationId: string | null
}) => {
  const map = useMap()

  useEffect(() => {
    if (selectedLocationId) {
      const location = DIVING_LOCATIONS.find(loc => loc.id === selectedLocationId)
      if (location) {
        map.flyTo([location.coordinates.lat, location.coordinates.lng], 10, {
          duration: 1.5
        })
      }
    }
  }, [selectedLocationId, map])

  return null
}

const InteractiveMap: React.FC = () => {
  const navigate = useNavigate()
  const isDesktop = useMediaQuery(DESKTOP_BREAKPOINT)
  const [selectedLocationId, setSelectedLocationId] = React.useState<string | null>(null)

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
          지역 선택
        </h3>
        <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto">
          지도에서 원하는 위치를 선택하여 Parks의 다이빙 센터를 확인하세요.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Map Container */}
        <div className="lg:col-span-2 h-[500px] lg:h-[600px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative z-0">
          <MapContainer
            center={centerPosition}
            zoom={zoomLevel}
            scrollWheelZoom={false}
            className="w-full h-full bg-slate-900"
            attributionControl={false} // Custom placing attribution if needed
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              className="map-tiles-filter" // We will add CSS to invert/darken tiles
            />

            <MapController selectedLocationId={selectedLocationId} />

            {DIVING_LOCATIONS.map((location) => (
              <Marker
                key={location.id}
                position={[location.coordinates.lat, location.coordinates.lng]}
                icon={createCustomIcon(location.icon, location.color)}
                eventHandlers={{
                  click: () => handleLocationClick(location.id)
                }}
              >
                <Popup className="custom-popup">
                  <div className="text-center p-2 min-w-[200px]">
                    <h3 className="font-display font-bold text-lg mb-1">{location.nameKo} ({location.name})</h3>
                    <p className="text-sm text-gray-600 mb-3">{location.description}</p>
                    <button
                      onClick={() => handleNavigate(location.path)}
                      className="w-full px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800 transition-colors"
                    >
                      자세히 보기
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Custom Attribution for Dark Mode aesthetic */}
          <div className="absolute bottom-1 right-1 bg-black/50 px-2 py-1 rounded text-[10px] text-white/50 z-[1000] pointer-events-none">
            © OpenStreetMap contributors
          </div>
        </div>

        {/* Sidebar List */}
        <div className="hidden lg:flex flex-col gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
          {DIVING_LOCATIONS.map((location) => (
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
                  <h4 className="font-bold text-white text-lg">{location.nameKo}</h4>
                  <p className="text-slate-400 text-sm">{location.name}</p>
                </div>
              </div>
              <p className="mt-3 text-slate-300 text-sm leading-relaxed border-t border-white/5 pt-3 mb-3">
                {location.description}
              </p>

              {/* Detailed View Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleNavigate(location.path)
                }}
                className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-slate-300 transition-colors flex items-center justify-center gap-2 group-hover:border-white/20 z-10 relative"
              >
                <span>자세히 보기</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile grid for locations (below map) */}
      <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        {DIVING_LOCATIONS.map((location) => (
          <button
            key={location.id}
            onClick={() => handleLocationClick(location.id)}
            className={`
                text-left p-4 rounded-xl border transition-all duration-300
                ${selectedLocationId === location.id
                ? 'bg-white/10 border-parks-gold/50'
                : 'glass-card border-white/5'
              }
              `}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{location.icon}</span>
              <div>
                <h4 className="font-bold text-white">{location.nameKo}</h4>
                <p className="text-xs text-slate-400">{location.description}</p>
              </div>
            </div>
          </button>
        ))}
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

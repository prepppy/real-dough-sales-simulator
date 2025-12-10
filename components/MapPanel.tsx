import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, CircleMarker, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { useSimulation } from '../context/SimulationContext';
import { Store } from '../types';
import L from 'leaflet';

const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
const iconShadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: iconUrl,
    shadowUrl: iconShadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const dsdIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const nationalIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const getDistanceFromLatLonInMiles = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  var R = 3958.8; 
  var dLat = deg2rad(lat2-lat1);  
  var dLon = deg2rad(lon2-lon1); 
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat1)) * Math.sin(dLon/2) * Math.sin(dLon/2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; 
  return d;
}

function deg2rad(deg: number) { return deg * (Math.PI/180) }

// Component to handle auto-zooming logic
const MapController: React.FC<{ stores: Store[] }> = ({ stores }) => {
    const map = useMap();
    
    useEffect(() => {
        if (stores.length === 0) return;
        
        // Calculate bounds of filtered stores
        const bounds = L.latLngBounds(stores.map(s => [s.lat, s.lng]));
        
        map.flyToBounds(bounds, { 
            padding: [50, 50],
            maxZoom: 10,
            duration: 1.5 
        });
        
    }, [stores, map]);

    return null;
}

const TAMCalculator: React.FC<{ 
  center: [number, number] | null; 
  radius: number;
  stores: Store[];
  onCalculate: (amount: number, count: number) => void; 
}> = ({ center, radius, stores, onCalculate }) => {
    useEffect(() => {
        if (!center) return;
        let totalRev = 0;
        let count = 0;
        stores.forEach(store => {
            const dist = getDistanceFromLatLonInMiles(center[0], center[1], store.lat, store.lng);
            if (dist <= radius) {
                 totalRev += (store.baseVelocity * store.currentSkuCount * 4.50 * 52); 
                 count++;
            }
        });
        onCalculate(totalRev, count);
    }, [center, radius, stores]); 

    if (!center) return null;
    return <Circle center={center} radius={radius * 1609.34} pathOptions={{ color: 'red', fillColor: '#fca5a5', fillOpacity: 0.2 }} />
}

const MapEvents: React.FC<{ onMapClick: (e: L.LeafletMouseEvent) => void }> = ({ onMapClick }) => {
    const map = useMap();
    useEffect(() => {
        map.on('click', onMapClick);
        return () => { map.off('click', onMapClick); }
    }, [map, onMapClick]);
    return null;
}

export const MapPanel: React.FC = () => {
  const { filteredStores, state, formatCurrency, getRetailerChannel } = useSimulation();
  const [activeCenter, setActiveCenter] = useState<[number, number] | null>(null);
  const [radiusMode, setRadiusMode] = useState(false);
  const [tamValue, setTamValue] = useState(0);
  const [tamCount, setTamCount] = useState(0);
  
  const handleMapClick = (e: L.LeafletMouseEvent) => {
      if (radiusMode) {
          setActiveCenter([e.latlng.lat, e.latlng.lng]);
      }
  };

  return (
    <div className="relative w-full h-full min-h-[500px] rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-white">
      
      {/* Floating Controls */}
      <div className="absolute top-4 right-4 z-[500] bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-xl border border-white/20 flex flex-col gap-3 min-w-[220px]">
         <div className="space-y-2">
             <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Legend</h4>
             <div className="flex items-center space-x-2">
                 <div className="w-3 h-3 rounded-full bg-red-600 shadow-sm"></div>
                 <span className="text-sm text-slate-700 font-medium">DSD Accounts</span>
             </div>
             <div className="flex items-center space-x-2">
                 <div className="w-3 h-3 rounded-full bg-blue-600 shadow-sm"></div>
                 <span className="text-sm text-slate-700 font-medium">National Accounts</span>
             </div>
         </div>
         <hr className="border-slate-100" />
         <button 
           onClick={() => setRadiusMode(!radiusMode)}
           className={`px-3 py-2 text-xs font-bold rounded-lg shadow-sm transition-all duration-200 ${radiusMode ? 'bg-slate-800 text-white ring-2 ring-slate-300' : 'bg-white border border-slate-200 text-slate-600 hover:bg-stone-50 hover:border-slate-300'}`}
         >
             {radiusMode ? 'Click Map to set Center' : 'Enable Radius Tool (50mi)'}
         </button>
         {radiusMode && activeCenter && (
             <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 shadow-inner">
                 <p className="font-bold text-slate-800 mb-1">TAM Analysis Result</p>
                 <div className="flex justify-between items-center mb-1">
                     <span>Stores:</span>
                     <span className="font-mono font-bold">{tamCount}</span>
                 </div>
                 <div className="flex justify-between items-center">
                     <span>Revenue:</span>
                     <span className="text-emerald-600 font-bold">{formatCurrency(tamValue)}</span>
                 </div>
             </div>
         )}
      </div>

      <MapContainer 
        center={[39.8283, -98.5795]} 
        zoom={5} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Auto Zoom Controller */}
        <MapController stores={filteredStores} />

        <MapEvents onMapClick={handleMapClick} />
        <TAMCalculator center={activeCenter} radius={50} stores={filteredStores} onCalculate={(val, count) => { setTamValue(val); setTamCount(count); }} />

        {state.mapMode === 'PINS' ? (
            <MarkerClusterGroup 
                chunkedLoading 
                maxClusterRadius={60}
                polygonOptions={{
                    fillColor: '#3b82f6',
                    color: '#2563eb',
                    weight: 2,
                    opacity: 1,
                    fillOpacity: 0.2
                }}
            >
            {filteredStores.map(store => {
                const channel = getRetailerChannel(store.retailerId);
                return (
                    <Marker 
                        key={store.id} 
                        position={[store.lat, store.lng]} 
                        icon={channel === 'DSD' ? dsdIcon : nationalIcon}
                    >
                    <Popup className="custom-popup">
                        <div className="p-1 min-w-[160px]">
                            <h3 className="font-bold text-slate-900 text-sm mb-1">{store.name}</h3>
                            <div className="flex items-center space-x-2 mb-3">
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${channel === 'DSD' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-blue-50 text-blue-700 border border-blue-100'}`}>
                                    {channel}
                                </span>
                                <span className="text-xs text-slate-500 font-medium">{store.state}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2 rounded-lg border border-slate-100">
                                <div>
                                    <p className="text-slate-400 uppercase tracking-wider text-[10px]">Velocity</p>
                                    <p className="font-bold text-slate-700 text-sm">{store.baseVelocity.toFixed(1)}</p>
                                </div>
                                <div>
                                    <p className="text-slate-400 uppercase tracking-wider text-[10px]">SKUs</p>
                                    <p className="font-bold text-slate-700 text-sm">{store.currentSkuCount}</p>
                                </div>
                            </div>
                        </div>
                    </Popup>
                    </Marker>
                );
            })}
            </MarkerClusterGroup>
        ) : (
            <>
                {filteredStores.map(store => {
                    const intensity = Math.min(store.baseVelocity / 30, 1); 
                    const channel = getRetailerChannel(store.retailerId);
                    return (
                        <CircleMarker 
                            key={store.id}
                            center={[store.lat, store.lng]}
                            radius={8 + (intensity * 12)}
                            stroke={false}
                            pathOptions={{ 
                                fillColor: channel === 'DSD' ? '#e11d48' : '#3b82f6',
                                fillOpacity: 0.4 + (intensity * 0.3)
                            }}
                        >
                            <Popup>{store.name}: {store.baseVelocity.toFixed(1)} UPSPW</Popup>
                        </CircleMarker>
                    )
                })}
            </>
        )}
      </MapContainer>
    </div>
  );
};
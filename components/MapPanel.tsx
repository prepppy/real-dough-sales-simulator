import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, CircleMarker, useMap, Tooltip as LeafletTooltip } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { useSimulation } from '../context/SimulationContext';
import { Store } from '../types';
import { MARKET_DATA } from '../constants';
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

const MapController: React.FC<{ stores: Store[], viewMode: string }> = ({ stores, viewMode }) => {
    const map = useMap();
    
    useEffect(() => {
        if (viewMode === 'MARKETS') {
            map.flyTo([43.5, -90], 6, { duration: 1.5 }); // Center on Midwest for markets
        } else if (stores.length > 0) {
            const bounds = L.latLngBounds(stores.map(s => [s.lat, s.lng]));
            map.flyToBounds(bounds, { padding: [50, 50], maxZoom: 10, duration: 1.5 });
        }
    }, [stores, map, viewMode]);

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

type MetricType = 'STORE_COUNT' | 'REVENUE' | 'VELOCITY' | 'ROYALTY' | 'GROWTH';

export const MapPanel: React.FC = () => {
  const { filteredStores, state, formatCurrency, getRetailerChannel } = useSimulation();
  const [activeCenter, setActiveCenter] = useState<[number, number] | null>(null);
  const [radiusMode, setRadiusMode] = useState(false);
  const [tamValue, setTamValue] = useState(0);
  const [tamCount, setTamCount] = useState(0);
  
  // New State for View Modes
  const [viewMode, setViewMode] = useState<'STORES' | 'MARKETS'>('MARKETS'); // Default to Markets as per request priority
  const [activeMetric, setActiveMetric] = useState<MetricType>('STORE_COUNT');

  const handleMapClick = (e: L.LeafletMouseEvent) => {
      if (radiusMode) {
          setActiveCenter([e.latlng.lat, e.latlng.lng]);
      }
  };

  const getBubbleStyle = (market: any, metric: MetricType) => {
    let radius = 20;
    let color = '#3b82f6';
    let opacity = 0.6;

    if (metric === 'STORE_COUNT') {
        radius = Math.sqrt(market.storeCount) * 2;
        color = '#3b82f6'; // Blue
    } else if (metric === 'REVENUE') {
        radius = Math.sqrt(market.revenue / 1000) * 2;
        color = '#10b981'; // Emerald
    } else if (metric === 'VELOCITY') {
        radius = market.velocity * 8;
        // Velocity Color Scale
        if (market.velocity > 4.0) color = '#15803d'; // Dark Green
        else if (market.velocity > 3.0) color = '#22c55e'; // Green
        else if (market.velocity > 2.0) color = '#fbbf24'; // Yellow
        else color = '#94a3b8'; // Gray
    } else if (metric === 'GROWTH') {
        radius = 25;
        // Growth Color Scale
        if (market.growth > 40) color = '#ec4899'; // Pink (High Growth)
        else if (market.growth > 20) color = '#8b5cf6'; // Purple
        else color = '#3b82f6';
    } else if (metric === 'ROYALTY') {
         radius = Math.sqrt(market.revenue / 500) * 2; // Proxy for royalty
         color = '#f59e0b'; // Amber
    }

    return { radius, color, opacity };
  };

  return (
    <div className="relative w-full h-full min-h-[500px] rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-white">
      
      {/* Floating Controls */}
      <div className="absolute top-4 right-4 z-[500] bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-xl border border-slate-200 flex flex-col gap-4 min-w-[260px]">
         
         {/* View Mode Toggle */}
         <div className="flex bg-slate-100 p-1 rounded-lg">
             <button 
                onClick={() => setViewMode('STORES')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${viewMode === 'STORES' ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
             >
                Store Pins
             </button>
             <button 
                onClick={() => setViewMode('MARKETS')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${viewMode === 'MARKETS' ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
             >
                Market Analysis
             </button>
         </div>

         {viewMode === 'MARKETS' && (
             <div className="space-y-3">
                 <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Performance Overlay</h4>
                 <div className="grid grid-cols-2 gap-2">
                     {['STORE_COUNT', 'REVENUE', 'VELOCITY', 'GROWTH'].map((m) => (
                         <button 
                            key={m}
                            onClick={() => setActiveMetric(m as MetricType)}
                            className={`px-2 py-1.5 text-[10px] font-bold rounded border transition-all ${activeMetric === m ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                         >
                            {m.replace('_', ' ')}
                         </button>
                     ))}
                 </div>
                 
                 <div className="bg-slate-50 p-2 rounded text-[10px] text-slate-500 border border-slate-100">
                    <p>Size: {activeMetric === 'VELOCITY' ? 'Fixed (Color Only)' : activeMetric.replace('_', ' ')}</p>
                    <p>Color: {activeMetric === 'VELOCITY' ? 'Velocity Intensity' : 'Metric Intensity'}</p>
                 </div>
             </div>
         )}

         {viewMode === 'STORES' && (
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
         )}
         
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

        <MapController stores={filteredStores} viewMode={viewMode} />
        <MapEvents onMapClick={handleMapClick} />
        <TAMCalculator center={activeCenter} radius={50} stores={filteredStores} onCalculate={(val, count) => { setTamValue(val); setTamCount(count); }} />

        {/* MARKET ANALYSIS MODE */}
        {viewMode === 'MARKETS' && (
            <>
                {MARKET_DATA.map(market => {
                    const style = getBubbleStyle(market, activeMetric);
                    return (
                        <CircleMarker 
                            key={market.id}
                            center={[market.lat, market.lng]}
                            radius={style.radius}
                            pathOptions={{ 
                                fillColor: style.color, 
                                color: style.color, 
                                weight: 1, 
                                opacity: 1, 
                                fillOpacity: 0.6 
                            }}
                        >
                            {/* Always Visible Label */}
                            <LeafletTooltip direction="top" offset={[0, -style.radius]} opacity={1} permanent>
                                <div className="text-xs font-bold text-slate-800 text-center">
                                    {market.name}
                                    <div className="font-normal text-[10px] text-slate-500">
                                        {activeMetric === 'REVENUE' && formatCurrency(market.revenue)}
                                        {activeMetric === 'VELOCITY' && `${market.velocity} U/S/W`}
                                        {activeMetric === 'STORE_COUNT' && `${market.storeCount} Stores`}
                                        {activeMetric === 'GROWTH' && `+${market.growth}% Growth`}
                                    </div>
                                </div>
                            </LeafletTooltip>
                            
                            <Popup className="custom-popup">
                                <div className="p-2 min-w-[200px]">
                                    <h3 className="font-bold text-slate-900 text-base mb-1">{market.name}</h3>
                                    <p className="text-xs text-slate-500 mb-3">{market.retailers.join(', ')}</p>
                                    
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div className="bg-slate-50 p-2 rounded border border-slate-100">
                                            <p className="text-slate-400 uppercase text-[10px]">Revenue</p>
                                            <p className="font-bold text-slate-700">{formatCurrency(market.revenue)}</p>
                                        </div>
                                        <div className="bg-slate-50 p-2 rounded border border-slate-100">
                                            <p className="text-slate-400 uppercase text-[10px]">Velocity</p>
                                            <p className="font-bold text-slate-700">{market.velocity}</p>
                                        </div>
                                        <div className="bg-slate-50 p-2 rounded border border-slate-100">
                                            <p className="text-slate-400 uppercase text-[10px]">Share</p>
                                            <p className="font-bold text-slate-700">{market.share}%</p>
                                        </div>
                                        <div className="bg-slate-50 p-2 rounded border border-slate-100">
                                            <p className="text-slate-400 uppercase text-[10px]">Growth</p>
                                            <p className="font-bold text-emerald-600">+{market.growth}%</p>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-3 pt-3 border-t border-slate-100 text-xs">
                                        <p className="text-slate-400 uppercase text-[10px] mb-1">Top Competitor</p>
                                        <p className="font-bold text-rose-600">{market.topCompetitor} <span className="text-rose-400 font-normal">(+{market.competitorGrowth}%)</span></p>
                                    </div>
                                </div>
                            </Popup>
                        </CircleMarker>
                    )
                })}
            </>
        )}

        {/* STORE PINS MODE (Existing Logic) */}
        {viewMode === 'STORES' && (
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
        )}
      </MapContainer>
    </div>
  );
};

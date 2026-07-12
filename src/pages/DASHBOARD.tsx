import { useOperations } from "@/App"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Bus, 
  AlertTriangle, 
  Clock, 
  BatteryCharging, 
  Map, 
  ArrowRight,
  TrendingUp,
  RotateCcw
} from "lucide-react"
import { Link } from "react-router-dom"

export default function Dashboard() {
  const { vehicles, incidents, resolveIncident } = useOperations()

  // Calculate Metrics
  const activeVehicles = vehicles.filter(v => v.status !== "Maintenance").length
  const maintenanceVehicles = vehicles.filter(v => v.status === "Maintenance").length
  
  const activeIncidents = incidents.filter(i => i.status === "Active")
  const criticalAlertsCount = activeIncidents.filter(i => i.severity === "Critical").length
  
  const avgBattery = Math.round(
    vehicles.reduce((acc, curr) => acc + curr.battery, 0) / vehicles.length
  )
  
  const averageDelay = Number(
    (vehicles.reduce((acc, curr) => acc + curr.delayMin, 0) / vehicles.length).toFixed(1)
  )

  // Map limits
  // Center of LA is roughly 34.0522, -118.2437
  // Let's project vehicles coordinates on a mini relative bounding box
  const getCoordinatesPct = (lat: number, lng: number) => {
    const latMin = 34.00, latMax = 34.08
    const lngMin = -118.50, lngMax = -118.20
    const x = ((lng - lngMin) / (lngMax - lngMin)) * 100
    const y = 100 - (((lat - latMin) / (latMax - latMin)) * 100) // Flip Y for screen coords
    return { 
      x: Math.max(5, Math.min(95, x)), 
      y: Math.max(5, Math.min(95, y)) 
    }
  }

  return (
    <div className="space-y-6">
      {/* Title section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white glow-text-cyan">Operations Center Dashboard</h2>
          <p className="text-sm text-slate-400">Live operational telemetry and dispatch hub overview.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            <RotateCcw className="h-4 w-4" /> Reset Feeds
          </Button>
          <Link to="/tracking">
            <Button size="sm">
              <Map className="h-4 w-4" /> Live Terminal
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Fleet</CardTitle>
            <Bus className="h-4 w-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{activeVehicles} / {vehicles.length}</div>
            <p className="text-xs text-slate-400 mt-1">
              <span className="text-cyan-400 font-semibold">{activeVehicles}</span> on-route • <span className="text-slate-500">{maintenanceVehicles}</span> in depot
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Incidents</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-400 animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">{activeIncidents.length}</div>
            <p className="text-xs text-slate-400 mt-1">
              <span className="text-red-400 font-semibold">{criticalAlertsCount} critical</span> requires immediate dispatch
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Average Delay</CardTitle>
            <Clock className="h-4 w-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{averageDelay} min</div>
            <p className="text-xs text-slate-400 mt-1">
              System OTP rate at <span className="text-emerald-400 font-semibold">94.8%</span>
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Avg Charge / Fuel</CardTitle>
            <BatteryCharging className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{avgBattery}%</div>
            <p className="text-xs text-slate-400 mt-1">
              Avg telemetry battery efficiency across fleet
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Grid: Live Telemetry Map & Active Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Real-time Map Plotter (2/3 width) */}
        <Card className="lg:col-span-2 glass-panel border border-white/5 flex flex-col h-[400px]">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-sm font-bold text-white uppercase tracking-wider">Live Route Map Monitor</CardTitle>
                <CardDescription className="text-xs">Visualizing active transit routes in Central Metropolitan Grid.</CardDescription>
              </div>
              <span className="h-2 w-2 rounded-full bg-emerald-500 glow-dot" />
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-4 relative overflow-hidden">
            {/* Stylized Grid Map Background */}
            <div className="w-full h-full rounded-lg border border-white/5 map-grid-bg relative overflow-hidden">
              
              {/* Mock Route Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                {/* Coastal Westside Line */}
                <path d="M 10,90 Q 30,50 60,70 T 95,10" fill="none" stroke="#06b6d4" strokeWidth="2.5" strokeDasharray="6 4" />
                {/* Airport Shuttle Route */}
                <path d="M 20,20 Q 50,40 70,80" fill="none" stroke="#a855f7" strokeWidth="2" strokeDasharray="3 3" />
                {/* Metro Green Route */}
                <line x1="80" y1="10" x2="80" y2="90" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 2" />
              </svg>

              {/* Plotted Vehicles */}
              {vehicles.map((v) => {
                const pos = getCoordinatesPct(v.lat, v.lng)
                const isCritical = v.status === "Critical"
                const isWarning = v.status === "Warning"
                const isMaintenance = v.status === "Maintenance"

                let color = "bg-cyan-500 shadow-cyan-500/50"
                if (isCritical) color = "bg-red-500 shadow-red-500/50"
                else if (isWarning) color = "bg-amber-500 shadow-amber-500/50"
                else if (isMaintenance) color = "bg-slate-500 shadow-slate-500/50"

                return (
                  <div
                    key={v.id}
                    className="absolute group z-10 cursor-pointer -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ease-out"
                    style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                  >
                    {/* Ring glow */}
                    <span className={`absolute inset-0 -m-1 rounded-full animate-ping opacity-25 ${
                      isCritical ? 'bg-red-500' : isWarning ? 'bg-amber-500' : 'bg-cyan-500'
                    }`} />
                    {/* Dot */}
                    <div className={`h-3 w-3 rounded-full border border-slate-950 ${color}`} />
                    
                    {/* Hover Info Tooltip */}
                    <div className="absolute left-1/2 bottom-full -translate-x-1/2 mb-2 w-32 bg-slate-900/90 border border-white/10 rounded-lg p-2 text-[10px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 shadow-xl">
                      <p className="font-bold text-white text-center">{v.id}</p>
                      <p className="text-slate-400 text-center">{v.route.split(" - ")[0]}</p>
                      <p className="text-center mt-1">
                        <span className="font-semibold text-slate-200">{v.speed} km/h</span> • <span className={v.battery < 20 ? 'text-red-400' : 'text-emerald-400'}>{v.battery}%</span>
                      </p>
                    </div>
                  </div>
                )
              })}

              {/* Map Legend */}
              <div className="absolute bottom-2 left-2 bg-slate-950/85 border border-white/10 rounded-lg p-2 flex flex-col gap-1 text-[9px] text-slate-400 backdrop-blur-sm z-20">
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-cyan-500" />
                  <span>Normal Service</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-amber-500" />
                  <span>Delay / Overspeed</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-red-500" />
                  <span>Critical Battery / Event</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Live Alerts Panel (1/3 width) */}
        <Card className="glass-panel border border-white/5 flex flex-col h-[400px]">
          <CardHeader className="pb-2 border-b border-white/5">
            <CardTitle className="text-sm font-bold text-white uppercase tracking-wider flex justify-between items-center">
              <span>Incident Queue</span>
              <Badge variant={activeIncidents.length > 0 ? "destructive" : "secondary"}>
                {activeIncidents.length} Active
              </Badge>
            </CardTitle>
            <CardDescription className="text-xs">Critical alerts requiring dispatcher review.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-3">
            {activeIncidents.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-xs text-slate-500 py-20">
                <ShieldAlert className="h-8 w-8 text-slate-600 mb-2 stroke-[1.5]" />
                <p>No critical incident warnings reported. System operational.</p>
              </div>
            ) : (
              activeIncidents.map((inc) => (
                <div key={inc.id} className="p-3 bg-slate-900/50 border border-white/5 rounded-lg flex flex-col gap-2 relative">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 block">{inc.id} • {inc.time}</span>
                      <h4 className="text-xs font-bold text-slate-200 mt-0.5">{inc.type}</h4>
                    </div>
                    <Badge variant={inc.severity === "Critical" ? "destructive" : "warning"}>
                      {inc.severity}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal">{inc.description}</p>
                  
                  {/* Action buttons */}
                  <div className="flex gap-2 mt-1">
                    <Button 
                      variant="glass" 
                      size="sm" 
                      className="text-[10px] h-7 px-2.5 flex-1"
                      onClick={() => resolveIncident(inc.id)}
                    >
                      Resolve
                    </Button>
                    <Link to={`/tracking`} className="flex-1">
                      <Button variant="outline" size="sm" className="text-[10px] h-7 px-2.5 w-full flex items-center justify-center gap-1">
                        Inspect <ArrowRight className="h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Live Operations & Dispatch Grid */}
      <Card className="glass-panel border border-white/5">
        <CardHeader className="pb-3 border-b border-white/5">
          <CardTitle className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="h-4.5 w-4.5 text-cyan-400" /> Live Dispatch Board
          </CardTitle>
          <CardDescription className="text-xs">Live schedule on-route log and driver stats.</CardDescription>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-slate-400 bg-slate-900/30">
                <th className="p-3.5 pl-6 font-semibold">Vehicle ID</th>
                <th className="p-3.5 font-semibold">Route Assignment</th>
                <th className="p-3.5 font-semibold">Active Driver</th>
                <th className="p-3.5 font-semibold">Speed</th>
                <th className="p-3.5 font-semibold">Battery / Fuel</th>
                <th className="p-3.5 font-semibold">Next Stop</th>
                <th className="p-3.5 font-semibold">Schedule Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {vehicles.map((v) => (
                <tr key={v.id} className="hover:bg-white/2 transition-colors">
                  <td className="p-3.5 pl-6 font-bold text-white flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${
                      v.status === "On-Route" ? "bg-emerald-500" :
                      v.status === "Warning" ? "bg-amber-500" :
                      v.status === "Critical" ? "bg-red-500" : "bg-slate-500"
                    }`} />
                    {v.id}
                  </td>
                  <td className="p-3.5 text-slate-300 font-medium">{v.route}</td>
                  <td className="p-3.5 text-slate-400 font-mono">{v.driver}</td>
                  <td className="p-3.5 text-slate-200 font-mono">{v.speed} km/h</td>
                  <td className="p-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-900 border border-white/5 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            v.battery < 20 ? "bg-red-500" : v.battery < 50 ? "bg-amber-500" : "bg-emerald-500"
                          }`}
                          style={{ width: `${v.battery}%` }}
                        />
                      </div>
                      <span className="font-semibold text-slate-300 font-mono text-[11px]">{v.battery}%</span>
                    </div>
                  </td>
                  <td className="p-3.5 text-slate-400">{v.nextStop}</td>
                  <td className="p-3.5">
                    <Badge variant={
                      v.status === "On-Route" ? "success" :
                      v.status === "Warning" ? "warning" :
                      v.status === "Critical" ? "destructive" : "secondary"
                    }>
                      {v.status === "On-Route" ? "On-Time" : v.status === "Maintenance" ? "Depot Service" : v.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Settings, 
  ShieldAlert, 
  Cpu, 
  RefreshCw, 
  Sliders, 
  Volume2, 
  Database,
  Radio
} from "lucide-react"

export default function SettingsPage() {
  const [maxSpeed, setMaxSpeed] = useState(60)
  const [minBattery, setMinBattery] = useState(15)
  const [refreshInterval, setRefreshInterval] = useState(4)
  const [desktopAlerts, setDesktopAlerts] = useState(true)
  const [audioAlerts, setAudioAlerts] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    alert("Configuration parameters updated in system cache.")
  }

  const handleTestAPI = () => {
    alert("API Diagnostic Status: Node server ping success (12ms latency)")
  }

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white glow-text-cyan">System Configurations</h2>
        <p className="text-sm text-slate-400">Configure fleet rules, diagnostic intervals, and dispatcher alert systems.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* 1. Fleet Operations Bounds */}
          <Card className="glass-panel border border-white/5">
            <CardHeader className="pb-3 border-b border-white/5">
              <CardTitle className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Sliders className="h-4.5 w-4.5 text-cyan-400" /> Fleet Telemetry Bounds
              </CardTitle>
              <CardDescription className="text-xs">Adjust rule thresholds that trigger warning logs.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex justify-between">
                  <span>Velocity Limit Threshold</span>
                  <span className="text-cyan-400 font-mono">{maxSpeed} km/h</span>
                </label>
                <input
                  type="range"
                  min="40"
                  max="120"
                  value={maxSpeed}
                  onChange={(e) => setMaxSpeed(Number(e.target.value))}
                  className="w-full h-1 bg-slate-900 border border-white/5 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
                <span className="text-[10px] text-slate-500 block">Exceeding this value logs warning reports for buses/trams.</span>
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-semibold text-slate-300 flex justify-between">
                  <span>Battery Low Limit Threshold</span>
                  <span className="text-red-400 font-mono">{minBattery}%</span>
                </label>
                <input
                  type="range"
                  min="5"
                  max="35"
                  value={minBattery}
                  onChange={(e) => setMinBattery(Number(e.target.value))}
                  className="w-full h-1 bg-slate-900 border border-white/5 rounded-lg appearance-none cursor-pointer accent-red-500"
                />
                <span className="text-[10px] text-slate-500 block">Triggers critical low energy alarm and alerts support dispatchers.</span>
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-semibold text-slate-300">Telemetry Sync Interval</label>
                <div className="flex gap-2">
                  {[2, 4, 10, 30].map((sec) => (
                    <Button
                      key={sec}
                      type="button"
                      variant={refreshInterval === sec ? "default" : "glass"}
                      size="sm"
                      onClick={() => setRefreshInterval(sec)}
                      className="text-xs flex-1"
                    >
                      {sec}s
                    </Button>
                  ))}
                </div>
                <span className="text-[10px] text-slate-500 block">Interval time for background websocket state fetches.</span>
              </div>
            </CardContent>
          </Card>

          {/* 2. Dispatcher Preferences */}
          <Card className="glass-panel border border-white/5">
            <CardHeader className="pb-3 border-b border-white/5">
              <CardTitle className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Volume2 className="h-4.5 w-4.5 text-cyan-400" /> Notifications & Audio
              </CardTitle>
              <CardDescription className="text-xs">Adjust how alerts are delivered to your terminal console.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/40 border border-white/3">
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Flash Incident Dashboard</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Visually flash screen border upon critical warning.</p>
                </div>
                <input
                  type="checkbox"
                  checked={desktopAlerts}
                  onChange={(e) => setDesktopAlerts(e.target.checked)}
                  className="h-4 w-4 rounded border-white/10 bg-slate-900 text-cyan-600 focus:ring-cyan-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/40 border border-white/3">
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Terminal Audio Warning</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Siren voice indicator during critical breakdowns.</p>
                </div>
                <input
                  type="checkbox"
                  checked={audioAlerts}
                  onChange={(e) => setAudioAlerts(e.target.checked)}
                  className="h-4 w-4 rounded border-white/10 bg-slate-900 text-cyan-600 focus:ring-cyan-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/40 border border-white/3">
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Auto-Center Map</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Instantly center map on selected vehicle coordinates.</p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 rounded border-white/10 bg-slate-900 text-cyan-600 focus:ring-cyan-500 cursor-pointer"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 3. System Diagnostics & Services */}
        <Card className="glass-panel border border-white/5">
          <CardHeader className="pb-3 border-b border-white/5">
            <CardTitle className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Cpu className="h-4.5 w-4.5 text-cyan-400" /> Platform Subsystem Health
            </CardTitle>
            <CardDescription className="text-xs">Active connections and diagnostic status logs.</CardDescription>
          </CardHeader>
          <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <div className="p-3 bg-slate-950/50 border border-white/5 rounded-lg flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                <Database className="h-4.5 w-4.5" />
              </div>
              <div className="min-w-0">
                <span className="text-[9px] uppercase text-slate-500 font-semibold block">Main Database</span>
                <span className="font-bold text-xs text-white">OPS-SQL-PRIMARY</span>
                <span className="text-[9px] text-emerald-400 block mt-0.5">● Healthy (Idle)</span>
              </div>
            </div>

            <div className="p-3 bg-slate-950/50 border border-white/5 rounded-lg flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                <Radio className="h-4.5 w-4.5" />
              </div>
              <div className="min-w-0">
                <span className="text-[9px] uppercase text-slate-500 font-semibold block">Websocket Channel</span>
                <span className="font-bold text-xs text-white">LIVE-SYNC-NODE</span>
                <span className="text-[9px] text-emerald-400 block mt-0.5">● Connected (Active)</span>
              </div>
            </div>

            <div className="p-3 bg-slate-950/50 border border-white/5 rounded-lg flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400 shrink-0">
                <RefreshCw className="h-4.5 w-4.5 animate-spin-slow" />
              </div>
              <div className="min-w-0">
                <span className="text-[9px] uppercase text-slate-500 font-semibold block">Map Tile Server</span>
                <span className="font-bold text-xs text-white">MAPBOX-TILES-US</span>
                <span className="text-[9px] text-cyan-400 block mt-0.5">● Online (Stable)</span>
              </div>
            </div>

          </CardContent>
          <CardFooter className="flex justify-between items-center bg-slate-900/10 border-t border-white/5 p-4 mt-2">
            <span className="text-[10px] text-slate-500">Last diagnostic verification test run: Just now.</span>
            <Button type="button" variant="outline" size="sm" onClick={handleTestAPI} className="text-xs h-8">
              Run Self-Test Ping
            </Button>
          </CardFooter>
        </Card>

        {/* Form Action buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="glass" size="default" onClick={() => window.location.reload()}>
            Cancel Changes
          </Button>
          <Button type="submit" size="default">
            Save Rule Settings
          </Button>
        </div>
      </form>
    </div>
  )
}

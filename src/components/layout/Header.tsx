import { useState, useEffect } from "react"
import { Bell, Wifi, Search, Clock, ShieldAlert, Check } from "lucide-react"

export default function Header() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showNotifications, setShowNotifications] = useState(false)

  // Simulation alerts
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Bus 104 - Speed Limit Exceeded (68 km/h)", type: "warning", read: false, time: "2 min ago" },
    { id: 2, text: "Tram 12 - Route Deviation Warning", type: "critical", read: false, time: "5 min ago" },
    { id: 3, text: "Van 45 - Battery critical level < 15%", type: "critical", read: false, time: "12 min ago" },
  ])

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <header className="h-16 border-b border-white/5 glass-panel sticky top-0 z-30 flex items-center justify-between px-6">
      {/* Left Search bar / Telemetry Node Status */}
      <div className="flex items-center gap-6">
        <div className="relative w-64 hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search fleet, routes, or dispatchers..."
            className="w-full bg-slate-900/40 border border-white/5 rounded-lg py-1.5 pl-9 pr-4 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 placeholder-slate-500"
          />
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 bg-slate-900/50 border border-white/5 px-2.5 py-1 rounded-md">
          <Wifi className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
          <span>OPS NODE: CENTRAL-WEST</span>
        </div>
      </div>

      {/* Right Stats & Utilities */}
      <div className="flex items-center gap-5">
        {/* Operations Health Status Panel */}
        <div className="hidden lg:flex items-center gap-4 text-xs border-r border-white/10 pr-5">
          <div className="text-right">
            <span className="text-[10px] uppercase text-slate-500 block">Fleet Efficiency</span>
            <span className="font-bold text-slate-200 text-sm">94.8%</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase text-slate-500 block">Active Drivers</span>
            <span className="font-bold text-emerald-400 text-sm">18 / 20</span>
          </div>
        </div>

        {/* Live Clock Widget */}
        <div className="flex items-center gap-2 text-xs text-slate-300 font-mono bg-slate-900/40 border border-white/5 px-3 py-1.5 rounded-lg">
          <Clock className="h-3.5 w-3.5 text-cyan-400" />
          <span>{currentTime.toLocaleTimeString()}</span>
        </div>

        {/* Alerts Notification dropdown trigger */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg bg-slate-900/40 border border-white/5 hover:bg-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer relative"
          >
            <Bell className="h-4.5 w-4.5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 h-4 w-4 bg-red-500 text-[9px] font-bold text-white flex items-center justify-center rounded-full animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Panel Modal */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 glass-panel-heavy rounded-xl shadow-2xl border border-white/10 overflow-hidden z-50">
              <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <h3 className="font-semibold text-xs text-white uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="h-4 w-4 text-red-500" /> Live Incident Alerts
                </h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[10px] text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Check className="h-3 w-3" /> Clear Active
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-500">
                    No active incident notifications.
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-3.5 border-b border-white/5 transition-colors ${
                        n.read ? "opacity-60 bg-transparent" : "bg-cyan-500/5 hover:bg-cyan-500/10"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className={`text-xs font-semibold ${
                          n.type === 'critical' ? 'text-red-400' : 'text-amber-400'
                        }`}>
                          {n.type === 'critical' ? 'CRITICAL' : 'WARNING'}
                        </span>
                        <span className="text-[10px] text-slate-500">{n.time}</span>
                      </div>
                      <p className="text-xs text-slate-200 mt-1">{n.text}</p>
                    </div>
                  ))
                )}
              </div>
              <div className="p-2 bg-slate-950/60 text-center border-t border-white/5">
                <a
                  href="#/incidents"
                  onClick={() => setShowNotifications(false)}
                  className="text-[10px] font-bold text-cyan-400 hover:text-cyan-300 uppercase tracking-widest block py-1"
                >
                  View Incidents Log
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

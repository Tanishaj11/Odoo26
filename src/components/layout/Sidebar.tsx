import { NavLink } from "react-router-dom"
import { 
  LayoutDashboard, 
  MapPin, 
  AlertTriangle, 
  BarChart3, 
  Settings, 
  Bus, 
  ShieldCheck,
  User
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function Sidebar() {
  const menuItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Fleet Tracking", path: "/tracking", icon: MapPin },
    { name: "Incidents Desk", path: "/incidents", icon: AlertTriangle, badge: "3" },
    { name: "Analytics", path: "/analytics", icon: BarChart3 },
    { name: "System Settings", path: "/settings", icon: Settings },
  ]

  return (
    <aside className="w-64 glass-panel border-r border-white/5 h-screen flex flex-col justify-between sticky top-0 shrink-0 z-40">
      <div className="flex flex-col flex-1 overflow-y-auto">
        {/* Brand Logo Header */}
        <div className="h-16 flex items-center px-6 border-b border-white/5 gap-2.5">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-cyan-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-cyan-950/30">
            <Bus className="h-5.5 w-5.5 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="font-bold text-sm leading-tight text-white tracking-wider">STOP HUB</h1>
            <p className="text-[10px] text-cyan-400 font-medium tracking-widest uppercase">Smart Operations</p>
          </div>
        </div>

        {/* Dispatcher Quick Profile */}
        <div className="p-4 mx-3 my-4 rounded-xl bg-slate-900/40 border border-white/5 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-slate-800 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-semibold shadow-inner">
            <User className="h-5 w-5" />
          </div>
          <div className="overflow-hidden">
            <h4 className="text-xs font-semibold text-white truncate">Janvi Dhameliya</h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              <ShieldCheck className="h-3 w-3 text-emerald-400" />
              <span className="text-[10px] text-emerald-400 font-medium uppercase tracking-wider">Lead Dispatcher</span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group cursor-pointer",
                  isActive
                    ? "bg-cyan-500/10 border-l-2 border-cyan-500 text-cyan-400 shadow-sm"
                    : "text-slate-400 hover:text-slate-100 hover:bg-white/5"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <item.icon
                      className={cn(
                        "h-4.5 w-4.5 transition-transform duration-150 group-hover:scale-105",
                        isActive ? "text-cyan-400" : "text-slate-400 group-hover:text-slate-200"
                      )}
                    />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={cn(
                        "text-[10px] font-bold px-1.5 py-0.5 rounded-md min-w-[18px] text-center",
                        isActive
                          ? "bg-cyan-500 text-slate-950"
                          : "bg-red-500/20 text-red-400 animate-pulse-glow"
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-white/5 text-[10px] text-slate-500 flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span>System Version</span>
          <span className="font-semibold text-slate-400">v4.8.2-PROD</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Node Telemetry</span>
          <span className="text-emerald-400 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 glow-dot" /> Connected
          </span>
        </div>
      </div>
    </aside>
  )
}

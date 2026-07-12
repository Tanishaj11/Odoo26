import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select } from "@/components/ui/select"
import { 
  AreaChart, Area, 
  BarChart, Bar, 
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts"
import { 
  BarChart3, 
  TrendingUp, 
  Activity, 
  Zap, 
  Download,
  Calendar
} from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Analytics() {
  const [timeframe, setTimeframe] = useState("24h")

  // Chart 1: Fleet Utilization over time (24h)
  const utilizationData = useMemo(() => {
    return [
      { hour: "00:00", buses: 20, trams: 10, vans: 5 },
      { hour: "04:00", buses: 35, trams: 12, vans: 8 },
      { hour: "08:00", buses: 92, trams: 88, vans: 74 },
      { hour: "12:00", buses: 74, trams: 65, vans: 62 },
      { hour: "16:00", buses: 96, trams: 90, vans: 85 },
      { hour: "20:00", buses: 60, trams: 45, vans: 30 },
      { hour: "23:59", buses: 25, trams: 15, vans: 10 }
    ]
  }, [])

  // Chart 2: Passenger ridership count by hour
  const ridershipData = useMemo(() => {
    return [
      { name: "6 AM", riders: 1200 },
      { name: "8 AM", riders: 4800 },
      { name: "10 AM", riders: 2100 },
      { name: "12 PM", riders: 2800 },
      { name: "2 PM", riders: 2300 },
      { name: "4 PM", riders: 5100 },
      { name: "6 PM", riders: 4600 },
      { name: "8 PM", riders: 1900 },
      { name: "10 PM", riders: 900 }
    ]
  }, [])

  // Chart 3: Energy efficiency comparisons (Wh/km - lower is better)
  const energyEfficiencyData = useMemo(() => {
    return [
      { name: "Electric Bus", efficiency: 820, fill: "#06b6d4" },
      { name: "Electric Van", efficiency: 320, fill: "#10b981" },
      { name: "LRT Tram", efficiency: 1100, fill: "#8b5cf6" },
      { name: "Hydrogen Bus", efficiency: 980, fill: "#f59e0b" }
    ]
  }, [])

  // Chart 4: Delays distribution (Minutes)
  const delayDistributionData = useMemo(() => {
    return [
      { name: "Line 4B Downtown", value: 45, color: "#ef4444" },
      { name: "Green Metro Line", value: 15, color: "#10b981" },
      { name: "Maintenance Grid", value: 30, color: "#f59e0b" },
      { name: "Airport Shuttle", value: 10, color: "#a855f7" }
    ]
  }, [])

  const handleExport = () => {
    alert("Exporting operations reports: CSV metrics generated.")
  }

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white glow-text-cyan">Analytics & Optimization</h2>
          <p className="text-sm text-slate-400">Historical performance reports and fleet efficiency metrics.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Select 
            value={timeframe} 
            onChange={(e) => setTimeframe(e.target.value)}
            className="w-32 py-1 text-xs"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </Select>
          <Button variant="outline" size="sm" onClick={handleExport} className="gap-1.5 text-xs">
            <Download className="h-4 w-4" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Grid: Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* 1. Fleet Utilization Area Chart */}
        <Card className="glass-panel border border-white/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="h-4.5 w-4.5 text-cyan-400" /> Operational Fleet Utilization
            </CardTitle>
            <CardDescription className="text-xs">Capacity percentage usage by vehicle category.</CardDescription>
          </CardHeader>
          <CardContent className="h-72 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={utilizationData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBuses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorTrams" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="hour" stroke="#64748b" fontSize={9} />
                <YAxis stroke="#64748b" fontSize={9} unit="%" />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}
                  labelStyle={{ color: "#94a3b8", fontSize: "10px" }}
                  itemStyle={{ color: "#fff", fontSize: "11px" }}
                />
                <Legend wrapperStyle={{ fontSize: "10px", marginTop: "10px" }} />
                <Area type="monotone" dataKey="buses" stroke="#06b6d4" fillOpacity={1} fill="url(#colorBuses)" name="Buses" />
                <Area type="monotone" dataKey="trams" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorTrams)" name="Trams" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 2. Ridership count Bar Chart */}
        <Card className="glass-panel border border-white/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Activity className="h-4.5 w-4.5 text-cyan-400" /> Passenger Load Volume
            </CardTitle>
            <CardDescription className="text-xs">Ridership capacity peaks by time intervals.</CardDescription>
          </CardHeader>
          <CardContent className="h-72 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ridershipData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={9} />
                <YAxis stroke="#64748b" fontSize={9} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}
                  labelStyle={{ color: "#94a3b8", fontSize: "10px" }}
                  itemStyle={{ color: "#fff", fontSize: "11px" }}
                />
                <Bar dataKey="riders" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Passenger Entries" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 3. Energy efficiency metrics Bar Chart */}
        <Card className="glass-panel border border-white/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Zap className="h-4.5 w-4.5 text-cyan-400" /> Propulsion Power efficiency
            </CardTitle>
            <CardDescription className="text-xs">Average consumption (Wh/km). Lower indicates higher efficiency.</CardDescription>
          </CardHeader>
          <CardContent className="h-72 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={energyEfficiencyData} layout="vertical" margin={{ top: 10, right: 20, left: -5, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" horizontal={false} />
                <XAxis type="number" stroke="#64748b" fontSize={9} />
                <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={9} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}
                  labelStyle={{ color: "#94a3b8", fontSize: "10px" }}
                  itemStyle={{ color: "#fff", fontSize: "11px" }}
                />
                <Bar dataKey="efficiency" radius={[0, 4, 4, 0]} name="Efficiency Rating">
                  {energyEfficiencyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 4. Pie Chart: Route delay distribution */}
        <Card className="glass-panel border border-white/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <BarChart3 className="h-4.5 w-4.5 text-cyan-400" /> Delayed Route Share
            </CardTitle>
            <CardDescription className="text-xs">Accumulated delay minutes distribution by transit line.</CardDescription>
          </CardHeader>
          <CardContent className="h-72 p-4 flex flex-col md:flex-row items-center justify-center gap-6">
            <div className="h-48 w-48 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={delayDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {delayDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}
                    itemStyle={{ color: "#fff", fontSize: "11px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-bold text-white">100m</span>
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Total Delay</span>
              </div>
            </div>
            
            {/* Custom Legend */}
            <div className="flex flex-col gap-2.5 text-xs">
              {delayDistributionData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-slate-400 font-medium">{entry.name}:</span>
                  <span className="font-bold text-slate-200">{entry.value} min</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}

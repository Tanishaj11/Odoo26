import { createContext, useContext, useState, useEffect } from "react"
import { HashRouter as Router, Routes, Route } from "react-router-dom"
import Sidebar from "@/components/layout/Sidebar"
import Header from "@/components/layout/Header"

// Import Pages
import Dashboard from "@/pages/Dashboard"
import FleetTracking from "@/pages/FleetTracking"
import Incidents from "@/pages/Incidents"
import Analytics from "@/pages/Analytics"
import Settings from "@/pages/Settings"

// Define interfaces
export interface Vehicle {
  id: string
  type: "Bus" | "Tram" | "Service Van"
  route: string
  speed: number
  battery: number
  lat: number
  lng: number
  status: "On-Route" | "Warning" | "Critical" | "Maintenance"
  driver: string
  nextStop: string
  fuelType: string
  efficiency: number // Wh/km or km/L
  delayMin: number
}

export interface Incident {
  id: string
  vehicleId: string
  severity: "Critical" | "Warning" | "Info"
  type: string
  description: string
  status: "Active" | "Resolved"
  time: string
  driver: string
}

interface OperationsContextType {
  vehicles: Vehicle[]
  incidents: Incident[]
  setVehicles: React.Dispatch<React.SetStateAction<Vehicle[]>>
  setIncidents: React.Dispatch<React.SetStateAction<Incident[]>>
  dispatchDriver: (vehicleId: string, driverName: string) => void
  resolveIncident: (incidentId: string) => void
}

const OperationsContext = createContext<OperationsContextType | undefined>(undefined)

export const useOperations = () => {
  const context = useContext(OperationsContext)
  if (!context) throw new Error("useOperations must be used within OperationsProvider")
  return context
}

export default function App() {
  // Initial Mock State
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      id: "BUS-104",
      type: "Bus",
      route: "Line 4B - Downtown Express",
      speed: 62,
      battery: 78,
      lat: 34.0522,
      lng: -118.2437,
      status: "Warning",
      driver: "Marcus Aurelius",
      nextStop: "Union Station",
      fuelType: "Electric",
      efficiency: 850, // Wh/km
      delayMin: 4
    },
    {
      id: "TRM-012",
      type: "Tram",
      route: "Green Line Metro link",
      speed: 0,
      battery: 89,
      lat: 34.0407,
      lng: -118.2685,
      status: "On-Route",
      driver: "Seneca",
      nextStop: "Pico Station",
      fuelType: "Overhead Catenary",
      efficiency: 1100,
      delayMin: 0
    },
    {
      id: "VAN-045",
      type: "Service Van",
      route: "Maintenance Dispatch Grid",
      speed: 45,
      battery: 12,
      lat: 34.0689,
      lng: -118.212,
      status: "Critical",
      driver: "Epictetus",
      nextStop: "Depot North",
      fuelType: "Electric",
      efficiency: 340,
      delayMin: 12
    },
    {
      id: "BUS-209",
      type: "Bus",
      route: "Line 12A - Airport Shuttle",
      speed: 52,
      battery: 64,
      lat: 34.0205,
      lng: -118.2856,
      status: "On-Route",
      driver: "Cicero",
      nextStop: "Terminal 2 Outbound",
      fuelType: "Hydrogen Hybrid",
      efficiency: 6.2, // km/kg
      delayMin: 1
    },
    {
      id: "BUS-078",
      type: "Bus",
      route: "Line 8 - Westside Coastal Route",
      speed: 0,
      battery: 95,
      lat: 34.015,
      lng: -118.4912,
      status: "Maintenance",
      driver: "None (Depot)",
      nextStop: "Westside Depot",
      fuelType: "Electric",
      efficiency: 0,
      delayMin: 0
    }
  ])

  const [incidents, setIncidents] = useState<Incident[]>([
    {
      id: "INC-201",
      vehicleId: "TRM-012",
      severity: "Critical",
      type: "Route Deviation",
      description: "Tram took incorrect switch track near Pico Blvd junction.",
      status: "Active",
      time: "5 min ago",
      driver: "Seneca"
    },
    {
      id: "INC-202",
      vehicleId: "BUS-104",
      severity: "Warning",
      type: "Overspeed Telemetry",
      description: "Bus speed clocked at 62 km/h in a 50 km/h transit lane limit.",
      status: "Active",
      time: "2 min ago",
      driver: "Marcus Aurelius"
    },
    {
      id: "INC-203",
      vehicleId: "VAN-045",
      severity: "Critical",
      type: "Critical Battery Safety",
      description: "Emergency battery level dropped below 15% safety threshold.",
      status: "Active",
      time: "12 min ago",
      driver: "Epictetus"
    }
  ])

  // Simulator telemetry fluctuation
  useEffect(() => {
    const telemetryInterval = setInterval(() => {
      setVehicles((prevVehicles) =>
        prevVehicles.map((vehicle) => {
          if (vehicle.status === "Maintenance" || vehicle.speed === 0) {
            // Idle or maintenance, minimal change
            return {
              ...vehicle,
              battery: vehicle.status === "Maintenance" ? vehicle.battery : Math.max(0, vehicle.battery - 0.05),
            }
          }

          // Active vehicle movement simulation
          const speedFluctuation = Math.floor(Math.random() * 7) - 3 // -3 to +3
          const newSpeed = Math.max(20, Math.min(80, vehicle.speed + speedFluctuation))
          const newBattery = Math.max(0, Number((vehicle.battery - (newSpeed / 1000)).toFixed(2)))

          // Lat/lng drift simulation
          const latDrift = (Math.random() - 0.5) * 0.0008
          const lngDrift = (Math.random() - 0.5) * 0.0008

          return {
            ...vehicle,
            speed: newSpeed,
            battery: newBattery,
            lat: vehicle.lat + latDrift,
            lng: vehicle.lng + lngDrift,
          }
        })
      )
    }, 4000)

    return () => clearInterval(telemetryInterval)
  }, [])

  // Action methods
  const dispatchDriver = (vehicleId: string, driverName: string) => {
    setVehicles(prev =>
      prev.map(v => v.id === vehicleId ? { ...v, driver: driverName, status: "On-Route" } : v)
    )
  }

  const resolveIncident = (incidentId: string) => {
    setIncidents(prev =>
      prev.map(inc => inc.id === incidentId ? { ...inc, status: "Resolved" as const } : inc)
    )
  }

  return (
    <OperationsContext.Provider
      value={{
        vehicles,
        incidents,
        setVehicles,
        setIncidents,
        dispatchDriver,
        resolveIncident
      }}
    >
      <Router>
        <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Workspace */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            {/* Header */}
            <Header />

            {/* Content router */}
            <main className="flex-1 overflow-y-auto bg-slate-950/20 p-6">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/tracking" element={<FleetTracking />} />
                <Route path="/incidents" element={<Incidents />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </OperationsContext.Provider>
  )
}

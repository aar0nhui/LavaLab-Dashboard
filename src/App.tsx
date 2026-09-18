import { useState } from "react";
import { AuthProvider, useAuth } from "./lib/auth";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import MapPage from "./components/MapPage";
import LoginPage from "./components/LoginPage";

function AppShell() {
  const { session, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeRoute, setActiveRoute] = useState("dashboard");
  const [navState, setNavState] = useState<Record<string, unknown> | null>(null);
  const [mapFocus, setMapFocus] = useState<{ lat: number; lng: number } | null>(null);

  const [unreadCount, setUnreadCount] = useState(0);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f7f7f7" }}>
        <p style={{ fontSize: "0.85rem", color: "#bbb", fontFamily: "var(--font-body)" }}>Loading…</p>
      </div>
    );
  }

  if (!session) return <LoginPage />;

  const handleNavigate = (route: string, state?: Record<string, unknown>) => {
    if (route === "map") {
      const lat = state?.lat as number | undefined;
      const lng = state?.lng as number | undefined;
      setMapFocus((lat != null && isFinite(lat) && lng != null && isFinite(lng))
        ? { lat, lng }
        : null);
    } else {
      setMapFocus(null);
    }
    setActiveRoute(route);
    setNavState(state || null);
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--color-bg)", fontFamily: "var(--font-body)" }}>
      <Sidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        activeRoute={activeRoute}
        onNavigate={handleNavigate}
        unreadCount={unreadCount}
      />
      <main className="flex-1 overflow-y-auto" style={{ background: "var(--color-bg)" }}>
        {activeRoute === "dashboard" && <Dashboard onNavigate={handleNavigate} onUnreadCountChange={setUnreadCount} navState={navState} mode="dashboard" />}
        {activeRoute === "activity-logs" && <Dashboard onNavigate={handleNavigate} navState={navState} mode="activity-logs" />}
        {activeRoute === "map" && <MapPage focusLat={mapFocus?.lat} focusLng={mapFocus?.lng} onNavigate={handleNavigate} />}
        {activeRoute !== "dashboard" && activeRoute !== "activity-logs" && activeRoute !== "map" && (
          <div className="flex items-center justify-center h-full" style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-display)" }}>
            <div className="text-center">
              <p className="text-2xl font-medium capitalize">{activeRoute.replace("-", " ")}</p>
              <p className="text-sm mt-2" style={{ color: "var(--color-text-faint)" }}>Coming soon</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}


import { useState, useEffect, useMemo } from "react";
import Map, { Marker, Popup, Source, Layer } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { supabase } from "../../utils/supabase/client";
import { MOCK_LOGS, type LogEntry, type Activity, isThisMonth } from "../data/logs";
import { FIELDS } from "../data/fields";

const FilterIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M1 2.5H11L7 7.5V11L5 10V7.5L1 2.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const PillXIcon = () => (
  <svg width="8" height="8" viewBox="0 0 12 12" fill="none" style={{ marginTop: "1px", opacity: 0.8 }}>
    <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const _envToken = import.meta.env.VITE_MAPBOX_TOKEN as string;
const MAPBOX_TOKEN = (_envToken && _envToken.startsWith("pk.")) ? _envToken : "pk.eyJ1IjoiYWFyb25odWkiLCJhIjoiY211NHRrZjViMGIydjJ6cHkweGZvbzBsZyJ9.EkKbkaNv8-FZgHQYN3sxiQ";

const ACTIVITY_DOT: Record<Activity, string> = {
  Spraying:   "#6366f1",
  Harvesting: "#f59e0b",
  Planting:   "#22c55e",
  Irrigation: "#3b82f6",
};

const validCoord = (v: number | undefined | null): v is number => v != null && isFinite(v);

export default function MapPage({ 
  focusLat, 
  focusLng,
  onNavigate
}: { 
  focusLat?: number; 
  focusLng?: number;
  onNavigate?: (route: string, state?: Record<string, unknown>) => void;
}) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<LogEntry | null>(null);
  
  const [filterBy, setFilterBy] = useState<"This Month" | "This Week" | "Today" | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    supabase.from("logs").select("*").then(({ data, error }) => {
      if (error || !data || data.length === 0) {
        setLogs(MOCK_LOGS);
        setLoading(false);
        return;
      }
      const parsedLogs = data.map((r: any) => {
        let lat = r.lat != null ? Number(r.lat) : NaN;
        let lng = r.lng != null ? Number(r.lng) : NaN;

        const fieldData = FIELDS[r.field];
        if (fieldData) {
          if (Math.abs(lat - fieldData.center.lat) > 0.0001 || Math.abs(lng - fieldData.center.lng) > 0.0001) {
            console.log(`[map] Auto-healing coordinates for ${r.id} to match ${r.field}`);
            supabase.from("logs").update({ lat: fieldData.center.lat, lng: fieldData.center.lng }).eq("id", r.id).then();
            lat = fieldData.center.lat;
            lng = fieldData.center.lng;
          }
        }

        return {
          id: r.id,
          employeeName: r.employee_name,
          activity: r.activity as Activity,
          date: r.date,
          field: r.field,
          timeStart: r.time_start,
          timeEnd: r.time_end,
          lat,
          lng,
          tags: r.tags ?? [],
          summary: r.summary,
          read: r.read ?? false,
        };
      });
      setLogs(parsedLogs);
      setLoading(false);
    });
  }, []);

  const today = new Date().toISOString().split("T")[0];

  const displayedLogs = useMemo(() => {
    let list = [...logs];
    if (filterBy === "This Month") {
      list = list.filter(l => isThisMonth(l.date));
    } else if (filterBy === "This Week") {
      const aWeekAgo = new Date();
      aWeekAgo.setDate(aWeekAgo.getDate() - 7);
      list = list.filter(l => new Date(l.date) >= aWeekAgo);
    } else if (filterBy === "Today") {
      list = list.filter(l => l.date === today);
    }
    return list;
  }, [logs, filterBy, today]);

  const validLogs = displayedLogs.filter(l => validCoord(l.lat) && validCoord(l.lng));
  
  const defaultLat = validLogs.length > 0 ? validLogs.reduce((acc, l) => acc + l.lat, 0) / validLogs.length : 41.9774;
  const defaultLng = validLogs.length > 0 ? validLogs.reduce((acc, l) => acc + l.lng, 0) / validLogs.length : -93.4475;
  
  const safeLat = validCoord(focusLat) ? focusLat : defaultLat;
  const safeLng = validCoord(focusLng) ? focusLng : defaultLng;
  const hasFocus = validCoord(focusLat) && validCoord(focusLng);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#f7f7f7" }}>

      {/* Header */}
      <div style={{ padding: "28px 36px 16px", flexShrink: 0, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.85rem", fontWeight: 700, color: "#111", letterSpacing: "-0.03em", lineHeight: 1, margin: 0 }}>
            Map
          </h1>
          <p style={{ fontSize: "0.82rem", color: "#999", marginTop: "6px" }}>
            Field activity locations across Bays Ranch
          </p>
        </div>
        
        {/* Filter UI */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          {filterBy && (
            <button
              onClick={() => setFilterBy(null)}
              style={{
                display: "flex", alignItems: "center", gap: "6px",
                fontSize: "0.72rem", padding: "5px 10px", borderRadius: "999px", cursor: "pointer",
                background: "#111", color: "#fff", border: "none", fontWeight: 500, fontFamily: "var(--font-body)",
                marginLeft: "8px"
              }}
            >
              <PillXIcon /> {filterBy}
            </button>
          )}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              style={{
                display: "flex", alignItems: "center", gap: "6px",
                fontSize: "0.72rem", padding: "5px 12px", borderRadius: "999px", cursor: "pointer",
                background: "#fff", color: "#555", border: "1px solid #e5e5e5", fontWeight: 500, fontFamily: "var(--font-body)",
                boxShadow: "0 1px 2px rgba(0,0,0,0.03)"
              }}
            >
              <FilterIcon /> Filter
            </button>
            {filterOpen && (
              <div style={{
                position: "absolute", top: "calc(100% + 4px)", right: 0, zIndex: 20,
                background: "#fff", border: "1px solid #e5e5e5", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                padding: "4px", minWidth: "120px", display: "flex", flexDirection: "column", gap: "2px"
              }}>
                {["This Month", "This Week", "Today"].map(opt => (
                  <button
                    key={opt}
                    onClick={() => { setFilterBy(opt as any); setFilterOpen(false); }}
                    style={{ padding: "6px 8px", textAlign: "left", fontSize: "0.75rem", background: "none", border: "none", borderRadius: "4px", cursor: "pointer", color: "#333" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#f5f5f5")}
                    onMouseLeave={e => (e.currentTarget.style.background = "none")}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div style={{ padding: "0 36px 16px", display: "flex", gap: "20px", flexShrink: 0 }}>
        {(Object.entries(ACTIVITY_DOT) as [Activity, string][]).map(([activity, color]) => (
          <div key={activity} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: color }} />
            <span style={{ fontSize: "0.75rem", color: "#666", fontFamily: "var(--font-body)" }}>{activity}</span>
          </div>
        ))}
      </div>

      {/* Map */}
      <div style={{ flex: 1, margin: "0 36px 36px", borderRadius: "16px", overflow: "hidden", border: "1px solid #e5e5e5", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", position: "relative" }}>
        {loading ? (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "#f9f9f9" }}>
            <span style={{ fontSize: "0.85rem", color: "#bbb", fontFamily: "var(--font-body)" }}>Loading map data...</span>
          </div>
        ) : (
          <Map
            key={`${safeLat},${safeLng}`}
            initialViewState={{ longitude: safeLng, latitude: safeLat, zoom: hasFocus ? 15 : 13 }}
            style={{ width: "100%", height: "100%" }}
            mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
            mapboxAccessToken={MAPBOX_TOKEN}
            onClick={() => setSelected(null)}
          >
            {Object.values(FIELDS).map(field => (
              <Source key={field.id} id={`field-polygon-${field.id}`} type="geojson" data={{
                type: "Feature",
                geometry: { type: "Polygon", coordinates: [field.polygon] },
                properties: {}
              }}>
                <Layer
                  id={`field-layer-${field.id}`}
                  type="fill"
                  paint={{
                    "fill-color": field.color,
                    "fill-opacity": 0.3
                  }}
                />
                <Layer
                  id={`field-layer-line-${field.id}`}
                  type="line"
                  paint={{
                    "line-color": field.color,
                    "line-width": 2
                  }}
                />
              </Source>
            ))}
            {validLogs.map(log => (
              <Marker
                key={log.id}
                longitude={log.lng}
                latitude={log.lat}
                anchor="center"
                onClick={e => { 
                  e.originalEvent.stopPropagation(); 
                  if (onNavigate) {
                    onNavigate("dashboard", { openLogId: log.id });
                  } else {
                    setSelected(log);
                  }
                }}
              >
                <div
                  title={`${log.employeeName} — ${log.activity}`}
                  style={{
                    width: "14px", height: "14px", borderRadius: "50%",
                    background: ACTIVITY_DOT[log.activity],
                    border: "2.5px solid #fff",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                    cursor: "pointer",
                    transition: "transform 0.15s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.4)")}
                  onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                />
              </Marker>
            ))}

            {selected && (
              <Popup
                longitude={selected.lng}
                latitude={selected.lat}
                anchor="bottom"
                offset={14}
                closeButton={false}
                onClose={() => setSelected(null)}
              >
                <div style={{ fontFamily: "var(--font-body)", padding: "4px 2px", minWidth: "180px" }}>
                  <p style={{ fontWeight: 600, fontSize: "0.82rem", color: "#111", margin: "0 0 4px", fontFamily: "var(--font-display)" }}>
                    {selected.employeeName}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: ACTIVITY_DOT[selected.activity], flexShrink: 0 }} />
                    <span style={{ fontSize: "0.75rem", color: "#555" }}>{selected.activity}</span>
                  </div>
                  <p style={{ fontSize: "0.72rem", color: "#888", margin: "0 0 2px" }}>
                    Field {selected.field} · {selected.date}
                  </p>
                  <p style={{ fontSize: "0.72rem", color: "#aaa", margin: 0 }}>
                    {selected.timeStart} – {selected.timeEnd}
                  </p>
                </div>
              </Popup>
            )}
          </Map>
        )}
      </div>
    </div>
  );
}

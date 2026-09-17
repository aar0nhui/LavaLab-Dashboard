import { useState, useEffect } from "react";
import Map, { Marker, Popup } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { supabase } from "../../utils/supabase/client";
import { MOCK_LOGS, type LogEntry, type Activity } from "../data/logs";

const _envToken = import.meta.env.VITE_MAPBOX_TOKEN as string;
const MAPBOX_TOKEN = (_envToken && _envToken.startsWith("pk.")) ? _envToken : "pk.eyJ1IjoiYWFyb25odWkiLCJhIjoiY211NHRrZjViMGIydjJ6cHkweGZvbzBsZyJ9.EkKbkaNv8-FZgHQYN3sxiQ";

const ACTIVITY_DOT: Record<Activity, string> = {
  Spraying:   "#6366f1",
  Harvesting: "#f59e0b",
  Planting:   "#22c55e",
  Irrigation: "#3b82f6",
};

const validCoord = (v: number | undefined): v is number => v != null && isFinite(v);

export default function MapPage({ focusLat, focusLng }: { focusLat?: number; focusLng?: number }) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [selected, setSelected] = useState<LogEntry | null>(null);

  const safeLat = validCoord(focusLat) ? focusLat : 38.896;
  const safeLng = validCoord(focusLng) ? focusLng : -77.039;
  const hasFocus = validCoord(focusLat) && validCoord(focusLng);

  useEffect(() => {
    supabase.from("logs").select("*").then(({ data, error }) => {
      if (error || !data || data.length === 0) {
        setLogs(MOCK_LOGS);
        return;
      }
      setLogs(data.map((r: any) => ({
        id: r.id,
        employeeName: r.employee_name,
        activity: r.activity as Activity,
        date: r.date,
        field: r.field,
        timeStart: r.time_start,
        timeEnd: r.time_end,
        lat: r.lat,
        lng: r.lng,
        tags: r.tags ?? [],
        summary: r.summary,
      })));
    });
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#f7f7f7" }}>

      {/* Header */}
      <div style={{ padding: "28px 36px 16px", flexShrink: 0 }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.85rem", fontWeight: 700, color: "#111", letterSpacing: "-0.03em", lineHeight: 1, margin: 0 }}>
          Map
        </h1>
        <p style={{ fontSize: "0.82rem", color: "#999", marginTop: "6px" }}>
          Field activity locations across Bays Ranch
        </p>
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
      <div style={{ flex: 1, margin: "0 36px 36px", borderRadius: "16px", overflow: "hidden", border: "1px solid #e5e5e5", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <Map
          initialViewState={{ longitude: safeLng, latitude: safeLat, zoom: hasFocus ? 15 : 13 }}
          style={{ width: "100%", height: "100%" }}
          mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
          mapboxAccessToken={MAPBOX_TOKEN}
          onClick={() => setSelected(null)}
        >
          {logs.filter(l => l.lat != null && l.lng != null && isFinite(l.lat) && isFinite(l.lng)).map(log => (
            <Marker
              key={log.id}
              longitude={log.lng}
              latitude={log.lat}
              anchor="center"
              onClick={e => { e.originalEvent.stopPropagation(); setSelected(log); }}
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
      </div>
    </div>
  );
}

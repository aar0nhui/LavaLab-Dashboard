import React, { useState, useMemo, useEffect } from "react";
import { DEMO_NEW_RECORDINGS_COUNT, MOCK_LOGS, formatDate, isThisMonth, type LogEntry, type Activity } from "../data/logs";
import { supabase } from "../../utils/supabase/client";
import { useAuth } from "../lib/auth";
import Map, { Source, Layer } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { FIELDS } from "../data/fields";

const _envToken = import.meta.env.VITE_MAPBOX_TOKEN as string;
const MAPBOX_TOKEN = (_envToken && _envToken.startsWith("pk.")) ? _envToken : "pk.eyJ1IjoiYWFyb25odWkiLCJhIjoiY211NHRrZjViMGIydjJ6cHkweGZvbzBsZyJ9.EkKbkaNv8-FZgHQYN3sxiQ";

// ── Constants ─────────────────────────────────────────────────────────────────

const ACTIVITY_COLORS: Record<Activity, { bg: string; text: string; dot: string }> = {
  Spraying:   { bg: "#f2f2f2", text: "#333", dot: "#666" },
  Harvesting: { bg: "#f2f2f2", text: "#333", dot: "#666" },
  Planting:   { bg: "#f2f2f2", text: "#333", dot: "#666" },
  Irrigation: { bg: "#f2f2f2", text: "#333", dot: "#666" },
};

const FIELD_COLORS: Record<string, string> = {
  A: "#1a1a1a",
  B: "#444",
  C: "#777",
  D: "#aaa",
};

// ── Icons (all const to avoid OXC hoisting issues) ────────────────────────────

const CalendarStatIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <rect x="1" y="2.5" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
    <line x1="1" y1="6" x2="13" y2="6" stroke="currentColor" strokeWidth="1.3"/>
    <line x1="4.5" y1="1" x2="4.5" y2="4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    <line x1="9.5" y1="1" x2="9.5" y2="4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);

const ClipboardIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <rect x="2" y="2" width="10" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M5 2V1.5C5 1.2 5.2 1 5.5 1H8.5C8.8 1 9 1.2 9 1.5V2" stroke="currentColor" strokeWidth="1.3"/>
    <line x1="4.5" y1="6" x2="9.5" y2="6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    <line x1="4.5" y1="8.5" x2="9.5" y2="8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    <line x1="4.5" y1="11" x2="7.5" y2="11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

const PercentIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <circle cx="3.5" cy="3.5" r="2" stroke="currentColor" strokeWidth="1.3"/>
    <circle cx="10.5" cy="10.5" r="2" stroke="currentColor" strokeWidth="1.3"/>
    <line x1="11.5" y1="2.5" x2="2.5" y2="11.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);

const PlayIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M3 2L10 6L3 10V2Z" fill="currentColor"/>
  </svg>
);

const ExpandIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ display: "inline" }}>
    <path d="M1 4V1H4M8 1H11V4M11 8V11H8M4 11H1V8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const XSmallIcon = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ display: "inline" }}>
    <line x1="2" y1="2" x2="8" y2="8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    <line x1="8" y1="2" x2="2" y2="8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);

const SparkleIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <path d="M6.5 1L7.6 5.4L12 6.5L7.6 7.6L6.5 12L5.4 7.6L1 6.5L5.4 5.4L6.5 1Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
  </svg>
);

const BroadcastIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <circle cx="6.5" cy="7.5" r="1.5" fill="currentColor"/>
    <path d="M3.5 10.5C2.3 9.3 1.5 7.7 1.5 6C1.5 4.3 2.3 2.7 3.5 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M9.5 10.5C10.7 9.3 11.5 7.7 11.5 6C11.5 4.3 10.7 2.7 9.5 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M5 8.8C4.4 8.2 4 7.4 4 6.5C4 5.6 4.4 4.8 5 4.2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M8 8.8C8.6 8.2 9 7.4 9 6.5C9 5.6 8.6 4.8 8 4.2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

const SortIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M2.5 4L6 1.5L9.5 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2.5 8L6 10.5L9.5 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="6" y1="2" x2="6" y2="10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

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



// ── StatCard ──────────────────────────────────────────────────────────────────

const StatCard = ({ label, value, icon, newCount, onBadgeClick }: {
  label: string;
  value: string;
  icon: React.ReactNode;
  newCount?: number;
  onBadgeClick?: () => void;
}) => (
  <div
    style={{
      background: "#fff",
      border: "1px solid #e5e5e5",
      borderRadius: "16px",
      padding: "20px",
      boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
      <span style={{ color: "#888", display: "flex", alignItems: "center" }}>{icon}</span>
      <span style={{ fontSize: "0.8rem", fontWeight: 500, color: "#555", fontFamily: "var(--font-body)" }}>
        {label}
      </span>
    </div>
    <div style={{ display: "flex", alignItems: "flex-end", gap: "8px" }}>
      <p style={{ fontFamily: "var(--font-display)", fontSize: "2.4rem", fontWeight: 700, color: "#111", letterSpacing: "-0.04em", lineHeight: 1, margin: 0 }}>
        {value}
      </p>
      {newCount !== undefined && (
        <button
          onClick={onBadgeClick}
          style={{
            fontSize: "0.72rem",
            color: "#aaa",
            fontFamily: "var(--font-body)",
            marginBottom: "4px",
            background: "none",
            border: "none",
            padding: 0,
            cursor: onBadgeClick ? "pointer" : "default",
            textDecoration: onBadgeClick ? "underline" : "none",
            textUnderlineOffset: "2px"
          }}
          onMouseEnter={e => { if (onBadgeClick) (e.currentTarget.style.color = "#888"); }}
          onMouseLeave={e => { if (onBadgeClick) (e.currentTarget.style.color = "#aaa"); }}
        >
          {newCount === 0 ? "all read" : `${newCount} new`}
        </button>
      )}
    </div>
  </div>
);

// ── StaticMap ─────────────────────────────────────────────────────────────────

const StaticMap = ({ field }: { field: string }) => {
  const fieldColor = FIELD_COLORS[field] ?? "#444";
  const shapes: Record<string, string> = {
    A: "M 30,20 L 180,15 L 185,90 L 25,95 Z",
    B: "M 40,30 L 160,25 L 165,100 L 35,105 Z",
    C: "M 20,15 L 190,20 L 185,95 L 25,100 Z",
    D: "M 35,25 L 175,20 L 170,95 L 30,100 Z",
  };
  return (
    <svg width="100%" height="100%" viewBox="0 0 220 140" preserveAspectRatio="xMidYMid slice" style={{ display: "block" }}>
      <defs>
        <pattern id={`grid-${field}`} width="18" height="18" patternUnits="userSpaceOnUse">
          <path d="M 18 0 L 0 0 0 18" fill="none" stroke="#ddd" strokeWidth="0.5"/>
        </pattern>
      </defs>
      <rect width="220" height="140" fill="#f5f5f5"/>
      <rect width="220" height="140" fill={`url(#grid-${field})`}/>
      <path d={shapes[field] ?? shapes.A} fill={fieldColor + "18"} stroke={fieldColor} strokeWidth="1.5"/>
      <circle cx="110" cy="57" r="5" fill={fieldColor} opacity="0.9"/>
      <circle cx="110" cy="57" r="10" fill={fieldColor} opacity="0.15"/>
      <text x="110" y="80" textAnchor="middle" fontSize="9" fill={fieldColor} fontFamily="'JetBrains Mono', monospace" fontWeight="500">
        Field {field}
      </text>
    </svg>
  );
};

// ── ExpandedRow ───────────────────────────────────────────────────────────────


class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return <div style={{ padding: 20, color: "red", background: "#fee" }}>Error: {this.state.error?.message}</div>;
    }
    return this.props.children;
  }
}

const WaveformPlayer = ({ entry }: { entry: LogEntry }) => {
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!entry.audioPath) { console.log("[audio] no audioPath on entry", entry.id); return; }
    console.log("[audio] fetching signed URL for", entry.audioPath);
    supabase.storage.from("recordings").createSignedUrl(entry.audioPath, 3600).then(({ data, error }) => {
      console.log("[audio] signedUrl result:", data?.signedUrl, "error:", error?.message);
      if (data?.signedUrl) setUrl(data.signedUrl);
    });
  }, [entry.audioPath]);

  const waveHeights = Array.from({ length: 60 }, (_, i) => {
    const seed = (entry.id.charCodeAt(i % entry.id.length) + i * 7) % 100;
    return 8 + (seed / 100) * 44;
  });

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || !url) return;
    if (playing) { audio.pause(); setPlaying(false); }
    else { audio.play(); setPlaying(true); }
  };

  const playedBars = Math.round(progress * waveHeights.length);

  return (
    <>
      {url && (
        <audio
          ref={audioRef}
          src={url}
          onTimeUpdate={e => {
            const el = e.currentTarget;
            setProgress(el.duration ? el.currentTime / el.duration : 0);
          }}
          onEnded={() => { setPlaying(false); setProgress(0); }}
        />
      )}
      <div style={{ position: "relative", display: "flex", alignItems: "center", gap: "3px", height: "60px", marginBottom: "20px" }}>
        {/* Middle line */}
        <div style={{ position: "absolute", left: 0, right: 0, top: "50%", height: "1px", background: "#e0e0e0", transform: "translateY(-50%)" }} />
        {waveHeights.map((h, i) => (
          <div key={i} style={{
            position: "relative", zIndex: 1,
            flex: 1, minWidth: "2px", height: `${h}px`, borderRadius: "2px",
            background: i < playedBars ? "#8abf98" : "#cde0d3",
            transition: "background 0.05s"
          }} />
        ))}
      </div>
      <button
        onClick={togglePlay}
        style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
          width: "100%", padding: "10px", borderRadius: "8px", marginBottom: "8px",
          background: "#fff", border: "1px solid #e5e5e5", cursor: url ? "pointer" : "default",
          fontSize: "0.82rem", fontWeight: 500, color: url ? "#333" : "#bbb", fontFamily: "var(--font-body)",
          opacity: url ? 1 : 0.6,
        }}
      >
        <PlayIcon /> {playing ? "Pause Recording" : "Play Recording"}
      </button>
    </>
  );
};

const ExpandedRow = ({
  entry, allTags, newTag, onNewTagChange, onAddTag, onRemoveTag, saving, onExpandMap,
}: {
  entry: LogEntry;
  allTags: string[];
  newTag: string;
  onNewTagChange: (v: string) => void;
  onAddTag: () => void;
  onRemoveTag: (tag: string) => void;
  saving?: boolean;
  onExpandMap: (lat: number, lng: number) => void;
}) => {
  const [addingTag, setAddingTag] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  const initViewState = React.useMemo(() => ({ longitude: entry.lng, latitude: entry.lat, zoom: 14 }), [entry.lng, entry.lat]);

  const fieldData = FIELDS[entry.field];

  const memoizedMap = React.useMemo(() => (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <Map
        initialViewState={initViewState}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
        mapboxAccessToken={MAPBOX_TOKEN}
        scrollZoom={false}
        dragPan={false}
        doubleClickZoom={false}
      >
        {fieldData && (
          <Source id="field-polygon" type="geojson" data={{
            type: "Feature",
            geometry: { type: "Polygon", coordinates: [fieldData.polygon] },
            properties: {}
          }}>
            <Layer
              id="field-layer"
              type="fill"
              paint={{
                "fill-color": fieldData.color,
                "fill-opacity": 0.3
              }}
            />
            <Layer
              id="field-layer-line"
              type="line"
              paint={{
                "line-color": fieldData.color,
                "line-width": 2
              }}
            />
          </Source>
        )}
      </Map>
      {/* Absolute centered marker since the map is static */}
      <div style={{
        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        width: "16px", height: "16px", borderRadius: "50%", background: "#2563eb",
        border: "3px solid #fff", boxShadow: "0 0 0 4px rgba(37,99,235,0.25)",
        pointerEvents: "none"
      }}/>
    </div>
  ), [initViewState, fieldData]);

  return (
    <div style={{ background: "#fff", borderTop: "1px solid #f0f0f0" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: "64px", padding: "32px 40px" }}>

        {/* ── Left: waveform + controls + summary ── */}
        <div style={{ display: "flex", flexDirection: "column" }}>

          <WaveformPlayer entry={entry} />

          {/* Add Tag button / inline input */}
          {!addingTag ? (
            <button
              onClick={() => setAddingTag(true)}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                width: "100%", padding: "10px", borderRadius: "8px", marginBottom: "20px",
                background: "#e8f5e9", border: "1px solid #c8e6c9", cursor: "pointer",
                fontSize: "0.82rem", fontWeight: 500, color: "#2e7d32", fontFamily: "var(--font-body)",
              }}
            >
              <SparkleIcon /> Add Tag
            </button>
          ) : (
            <div style={{ display: "flex", gap: "6px", marginBottom: "20px" }}>
              <input
                autoFocus
                type="text"
                placeholder="Tag name…"
                value={newTag}
                onChange={e => onNewTagChange(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") { onAddTag(); setAddingTag(false); } if (e.key === "Escape") setAddingTag(false); }}
                style={{ flex: 1, fontSize: "0.78rem", padding: "8px 10px", borderRadius: "8px", border: "1px solid #e5e5e5", background: "#fff", color: "#333", outline: "none", fontFamily: "var(--font-body)" }}
              />
              <button onClick={() => { onAddTag(); setAddingTag(false); }} style={{ padding: "8px 14px", borderRadius: "8px", background: "#111", color: "#fff", border: "none", cursor: "pointer", fontSize: "0.78rem", fontWeight: 500 }}>
                Add
              </button>
              <button onClick={() => setAddingTag(false)} style={{ padding: "8px 10px", borderRadius: "8px", background: "#f5f5f5", color: "#555", border: "1px solid #e5e5e5", cursor: "pointer", fontSize: "0.78rem" }}>
                ✕
              </button>
            </div>
          )}

          {/* Existing tags */}
          {allTags.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "20px" }}>
              {allTags.map(tag => (
                <span key={tag} style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "0.7rem", padding: "3px 10px", borderRadius: "999px", background: "#f2f2f2", color: "#555", border: "1px solid #e5e5e5" }}>
                  {tag}
                  <button onClick={() => onRemoveTag(tag)} style={{ opacity: 0.5, background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center" }}>
                    <XSmallIcon />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Summary */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <p style={{ fontSize: "0.88rem", fontWeight: 600, color: "#111", fontFamily: "var(--font-display)", margin: 0 }}>
                Summary
              </p>
              {saving && <span style={{ fontSize: "0.7rem", color: "#aaa", fontFamily: "var(--font-body)" }}>Saving…</span>}
            </div>
            <p style={{ fontSize: "0.8rem", lineHeight: 1.7, color: "#aaa", margin: 0 }}>
              {entry.summary}
            </p>
          </div>
        </div>

        {/* ── Right: satellite map ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ position: "relative", overflow: "hidden", minHeight: "280px", borderRadius: "12px" }}>
            {(entry.lat == null || entry.lng == null || !isFinite(entry.lat) || !isFinite(entry.lng)) ? (
              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f5f5", color: "#bbb", fontSize: "0.8rem", fontFamily: "var(--font-body)", borderRadius: "12px" }}>
                No location data
              </div>
            ) : (
              memoizedMap
            )}
          </div>
          <button
            onClick={() => onExpandMap(entry.lat, entry.lng)}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              width: "100%", padding: "10px", borderRadius: "8px",
              background: "#fff", border: "1px solid #e5e5e5", cursor: "pointer",
              fontSize: "0.82rem", fontWeight: 500, color: "#333", fontFamily: "var(--font-body)",
            }}
          >
            <ExpandIcon /> Expand Map
          </button>
        </div>
      </div>
    </div>
  );
};

import AddLogModal from "./AddLogModal";
import EditLogModal from "./EditLogModal";

// ── Dashboard (default export) ────────────────────────────────────────────────

export default function Dashboard({ onNavigate, onUnreadCountChange, navState, mode = "dashboard" }: { 
  onNavigate: (route: string, state?: Record<string, unknown>) => void;
  onUnreadCountChange?: (count: number) => void;
  navState?: Record<string, unknown> | null;
  mode?: "dashboard" | "activity-logs";
}) {
  const { profile } = useAuth();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [addLogOpen, setAddLogOpen] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [sortBy, setSortBy] = useState<"Date" | "Name" | null>(null);
  const [filterBy, setFilterBy] = useState<"This Month" | "This Week" | "Today" | "Unread" | null>(null);
  const [sortOpen, setSortOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingTag, setSavingTag] = useState<string | null>(null);
  const [viewedInUnread, setViewedInUnread] = useState<Set<string>>(new Set());
  
  const [selectedLogs, setSelectedLogs] = useState<Set<string>>(new Set());
  const [editLogId, setEditLogId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  const allAvailableTags = React.useMemo(() => {
    const tags = new Set<string>();
    logs.forEach(l => (l.tags || []).forEach(t => { if (t) tags.add(t); }));
    return Array.from(tags);
  }, [logs]);

  const matchingTags = searchQuery.trim() ? allAvailableTags.filter(t => t && t.toLowerCase().includes(searchQuery.toLowerCase()) && t.toLowerCase() !== searchQuery.toLowerCase()) : [];

  useEffect(() => {
    if (navState?.openLogId) {
      setExpandedId(navState.openLogId as string);
      
      // Also mark it as read immediately if it's currently unread
      const log = logs.find(l => l.id === navState.openLogId);
      if (log && !log.read) {
        setLogs(prev => prev.map(l => l.id === navState.openLogId ? { ...l, read: true } : l));
        supabase.from("logs").update({ read: true }).eq("id", navState.openLogId).then();
      }
    }
  }, [navState, logs]);
  useEffect(() => {
    if (filterBy !== "Unread") {
      setViewedInUnread(new Set());
    }
  }, [filterBy]);

  useEffect(() => {
    // Wait until profile is loaded before fetching (if auth is active)
    if (profile === undefined) return;

    async function fetchLogs() {
      let query = supabase.from("logs").select("*");
      
      // Role-based filtering: employees only see their own logs
      if (profile?.role === "employee") {
        query = query.eq("employee_name", profile.full_name);
      }

      const { data, error } = await query;

      console.log("[logs] fetch result — data:", data?.length, "error:", error?.message);
      if (error || !data || data.length === 0) {
        if (error) console.error("[logs] fetch error:", error.message);
        else console.warn("[logs] empty result, falling back to mock");
        
        // Filter mock logs as well if falling back
        const mockData = profile?.role === "employee" 
          ? MOCK_LOGS.filter(l => l.employeeName === profile.full_name) 
          : MOCK_LOGS;
        
        setLogs(mockData);
        setLoading(false);
        return;
      }

      const parsedLogs = data.map((r: any) => {
        let lat = r.lat != null ? Number(r.lat) : NaN;
        let lng = r.lng != null ? Number(r.lng) : NaN;
        
        // Auto-heal DB coordinates if they don't match the new field definitions
        const fieldData = FIELDS[r.field];
        if (fieldData) {
          if (Math.abs(lat - fieldData.center.lat) > 0.0001 || Math.abs(lng - fieldData.center.lng) > 0.0001) {
            console.log(`[logs] Auto-healing coordinates for ${r.id} to match ${r.field}`);
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
          audioPath: r.audio_path ?? null,
          read: r.read ?? false,
        };
      });
      
      setLogs(parsedLogs);
      setLoading(false);
    }

    fetchLogs();

    // Set up real-time subscription so backend changes instantly update the frontend
    const channel = supabase
      .channel('logs-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'logs' },
        (payload) => {
          console.log("Real-time change received!", payload);
          fetchLogs(); // Refetch to get the latest data
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile]);

  useEffect(() => {
    if (onUnreadCountChange) {
      onUnreadCountChange(logs.filter(l => !l.read).length);
    }
  }, [logs, onUnreadCountChange]);

  const today = new Date().toISOString().split("T")[0];
  const todayLogs = logs.filter(l => l.date === today);

  const displayed = useMemo(() => {
    let list = [...logs];
    if (filterBy === "Unread") {
      list = list.filter(l => !l.read || viewedInUnread.has(l.id));
    } else if (filterBy === "This Month") {
      list = list.filter(l => isThisMonth(l.date));
    } else if (filterBy === "This Week") {
      const aWeekAgo = new Date();
      aWeekAgo.setDate(aWeekAgo.getDate() - 7);
      list = list.filter(l => new Date(l.date) >= aWeekAgo);
    } else if (filterBy === "Today") {
      list = list.filter(l => l.date === today);
    }

    if (searchQuery.trim()) {
      const sq = searchQuery.toLowerCase();
      list = list.filter(l => (l.tags || []).some(t => t && t.toLowerCase().includes(sq)));
    }

    if (sortBy === "Name") {
      list.sort((a, b) => (a.employeeName || "").localeCompare(b.employeeName || ""));
    } else {
      list.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
    }
    return list;
  }, [sortBy, filterBy, logs, today, viewedInUnread, searchQuery]);

  const updateTagsInDb = async (id: string, newTags: string[]) => {
    setSavingTag(id);
    const { error } = await supabase.from("logs").update({ tags: newTags }).eq("id", id);
    if (error) console.error("Tag update error:", error.message);
    setSavingTag(null);
  };

  const addTag = (id: string) => {
    const trimmed = newTag.trim();
    if (!trimmed) return;
    setLogs(prev => prev.map(l => {
      if (l.id !== id) return l;
      const newTags = [...(l.tags || []), trimmed];
      updateTagsInDb(id, newTags);
      return { ...l, tags: newTags };
    }));
    setNewTag("");
  };

  const removeTag = (id: string, tag: string) => {
    setLogs(prev => prev.map(l => {
      if (l.id !== id) return l;
      const newTags = (l.tags || []).filter(t => t !== tag);
      updateTagsInDb(id, newTags);
      return { ...l, tags: newTags };
    }));
  };

  if (loading) return null;

  return (
    <ErrorBoundary>
      <div style={{ padding: "32px 36px", maxWidth: "1200px", margin: "0 auto" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "28px" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.85rem", fontWeight: 700, color: "#111", letterSpacing: "-0.03em", lineHeight: 1, margin: 0 }}>
            {mode === "activity-logs" ? "Activity Logs" : "Dashboard"}
          </h1>
          <p style={{ fontSize: "0.82rem", color: "#999", marginTop: "6px" }}>
            {mode === "activity-logs" 
              ? (profile?.role === "employee" ? `Viewing all your activity logs` : "A complete log of farm and employee activity")
              : (profile?.role === "employee"
                  ? `Viewing your activity logs, ${profile?.full_name?.split(" ")[0] || ""}`
                  : "An overview of your farm and employee activity")
            }
          </p>
        </div>
        {/* Search bar */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <span style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#bbb", display: "flex", pointerEvents: "none" }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.3"/>
              <line x1="9.5" y1="9.5" x2="12.5" y2="12.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search tags…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              paddingLeft: "30px", paddingRight: "14px", paddingTop: "8px", paddingBottom: "8px",
              fontSize: "0.8rem", borderRadius: "10px", outline: "none",
              border: "1px solid #e5e5e5", background: "#fff", color: "#333",
              width: "200px", fontFamily: "var(--font-body)",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#aaa";
              setSearchFocused(true);
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "#e5e5e5";
              setTimeout(() => setSearchFocused(false), 200);
            }}
          />
          {/* Tag search suggestions */}
          {searchFocused && matchingTags.length > 0 && (
            <div style={{
              position: "absolute", top: "calc(100% + 4px)", left: 0, width: "100%", zIndex: 30,
              background: "#fff", border: "1px solid #e5e5e5", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              padding: "4px", display: "flex", flexDirection: "column", gap: "2px",
              maxHeight: "200px", overflowY: "auto"
            }}>
              {matchingTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => {
                    setSearchQuery(tag);
                    setSearchFocused(false);
                  }}
                  style={{
                    padding: "8px 10px", textAlign: "left", fontSize: "0.75rem", background: "none",
                    border: "none", borderRadius: "4px", cursor: "pointer", color: "#333",
                    display: "flex", alignItems: "center", gap: "6px"
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#f5f5f5")}
                  onMouseLeave={e => (e.currentTarget.style.background = "none")}
                >
                  <SparkleIcon />
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stat Cards (Dashboard only) */}
      {mode === "dashboard" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "16px", marginBottom: "28px" }}>
          <StatCard 
            label="Today's Recordings" 
            value="5" 
            newCount={logs.filter(l => !l.read).length} 
            icon={<CalendarStatIcon />}
            onBadgeClick={() => setFilterBy("Unread")}
          />
          <StatCard label="Active Workers" value="12" icon={<ClipboardIcon />}/>
          <StatCard label="Response Accuracy" value="90" icon={<PercentIcon />}/>
        </div>
      )}

      {/* Table */}
      <div style={{ background: "#fff", border: "1px solid #e5e5e5", borderRadius: "16px", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>

        {/* Table toolbar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px", borderBottom: "1px solid #f0f0f0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ color: "#aaa", display: "flex" }}><BroadcastIcon /></span>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "0.95rem", fontWeight: 600, color: "#111", letterSpacing: "-0.01em", margin: 0 }}>
              {mode === "activity-logs" ? "All Logs" : "New Employee Logs"}
            </h2>
            <span style={{ fontSize: "0.72rem", color: "#aaa", background: "#f5f5f5", borderRadius: "999px", padding: "1px 7px" }}>
              {displayed.length}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            
            {/* Action Buttons (Edit/Delete) */}
            {selectedLogs.size > 0 && (
              <>
                {selectedLogs.size === 1 && (
                  <button
                    onClick={() => setEditLogId(Array.from(selectedLogs)[0])}
                    style={{
                      display: "flex", alignItems: "center", gap: "6px",
                      fontSize: "0.72rem", padding: "5px 12px", borderRadius: "999px", cursor: "pointer",
                      background: "#fff", color: "#111", border: "1px solid #e5e5e5", fontWeight: 500, fontFamily: "var(--font-body)",
                    }}
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={async () => {
                    const ids = Array.from(selectedLogs);
                    const { error } = await supabase.from("logs").delete().in("id", ids);
                    if (!error) {
                      setSelectedLogs(new Set());
                    } else {
                      console.error("Failed to delete logs", error);
                    }
                  }}
                  style={{
                    display: "flex", alignItems: "center", gap: "6px",
                    fontSize: "0.72rem", padding: "5px 12px", borderRadius: "999px", cursor: "pointer",
                    background: "#fee", color: "#ef4444", border: "1px solid #fcc", fontWeight: 500, fontFamily: "var(--font-body)",
                  }}
                >
                  Delete ({selectedLogs.size})
                </button>
              </>
            )}

            {/* Add Log Button */}
            {mode === "activity-logs" && selectedLogs.size === 0 && (
              <button
                onClick={() => setAddLogOpen(true)}
                style={{
                  display: "flex", alignItems: "center", gap: "6px",
                  fontSize: "0.72rem", padding: "5px 12px", borderRadius: "999px", cursor: "pointer",
                  background: "#111", color: "#fff", border: "none", fontWeight: 500, fontFamily: "var(--font-body)",
                }}
              >
                + Add Log
              </button>
            )}

            {/* Sort Group */}
            {sortBy && (
              <button
                onClick={() => setSortBy(null)}
                style={{
                  display: "flex", alignItems: "center", gap: "6px",
                  fontSize: "0.72rem", padding: "5px 10px", borderRadius: "999px", cursor: "pointer",
                  background: "#111", color: "#fff", border: "none", fontWeight: 500, fontFamily: "var(--font-body)",
                }}
              >
                <PillXIcon /> {sortBy}
              </button>
            )}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => { setSortOpen(!sortOpen); setFilterOpen(false); }}
                style={{
                  display: "flex", alignItems: "center", gap: "6px",
                  fontSize: "0.72rem", padding: "5px 12px", borderRadius: "999px", cursor: "pointer",
                  background: "#fff", color: "#555", border: "1px solid #e5e5e5", fontWeight: 500, fontFamily: "var(--font-body)",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.03)"
                }}
              >
                <SortIcon /> Sort
              </button>
              {sortOpen && (
                <div style={{
                  position: "absolute", top: "calc(100% + 4px)", right: 0, zIndex: 20,
                  background: "#fff", border: "1px solid #e5e5e5", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  padding: "4px", minWidth: "120px", display: "flex", flexDirection: "column", gap: "2px"
                }}>
                  {["Date", "Name"].map(opt => (
                    <button
                      key={opt}
                      onClick={() => { setSortBy(opt as "Date" | "Name"); setSortOpen(false); }}
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

            {/* Filter Group */}
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
                onClick={() => { setFilterOpen(!filterOpen); setSortOpen(false); }}
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
                  {["This Month", "This Week", "Today", "Unread"].map(opt => (
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

        {/* Column headers */}
        <div style={{ display: "grid", gridTemplateColumns: "32px 2fr 1.2fr 1.5fr 0.6fr 1.1fr 88px", padding: "10px 24px", background: "#fafafa", borderBottom: "1px solid #f0f0f0", alignItems: "center" }}>
          <input 
            type="checkbox" 
            checked={displayed.length > 0 && selectedLogs.size === displayed.length}
            onChange={e => {
              if (e.target.checked) {
                setSelectedLogs(new Set(displayed.map(l => l.id)));
              } else {
                setSelectedLogs(new Set());
              }
            }}
            style={{ width: "14px", height: "14px", accentColor: "#111", cursor: "pointer" }}
          />
          {["Employee", "Activity", "Date", "Field", "Time", ""].map(h => (
            <span key={h} style={{ fontSize: "0.63rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.09em", color: "#bbb", fontFamily: "var(--font-mono)" }}>
              {h}
            </span>
          ))}
        </div>

        {/* Rows */}
        {loading && (
          <div style={{ padding: "40px 24px", textAlign: "center", color: "#bbb", fontSize: "0.82rem", fontFamily: "var(--font-body)" }}>
            Loading logs…
          </div>
        )}
        {!loading && displayed.length === 0 && (
          <div style={{ padding: "40px 24px", textAlign: "center", color: "#bbb", fontSize: "0.82rem", fontFamily: "var(--font-body)" }}>
            No logs found.
          </div>
        )}
        {!loading && displayed.map((entry, i) => {
          const expanded = expandedId === entry.id;
          const colors = ACTIVITY_COLORS[entry.activity] || { bg: "#f2f2f2", text: "#333", dot: "#666" };
          return (
            <div key={entry.id} style={{ borderBottom: i < displayed.length - 1 ? "1px solid #f5f5f5" : "none" }}>
              <div
                style={{
                  display: "grid", gridTemplateColumns: "32px 2fr 1.2fr 1.5fr 0.6fr 1.1fr 88px",
                  alignItems: "center", padding: "12px 24px",
                  background: expanded ? "#fafafa" : "transparent",
                  transition: "background 0.15s",
                  cursor: "default",
                }}
                onMouseEnter={e => { if (!expanded) (e.currentTarget as HTMLElement).style.background = "#fafafa"; }}
                onMouseLeave={e => { if (!expanded) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                {/* Checkbox */}
                <input 
                  type="checkbox" 
                  checked={selectedLogs.has(entry.id)}
                  onChange={e => {
                    const next = new Set(selectedLogs);
                    if (e.target.checked) next.add(entry.id);
                    else next.delete(entry.id);
                    setSelectedLogs(next);
                  }}
                  style={{ width: "14px", height: "14px", accentColor: "#111", cursor: "pointer" }}
                />
                {/* Name */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#f0f0f0", color: "#666", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", fontWeight: 600, flexShrink: 0, fontFamily: "var(--font-display)" }}>
                    {(entry.employeeName || "?").split(" ").map(n => n[0]).join("")}
                  </div>
                  <span style={{ fontSize: "0.85rem", fontWeight: 500, color: "#111" }}>{entry.employeeName || "Unknown"}</span>
                </div>
                {/* Activity */}
                <span style={{ fontSize: "0.82rem", color: colors.text }}>{entry.activity}</span>
                {/* Date */}
                <span style={{ fontSize: "0.82rem", color: "#666" }}>{formatDate(entry.date)}</span>
                {/* Field */}
                <span style={{ fontSize: "0.8rem", color: "#333", fontWeight: 500 }}>
                  {entry.field}
                </span>
                {/* Time */}
                <span style={{ fontSize: "0.8rem", color: "#555" }}>{entry.timeStart} - {entry.timeEnd}</span>
                {/* View button */}
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button
                    onClick={() => {
                      if (!expanded) {
                        setExpandedId(entry.id);
                        if (!entry.read) {
                          if (filterBy === "Unread") setViewedInUnread(prev => new Set(prev).add(entry.id));
                          setLogs(prev => prev.map(l => l.id === entry.id ? { ...l, read: true } : l));
                          supabase.from("logs").update({ read: true }).eq("id", entry.id).then(({ error }) => {
                            if (error) console.error("Error marking as read", error);
                          });
                        }
                      } else {
                        setExpandedId(null);
                      }
                    }}
                    style={{
                      display: "flex", alignItems: "center", gap: "4px",
                      padding: "5px 12px", fontSize: "0.72rem", fontWeight: 500, borderRadius: "8px", cursor: "pointer",
                      background: expanded ? "#111" : "#f5f5f5",
                      color: expanded ? "#fff" : "#666",
                      border: "1px solid " + (expanded ? "#111" : "#e5e5e5"),
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {expanded ? "Close" : "View"}
                    <span style={{ opacity: 0.6, display: "inline-flex", transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  </button>
                </div>
              </div>

              {expanded && (
                <ErrorBoundary>
                  <ExpandedRow
                    entry={entry}
                    allTags={entry.tags || []}
                    newTag={newTag}
                    onNewTagChange={setNewTag}
                    onAddTag={() => addTag(entry.id)}
                    onRemoveTag={tag => removeTag(entry.id, tag)}
                    saving={savingTag === entry.id}
                    onExpandMap={(lat, lng) => onNavigate("map", { lat, lng })}
                  />
                </ErrorBoundary>
              )}
            </div>
          );
        })}
        </div>
      </div>
      
      {addLogOpen && (
        <AddLogModal 
          onClose={() => setAddLogOpen(false)} 
          onSuccess={() => setAddLogOpen(false)} 
        />
      )}
      
      {editLogId && (
        <EditLogModal
          logToEdit={logs.find(l => l.id === editLogId)!}
          onClose={() => setEditLogId(null)}
          onSuccess={() => {
            setEditLogId(null);
            setSelectedLogs(new Set());
          }}
        />
      )}
    </ErrorBoundary>
  );
}

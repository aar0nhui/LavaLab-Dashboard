// Icons first — OXC requires const declarations before their use in NAV_GROUPS

const IconDashboard = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <rect x="1" y="1" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.3"/>
    <rect x="8.5" y="1" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.3"/>
    <rect x="1" y="8.5" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.3"/>
    <rect x="8.5" y="8.5" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.3"/>
  </svg>
);

const IconActivityLogs = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <line x1="4" y1="3.5" x2="13" y2="3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    <line x1="4" y1="7.5" x2="13" y2="7.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    <line x1="4" y1="11.5" x2="10" y2="11.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    <circle cx="1.8" cy="3.5" r="1" fill="currentColor"/>
    <circle cx="1.8" cy="7.5" r="1" fill="currentColor"/>
    <circle cx="1.8" cy="11.5" r="1" fill="currentColor"/>
  </svg>
);

const IconMap = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <path d="M1.5 4L5.5 2.5L9.5 4.5L13.5 3V12L9.5 13.5L5.5 11.5L1.5 13V4Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
    <line x1="5.5" y1="2.5" x2="5.5" y2="11.5" stroke="currentColor" strokeWidth="1.3"/>
    <line x1="9.5" y1="4.5" x2="9.5" y2="13.5" stroke="currentColor" strokeWidth="1.3"/>
  </svg>
);

const IconAudit = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <path d="M7.5 1.5L13 4V8.5C13 11.3 10.5 13.6 7.5 14.5C4.5 13.6 2 11.3 2 8.5V4L7.5 1.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
    <polyline points="5,7.5 6.5,9 10,5.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconReports = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <path d="M8.5 1.5H3.5C2.7 1.5 2 2.2 2 3V12C2 12.8 2.7 13.5 3.5 13.5H11.5C12.3 13.5 13 12.8 13 12V6L8.5 1.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
    <path d="M8.5 1.5V6H13" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
    <line x1="5" y1="9" x2="10" y2="9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    <line x1="5" y1="11" x2="8" y2="11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

const IconSchedule = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <rect x="1.5" y="2.5" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
    <line x1="1.5" y1="6.5" x2="13.5" y2="6.5" stroke="currentColor" strokeWidth="1.3"/>
    <line x1="5" y1="1" x2="5" y2="4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    <line x1="10" y1="1" x2="10" y2="4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    <rect x="4" y="8.5" width="2.5" height="2.5" rx="0.5" fill="currentColor" opacity="0.6"/>
    <rect x="8.5" y="8.5" width="2.5" height="2.5" rx="0.5" fill="currentColor" opacity="0.6"/>
  </svg>
);

const IconEmployees = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <circle cx="5.5" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M1 13C1 10.5 3 8.5 5.5 8.5C8 8.5 10 10.5 10 13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    <path d="M10.5 5.5C11.9 5.5 13 6.6 13 8C13 9.1 12.3 10 11 10.3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    <path d="M11.5 13C12.5 12.5 14 11.5 14 10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);

const IconPerformance = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <line x1="1.5" y1="13" x2="13.5" y2="13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    <rect x="2" y="9" width="3" height="4" rx="0.5" fill="currentColor" opacity="0.8"/>
    <rect x="6" y="6" width="3" height="7" rx="0.5" fill="currentColor" opacity="0.8"/>
    <rect x="10" y="3" width="3" height="10" rx="0.5" fill="currentColor" opacity="0.8"/>
  </svg>
);

const IconMessages = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <path d="M13 2H2C1.4 2 1 2.4 1 3V9.5C1 10.1 1.4 10.5 2 10.5H4.5V13.5L8 10.5H13C13.6 10.5 14 10.1 14 9.5V3C14 2.4 13.6 2 13 2Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
  </svg>
);

const IconSettings = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <circle cx="7.5" cy="7.5" r="2.2" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M7.5 1.5V3M7.5 12V13.5M1.5 7.5H3M12 7.5H13.5M3.2 3.2L4.3 4.3M10.7 10.7L11.8 11.8M11.8 3.2L10.7 4.3M4.3 10.7L3.2 11.8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);

const IconSupport = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <circle cx="7.5" cy="7.5" r="6" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M5.8 5.8C5.8 4.8 6.5 4 7.5 4C8.5 4 9.2 4.8 9.2 5.8C9.2 7 7.5 7.8 7.5 9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    <circle cx="7.5" cy="11" r="0.8" fill="currentColor"/>
  </svg>
);

const IconSwitchUser = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <circle cx="5.5" cy="4.5" r="2.5" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M1 12.5C1 10.3 3 8.5 5.5 8.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    <path d="M10.5 8L13.5 10.5L10.5 13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="8.5" y1="10.5" x2="13.5" y2="10.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);

const IconLogOut = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <path d="M5.5 2H3C2.4 2 2 2.4 2 3V12C2 12.6 2.4 13 3 13H5.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    <path d="M10 5L13 7.5L10 10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="6" y1="7.5" x2="13" y2="7.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);

const IconInbox = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M1.5 9H4.5L6 11.5H8L9.5 9H12.5M1.5 9V3.5C1.5 3 2 2.5 2.5 2.5H11.5C12 2.5 12.5 3 12.5 3.5V9" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
  </svg>
);

// Nav data — icons must be declared above this

const NAV_GROUPS = [
  {
    label: "Overview",
    items: [
      { id: "dashboard",     label: "Dashboard",     icon: IconDashboard },
      { id: "activity-logs", label: "Activity Logs", icon: IconActivityLogs },
      { id: "map",           label: "Map",           icon: IconMap },
    ],
  },
  {
    label: "Compliance",
    items: [
      { id: "audit-manager", label: "Audit Manager", icon: IconAudit },
      { id: "reports",       label: "Reports",       icon: IconReports },
      { id: "schedule",      label: "Schedule",      icon: IconSchedule },
    ],
  },
  {
    label: "Team Management",
    items: [
      { id: "employees",   label: "Employees",   icon: IconEmployees },
      { id: "performance", label: "Performance", icon: IconPerformance },
      { id: "messages",    label: "Messages",    icon: IconMessages },
    ],
  },
  {
    label: "Other",
    items: [
      { id: "settings", label: "Settings", icon: IconSettings },
      { id: "support",  label: "Support",  icon: IconSupport },
    ],
  },
];

// Sidebar component — imports auth directly so profile state is always fresh
import { useAuth } from "../lib/auth";

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
  activeRoute: string;
  onNavigate: (route: string) => void;
}

export default function Sidebar({ open, onToggle, activeRoute, onNavigate }: SidebarProps) {
  const { profile, user, signOut } = useAuth();

  const displayName = profile?.full_name
    ?? user?.user_metadata?.full_name
    ?? user?.user_metadata?.name
    ?? (user?.email ? user.email.split("@")[0] : "—");

  const displayRole = profile?.role === "admin"
    ? "Admin"
    : profile?.role === "employee"
    ? "Employee"
    : user?.email
    ? "Employee"
    : "—";

  const initials = displayName !== "—"
    ? displayName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "BR";
  return (
    <aside style={{
      width: open ? "220px" : "56px",
      background: "#fff",
      borderRight: "1px solid #ebebeb",
      transition: "width 0.22s cubic-bezier(0.4,0,0.2,1)",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      flexShrink: 0,
      height: "100vh",
    }}>

      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: open ? "14px 16px" : "14px 10px",
        borderBottom: "1px solid #f0f0f0",
        flexShrink: 0,
      }}>
        <div style={{
          width: "34px", height: "34px", borderRadius: "50%",
          background: "#111", color: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "11px", fontWeight: 700, flexShrink: 0,
          fontFamily: "var(--font-display)",
        }}>
          {initials}
        </div>
        {open && (
          <>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "#111", fontFamily: "var(--font-display)", margin: 0, lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {displayName}
              </p>
              <p style={{ fontSize: "0.7rem", color: "#999", margin: 0, lineHeight: 1.3 }}>
                {displayRole}
              </p>
            </div>
            <button
              onClick={onToggle}
              style={{ color: "#ccc", background: "none", border: "none", cursor: "pointer", padding: "2px", display: "flex", flexShrink: 0 }}
              onMouseEnter={e => (e.currentTarget.style.color = "#666")}
              onMouseLeave={e => (e.currentTarget.style.color = "#ccc")}
            >
              <IconInbox />
            </button>
          </>
        )}
      </div>

      <nav style={{
        flex: 1,
        overflowY: "auto",
        overflowX: "hidden",
        padding: "8px 8px",
        scrollbarWidth: "none",
      }}>
        {NAV_GROUPS.map(group => (
          <div key={group.label} style={{ marginBottom: "6px" }}>
            {open && (
              <p style={{
                fontSize: "0.6rem", fontWeight: 600, textTransform: "uppercase",
                letterSpacing: "0.08em", color: "#bbb", fontFamily: "var(--font-mono)",
                padding: "4px 8px 4px", margin: 0,
              }}>
                {group.label}
              </p>
            )}
            {!open && <div style={{ height: "1px", background: "#f0f0f0", margin: "6px 4px" }} />}
            {group.items.map(({ id, label, icon: Icon }) => {
              const active = activeRoute === id;
              return (
                <button
                  key={id}
                  onClick={() => onNavigate(id)}
                  title={!open ? label : undefined}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    gap: "9px",
                    padding: "7px 8px",
                    borderRadius: "6px",
                    marginBottom: "1px",
                    background: active ? "#f5f5f5" : "transparent",
                    color: active ? "#111" : "#888",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                  onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = "#f7f7f7"; (e.currentTarget as HTMLElement).style.color = "#333"; } }}
                  onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#888"; } }}
                >
                  <span style={{ flexShrink: 0, display: "flex", alignItems: "center", width: "16px" }}>
                    <Icon />
                  </span>
                  {open && (
                    <>
                      <span style={{
                        fontSize: "0.82rem",
                        fontWeight: active ? 600 : 400,
                        fontFamily: "var(--font-body)",
                        flex: 1,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}>
                        {label}
                      </span>
                      {active && (
                        <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#4ade80", flexShrink: 0 }} />
                      )}
                    </>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      <div style={{
        borderTop: "1px solid #f0f0f0",
        padding: "8px 8px 12px",
        flexShrink: 0,
      }}>
        {[
          { label: "Switch User", icon: IconSwitchUser, action: signOut },
          { label: "Log Out",     icon: IconLogOut,     action: signOut },
        ].map(({ label, icon: Icon, action }) => (
          <button
            key={label}
            onClick={action}
            title={!open ? label : undefined}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: "9px",
              padding: "7px 8px",
              borderRadius: "6px",
              marginBottom: "1px",
              background: "transparent",
              color: "#666",
              border: "none",
              cursor: "pointer",
              textAlign: "left",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#f7f7f7"; (e.currentTarget as HTMLElement).style.color = "#111"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#666"; }}
          >
            <span style={{ flexShrink: 0, display: "flex", alignItems: "center", width: "16px" }}>
              <Icon />
            </span>
            {open && (
              <span style={{ fontSize: "0.82rem", fontWeight: 500, fontFamily: "var(--font-body)" }}>
                {label}
              </span>
            )}
          </button>
        ))}

        {/* Collapse/expand toggle — always visible */}
        <div style={{ borderTop: "1px solid #f0f0f0", marginTop: "4px", paddingTop: "8px" }}>
          <button
            onClick={onToggle}
            title={open ? "Collapse sidebar" : "Expand sidebar"}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: open ? "flex-end" : "center",
              padding: "6px 8px",
              borderRadius: "6px",
              background: "transparent",
              color: "#bbb",
              border: "none",
              cursor: "pointer",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#f7f7f7"; (e.currentTarget as HTMLElement).style.color = "#555"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#bbb"; }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ transform: open ? "none" : "rotate(180deg)", transition: "transform 0.22s" }}>
              <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {open && (
              <span style={{ fontSize: "0.72rem", color: "#bbb", marginLeft: "4px", fontFamily: "var(--font-body)" }}>Collapse</span>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}


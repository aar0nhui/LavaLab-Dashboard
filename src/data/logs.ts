export type Activity = "Spraying" | "Harvesting" | "Planting" | "Irrigation";
export type Field = "A" | "B" | "C" | "D";

export interface LogEntry {
  id: string;
  employeeName: string;
  activity: Activity;
  date: string; // ISO string
  field: Field;
  timeStart: string;
  timeEnd: string;
  lat: number;
  lng: number;
  tags: string[];
  summary: string;
  audioPath?: string;
  read?: boolean;
}

export const MOCK_LOGS: LogEntry[] = [
  {
    id: "log-001",
    employeeName: "Isaac Wang",
    activity: "Spraying",
    date: "2026-04-19",
    field: "FIELD A",
    timeStart: "6:00 AM",
    timeEnd: "10:40 AM",
    lat: 41.9774,
    lng: -93.4475,
    tags: ["herbicide", "pre-emergent"],
    summary:
      "Offline guided voice log created at 2026-04-08T22:01:01.711Z. Question (activity_type): What type of activity was this — spraying, fertilizing, planting, irrigating, harvesting, scouting, pruning, soil work, or equipment maintenance? Answer: I'm leaving first, I'm going to go home. Question (field_block): Where were you working (field, block, or area)? Answer: yes, in one part and then 130 and 200 yes, and 130 for uh 160 and no, this yes no, no, uhm no no I remember, uhm uhm uhm, no, I don't remember anything.",
    audioPath: "farmer1.mp3",
    read: false,
  },
  {
    id: "log-002",
    employeeName: "Maya Patel",
    activity: "Harvesting",
    date: "2026-04-20",
    field: "FIELD B",
    timeStart: "7:30 AM",
    timeEnd: "11:15 AM",
    lat: 41.9774,
    lng: -93.4540,
    tags: ["soybeans", "combine"],
    summary:
      "Soybean harvest completed across the full northern portion of Field B. Moisture readings averaged 12.8%. No mechanical issues encountered. Yield estimated at 52 bu/acre pending final weigh-in.",
    audioPath: "farmer2.mp3",
    read: true,
  },
  {
    id: "log-003",
    employeeName: "Liam Johnson",
    activity: "Planting",
    date: "2026-04-21",
    field: "FIELD C",
    timeStart: "8:00 AM",
    timeEnd: "12:00 PM",
    lat: 41.9730,
    lng: -93.4475,
    tags: ["cover-crop", "rye"],
    summary:
      "Cover crop seeding completed on Field C using winter rye at 1.2 bu/acre. Seed-to-soil contact was good following recent tillage. Irrigation scheduled for the following morning.",
    audioPath: "farmer3.mp3",
    read: true,
  },
  {
    id: "log-004",
    employeeName: "Sophia Lee",
    activity: "Irrigation",
    date: "2026-04-22",
    field: "FIELD D",
    timeStart: "6:30 AM",
    timeEnd: "9:30 AM",
    lat: 41.9730,
    lng: -93.4540,
    tags: ["drip-irrigation", "corn"],
    summary:
      "Drip irrigation cycle run on Field D corn block. System pressure held steady at 18 PSI. Flow meters showed 0.6 in applied. One emitter replaced near the southwest corner.",
    audioPath: "farmer4.mp3",
    read: true,
  },
  {
    id: "log-005",
    employeeName: "Isaac Wang",
    activity: "Spraying",
    date: "2026-09-13",
    field: "FIELD B",
    timeStart: "6:45 AM",
    timeEnd: "8:30 AM",
    lat: 41.9774,
    lng: -93.4540,
    tags: ["fungicide"],
    summary:
      "Preventive fungicide application to Field B wheat. Canopy was fully wet from morning dew; delayed start by 45 min. Full coverage achieved at recommended rate of 8 oz/acre.",
    audioPath: "farmer1.mp3",
    read: true,
  },
  {
    id: "log-006",
    employeeName: "Liam Johnson",
    activity: "Planting",
    date: "2026-09-12",
    field: "FIELD A",
    timeStart: "7:30 AM",
    timeEnd: "1:00 PM",
    lat: 41.9774,
    lng: -93.4475,
    tags: ["wheat", "fall-seeding"],
    summary:
      "Winter wheat seeded at 1.8 bu/acre on Field A. Seed treated with fungicide. Planter calibration checked prior to run — row spacing 7.5 in. Soil temperature logged at 61°F.",
    audioPath: "farmer3.mp3",
    read: true,
  },
  {
    id: "log-007",
    employeeName: "Maya Patel",
    activity: "Harvesting",
    date: "2026-09-11",
    field: "FIELD D",
    timeStart: "9:00 AM",
    timeEnd: "4:00 PM",
    lat: 41.9730,
    lng: -93.4540,
    tags: ["corn", "silage"],
    summary:
      "Corn silage harvest completed on Field D. Chop length set to ¾ in. Kernel processor engaged throughout. Forage test sample collected and sent to lab. Clamp covered by end of day.",
    audioPath: "farmer2.mp3",
    read: true,
  },
  {
    id: "log-008",
    employeeName: "Sophia Lee",
    activity: "Irrigation",
    date: "2026-09-10",
    field: "FIELD C",
    timeStart: "4:30 AM",
    timeEnd: "6:45 AM",
    lat: 41.9730,
    lng: -93.4475,
    tags: ["overhead", "pivot"],
    summary:
      "Center pivot run completed on Field C. 0.5 in applied uniformly. Pivot speed set to 45% for desired application rate. No leaks or alignment issues observed during post-run inspection.",
    audioPath: "farmer4.mp3",
    read: true,
  },
];

export function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export function isThisMonth(iso: string): boolean {
  const d = new Date(iso + "T00:00:00");
  const now = new Date();
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}

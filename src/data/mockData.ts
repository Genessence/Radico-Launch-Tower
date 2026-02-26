export const STAGE_NAMES = [
  "Brand Approval",
  "R&D / Blend Development",
  "Packaging",
  "Regulatory",
  "Manufacturing",
  "Marketing",
  "Launch",
] as const;

export type StageName = typeof STAGE_NAMES[number];

export interface Stage {
  name: StageName;
  plannedStart: string;
  plannedEnd: string;
  actualStart: string | null;
  actualEnd: string | null;
  status: "Pending" | "In Progress" | "Completed" | "Delayed";
  owner: string;
  delay: number;
  notes: string;
  attachments: string[];
}

export interface Brand {
  id: string;
  name: string;
  category: "Whisky" | "Vodka" | "Gin" | "Brandy" | "Rum";
  stages: Stage[];
  overallStatus: string;
  launchDate: string;
}

export const OWNERS = ["John Doe", "Jane Smith", "Radico Team Lead", "Radico Plant Ops", "Amit Verma"];
export const CATEGORIES = ["Whisky", "Vodka", "Gin", "Brandy", "Rum"] as const;

export const mockERPData = {
  Manufacturing: {
    actualStart: "2025-01-10",
    actualEnd: "2025-01-22",
    owner: "Radico Plant Ops",
    notes: "Data synced from ERP (mock)",
  },
};

function makeStage(name: StageName, ps: string, pe: string, as_: string | null, ae: string | null, status: Stage["status"], owner: string, notes = ""): Stage {
  const delay = as_ && ae && status !== "Pending" ? Math.max(0, Math.ceil((new Date(ae).getTime() - new Date(pe).getTime()) / 86400000)) : 0;
  return { name, plannedStart: ps, plannedEnd: pe, actualStart: as_, actualEnd: ae, status, owner, delay, notes, attachments: [] };
}

export const initialBrands: Brand[] = [
  {
    id: crypto.randomUUID(),
    name: "New Rampur Whisky Variant",
    category: "Whisky",
    launchDate: "2025-06-01",
    overallStatus: "Delayed",
    stages: [
      makeStage("Brand Approval", "2024-08-01", "2024-08-15", "2024-08-01", "2024-08-14", "Completed", "John Doe"),
      makeStage("R&D / Blend Development", "2024-08-16", "2024-09-30", "2024-08-16", "2024-10-10", "Delayed", "Jane Smith", "Blend took longer than expected"),
      makeStage("Packaging", "2024-10-01", "2024-10-31", "2024-10-12", null, "In Progress", "Amit Verma"),
      makeStage("Regulatory", "2024-11-01", "2024-11-30", null, null, "Pending", "Radico Team Lead"),
      makeStage("Manufacturing", "2024-12-01", "2025-01-15", null, null, "Pending", "Radico Plant Ops"),
      makeStage("Marketing", "2025-01-16", "2025-03-31", null, null, "Pending", "John Doe"),
      makeStage("Launch", "2025-04-01", "2025-06-01", null, null, "Pending", "Jane Smith"),
    ],
  },
  {
    id: crypto.randomUUID(),
    name: "Magic Moments Berry",
    category: "Vodka",
    launchDate: "2024-12-01",
    overallStatus: "Completed",
    stages: [
      makeStage("Brand Approval", "2024-03-01", "2024-03-15", "2024-03-01", "2024-03-14", "Completed", "John Doe"),
      makeStage("R&D / Blend Development", "2024-03-16", "2024-04-30", "2024-03-16", "2024-04-28", "Completed", "Jane Smith"),
      makeStage("Packaging", "2024-05-01", "2024-05-31", "2024-05-01", "2024-05-30", "Completed", "Amit Verma"),
      makeStage("Regulatory", "2024-06-01", "2024-06-30", "2024-06-01", "2024-06-28", "Completed", "Radico Team Lead"),
      makeStage("Manufacturing", "2024-07-01", "2024-08-15", "2024-07-01", "2024-08-14", "Completed", "Radico Plant Ops"),
      makeStage("Marketing", "2024-08-16", "2024-10-31", "2024-08-16", "2024-10-30", "Completed", "John Doe"),
      makeStage("Launch", "2024-11-01", "2024-12-01", "2024-11-01", "2024-12-01", "Completed", "Jane Smith"),
    ],
  },
  {
    id: crypto.randomUUID(),
    name: "Jaisalmer Gin Reserve",
    category: "Gin",
    launchDate: "2025-09-01",
    overallStatus: "In Progress",
    stages: [
      makeStage("Brand Approval", "2024-10-01", "2024-10-15", "2024-10-01", "2024-10-14", "Completed", "John Doe"),
      makeStage("R&D / Blend Development", "2024-10-16", "2024-12-15", "2024-10-16", null, "In Progress", "Jane Smith", "Botanical sourcing ongoing"),
      makeStage("Packaging", "2024-12-16", "2025-01-31", null, null, "Pending", "Amit Verma"),
      makeStage("Regulatory", "2025-02-01", "2025-03-15", null, null, "Pending", "Radico Team Lead"),
      makeStage("Manufacturing", "2025-03-16", "2025-05-15", null, null, "Pending", "Radico Plant Ops"),
      makeStage("Marketing", "2025-05-16", "2025-07-31", null, null, "Pending", "John Doe"),
      makeStage("Launch", "2025-08-01", "2025-09-01", null, null, "Pending", "Jane Smith"),
    ],
  },
  {
    id: crypto.randomUUID(),
    name: "Morpheus XO Brandy",
    category: "Brandy",
    launchDate: "2025-12-01",
    overallStatus: "Pending",
    stages: [
      makeStage("Brand Approval", "2025-02-01", "2025-02-15", null, null, "Pending", "John Doe"),
      makeStage("R&D / Blend Development", "2025-02-16", "2025-04-30", null, null, "Pending", "Jane Smith"),
      makeStage("Packaging", "2025-05-01", "2025-06-15", null, null, "Pending", "Amit Verma"),
      makeStage("Regulatory", "2025-06-16", "2025-07-31", null, null, "Pending", "Radico Team Lead"),
      makeStage("Manufacturing", "2025-08-01", "2025-09-15", null, null, "Pending", "Radico Plant Ops"),
      makeStage("Marketing", "2025-09-16", "2025-11-15", null, null, "Pending", "John Doe"),
      makeStage("Launch", "2025-11-16", "2025-12-01", null, null, "Pending", "Jane Smith"),
    ],
  },
  {
    id: crypto.randomUUID(),
    name: "8PM Premium Rum",
    category: "Rum",
    launchDate: "2025-07-01",
    overallStatus: "In Progress",
    stages: [
      makeStage("Brand Approval", "2024-09-01", "2024-09-15", "2024-09-01", "2024-09-14", "Completed", "Amit Verma"),
      makeStage("R&D / Blend Development", "2024-09-16", "2024-11-15", "2024-09-16", "2024-11-20", "Delayed", "Jane Smith", "Recipe refinement needed extra time"),
      makeStage("Packaging", "2024-11-16", "2025-01-15", "2024-11-22", null, "In Progress", "Amit Verma"),
      makeStage("Regulatory", "2025-01-16", "2025-02-28", null, null, "Pending", "Radico Team Lead"),
      makeStage("Manufacturing", "2025-03-01", "2025-04-15", null, null, "Pending", "Radico Plant Ops"),
      makeStage("Marketing", "2025-04-16", "2025-06-15", null, null, "Pending", "John Doe"),
      makeStage("Launch", "2025-06-16", "2025-07-01", null, null, "Pending", "Jane Smith"),
    ],
  },
];

import { useState, useRef, useCallback } from "react";

// ─── DIVISIONS DATA ───────────────────────────────────────────────────────────
const DIVISIONS = [
  { id: "permits", code: "00", label: "Permits & Fees", icon: "📋", items: [
    { id: "building_permit", label: "Building Permit", unit: "$/sqft", rate: 1.20 },
    { id: "demolition_permit", label: "Demolition Permit", unit: "lump sum", rate: 850 },
    { id: "electrical_permit", label: "Electrical Permit", unit: "lump sum", rate: 450 },
    { id: "plumbing_permit", label: "Plumbing Permit", unit: "lump sum", rate: 350 },
    { id: "mechanical_permit", label: "Mechanical Permit", unit: "lump sum", rate: 300 },
    { id: "fire_permit", label: "Fire Suppression Permit", unit: "lump sum", rate: 400 },
    { id: "development_permit", label: "Development Permit", unit: "lump sum", rate: 2500 },
    { id: "occupancy_permit", label: "Occupancy Permit", unit: "lump sum", rate: 600 },
    { id: "road_closure", label: "Road Closure Permit", unit: "$/day", rate: 120 },
    { id: "hoarding_permit", label: "Hoarding/Scaffold Permit", unit: "lump sum", rate: 250 },
  ]},
  { id: "civil", code: "02", label: "Civil & Site Work", icon: "🏗️", items: [
    { id: "survey", label: "Topographic Survey", unit: "lump sum", rate: 3500 },
    { id: "geotechnical", label: "Geotechnical Investigation", unit: "lump sum", rate: 8000 },
    { id: "demo_clearing", label: "Site Clearing & Grubbing", unit: "$/acre", rate: 4500 },
    { id: "demolition", label: "Demolition (existing structure)", unit: "$/sqft", rate: 8.50 },
    { id: "excavation", label: "Mass Excavation", unit: "$/CY", rate: 18 },
    { id: "trench_excavation", label: "Trench Excavation", unit: "$/LF", rate: 22 },
    { id: "backfill", label: "Structural Backfill", unit: "$/CY", rate: 28 },
    { id: "grading", label: "Rough Grading", unit: "$/CY", rate: 12 },
    { id: "fine_grading", label: "Fine Grading", unit: "$/sqft", rate: 0.85 },
    { id: "asphalt", label: "Asphalt Paving", unit: "$/sqft", rate: 3.80 },
    { id: "concrete_paving", label: "Concrete Paving", unit: "$/sqft", rate: 7.50 },
    { id: "curb_gutter", label: "Curb & Gutter", unit: "$/LF", rate: 32 },
    { id: "sidewalk", label: "Sidewalk", unit: "$/sqft", rate: 8.50 },
    { id: "storm_sewer", label: "Storm Sewer (12\" pipe)", unit: "$/LF", rate: 65 },
    { id: "sanitary_sewer", label: "Sanitary Sewer (6\" pipe)", unit: "$/LF", rate: 48 },
    { id: "watermain", label: "Watermain (4\" pipe)", unit: "$/LF", rate: 42 },
    { id: "catch_basin", label: "Catch Basin", unit: "$/EA", rate: 2200 },
    { id: "manhole", label: "Manhole", unit: "$/EA", rate: 3800 },
    { id: "retaining_wall", label: "Retaining Wall (concrete)", unit: "$/sqft face", rate: 45 },
    { id: "landscaping", label: "Landscaping & Seeding", unit: "$/sqft", rate: 2.20 },
    { id: "erosion_control", label: "Erosion & Sediment Control", unit: "lump sum", rate: 4500 },
    { id: "site_fencing", label: "Temporary Site Fencing", unit: "$/LF", rate: 12 },
  ]},
  { id: "concrete", code: "03", label: "Concrete", icon: "🧱", items: [
    { id: "footing_concrete", label: "Strip Footing Concrete", unit: "$/CY", rate: 185 },
    { id: "pad_footing", label: "Pad Footing", unit: "$/CY", rate: 210 },
    { id: "slab_on_grade", label: "Slab on Grade (4\")", unit: "$/sqft", rate: 7.20 },
    { id: "structural_slab", label: "Structural Slab (elevated)", unit: "$/sqft", rate: 14.50 },
    { id: "foundation_wall", label: "Foundation Wall", unit: "$/sqft", rate: 18.50 },
    { id: "shearwall_concrete", label: "Shear Wall (concrete)", unit: "$/sqft", rate: 22 },
    { id: "columns_concrete", label: "Concrete Columns", unit: "$/LF", rate: 85 },
    { id: "beams_concrete", label: "Concrete Beams", unit: "$/LF", rate: 95 },
    { id: "stairs_concrete", label: "Concrete Stairs", unit: "$/flight", rate: 3200 },
    { id: "rebar", label: "Reinforcing Steel (rebar)", unit: "$/ton", rate: 1850 },
    { id: "waterproofing", label: "Below-Grade Waterproofing", unit: "$/sqft", rate: 6.50 },
    { id: "drainage_board", label: "Drainage Board & Filter Fabric", unit: "$/sqft", rate: 3.20 },
  ]},
  { id: "masonry", code: "04", label: "Masonry", icon: "🏠", items: [
    { id: "cmu_block", label: "CMU Block (8\")", unit: "$/sqft", rate: 14.50 },
    { id: "brick_veneer", label: "Brick Veneer", unit: "$/sqft", rate: 22 },
    { id: "stone_veneer", label: "Stone Veneer", unit: "$/sqft", rate: 35 },
    { id: "grout_fill", label: "Grout Fill (CMU cores)", unit: "$/sqft", rate: 3.80 },
    { id: "masonry_lintels", label: "Steel Lintels", unit: "$/LF", rate: 28 },
  ]},
  { id: "metals", code: "05", label: "Structural Steel & Metals", icon: "⚙️", items: [
    { id: "structural_steel", label: "Structural Steel (supply & erect)", unit: "$/ton", rate: 4200 },
    { id: "steel_deck", label: "Steel Deck (composite)", unit: "$/sqft", rate: 4.80 },
    { id: "steel_joists", label: "Open Web Steel Joists", unit: "$/sqft", rate: 5.20 },
    { id: "steel_columns", label: "Steel Columns (HP section)", unit: "$/LF", rate: 145 },
    { id: "steel_beams", label: "Steel Beams (W-shape)", unit: "$/LF", rate: 120 },
    { id: "misc_metals", label: "Miscellaneous Metals", unit: "$/ton", rate: 5500 },
    { id: "stairs_steel", label: "Steel Stairs", unit: "$/flight", rate: 4500 },
    { id: "guardrails", label: "Guardrails & Handrails", unit: "$/LF", rate: 85 },
  ]},
  { id: "wood", code: "06", label: "Wood Framing & Millwork", icon: "🪵", items: [
    { id: "rough_framing", label: "Rough Framing (wood)", unit: "$/sqft", rate: 12.50 },
    { id: "engineered_lumber", label: "Engineered Lumber (LVL/LSL)", unit: "$/LF", rate: 18 },
    { id: "wood_trusses", label: "Roof Trusses", unit: "$/sqft", rate: 8.20 },
    { id: "floor_trusses", label: "Floor Trusses", unit: "$/sqft", rate: 9.50 },
    { id: "sheathing_wall", label: "Wall Sheathing (OSB 7/16\")", unit: "$/sqft", rate: 1.85 },
    { id: "sheathing_roof", label: "Roof Sheathing (OSB 5/8\")", unit: "$/sqft", rate: 2.20 },
    { id: "sub_floor", label: "Subfloor (3/4\" T&G)", unit: "$/sqft", rate: 2.80 },
    { id: "interior_millwork", label: "Interior Millwork & Trim", unit: "$/LF", rate: 8.50 },
    { id: "cabinets", label: "Cabinets (supply & install)", unit: "$/LF run", rate: 285 },
    { id: "countertops", label: "Countertops (quartz)", unit: "$/sqft", rate: 68 },
  ]},
  { id: "thermal", code: "07", label: "Thermal & Moisture Protection", icon: "🌡️", items: [
    { id: "batt_insulation", label: "Batt Insulation (R-20 walls)", unit: "$/sqft", rate: 1.45 },
    { id: "spray_foam", label: "Spray Foam Insulation", unit: "$/sqft", rate: 3.80 },
    { id: "rigid_insulation", label: "Rigid Insulation (exterior)", unit: "$/sqft", rate: 2.20 },
    { id: "vapour_barrier", label: "Vapour Barrier (6 mil poly)", unit: "$/sqft", rate: 0.65 },
    { id: "house_wrap", label: "House Wrap / WRB", unit: "$/sqft", rate: 0.85 },
    { id: "roofing_shingles", label: "Asphalt Shingles", unit: "$/sqft", rate: 3.20 },
    { id: "torch_on", label: "Modified Bitumen (torch-on)", unit: "$/sqft", rate: 7.80 },
    { id: "tpo_membrane", label: "TPO Membrane Roofing", unit: "$/sqft", rate: 8.50 },
    { id: "metal_roofing", label: "Standing Seam Metal Roofing", unit: "$/sqft", rate: 14.50 },
    { id: "flashing", label: "Sheet Metal Flashing", unit: "$/LF", rate: 18 },
    { id: "cladding_hardie", label: "Fibre Cement Cladding", unit: "$/sqft", rate: 8.50 },
    { id: "cladding_vinyl", label: "Vinyl Siding", unit: "$/sqft", rate: 5.20 },
    { id: "cladding_wood", label: "Wood Siding", unit: "$/sqft", rate: 9.80 },
    { id: "cladding_metal", label: "Metal Panel Cladding", unit: "$/sqft", rate: 18.50 },
    { id: "stucco", label: "Exterior Stucco (3-coat)", unit: "$/sqft", rate: 12.50 },
    { id: "caulking", label: "Caulking & Sealants", unit: "$/LF", rate: 3.50 },
  ]},
  { id: "openings", code: "08", label: "Openings (Doors, Windows, Glazing)", icon: "🪟", items: [
    { id: "ext_doors", label: "Exterior Doors (hollow metal)", unit: "$/EA", rate: 850 },
    { id: "int_doors", label: "Interior Doors (hollow core)", unit: "$/EA", rate: 320 },
    { id: "overhead_doors", label: "Overhead Doors", unit: "$/EA", rate: 2200 },
    { id: "windows_vinyl", label: "Windows (vinyl)", unit: "$/sqft opening", rate: 45 },
    { id: "windows_aluminum", label: "Windows (aluminum)", unit: "$/sqft opening", rate: 85 },
    { id: "storefront", label: "Aluminum Storefront", unit: "$/sqft opening", rate: 120 },
    { id: "curtain_wall", label: "Curtain Wall System", unit: "$/sqft", rate: 185 },
    { id: "sliding_doors", label: "Sliding/Patio Doors", unit: "$/EA", rate: 1800 },
    { id: "door_hardware", label: "Door Hardware (per leaf)", unit: "$/EA", rate: 380 },
    { id: "automatic_doors", label: "Automatic Door Operator", unit: "$/EA", rate: 3200 },
    { id: "glass_railing", label: "Glass Railing System", unit: "$/LF", rate: 285 },
    { id: "skylight", label: "Skylights", unit: "$/EA", rate: 2800 },
  ]},
  { id: "finishes", code: "09", label: "Finishes", icon: "🎨", items: [
    { id: "drywall", label: "Drywall (5/8\" supply & install)", unit: "$/sqft", rate: 3.20 },
    { id: "drywall_taping", label: "Drywall Taping & Finishing", unit: "$/sqft", rate: 1.80 },
    { id: "tile_floor", label: "Tile Flooring (supply & install)", unit: "$/sqft", rate: 14.50 },
    { id: "tile_wall", label: "Tile (wall)", unit: "$/sqft", rate: 16.50 },
    { id: "hardwood", label: "Hardwood Flooring", unit: "$/sqft", rate: 12.80 },
    { id: "laminate", label: "Laminate Flooring", unit: "$/sqft", rate: 5.80 },
    { id: "carpet", label: "Carpet (supply & install)", unit: "$/sqft", rate: 4.50 },
    { id: "lvp", label: "LVP Flooring", unit: "$/sqft", rate: 6.50 },
    { id: "epoxy_floor", label: "Epoxy Floor Coating", unit: "$/sqft", rate: 8.50 },
    { id: "acoustic_ceiling", label: "Acoustic Tile Ceiling (T-bar)", unit: "$/sqft", rate: 4.80 },
    { id: "gypsum_ceiling", label: "Drywall Ceiling (flat)", unit: "$/sqft", rate: 5.20 },
    { id: "painting_int", label: "Interior Painting", unit: "$/sqft", rate: 2.20 },
    { id: "painting_ext", label: "Exterior Painting", unit: "$/sqft", rate: 3.50 },
    { id: "gypcrete", label: "Gypcrete (1.5\" topping)", unit: "$/sqft", rate: 3.80 },
  ]},
  { id: "specialties", code: "10", label: "Specialties", icon: "🚪", items: [
    { id: "fire_ext", label: "Fire Extinguisher Cabinets", unit: "$/EA", rate: 380 },
    { id: "signs", label: "Signage & Wayfinding", unit: "lump sum", rate: 2500 },
    { id: "toilet_partitions", label: "Toilet Partitions", unit: "$/stall", rate: 950 },
    { id: "lockers", label: "Lockers", unit: "$/EA", rate: 280 },
    { id: "bike_racks", label: "Bike Racks", unit: "$/EA", rate: 180 },
    { id: "mailboxes", label: "Mailbox Units", unit: "$/EA", rate: 220 },
    { id: "access_control", label: "Access Control System", unit: "lump sum", rate: 8500 },
  ]},
  { id: "equipment", code: "11", label: "Equipment & Appliances", icon: "🏢", items: [
    { id: "elevator", label: "Elevator (2-stop hydraulic)", unit: "$/EA", rate: 45000 },
    { id: "elevator_3", label: "Elevator (3+ stop traction)", unit: "$/EA", rate: 85000 },
    { id: "appliances", label: "Residential Appliance Package", unit: "$/unit", rate: 3200 },
    { id: "commercial_kitchen", label: "Commercial Kitchen Equipment", unit: "lump sum", rate: 35000 },
    { id: "laundry", label: "Common Laundry Equipment", unit: "$/EA", rate: 1800 },
  ]},
  { id: "plumbing", code: "15", label: "Plumbing & Mechanical", icon: "🔧", items: [
    { id: "domestic_water", label: "Domestic Water Supply", unit: "$/fixture", rate: 1200 },
    { id: "drain_waste", label: "Drain, Waste & Vent", unit: "$/fixture", rate: 950 },
    { id: "water_heater", label: "Hot Water Heater (tank)", unit: "$/EA", rate: 1800 },
    { id: "tankless_water", label: "Tankless Water Heater", unit: "$/EA", rate: 2800 },
    { id: "boiler", label: "Boiler System", unit: "lump sum", rate: 18000 },
    { id: "hydronic_heat", label: "Hydronic In-Floor Heat", unit: "$/sqft", rate: 8.50 },
    { id: "gas_piping", label: "Gas Piping Distribution", unit: "$/LF", rate: 22 },
    { id: "backflow", label: "Backflow Preventer", unit: "$/EA", rate: 850 },
    { id: "sump_pump", label: "Sump Pump", unit: "$/EA", rate: 1200 },
    { id: "grease_trap", label: "Grease Trap / Interceptor", unit: "$/EA", rate: 3500 },
    { id: "site_service", label: "Site Service (water & sewer tie-in)", unit: "lump sum", rate: 8500 },
  ]},
  { id: "hvac", code: "15H", label: "HVAC", icon: "💨", items: [
    { id: "hvac_residential", label: "HVAC System (residential split)", unit: "$/unit", rate: 4800 },
    { id: "hvac_commercial", label: "HVAC System (commercial RTU)", unit: "$/ton", rate: 2800 },
    { id: "ductwork", label: "Ductwork Supply & Return", unit: "$/sqft flr", rate: 8.50 },
    { id: "erv_hrv", label: "ERV/HRV Unit", unit: "$/EA", rate: 2200 },
    { id: "exhaust_fans", label: "Exhaust Fans (bath)", unit: "$/EA", rate: 380 },
    { id: "kitchen_exhaust", label: "Kitchen Exhaust Hood & Fan", unit: "$/EA", rate: 1800 },
    { id: "parkade_exhaust", label: "Parkade Exhaust System", unit: "lump sum", rate: 28000 },
    { id: "vav_boxes", label: "VAV Boxes", unit: "$/EA", rate: 1200 },
    { id: "air_handler", label: "Air Handling Unit (AHU)", unit: "$/EA", rate: 12000 },
    { id: "chiller", label: "Chiller System", unit: "$/ton", rate: 850 },
    { id: "cooling_tower", label: "Cooling Tower", unit: "lump sum", rate: 35000 },
    { id: "controls_bas", label: "Building Automation System (BAS)", unit: "lump sum", rate: 45000 },
  ]},
  { id: "electrical", code: "16", label: "Electrical", icon: "⚡", items: [
    { id: "service_residential", label: "Electrical Service (200A residential)", unit: "$/unit", rate: 3200 },
    { id: "service_commercial", label: "Electrical Service (commercial 600V)", unit: "lump sum", rate: 28000 },
    { id: "distribution", label: "Electrical Distribution (panels/feeders)", unit: "$/sqft", rate: 4.50 },
    { id: "branch_circuits", label: "Branch Circuit Wiring", unit: "$/sqft", rate: 6.80 },
    { id: "receptacles", label: "Receptacles & Outlets", unit: "$/EA", rate: 120 },
    { id: "switches", label: "Switches", unit: "$/EA", rate: 85 },
    { id: "lighting_residential", label: "Lighting (residential)", unit: "$/fixture", rate: 180 },
    { id: "lighting_commercial", label: "Lighting (commercial/LED)", unit: "$/fixture", rate: 280 },
    { id: "emergency_lighting", label: "Emergency Lighting & Exit Signs", unit: "$/EA", rate: 320 },
    { id: "fire_alarm", label: "Fire Alarm System", unit: "$/sqft", rate: 3.20 },
    { id: "security_cameras", label: "Security Camera System (CCTV)", unit: "$/camera", rate: 850 },
    { id: "intercom", label: "Intercom / Video Entry System", unit: "lump sum", rate: 5500 },
    { id: "data_comm", label: "Data & Communications (Cat6)", unit: "$/port", rate: 180 },
    { id: "ev_charging", label: "EV Charging Stations (L2)", unit: "$/EA", rate: 2800 },
    { id: "solar_pv", label: "Solar PV System", unit: "$/kW", rate: 3200 },
    { id: "generator", label: "Emergency Generator (standby)", unit: "$/kW", rate: 850 },
    { id: "transformer", label: "Transformer", unit: "$/kVA", rate: 28 },
    { id: "conduit", label: "Conduit (EMT 3/4\")", unit: "$/LF", rate: 8.50 },
    { id: "grounding", label: "Grounding & Bonding", unit: "lump sum", rate: 3500 },
  ]},
  { id: "general_conditions", code: "GC", label: "General Conditions", icon: "📦", items: [
    { id: "project_management", label: "Project Management (PM)", unit: "$/month", rate: 8500 },
    { id: "site_superintendent", label: "Site Superintendent", unit: "$/month", rate: 7200 },
    { id: "foreman", label: "Foreman", unit: "$/month", rate: 6400 },
    { id: "site_trailer", label: "Site Trailer (rental)", unit: "$/month", rate: 1200 },
    { id: "portable_toilets", label: "Portable Toilets", unit: "$/month", rate: 280 },
    { id: "temporary_power", label: "Temporary Power & Lighting", unit: "$/month", rate: 850 },
    { id: "temp_heat", label: "Temporary Heat", unit: "$/month", rate: 1800 },
    { id: "dumpsters", label: "Waste Disposal (dumpsters)", unit: "$/month", rate: 650 },
    { id: "safety", label: "Safety Program & PPE", unit: "$/month", rate: 1200 },
    { id: "small_tools", label: "Small Tools & Equipment", unit: "$/month", rate: 950 },
    { id: "crane", label: "Mobile Crane (rental)", unit: "$/day", rate: 2800 },
    { id: "scaffold", label: "Scaffolding", unit: "$/sqft/month", rate: 0.65 },
    { id: "insurance", label: "Project Insurance", unit: "% of construction", rate: 1.5 },
    { id: "bonds", label: "Performance & Payment Bonds", unit: "% of contract", rate: 1.2 },
    { id: "testing_inspection", label: "Testing & Special Inspection", unit: "lump sum", rate: 12000 },
    { id: "as_builts", label: "As-Built Drawings", unit: "lump sum", rate: 3500 },
    { id: "commissioning", label: "Commissioning", unit: "lump sum", rate: 8500 },
    { id: "warranty", label: "Warranty Program", unit: "% of construction", rate: 0.5 },
    { id: "escalation", label: "Material Escalation Allowance", unit: "% of construction", rate: 3.0 },
  ]},
];

const PROJECT_TYPES = [
  "Single Family Residential","Multi-Family Residential","Mixed-Use",
  "Commercial Office","Retail / Restaurant","Industrial / Warehouse",
  "Institutional","Renovation / Tenant Improvement"
];

const MARKUP_PRESETS = {
  "Conservative": { overhead: 10, profit: 8 },
  "Standard": { overhead: 12, profit: 10 },
  "Competitive": { overhead: 8, profit: 6 },
  "Premium": { overhead: 15, profit: 15 },
};

// Build a flat lookup: itemId → { divisionId, rate, label, unit }
const ITEM_LOOKUP = {};
DIVISIONS.forEach(div => div.items.forEach(item => {
  ITEM_LOOKUP[item.id] = { ...item, divisionId: div.id };
}));

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function fmt(n) {
  return new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 }).format(n || 0);
}
function fmtNum(n) { return new Intl.NumberFormat("en-CA").format(n); }

function fileToBase64(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result.split(",")[1]);
    r.onerror = () => rej(new Error("File read failed"));
    r.readAsDataURL(file);
  });
}

function confidenceColor(c) {
  if (c >= 80) return "text-emerald-400 border-emerald-700/50 bg-emerald-900/20";
  if (c >= 50) return "text-amber-400 border-amber-700/50 bg-amber-900/20";
  return "text-red-400 border-red-700/50 bg-red-900/20";
}

// ─── SHARED COMPONENTS ───────────────────────────────────────────────────────
function Badge({ color, children }) {
  const colors = {
    green: "bg-emerald-900/40 text-emerald-300 border-emerald-700/40",
    yellow: "bg-amber-900/40 text-amber-300 border-amber-700/40",
    blue: "bg-blue-900/40 text-blue-300 border-blue-700/40",
    red: "bg-red-900/40 text-red-300 border-red-700/40",
    gray: "bg-zinc-800 text-zinc-200 border-zinc-700",
    purple: "bg-purple-900/40 text-purple-300 border-purple-700/40",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-semibold border ${colors[color] || colors.gray}`}>
      {children}
    </span>
  );
}

function SummaryCard({ label, value, sub, accent }) {
  return (
    <div className={`relative bg-zinc-900 border rounded-xl p-4 overflow-hidden ${accent ? "border-amber-500/50" : "border-zinc-700/50"}`}>
      {accent && <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500 to-orange-500" />}
      <p className="text-xs font-medium text-zinc-300 uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-2xl font-black font-mono ${accent ? "text-amber-400" : "text-white"}`}>{value}</p>
      {sub && <p className="text-xs text-zinc-300 mt-1">{sub}</p>}
    </div>
  );
}

// ─── PLANS TAKEOFF VIEW ───────────────────────────────────────────────────────
function PlansTakeoff({ onApplyToEstimate }) {
  const [files, setFiles] = useState([]); // { name, base64, mediaType, preview }
  const [activeIdx, setActiveIdx] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState("");
  const [results, setResults] = useState(null); // parsed AI takeoff
  const [selected, setSelected] = useState({}); // itemId → bool (which to apply)
  const [error, setError] = useState("");
  const [projectContext, setProjectContext] = useState("");
  const dropRef = useRef();

  const ACCEPTED = ["image/jpeg","image/png","image/webp","image/gif","application/pdf"];

  async function processFiles(rawFiles) {
    const processed = [];
    for (const f of rawFiles) {
      if (!ACCEPTED.includes(f.type)) continue;
      try {
        const b64 = await fileToBase64(f);
        const preview = f.type.startsWith("image/") ? `data:${f.type};base64,${b64}` : null;
        processed.push({ name: f.name, base64: b64, mediaType: f.type, preview, size: f.size });
      } catch {}
    }
    setFiles(prev => {
      const combined = [...prev, ...processed].slice(0, 12);
      return combined;
    });
    setResults(null);
    setSelected({});
  }

  function handleDrop(e) {
    e.preventDefault();
    dropRef.current?.classList.remove("border-amber-500");
    processFiles([...e.dataTransfer.files]);
  }

  function handleDragOver(e) {
    e.preventDefault();
    dropRef.current?.classList.add("border-amber-500");
  }

  function handleDragLeave() {
    dropRef.current?.classList.remove("border-amber-500");
  }

  function removeFile(i) {
    setFiles(prev => prev.filter((_, idx) => idx !== i));
    if (activeIdx >= i && activeIdx > 0) setActiveIdx(activeIdx - 1);
    setResults(null);
    setSelected({});
  }

  const divisionsSummary = DIVISIONS.map(d => `${d.code} ${d.label}: ${d.items.map(i => i.id).join(", ")}`).join("\n");

  async function runAnalysis() {
    if (files.length === 0) return;
    setAnalyzing(true);
    setError("");
    setResults(null);
    setSelected({});

    try {
      // Build message content — include all uploaded images/pages
      const contentBlocks = [];

      // System context
      contentBlocks.push({
        type: "text",
        text: `You are an expert Canadian general contractor and quantity surveyor specializing in construction cost estimating. 
        
You are analyzing construction drawings/plans. Your job is to perform a detailed quantity takeoff and return structured JSON that maps to our estimating system's line items.

${projectContext ? `Additional context from estimator: ${projectContext}` : ""}

Our estimating system has these divisions and item IDs:
${divisionsSummary}

IMPORTANT INSTRUCTIONS:
1. Carefully examine every plan sheet provided
2. For each item you can identify or infer quantities for, provide your best estimate
3. Use Canadian construction standards and Victoria, BC pricing context where relevant
4. Be specific — count doors, windows, fixtures. Measure areas and lengths where possible
5. If a dimension scale is visible (e.g. 1:100, 1/4"=1'-0"), use it to calculate real dimensions
6. Note what sheet type each observation comes from (floor plan, elevation, section, electrical, etc.)

Return ONLY valid JSON (no markdown, no preamble) in this exact structure:
{
  "projectSummary": {
    "projectType": string,
    "totalGFA": number (sqft, your best estimate),
    "storeys": number,
    "units": number (if residential),
    "constructionType": string,
    "notes": string (key observations about the drawings)
  },
  "takeoffItems": [
    {
      "itemId": string (must match one of our system item IDs exactly),
      "divisionId": string,
      "label": string,
      "qty": number,
      "unit": string,
      "confidence": number (0-100, how confident you are in this quantity),
      "reasoning": string (what you saw on the plans to derive this),
      "sourceSheet": string (e.g. "Floor Plan - Level 1", "Electrical Plan", etc.)
    }
  ],
  "aiNotes": string (overall observations, assumptions made, what was unclear),
  "flaggedItems": [string] (items that need estimator review or clarification)
}`
      });

      // Add all plan images
      for (const f of files) {
        if (f.mediaType.startsWith("image/")) {
          contentBlocks.push({
            type: "image",
            source: { type: "base64", media_type: f.mediaType, data: f.base64 }
          });
          contentBlocks.push({ type: "text", text: `[Above image: ${f.name}]` });
        } else if (f.mediaType === "application/pdf") {
          // PDF — send as document
          contentBlocks.push({
            type: "document",
            source: { type: "base64", media_type: "application/pdf", data: f.base64 }
          });
          contentBlocks.push({ type: "text", text: `[Above document: ${f.name}]` });
        }
      }

      setProgress("Sending plans to AI for analysis…");

      const response = await fetch("/.netlify/functions/anthropic-proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4000,
          messages: [{ role: "user", content: contentBlocks }]
        })
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err?.error?.message || `API error ${response.status}`);
      }

      setProgress("Processing AI response…");
      const data = await response.json();
      const rawText = data.content?.find(b => b.type === "text")?.text || "";

      // Parse JSON — strip any markdown fences
      const cleaned = rawText.replace(/```json|```/g, "").trim();
      let parsed;
      try {
        parsed = JSON.parse(cleaned);
      } catch {
        // Try to extract JSON from within text
        const match = cleaned.match(/\{[\s\S]*\}/);
        if (match) parsed = JSON.parse(match[0]);
        else throw new Error("Could not parse AI response as JSON. Try again.");
      }

      // Validate and enrich takeoff items — cross-reference with our ITEM_LOOKUP
      const enriched = (parsed.takeoffItems || []).map(item => {
        const known = ITEM_LOOKUP[item.itemId];
        return {
          ...item,
          rate: known?.rate || 0,
          systemLabel: known?.label || item.label,
          matched: !!known,
        };
      }).filter(i => i.matched && i.qty > 0);

      parsed.takeoffItems = enriched;

      // Default all high-confidence items as selected
      const sel = {};
      enriched.forEach(item => {
        sel[item.itemId] = item.confidence >= 60;
      });

      setResults(parsed);
      setSelected(sel);
      setProgress("");
    } catch (err) {
      setError(err.message || "Analysis failed. Please try again.");
      setProgress("");
    } finally {
      setAnalyzing(false);
    }
  }

  function toggleAll(val) {
    const next = {};
    (results?.takeoffItems || []).forEach(i => { next[i.itemId] = val; });
    setSelected(next);
  }

  function applySelected() {
    if (!results) return;
    const toApply = results.takeoffItems.filter(i => selected[i.itemId]);
    onApplyToEstimate(toApply, results.projectSummary);
  }

  const selectedCount = Object.values(selected).filter(Boolean).length;
  const selectedTotal = (results?.takeoffItems || [])
    .filter(i => selected[i.itemId])
    .reduce((s, i) => s + i.qty * i.rate, 0);

  // Group results by division
  const groupedResults = {};
  (results?.takeoffItems || []).forEach(item => {
    if (!groupedResults[item.divisionId]) groupedResults[item.divisionId] = [];
    groupedResults[item.divisionId].push(item);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="syne font-black text-2xl text-white flex items-center gap-3">
            AI Plans Takeoff
            <Badge color="purple">✦ Claude Vision</Badge>
          </div>
          <p className="text-xs text-zinc-300 mt-1">Upload plan sheets · AI reads dimensions & counts · Auto-populates estimate</p>
        </div>
        {results && (
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs text-zinc-300">{selectedCount} items selected</div>
              <div className="font-mono font-black text-amber-400 syne">{fmt(selectedTotal)}</div>
            </div>
            <button
              onClick={applySelected}
              disabled={selectedCount === 0}
              className="bg-amber-500 hover:bg-amber-400 disabled:bg-zinc-700 disabled:text-zinc-300 text-black font-black px-5 py-2.5 rounded-xl text-sm transition-all syne"
            >
              Apply to Estimate →
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-12 gap-5">
        {/* Left: Upload + Plan Viewer */}
        <div className="col-span-4 space-y-4">
          {/* Drop Zone */}
          <div
            ref={dropRef}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className="relative border-2 border-dashed border-zinc-700 rounded-xl p-6 text-center transition-colors bg-zinc-900/50 hover:border-zinc-500"
          >
            <input
              type="file"
              multiple
              accept="image/*,.pdf"
              onChange={e => processFiles([...e.target.files])}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <div className="text-3xl mb-2">📐</div>
            <div className="text-sm font-semibold text-zinc-300 mb-1">Drop plan sheets here</div>
            <div className="text-xs text-zinc-400">PNG · JPG · PDF · up to 12 sheets</div>
            <div className="text-xs text-zinc-500 mt-1">Floor plans, elevations, sections, electrical, mechanical</div>
          </div>

          {/* Project Context */}
          <div className="bg-zinc-900 border border-zinc-700/50 rounded-xl p-4">
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-widest block mb-2">Context for AI (optional)</label>
            <textarea
              value={projectContext}
              onChange={e => setProjectContext(e.target.value)}
              placeholder="e.g. 4-storey wood frame multi-family, 24 units, Victoria BC, ICI market, standard spec..."
              rows={3}
              className="w-full bg-zinc-800 border border-zinc-700 text-xs text-zinc-300 px-3 py-2 rounded focus:outline-none focus:border-amber-500/60 resize-none placeholder:text-zinc-500"
            />
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="bg-zinc-900 border border-zinc-700/50 rounded-xl overflow-hidden">
              <div className="px-4 py-2 border-b border-zinc-800 flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-300 uppercase tracking-widest">{files.length} Sheet{files.length !== 1 ? "s" : ""}</span>
                <button onClick={() => { setFiles([]); setResults(null); setSelected({}); }} className="text-xs text-zinc-500 hover:text-red-400 transition-colors">Clear all</button>
              </div>
              <div className="divide-y divide-zinc-800 max-h-48 overflow-y-auto scrollbar-thin">
                {files.map((f, i) => (
                  <div key={i} onClick={() => setActiveIdx(i)}
                    className={`flex items-center gap-3 px-4 py-2 cursor-pointer transition-colors ${activeIdx === i ? "bg-zinc-800" : "hover:bg-zinc-800/50"}`}>
                    <div className="text-lg flex-shrink-0">{f.mediaType === "application/pdf" ? "📄" : "🖼️"}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-zinc-300 truncate">{f.name}</div>
                      <div className="text-xs text-zinc-400">{(f.size / 1024).toFixed(0)} KB</div>
                    </div>
                    <button onClick={e => { e.stopPropagation(); removeFile(i); }} className="text-zinc-500 hover:text-red-400 text-xs transition-colors">✕</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Plan Preview */}
          {files[activeIdx]?.preview && (
            <div className="bg-zinc-900 border border-zinc-700/50 rounded-xl overflow-hidden">
              <div className="px-3 py-2 border-b border-zinc-800 text-xs text-zinc-300 truncate">{files[activeIdx].name}</div>
              <img src={files[activeIdx].preview} alt="plan" className="w-full object-contain max-h-72 bg-zinc-950" />
            </div>
          )}

          {files[activeIdx]?.mediaType === "application/pdf" && (
            <div className="bg-zinc-900 border border-zinc-700/50 rounded-xl p-6 text-center">
              <div className="text-3xl mb-2">📄</div>
              <div className="text-xs text-zinc-300">{files[activeIdx].name}</div>
              <div className="text-xs text-zinc-500 mt-1">PDF ready for AI analysis</div>
            </div>
          )}

          {/* Analyze Button */}
          {files.length > 0 && (
            <button
              onClick={runAnalysis}
              disabled={analyzing}
              className="w-full relative overflow-hidden bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:from-zinc-700 disabled:to-zinc-700 text-black disabled:text-zinc-300 font-black py-3.5 rounded-xl text-sm syne transition-all"
            >
              {analyzing ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  {progress || "Analyzing…"}
                </span>
              ) : (
                `✦ Analyze ${files.length} Sheet${files.length !== 1 ? "s" : ""} with AI`
              )}
            </button>
          )}

          {error && (
            <div className="bg-red-900/20 border border-red-700/50 rounded-xl p-4 text-xs text-red-300">{error}</div>
          )}
        </div>

        {/* Right: Results */}
        <div className="col-span-8">
          {!results && !analyzing && (
            <div className="h-full flex flex-col items-center justify-center text-center py-20 text-zinc-500">
              <div className="text-6xl mb-4 opacity-50">🏛️</div>
              <div className="text-lg font-semibold text-zinc-400 syne">Upload your plans to start</div>
              <div className="text-sm text-zinc-500 mt-2 max-w-sm">
                Claude Vision will read your drawings, identify quantities, count fixtures, measure areas, and map everything to your estimate divisions.
              </div>
              <div className="mt-6 grid grid-cols-3 gap-3 text-xs text-zinc-500 max-w-lg">
                {["Floor plans → room areas, wall lengths","Elevations → cladding, window areas","Sections → floor assemblies, heights","Electrical → panel, circuits, fixtures","Plumbing → fixture counts","Site plan → civil quantities"].map(tip => (
                  <div key={tip} className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-3 text-left">{tip}</div>
                ))}
              </div>
            </div>
          )}

          {analyzing && (
            <div className="h-full flex flex-col items-center justify-center text-center py-20">
              <div className="relative w-20 h-20 mb-6">
                <div className="absolute inset-0 border-4 border-amber-500/20 rounded-full" />
                <div className="absolute inset-0 border-4 border-transparent border-t-amber-500 rounded-full animate-spin" />
                <div className="absolute inset-2 border-4 border-transparent border-t-orange-400 rounded-full animate-spin" style={{ animationDirection: "reverse", animationDuration: "0.8s" }} />
              </div>
              <div className="syne font-black text-xl text-white mb-2">Reading Your Plans</div>
              <div className="text-sm text-zinc-300">{progress}</div>
              <div className="mt-4 text-xs text-zinc-500 max-w-xs">
                Claude is examining every sheet, reading dimensions, counting components, and mapping quantities to your estimating divisions.
              </div>
            </div>
          )}

          {results && (
            <div className="space-y-4">
              {/* Project Summary */}
              <div className="bg-zinc-900 border border-purple-700/40 rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs font-semibold text-zinc-300 uppercase tracking-widest">AI Project Summary</div>
                  <Badge color="purple">✦ AI Generated</Badge>
                </div>
                <div className="grid grid-cols-4 gap-4 mb-3">
                  {[
                    ["Project Type", results.projectSummary?.projectType || "—"],
                    ["Est. GFA", results.projectSummary?.totalGFA ? `${fmtNum(results.projectSummary.totalGFA)} sqft` : "—"],
                    ["Storeys", results.projectSummary?.storeys || "—"],
                    ["Units", results.projectSummary?.units || "—"],
                  ].map(([k, v]) => (
                    <div key={k} className="bg-zinc-800/50 rounded-lg p-3">
                      <div className="text-xs text-zinc-400 mb-0.5">{k}</div>
                      <div className="font-mono font-bold text-white text-sm">{v}</div>
                    </div>
                  ))}
                </div>
                {results.projectSummary?.notes && (
                  <p className="text-xs text-zinc-200 bg-zinc-800/50 rounded-lg p-3">{results.projectSummary.notes}</p>
                )}
                {results.aiNotes && (
                  <p className="text-xs text-zinc-300 mt-2 italic">{results.aiNotes}</p>
                )}
                {results.flaggedItems?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    <span className="text-xs text-amber-500 font-semibold mr-1">⚠ Needs review:</span>
                    {results.flaggedItems.map((f, i) => <Badge key={i} color="yellow">{f}</Badge>)}
                  </div>
                )}
              </div>

              {/* Takeoff Items */}
              <div className="bg-zinc-900 border border-zinc-700/50 rounded-xl overflow-hidden">
                <div className="px-5 py-3 border-b border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-zinc-300 uppercase tracking-widest">
                      {results.takeoffItems.length} Items Identified
                    </span>
                    <Badge color="green">{selectedCount} selected</Badge>
                  </div>
                  <div className="flex gap-3 text-xs">
                    <button onClick={() => toggleAll(true)} className="text-amber-500 hover:text-amber-400 transition-colors font-semibold">Select all</button>
                    <button onClick={() => toggleAll(false)} className="text-zinc-400 hover:text-zinc-200 transition-colors">Deselect all</button>
                  </div>
                </div>

                <div className="divide-y divide-zinc-800/60 max-h-[520px] overflow-y-auto scrollbar-thin">
                  {/* Group by division */}
                  {Object.entries(groupedResults).map(([divId, items]) => {
                    const div = DIVISIONS.find(d => d.id === divId);
                    if (!div) return null;
                    const divSubtotal = items.filter(i => selected[i.itemId]).reduce((s, i) => s + i.qty * i.rate, 0);
                    return (
                      <div key={divId}>
                        <div className="px-5 py-2 bg-zinc-800/60 flex items-center justify-between sticky top-0">
                          <span className="text-xs font-bold text-zinc-200">{div.icon} {div.label}</span>
                          {divSubtotal > 0 && <span className="text-xs font-mono text-amber-400">{fmt(divSubtotal)}</span>}
                        </div>
                        {items.map(item => {
                          const isSelected = selected[item.itemId];
                          const lineTotal = item.qty * item.rate;
                          return (
                            <div
                              key={item.itemId}
                              onClick={() => setSelected(s => ({ ...s, [item.itemId]: !s[item.itemId] }))}
                              className={`flex items-start gap-3 px-5 py-3 cursor-pointer transition-colors ${isSelected ? "bg-amber-500/5 hover:bg-amber-500/10" : "hover:bg-zinc-800/40"}`}
                            >
                              {/* Checkbox */}
                              <div className={`mt-0.5 w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-all ${isSelected ? "bg-amber-500 border-amber-500" : "border-zinc-600"}`}>
                                {isSelected && <span className="text-black text-xs font-black">✓</span>}
                              </div>
                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                                  <span className={`text-xs font-semibold ${isSelected ? "text-white" : "text-zinc-200"}`}>{item.systemLabel}</span>
                                  <span className={`text-xs font-mono px-1.5 py-0.5 rounded border ${confidenceColor(item.confidence)}`}>
                                    {item.confidence}% conf
                                  </span>
                                  {item.sourceSheet && <span className="text-xs text-zinc-500">{item.sourceSheet}</span>}
                                </div>
                                <div className="text-xs text-zinc-400 italic">{item.reasoning}</div>
                              </div>
                              {/* Numbers */}
                              <div className="text-right flex-shrink-0 ml-2">
                                <div className="text-xs font-mono text-zinc-200">{fmtNum(item.qty)} {item.unit}</div>
                                <div className={`text-sm font-mono font-bold ${isSelected ? "text-amber-400" : "text-zinc-400"}`}>
                                  {fmt(lineTotal)}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>

                {/* Footer */}
                <div className="px-5 py-4 border-t border-zinc-700 bg-zinc-800/60 flex items-center justify-between">
                  <div className="text-xs text-zinc-300">
                    {selectedCount} of {results.takeoffItems.length} items · estimated from plans
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-xs text-zinc-400">Selected construction value</div>
                      <div className="font-mono font-black text-amber-400 syne text-lg">{fmt(selectedTotal)}</div>
                    </div>
                    <button
                      onClick={applySelected}
                      disabled={selectedCount === 0}
                      className="bg-amber-500 hover:bg-amber-400 disabled:bg-zinc-700 disabled:text-zinc-300 text-black font-black px-6 py-2.5 rounded-xl text-sm syne transition-all"
                    >
                      Apply {selectedCount} Items →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── DIVISION ROW ─────────────────────────────────────────────────────────────
function DivisionRow({ division, entries, onUpdate, totalConstruction, highlightIds }) {
  const [open, setOpen] = useState(false);
  const divTotal = entries.reduce((s, e) => s + (e.amount || 0), 0);
  const pct = totalConstruction > 0 ? ((divTotal / totalConstruction) * 100).toFixed(1) : 0;
  const hasHighlights = highlightIds?.some(id => division.items.find(i => i.id === id));

  // Auto-open if has newly applied items
  const prevHighlight = useRef(false);
  if (hasHighlights && !prevHighlight.current) {
    prevHighlight.current = true;
  }

  return (
    <div className={`border rounded-xl overflow-hidden mb-2 transition-colors ${hasHighlights ? "border-amber-500/40" : "border-zinc-700/50"}`}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-zinc-800/80 hover:bg-zinc-800 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{division.icon}</span>
          <span className="font-mono text-xs text-zinc-300">{division.code}</span>
          <span className="font-semibold text-sm text-white">{division.label}</span>
          {divTotal > 0 && <Badge color="green">{entries.filter(e => e.amount > 0).length} items</Badge>}
          {hasHighlights && <Badge color="purple">✦ AI populated</Badge>}
        </div>
        <div className="flex items-center gap-4">
          {divTotal > 0 && (
            <>
              <span className="text-xs text-zinc-300 font-mono">{pct}%</span>
              <span className="font-mono font-bold text-amber-400">{fmt(divTotal)}</span>
            </>
          )}
          <span className={`text-zinc-200 transition-transform duration-200 ${open ? "rotate-180" : ""}`}>▾</span>
        </div>
      </button>

      {open && (
        <div className="bg-zinc-900/50 divide-y divide-zinc-800">
          <div className="grid grid-cols-12 gap-2 px-4 py-2 text-xs font-semibold text-zinc-400 uppercase tracking-widest border-b border-zinc-800">
            <div className="col-span-4">Description</div>
            <div className="col-span-2 text-right">Unit</div>
            <div className="col-span-2 text-right">Rate</div>
            <div className="col-span-2 text-right">Qty</div>
            <div className="col-span-2 text-right">Total</div>
          </div>

          {division.items.map(item => {
            const entry = entries.find(e => e.id === item.id) || { id: item.id, qty: 0, rate: item.rate, amount: 0 };
            const isActive = entry.qty > 0;
            const isAI = highlightIds?.includes(item.id);

            return (
              <div key={item.id} className={`grid grid-cols-12 gap-2 px-4 py-2 items-center text-sm transition-colors hover:bg-zinc-800/30 ${isAI ? "bg-purple-900/10" : isActive ? "bg-zinc-800/20" : ""}`}>
                <div className="col-span-4 text-zinc-300 text-xs flex items-center gap-1.5">
                  {item.label}
                  {isAI && <span className="text-purple-400 text-xs">✦</span>}
                </div>
                <div className="col-span-2 text-right">
                  <span className="text-xs text-zinc-400 font-mono">{item.unit}</span>
                </div>
                <div className="col-span-2">
                  <input type="number" value={entry.rate || item.rate}
                    onChange={e => onUpdate(division.id, item.id, { rate: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-zinc-800 border border-zinc-700 text-right text-xs font-mono text-zinc-300 px-2 py-1 rounded focus:outline-none focus:border-amber-500/60" />
                </div>
                <div className="col-span-2">
                  <input type="number" value={entry.qty || ""} placeholder="0"
                    onChange={e => onUpdate(division.id, item.id, { qty: parseFloat(e.target.value) || 0 })}
                    className={`w-full bg-zinc-800 border text-right text-xs font-mono px-2 py-1 rounded focus:outline-none transition-colors ${isAI ? "border-purple-500/40 text-purple-300 focus:border-purple-500" : isActive ? "border-amber-500/40 text-amber-300 focus:border-amber-500" : "border-zinc-700 text-zinc-200 focus:border-amber-500/60"}`} />
                </div>
                <div className="col-span-2 text-right">
                  <span className={`font-mono text-xs font-bold ${isActive ? "text-amber-400" : "text-zinc-500"}`}>
                    {isActive ? fmt(entry.amount) : "—"}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Custom line */}
          <div className="px-4 py-2 border-t border-zinc-800/60">
            <CustomLineItem onAdd={(item) => onUpdate(division.id, item.id, item)} />
          </div>

          {divTotal > 0 && (
            <div className="px-4 py-2 flex justify-end border-t border-zinc-700/50 bg-zinc-800/40">
              <span className="text-xs text-zinc-300 mr-4 self-center">Division Subtotal</span>
              <span className="font-mono font-black text-amber-400">{fmt(divTotal)}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CustomLineItem({ onAdd }) {
  const [show, setShow] = useState(false);
  const [desc, setDesc] = useState(""); const [unit, setUnit] = useState("");
  const [rate, setRate] = useState(""); const [qty, setQty] = useState("");
  function handleAdd() {
    if (!desc || !qty) return;
    const r = parseFloat(rate) || 0; const q = parseFloat(qty) || 0;
    onAdd({ id: `custom_${Date.now()}`, label: desc, unit, rate: r, qty: q, amount: r * q, custom: true });
    setDesc(""); setUnit(""); setRate(""); setQty(""); setShow(false);
  }
  if (!show) return <button onClick={() => setShow(true)} className="text-xs text-zinc-400 hover:text-amber-500 transition-colors font-medium">+ Add custom line item</button>;
  return (
    <div className="grid grid-cols-12 gap-2 items-center">
      <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="Description" className="col-span-4 bg-zinc-800 border border-amber-500/40 text-xs text-zinc-300 px-2 py-1 rounded focus:outline-none focus:border-amber-500" />
      <input value={unit} onChange={e => setUnit(e.target.value)} placeholder="Unit" className="col-span-2 bg-zinc-800 border border-zinc-700 text-xs text-zinc-300 px-2 py-1 rounded focus:outline-none focus:border-amber-500/60 text-right" />
      <input value={rate} onChange={e => setRate(e.target.value)} type="number" placeholder="Rate" className="col-span-2 bg-zinc-800 border border-zinc-700 text-xs text-zinc-300 px-2 py-1 rounded focus:outline-none focus:border-amber-500/60 text-right" />
      <input value={qty} onChange={e => setQty(e.target.value)} type="number" placeholder="Qty" className="col-span-2 bg-zinc-800 border border-zinc-700 text-xs text-zinc-300 px-2 py-1 rounded focus:outline-none focus:border-amber-500/60 text-right" />
      <div className="col-span-2 flex gap-1">
        <button onClick={handleAdd} className="flex-1 bg-amber-500 text-black text-xs font-bold py-1 rounded hover:bg-amber-400 transition-colors">Add</button>
        <button onClick={() => setShow(false)} className="flex-1 bg-zinc-700 text-zinc-300 text-xs py-1 rounded hover:bg-zinc-600 transition-colors">✕</button>
      </div>
    </div>
  );
}

// ─── PROPOSAL VIEW ────────────────────────────────────────────────────────────
function ProposalView({ project, markups, divTotals, subtotal, overhead, profit, contingency, tax, grand }) {
  const date = new Date().toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" });
  return (
    <div className="bg-white text-zinc-900 p-12 rounded-2xl font-serif max-w-4xl mx-auto">
      <div className="flex justify-between items-start mb-10 pb-8 border-b-2 border-zinc-200">
        <div>
          <div className="text-3xl font-black tracking-tight text-zinc-900 mb-1">GT MANN CONTRACTING</div>
          <div className="text-sm text-zinc-300">Victoria, BC · General Contractor</div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-amber-600">ESTIMATE</div>
          <div className="text-sm text-zinc-300 mt-1">{date}</div>
          <div className="text-xs font-mono text-zinc-200 mt-1">EST-{Date.now().toString().slice(-6)}</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-8 mb-10">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-zinc-200 mb-2">Project</div>
          <div className="font-bold text-lg">{project.name || "Unnamed Project"}</div>
          <div className="text-sm text-zinc-400">{project.address}</div>
          <div className="text-sm text-zinc-400">{project.type}</div>
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-zinc-200 mb-2">Client</div>
          <div className="font-bold text-lg">{project.clientName || "—"}</div>
          <div className="text-sm text-zinc-400">{project.clientEmail}</div>
          <div className="text-sm text-zinc-400">{project.clientPhone}</div>
        </div>
      </div>
      <table className="w-full text-sm mb-8">
        <thead>
          <tr className="border-b-2 border-zinc-200">
            <th className="text-left py-2 font-bold uppercase tracking-widest text-xs text-zinc-300">Division</th>
            <th className="text-right py-2 font-bold uppercase tracking-widest text-xs text-zinc-300">Amount</th>
            <th className="text-right py-2 font-bold uppercase tracking-widest text-xs text-zinc-300">%</th>
          </tr>
        </thead>
        <tbody>
          {DIVISIONS.map(div => {
            const total = divTotals[div.id] || 0;
            if (total === 0) return null;
            return (
              <tr key={div.id} className="border-b border-zinc-100">
                <td className="py-2">{div.icon} {div.label}</td>
                <td className="py-2 text-right font-mono font-semibold">{fmt(total)}</td>
                <td className="py-2 text-right text-zinc-300">{subtotal > 0 ? ((total / subtotal) * 100).toFixed(1) : 0}%</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="bg-zinc-50 rounded-xl p-6">
        <div className="space-y-2">
          {[["Construction Subtotal", subtotal], [`Overhead & Burden (${markups.overhead}%)`, overhead], [`Profit (${markups.profit}%)`, profit], [`Contingency (${markups.contingency}%)`, contingency]].map(([l, v]) => (
            <div key={l} className="flex justify-between text-sm"><span className="text-zinc-400">{l}</span><span className="font-mono font-semibold">{fmt(v)}</span></div>
          ))}
          {markups.taxRate > 0 && <div className="flex justify-between text-sm"><span className="text-zinc-400">Tax ({markups.taxRate}%)</span><span className="font-mono font-semibold">{fmt(tax)}</span></div>}
          <div className="flex justify-between text-lg font-black pt-3 border-t-2 border-zinc-300 mt-2">
            <span>TOTAL CONTRACT VALUE</span><span className="text-amber-600">{fmt(grand)}</span>
          </div>
        </div>
      </div>
      {project.notes && (
        <div className="mt-8 pt-6 border-t border-zinc-200">
          <div className="text-xs font-bold uppercase tracking-widest text-zinc-200 mb-2">Notes & Exclusions</div>
          <p className="text-sm text-zinc-400 whitespace-pre-wrap">{project.notes}</p>
        </div>
      )}
      <div className="mt-10 pt-6 border-t border-zinc-200 text-xs text-zinc-200">
        This estimate is valid for 30 days from the date of issue. All prices in Canadian dollars. Subject to site conditions, final drawings, and owner-confirmed scope.
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function GCEstimator() {
  const [view, setView] = useState("takeoff");
  const [project, setProject] = useState({
    name: "", address: "", type: PROJECT_TYPES[1], clientName: "",
    clientEmail: "", clientPhone: "", sqft: "", duration: 8, notes: ""
  });
  const [lineEntries, setLineEntries] = useState({});
  const [markups, setMarkups] = useState({ overhead: 12, profit: 10, contingency: 5, taxRate: 0 });
  const [markupPreset, setMarkupPreset] = useState("Standard");
  const [aiPopulatedIds, setAiPopulatedIds] = useState([]); // track which items came from AI

  function handleUpdate(divId, itemId, patch) {
    setLineEntries(prev => {
      const divEntries = { ...(prev[divId] || {}) };
      const existing = divEntries[itemId] || {};
      const updated = { ...existing, ...patch };
      const r = updated.rate ?? 0; const q = updated.qty ?? 0;
      updated.amount = r * q;
      divEntries[itemId] = updated;
      return { ...prev, [divId]: divEntries };
    });
  }

  // Called from PlansTakeoff when user clicks "Apply to Estimate"
  function handleApplyFromPlans(takeoffItems, projectSummary) {
    const newIds = [];
    takeoffItems.forEach(item => {
      const known = ITEM_LOOKUP[item.itemId];
      if (!known) return;
      handleUpdate(known.divisionId, item.itemId, { qty: item.qty, rate: item.rate || known.rate });
      newIds.push(item.itemId);
    });
    setAiPopulatedIds(prev => [...new Set([...prev, ...newIds])]);

    // Auto-fill project info from AI summary if blank
    if (projectSummary?.totalGFA && !project.sqft) {
      setProject(p => ({ ...p, sqft: String(projectSummary.totalGFA) }));
    }
    if (projectSummary?.projectType && !project.type) {
      const match = PROJECT_TYPES.find(t => t.toLowerCase().includes(projectSummary.projectType.toLowerCase().split(" ")[0]));
      if (match) setProject(p => ({ ...p, type: match }));
    }

    setView("estimate");
  }

  function getDivEntries(divId) {
    const divData = lineEntries[divId] || {};
    const div = DIVISIONS.find(d => d.id === divId);
    return div.items.map(item => ({
      id: item.id, label: item.label,
      rate: divData[item.id]?.rate ?? item.rate,
      qty: divData[item.id]?.qty ?? 0,
      amount: divData[item.id]?.amount ?? 0,
      unit: item.unit,
    }));
  }

  const divTotals = {};
  DIVISIONS.forEach(div => {
    divTotals[div.id] = getDivEntries(div.id).reduce((s, e) => s + (e.amount || 0), 0);
  });
  const subtotal = Object.values(divTotals).reduce((s, v) => s + v, 0);
  const overhead = subtotal * (markups.overhead / 100);
  const profit = (subtotal + overhead) * (markups.profit / 100);
  const contingency = subtotal * (markups.contingency / 100);
  const beforeTax = subtotal + overhead + profit + contingency;
  const tax = beforeTax * (markups.taxRate / 100);
  const grand = beforeTax + tax;
  const sqftCost = project.sqft > 0 ? grand / parseFloat(project.sqft) : 0;
  const activeItemCount = Object.values(lineEntries).reduce((s, div) => s + Object.values(div).filter(e => e.qty > 0).length, 0);

  const breakdownItems = DIVISIONS
    .map(d => ({ label: d.label.split("&")[0].trim(), value: divTotals[d.id] || 0, icon: d.icon }))
    .filter(d => d.value > 0).sort((a, b) => b.value - a.value);

  function applyPreset(name) {
    setMarkupPreset(name);
    setMarkups(m => ({ ...m, ...MARKUP_PRESETS[name] }));
  }

  const TABS = [
    { id: "takeoff", label: "AI Takeoff", icon: "✦" },
    { id: "estimate", label: "Estimate", icon: "📋" },
    { id: "breakdown", label: "Breakdown", icon: "📊" },
    { id: "proposal", label: "Proposal", icon: "📄" },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white" style={{ fontFamily: "'DM Mono','Courier New',monospace" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@700;800;900&display=swap');
        .syne { font-family: 'Syne', sans-serif; }
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
        input[type=number] { -moz-appearance: textfield; }
        .scrollbar-thin::-webkit-scrollbar { width: 4px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: #18181b; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 2px; }
      `}</style>

      {/* Header */}
      <div className="sticky top-0 z-50 bg-zinc-950/95 backdrop-blur border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center text-black font-black text-sm syne">E</div>
            <div>
              <div className="syne font-black text-white text-sm tracking-tight">ESTIMATOR PRO</div>
              <div className="text-xs text-zinc-400">General Contractor Edition · AI-Powered</div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setView(t.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${view === t.id ? "bg-amber-500 text-black" : "text-zinc-200 hover:text-white hover:bg-zinc-800"}`}>
                <span>{t.icon}</span>{t.label}
                {t.id === "estimate" && activeItemCount > 0 && (
                  <span className="bg-black/20 text-xs px-1.5 rounded-full">{activeItemCount}</span>
                )}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            {grand > 0 && <div className="syne font-black text-amber-400 text-lg">{fmt(grand)}</div>}
            <button onClick={() => { if (confirm("Clear all quantities?")) { setLineEntries({}); setAiPopulatedIds([]); } }}
              className="text-xs text-zinc-400 hover:text-red-400 transition-colors">Clear</button>
          </div>
        </div>
      </div>

      {/* AI TAKEOFF */}
      {view === "takeoff" && (
        <PlansTakeoff onApplyToEstimate={handleApplyFromPlans} />
      )}

      {/* ESTIMATE */}
      {view === "estimate" && (
        <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-12 gap-6">
          <div className="col-span-3">
            <div className="sticky top-20 space-y-4">
              {aiPopulatedIds.length > 0 && (
                <div className="bg-purple-900/20 border border-purple-700/40 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge color="purple">✦ AI</Badge>
                    <span className="text-xs font-semibold text-purple-300">Plans Populated</span>
                  </div>
                  <p className="text-xs text-zinc-300">{aiPopulatedIds.length} items auto-filled from your plans. Purple ✦ marks AI-sourced quantities.</p>
                </div>
              )}
              <div className="bg-zinc-900 border border-zinc-700/50 rounded-xl p-4">
                <div className="text-xs font-semibold text-zinc-300 uppercase tracking-widest mb-3">Project Info</div>
                <div className="space-y-2">
                  {[{ key:"name",label:"Project Name",placeholder:"Grand & Fir" },{ key:"address",label:"Address",placeholder:"Victoria, BC" },{ key:"clientName",label:"Client Name",placeholder:"Owner" },{ key:"clientEmail",label:"Email",placeholder:"email@domain.com" },{ key:"clientPhone",label:"Phone",placeholder:"250-000-0000" },{ key:"sqft",label:"Total Area (sqft)",placeholder:"0",type:"number" }].map(f => (
                    <div key={f.key}>
                      <label className="text-xs text-zinc-400 block mb-0.5">{f.label}</label>
                      <input type={f.type||"text"} value={project[f.key]} onChange={e => setProject(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder}
                        className="w-full bg-zinc-800 border border-zinc-700 text-xs text-zinc-300 px-2 py-1.5 rounded focus:outline-none focus:border-amber-500/60 placeholder:text-zinc-500" />
                    </div>
                  ))}
                  <div>
                    <label className="text-xs text-zinc-400 block mb-0.5">Project Type</label>
                    <select value={project.type} onChange={e => setProject(p => ({ ...p, type: e.target.value }))}
                      className="w-full bg-zinc-800 border border-zinc-700 text-xs text-zinc-300 px-2 py-1.5 rounded focus:outline-none focus:border-amber-500/60">
                      {PROJECT_TYPES.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-zinc-400 block mb-0.5">Duration (months)</label>
                    <input type="number" value={project.duration} onChange={e => setProject(p => ({ ...p, duration: parseInt(e.target.value)||1 }))}
                      className="w-full bg-zinc-800 border border-zinc-700 text-xs text-zinc-300 px-2 py-1.5 rounded focus:outline-none focus:border-amber-500/60" />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-400 block mb-0.5">Notes / Exclusions</label>
                    <textarea value={project.notes} onChange={e => setProject(p => ({ ...p, notes: e.target.value }))} rows={3} placeholder="Scope clarifications..."
                      className="w-full bg-zinc-800 border border-zinc-700 text-xs text-zinc-300 px-2 py-1.5 rounded focus:outline-none focus:border-amber-500/60 resize-none placeholder:text-zinc-500" />
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-700/50 rounded-xl p-4">
                <div className="text-xs font-semibold text-zinc-300 uppercase tracking-widest mb-3">Markup & Fees</div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {Object.keys(MARKUP_PRESETS).map(k => (
                    <button key={k} onClick={() => applyPreset(k)}
                      className={`text-xs px-2 py-1 rounded font-medium transition-all ${markupPreset === k ? "bg-amber-500 text-black" : "bg-zinc-800 text-zinc-200 hover:bg-zinc-700"}`}>{k}</button>
                  ))}
                </div>
                <div className="space-y-2">
                  {[{ key:"overhead",label:"Overhead (%)" },{ key:"profit",label:"Profit (%)" },{ key:"contingency",label:"Contingency (%)" },{ key:"taxRate",label:"Tax Rate (%)" }].map(f => (
                    <div key={f.key} className="flex items-center justify-between gap-2">
                      <label className="text-xs text-zinc-300 flex-1">{f.label}</label>
                      <input type="number" value={markups[f.key]} onChange={e => { setMarkupPreset("Custom"); setMarkups(m => ({ ...m, [f.key]: parseFloat(e.target.value)||0 })); }}
                        className="w-16 bg-zinc-800 border border-zinc-700 text-xs text-amber-300 font-mono px-2 py-1 rounded text-right focus:outline-none focus:border-amber-500/60" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-zinc-900 border border-amber-500/30 rounded-xl p-4">
                <div className="text-xs font-semibold text-zinc-300 uppercase tracking-widest mb-3">Summary</div>
                <div className="space-y-1.5">
                  {[["Construction Sub",fmt(subtotal)],[`Overhead (${markups.overhead}%)`,fmt(overhead)],[`Profit (${markups.profit}%)`,fmt(profit)],[`Contingency (${markups.contingency}%)`,fmt(contingency)],...(markups.taxRate>0?[[`Tax (${markups.taxRate}%)`,fmt(tax)]]:[])]
                    .map(([k,v]) => (
                    <div key={k} className="flex justify-between text-xs">
                      <span className="text-zinc-300">{k}</span><span className="font-mono text-zinc-300">{v}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-sm font-black pt-2 border-t border-zinc-700 mt-1">
                    <span className="text-white">TOTAL</span>
                    <span className="text-amber-400 font-mono syne">{fmt(grand)}</span>
                  </div>
                  {sqftCost > 0 && <div className="flex justify-between text-xs pt-1"><span className="text-zinc-400">Cost / sqft</span><span className="font-mono text-zinc-200">{fmt(sqftCost)}</span></div>}
                  {activeItemCount > 0 && <div className="flex justify-between text-xs"><span className="text-zinc-400">Line items</span><span className="font-mono text-zinc-200">{activeItemCount}</span></div>}
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-9">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="syne font-black text-xl text-white">Cost Breakdown</div>
                <div className="text-xs text-zinc-400">{DIVISIONS.length} divisions · {DIVISIONS.reduce((s,d)=>s+d.items.length,0)}+ line items
                  {aiPopulatedIds.length > 0 && <span className="text-purple-400 ml-2">· {aiPopulatedIds.length} AI-populated ✦</span>}
                </div>
              </div>
              {aiPopulatedIds.length > 0 && (
                <button onClick={() => setView("takeoff")} className="text-xs text-purple-400 hover:text-purple-300 transition-colors border border-purple-700/40 px-3 py-1.5 rounded-lg">
                  ← Back to Takeoff
                </button>
              )}
            </div>
            <div className="space-y-1">
              {DIVISIONS.map(div => (
                <DivisionRow key={div.id} division={div} entries={getDivEntries(div.id)}
                  onUpdate={handleUpdate} totalConstruction={subtotal}
                  highlightIds={aiPopulatedIds.filter(id => div.items.find(i => i.id === id))} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* BREAKDOWN */}
      {view === "breakdown" && (
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="syne font-black text-2xl mb-6 text-white">Cost Breakdown Analysis</div>
          {breakdownItems.length === 0 ? (
            <div className="text-center py-20 text-zinc-400">
              <div className="text-5xl mb-4">📊</div>
              <div className="text-lg">No costs yet — upload plans or enter quantities.</div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-4 gap-4 mb-8">
                <SummaryCard label="Construction Cost" value={fmt(subtotal)} accent />
                <SummaryCard label="Total w/ Markup" value={fmt(grand)} accent />
                <SummaryCard label="Cost / sqft" value={project.sqft > 0 ? fmt(sqftCost) : "—"} sub={project.sqft > 0 ? `${fmtNum(project.sqft)} sqft` : "Enter area"} />
                <SummaryCard label="Active Line Items" value={activeItemCount} sub={`across ${breakdownItems.length} divisions`} />
              </div>
              <div className="bg-zinc-900 border border-zinc-700/50 rounded-xl p-6 mb-6">
                <div className="text-xs font-semibold text-zinc-300 uppercase tracking-widest mb-4">Division Breakdown</div>
                <div className="space-y-2">
                  {breakdownItems.map(item => (
                    <div key={item.label} className="flex items-center gap-3">
                      <div className="w-40 text-xs text-zinc-200 text-right truncate flex-shrink-0">{item.icon} {item.label}</div>
                      <div className="flex-1 relative h-6 bg-zinc-800 rounded overflow-hidden">
                        <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded transition-all duration-500"
                          style={{ width: `${(item.value / subtotal) * 100}%` }} />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-2">
                          <span className="text-xs font-mono font-bold text-black">{((item.value / subtotal) * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                      <div className="w-28 text-right font-mono text-xs text-amber-400 font-bold flex-shrink-0">{fmt(item.value)}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-zinc-900 border border-zinc-700/50 rounded-xl p-6">
                <div className="text-xs font-semibold text-zinc-300 uppercase tracking-widest mb-4">Contract Value Stack</div>
                <div className="space-y-2">
                  {[{ label:"Construction Subtotal",value:subtotal,color:"from-blue-500 to-cyan-500" },{ label:`Overhead (${markups.overhead}%)`,value:overhead,color:"from-violet-500 to-purple-500" },{ label:`Profit (${markups.profit}%)`,value:profit,color:"from-emerald-500 to-teal-500" },{ label:`Contingency (${markups.contingency}%)`,value:contingency,color:"from-amber-500 to-orange-500" },...(tax>0?[{ label:`Tax`,value:tax,color:"from-red-500 to-rose-500" }]:[])]
                    .map(row => (
                    <div key={row.label} className="flex items-center gap-3">
                      <div className="w-44 text-xs text-zinc-200 text-right flex-shrink-0">{row.label}</div>
                      <div className="flex-1 relative h-6 bg-zinc-800 rounded overflow-hidden">
                        <div className={`absolute inset-y-0 left-0 bg-gradient-to-r ${row.color} rounded`}
                          style={{ width: `${Math.min((row.value / grand) * 100, 100)}%` }} />
                      </div>
                      <div className="w-24 text-right font-mono text-xs text-zinc-300 font-bold flex-shrink-0">{fmt(row.value)}</div>
                    </div>
                  ))}
                  <div className="flex justify-end pt-2 border-t border-zinc-700">
                    <div className="text-right">
                      <div className="text-xs text-zinc-300">TOTAL CONTRACT</div>
                      <div className="font-mono font-black text-amber-400 syne text-xl">{fmt(grand)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* PROPOSAL */}
      {view === "proposal" && (
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="syne font-black text-2xl text-white">Proposal Preview</div>
            <button onClick={() => window.print()} className="bg-amber-500 text-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-amber-400 transition-colors">
              🖨️ Print / PDF
            </button>
          </div>
          <ProposalView project={project} markups={markups} divTotals={divTotals}
            subtotal={subtotal} overhead={overhead} profit={profit}
            contingency={contingency} tax={tax} grand={grand} />
        </div>
      )}
    </div>
  );
}

import {
  Activity, Archive, ArrowUpDown, ArrowUpFromLine, Baby, Bath, Blinds,
  BookOpen, Building, Building2, Cable, Calculator, Calendar, Camera,
  Car, CarFront, ChefHat, Code, Compass, Construction, Cpu, Diamond,
  Dog, DoorOpen, Drill, Droplets, Dumbbell, Eye, Fence, Flame, Flower,
  Flower2, GraduationCap, Globe, Grid3X3, GlassWater, Gavel, Hand,
  HandHeart, Hammer, HeartPulse, Home, Languages, Lamp, Layers,
  LayoutDashboard, LayoutGrid, LayoutTemplate, Leaf, Lock, Map, MapPinned,
  Megaphone, Monitor, MoveUp, Package, Paintbrush, PaintRoller, Palette,
  PanelsTopLeft, PartyPopper, PawPrint, PenTool, Scale, Scissors, Shield,
  ShieldAlert, ShowerHead, Shirt, Smartphone, Sofa, Sparkles, Square,
  Stethoscope, Sun, ThermometerSun, Trees, Truck, Utensils, Waves,
  WashingMachine, Wind, Wand2, Wifi, Wrench, Zap,
  type LucideIcon,
} from 'lucide-react';

interface IconEntry {
  Icon: LucideIcon;
  color: string;
  bgColor: string;
}

const iconMap: Record<string, IconEntry> = {
  // ── Plomberie & Eau ────────────────────────────────────────────────────────
  plomberie:           { Icon: Wrench,          color: 'text-blue-400',     bgColor: 'bg-blue-500/10'     },
  etancheite:          { Icon: Droplets,        color: 'text-sky-400',      bgColor: 'bg-sky-500/10'      },
  piscine:             { Icon: Waves,           color: 'text-cyan-400',     bgColor: 'bg-cyan-500/10'     },
  salledebain:         { Icon: ShowerHead,      color: 'text-cyan-400',     bgColor: 'bg-cyan-500/10'     },

  // ── Électricité & Énergie ─────────────────────────────────────────────────
  electricite:         { Icon: Zap,             color: 'text-yellow-400',   bgColor: 'bg-yellow-500/10'   },
  chauffage:           { Icon: Flame,           color: 'text-red-400',      bgColor: 'bg-red-500/10'      },
  climatisation:       { Icon: Wind,            color: 'text-cyan-400',     bgColor: 'bg-cyan-500/10'     },
  panneauxsolaires:    { Icon: Sun,             color: 'text-yellow-400',   bgColor: 'bg-yellow-500/10'   },
  domotique:           { Icon: Wifi,            color: 'text-teal-400',     bgColor: 'bg-teal-500/10'     },

  // ── Peinture & Finitions ──────────────────────────────────────────────────
  peinture:            { Icon: PaintRoller,     color: 'text-purple-400',   bgColor: 'bg-purple-500/10'   },
  platrier:            { Icon: Paintbrush,      color: 'text-cyan-400',     bgColor: 'bg-cyan-500/10'     },
  decoration:          { Icon: LayoutTemplate,  color: 'text-fuchsia-400',  bgColor: 'bg-fuchsia-500/10'  },

  // ── Bois & Construction ───────────────────────────────────────────────────
  menuiserie:          { Icon: Hammer,          color: 'text-amber-400',    bgColor: 'bg-amber-500/10'    },
  charpenterie:        { Icon: Home,            color: 'text-orange-400',   bgColor: 'bg-orange-500/10'   },
  maconnerie:          { Icon: Layers,          color: 'text-stone-400',    bgColor: 'bg-gray-500/10'     },
  toiture:             { Icon: Building,        color: 'text-amber-400',    bgColor: 'bg-amber-500/10'    },
  facadier:            { Icon: Building2,       color: 'text-gray-400',     bgColor: 'bg-gray-500/10'     },
  escalier:            { Icon: Construction,    color: 'text-yellow-400',   bgColor: 'bg-yellow-500/10'   },
  plafond:             { Icon: PanelsTopLeft,   color: 'text-sky-400',      bgColor: 'bg-sky-500/10'      },
  isolation:           { Icon: ThermometerSun,  color: 'text-amber-400',    bgColor: 'bg-amber-500/10'    },

  // ── Métallerie & Serrurerie ───────────────────────────────────────────────
  serrurerie:          { Icon: Cable,           color: 'text-blue-400',     bgColor: 'bg-blue-500/10'     },
  soudure:             { Icon: Drill,           color: 'text-red-400',      bgColor: 'bg-red-500/10'      },
  ferronnerie:         { Icon: PenTool,         color: 'text-rose-400',     bgColor: 'bg-rose-500/10'     },
  portail:             { Icon: Fence,           color: 'text-purple-400',   bgColor: 'bg-purple-500/10'   },
  ascenseur:           { Icon: ArrowUpDown,     color: 'text-blue-400',     bgColor: 'bg-blue-500/10'     },

  // ── Vitrage & Surfaces ────────────────────────────────────────────────────
  vitrerie:            { Icon: Square,          color: 'text-indigo-400',   bgColor: 'bg-indigo-500/10'   },
  carrelage:           { Icon: LayoutGrid,      color: 'text-teal-400',     bgColor: 'bg-teal-500/10'     },
  parquet:             { Icon: Grid3X3,         color: 'text-amber-400',    bgColor: 'bg-amber-500/10'    },
  marbre:              { Icon: Diamond,         color: 'text-gray-300',     bgColor: 'bg-gray-500/10'     },
  nettoyagevitre:      { Icon: Eye,             color: 'text-sky-400',      bgColor: 'bg-sky-500/10'      },

  // ── Aménagement intérieur ─────────────────────────────────────────────────
  cuisine:             { Icon: ChefHat,         color: 'text-orange-400',   bgColor: 'bg-orange-500/10'   },
  dressing:            { Icon: Archive,         color: 'text-purple-400',   bgColor: 'bg-purple-500/10'   },
  volets:              { Icon: Blinds,          color: 'text-slate-400',    bgColor: 'bg-slate-500/10'    },
  moustiquaire:        { Icon: Grid3X3,         color: 'text-green-400',    bgColor: 'bg-green-500/10'    },
  pergola:             { Icon: Trees,           color: 'text-green-400',    bgColor: 'bg-green-500/10'    },

  // ── Nettoyage ─────────────────────────────────────────────────────────────
  menage:              { Icon: Home,            color: 'text-rose-400',     bgColor: 'bg-rose-500/10'     },
  nettoyage:           { Icon: Sparkles,        color: 'text-teal-400',     bgColor: 'bg-teal-500/10'     },

  // ── Jardinage & Extérieur ─────────────────────────────────────────────────
  jardinage:           { Icon: Flower2,         color: 'text-green-400',    bgColor: 'bg-green-500/10'    },

  // ── Sécurité ──────────────────────────────────────────────────────────────
  alarme:              { Icon: ShieldAlert,     color: 'text-red-400',      bgColor: 'bg-red-500/10'      },

  // ── Auto ──────────────────────────────────────────────────────────────────
  mecaniqueauto:       { Icon: Wrench,          color: 'text-orange-400',   bgColor: 'bg-orange-500/10'   },
  carrosserie:         { Icon: CarFront,        color: 'text-red-400',      bgColor: 'bg-red-500/10'      },

  // ── Tech & Numérique ──────────────────────────────────────────────────────
  informatique:        { Icon: Monitor,         color: 'text-sky-400',      bgColor: 'bg-sky-500/10'      },
  electronique:        { Icon: Cpu,             color: 'text-purple-400',   bgColor: 'bg-purple-500/10'   },
  telephonie:          { Icon: Smartphone,      color: 'text-blue-400',     bgColor: 'bg-blue-500/10'     },
  webdev:              { Icon: Code,            color: 'text-teal-400',     bgColor: 'bg-teal-500/10'     },
  designgraphique:     { Icon: Palette,         color: 'text-rose-400',     bgColor: 'bg-rose-500/10'     },
  marketing:           { Icon: Megaphone,       color: 'text-orange-400',   bgColor: 'bg-orange-500/10'   },

  // ── Services professionnels ───────────────────────────────────────────────
  comptabilite:        { Icon: Calculator,      color: 'text-blue-400',     bgColor: 'bg-blue-500/10'     },
  juridique:           { Icon: Gavel,           color: 'text-red-400',      bgColor: 'bg-red-500/10'      },
  architecture:        { Icon: Compass,         color: 'text-indigo-400',   bgColor: 'bg-indigo-500/10'   },
  topographie:         { Icon: MapPinned,       color: 'text-emerald-400',  bgColor: 'bg-emerald-500/10'  },
  traduction:          { Icon: Languages,       color: 'text-purple-400',   bgColor: 'bg-purple-500/10'   },
  coursparticuliers:   { Icon: GraduationCap,   color: 'text-indigo-400',   bgColor: 'bg-indigo-500/10'   },
  photographie:        { Icon: Camera,          color: 'text-indigo-400',   bgColor: 'bg-indigo-500/10'   },

  // ── Événementiel & Restauration ───────────────────────────────────────────
  traiteur:            { Icon: Utensils,        color: 'text-red-400',      bgColor: 'bg-red-500/10'      },
  evenementiel:        { Icon: PartyPopper,     color: 'text-amber-400',    bgColor: 'bg-amber-500/10'    },

  // ── Transport & Logistique ─────────────────────────────────────────────────
  demenagement:        { Icon: Truck,           color: 'text-pink-400',     bgColor: 'bg-pink-500/10'     },
  livraison:           { Icon: Package,         color: 'text-orange-400',   bgColor: 'bg-orange-500/10'   },

  // ── Beauté & Bien-être ────────────────────────────────────────────────────
  coiffure:            { Icon: Scissors,        color: 'text-pink-400',     bgColor: 'bg-pink-500/10'     },
  esthetique:          { Icon: Flower,          color: 'text-fuchsia-400',  bgColor: 'bg-fuchsia-500/10'  },
  massage:             { Icon: Hand,            color: 'text-rose-400',     bgColor: 'bg-rose-500/10'     },
  maquillage:          { Icon: Wand2,           color: 'text-pink-400',     bgColor: 'bg-pink-500/10'     },
  couture:             { Icon: Scissors,        color: 'text-fuchsia-400',  bgColor: 'bg-fuchsia-500/10'  },
  pressing:            { Icon: WashingMachine,  color: 'text-sky-400',      bgColor: 'bg-sky-500/10'      },
  'bien-etre':         { Icon: HeartPulse,      color: 'text-red-400',      bgColor: 'bg-red-500/10'      },

  // ── Personnes & Animaux ───────────────────────────────────────────────────
  babysitter:          { Icon: Baby,            color: 'text-pink-400',     bgColor: 'bg-pink-500/10'     },
  aidepersonnes:       { Icon: HandHeart,       color: 'text-rose-400',     bgColor: 'bg-rose-500/10'     },
  gardeanimaux:        { Icon: Dog,             color: 'text-orange-400',   bgColor: 'bg-orange-500/10'   },
  veterinaire:         { Icon: Stethoscope,     color: 'text-amber-400',    bgColor: 'bg-amber-500/10'    },
  coachsportif:        { Icon: Dumbbell,        color: 'text-red-400',      bgColor: 'bg-red-500/10'      },
};

export function getCategoryIcon(slug: string): IconEntry & { isFallback: boolean } {
  const entry = iconMap[slug];
  if (entry) return { ...entry, isFallback: false };
  return { Icon: Wrench, color: 'text-orange-400', bgColor: 'bg-orange-500/10', isFallback: true };
}

import {
  Activity, Archive, ArrowUp, Bath, Blinds, BookOpen, Building, Building2,
  Calculator, Calendar, Camera, Car, ChefHat, Code, Construction, Cpu,
  Diamond, DoorOpen, Drill, Droplets, Dumbbell, Eye, Flame, Flower2,
  Globe, Grid3X3, GlassWater, Hand, Hammer, Heart, Home, Layers,
  LayoutDashboard, LayoutGrid, Leaf, Lock, Map, Megaphone, Monitor, MoveUp,
  Package, Paintbrush, Palette, PawPrint, PenTool, Scale, Scissors, Shield,
  Shirt, Smartphone, Sofa, Sparkles, Sun, Thermometer, Trees, Truck,
  UtensilsCrossed, Waves, Wind, Wand2, Wifi, Wrench, Zap,
  type LucideIcon,
} from 'lucide-react';

interface IconEntry {
  Icon: LucideIcon;
  color: string;
  bgColor: string;
}

const iconMap: Record<string, IconEntry> = {
  // ── Bâtiment & Travaux ─────────────────────────────────────────────────────
  plomberie:          { Icon: Wrench,         color: 'text-blue-400',    bgColor: 'bg-blue-500/10'    },
  electricite:        { Icon: Zap,            color: 'text-yellow-400',  bgColor: 'bg-yellow-500/10'  },
  peinture:           { Icon: Palette,        color: 'text-purple-400',  bgColor: 'bg-purple-500/10'  },
  climatisation:      { Icon: Wind,           color: 'text-cyan-400',    bgColor: 'bg-cyan-500/10'    },
  menuiserie:         { Icon: Hammer,         color: 'text-amber-400',   bgColor: 'bg-amber-500/10'   },
  maconnerie:         { Icon: Layers,         color: 'text-stone-400',   bgColor: 'bg-gray-500/10'    },
  serrurerie:         { Icon: Lock,           color: 'text-slate-400',   bgColor: 'bg-slate-500/10'   },
  chauffage:          { Icon: Flame,          color: 'text-red-400',     bgColor: 'bg-red-500/10'     },
  charpenterie:       { Icon: Trees,          color: 'text-amber-600',   bgColor: 'bg-amber-700/10'   },
  soudure:            { Icon: Drill,          color: 'text-red-400',     bgColor: 'bg-red-500/10'     },
  carrelage:          { Icon: LayoutGrid,     color: 'text-teal-400',    bgColor: 'bg-teal-500/10'    },
  vitrerie:           { Icon: GlassWater,     color: 'text-sky-400',     bgColor: 'bg-sky-500/10'     },
  toiture:            { Icon: Building,       color: 'text-amber-400',   bgColor: 'bg-amber-500/10'   },
  facadier:           { Icon: Building2,      color: 'text-gray-400',    bgColor: 'bg-gray-500/10'    },
  platrier:           { Icon: Paintbrush,     color: 'text-gray-400',    bgColor: 'bg-gray-500/10'    },
  parquet:            { Icon: Grid3X3,        color: 'text-amber-400',   bgColor: 'bg-amber-500/10'   },
  isolation:          { Icon: Thermometer,    color: 'text-orange-400',  bgColor: 'bg-orange-500/10'  },
  etancheite:         { Icon: Droplets,       color: 'text-blue-400',    bgColor: 'bg-blue-500/10'    },
  marbre:             { Icon: Diamond,        color: 'text-gray-300',    bgColor: 'bg-gray-500/10'    },
  ferronnerie:        { Icon: Hammer,         color: 'text-red-400',     bgColor: 'bg-red-500/10'     },
  portail:            { Icon: DoorOpen,       color: 'text-amber-400',   bgColor: 'bg-amber-500/10'   },
  volets:             { Icon: Blinds,         color: 'text-slate-400',   bgColor: 'bg-slate-500/10'   },
  escalier:           { Icon: Construction,   color: 'text-yellow-400',  bgColor: 'bg-yellow-500/10'  },
  plafond:            { Icon: LayoutDashboard,color: 'text-teal-400',    bgColor: 'bg-teal-500/10'    },
  moustiquaire:       { Icon: Grid3X3,        color: 'text-green-400',   bgColor: 'bg-green-500/10'   },
  pergola:            { Icon: Trees,          color: 'text-green-400',   bgColor: 'bg-green-500/10'   },
  panneauxsolaires:   { Icon: Sun,            color: 'text-yellow-400',  bgColor: 'bg-yellow-500/10'  },
  ascenseur:          { Icon: MoveUp,         color: 'text-gray-400',    bgColor: 'bg-gray-500/10'    },
  domotique:          { Icon: Wifi,           color: 'text-teal-400',    bgColor: 'bg-teal-500/10'    },

  // ── Intérieur & Aménagement ────────────────────────────────────────────────
  decoration:         { Icon: Sofa,           color: 'text-violet-400',  bgColor: 'bg-violet-500/10'  },
  cuisine:            { Icon: ChefHat,        color: 'text-orange-400',  bgColor: 'bg-orange-500/10'  },
  salledebain:        { Icon: Bath,           color: 'text-blue-400',    bgColor: 'bg-blue-500/10'    },
  dressing:           { Icon: Archive,        color: 'text-purple-400',  bgColor: 'bg-purple-500/10'  },
  piscine:            { Icon: Waves,          color: 'text-cyan-400',    bgColor: 'bg-cyan-500/10'    },
  alarme:             { Icon: Shield,         color: 'text-orange-400',  bgColor: 'bg-orange-500/10'  },

  // ── Nettoyage & Entretien ──────────────────────────────────────────────────
  menage:             { Icon: Home,           color: 'text-rose-400',    bgColor: 'bg-rose-500/10'    },
  nettoyage:          { Icon: Sparkles,       color: 'text-teal-400',    bgColor: 'bg-teal-500/10'    },
  nettoyagevitre:     { Icon: Eye,            color: 'text-sky-400',     bgColor: 'bg-sky-500/10'     },
  jardinage:          { Icon: Flower2,        color: 'text-green-400',   bgColor: 'bg-green-500/10'   },

  // ── Transport & Logistique ─────────────────────────────────────────────────
  demenagement:       { Icon: Truck,          color: 'text-orange-400',  bgColor: 'bg-orange-500/10'  },
  livraison:          { Icon: Package,        color: 'text-orange-400',  bgColor: 'bg-orange-500/10'  },

  // ── Auto & Moto ────────────────────────────────────────────────────────────
  mecaniqueauto:      { Icon: Car,            color: 'text-blue-400',    bgColor: 'bg-blue-500/10'    },
  carrosserie:        { Icon: Car,            color: 'text-red-400',     bgColor: 'bg-red-500/10'     },

  // ── Tech & Numérique ──────────────────────────────────────────────────────
  informatique:       { Icon: Monitor,        color: 'text-sky-400',     bgColor: 'bg-sky-500/10'     },
  electronique:       { Icon: Cpu,            color: 'text-purple-400',  bgColor: 'bg-purple-500/10'  },
  telephonie:         { Icon: Smartphone,     color: 'text-sky-400',     bgColor: 'bg-sky-500/10'     },
  webdev:             { Icon: Code,           color: 'text-indigo-400',  bgColor: 'bg-indigo-500/10'  },
  designgraphique:    { Icon: Paintbrush,     color: 'text-violet-400',  bgColor: 'bg-violet-500/10'  },
  marketing:          { Icon: Megaphone,      color: 'text-orange-400',  bgColor: 'bg-orange-500/10'  },

  // ── Services professionnels ────────────────────────────────────────────────
  comptabilite:       { Icon: Calculator,     color: 'text-green-400',   bgColor: 'bg-green-500/10'   },
  juridique:          { Icon: Scale,          color: 'text-blue-400',    bgColor: 'bg-blue-500/10'    },
  architecture:       { Icon: PenTool,        color: 'text-gray-400',    bgColor: 'bg-gray-500/10'    },
  topographie:        { Icon: Map,            color: 'text-emerald-400', bgColor: 'bg-emerald-500/10' },
  traduction:         { Icon: Globe,          color: 'text-blue-400',    bgColor: 'bg-blue-500/10'    },
  coursparticuliers:  { Icon: BookOpen,       color: 'text-indigo-400',  bgColor: 'bg-indigo-500/10'  },
  photographie:       { Icon: Camera,         color: 'text-indigo-400',  bgColor: 'bg-indigo-500/10'  },
  traiteur:           { Icon: UtensilsCrossed,color: 'text-amber-400',   bgColor: 'bg-amber-500/10'   },
  evenementiel:       { Icon: Calendar,       color: 'text-rose-400',    bgColor: 'bg-rose-500/10'    },

  // ── Beauté & Bien-être ────────────────────────────────────────────────────
  coiffure:           { Icon: Scissors,       color: 'text-pink-400',    bgColor: 'bg-pink-500/10'    },
  esthetique:         { Icon: Sparkles,       color: 'text-pink-400',    bgColor: 'bg-pink-500/10'    },
  massage:            { Icon: Hand,           color: 'text-violet-400',  bgColor: 'bg-violet-500/10'  },
  maquillage:         { Icon: Wand2,          color: 'text-pink-400',    bgColor: 'bg-pink-500/10'    },
  couture:            { Icon: Shirt,          color: 'text-purple-400',  bgColor: 'bg-purple-500/10'  },
  pressing:           { Icon: Shirt,          color: 'text-blue-400',    bgColor: 'bg-blue-500/10'    },
  'bien-etre':        { Icon: Leaf,           color: 'text-green-400',   bgColor: 'bg-green-500/10'   },

  // ── Personnes & Animaux ───────────────────────────────────────────────────
  babysitter:         { Icon: Heart,          color: 'text-pink-400',    bgColor: 'bg-pink-500/10'    },
  aidepersonnes:      { Icon: Hand,           color: 'text-red-400',     bgColor: 'bg-red-500/10'     },
  gardeanimaux:       { Icon: PawPrint,       color: 'text-amber-400',   bgColor: 'bg-amber-500/10'   },
  veterinaire:        { Icon: Activity,       color: 'text-green-400',   bgColor: 'bg-green-500/10'   },
  coachsportif:       { Icon: Dumbbell,       color: 'text-orange-400',  bgColor: 'bg-orange-500/10'  },
};

export function getCategoryIcon(slug: string): IconEntry & { isFallback: boolean } {
  const entry = iconMap[slug];
  if (entry) return { ...entry, isFallback: false };
  return { Icon: Wrench, color: 'text-orange-400', bgColor: 'bg-orange-500/10', isFallback: true };
}

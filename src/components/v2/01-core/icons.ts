// icons.ts
// Purpose: Single shared keyFacts.iconKey -> lucide icon lookup table, used by
//          any v2 component that renders a service's keyFacts (currently
//          XerxezServiceTemplate). Centralized here so the map is defined once
//          instead of duplicated per consumer.
// Used in: 04-features/services/XerxezServiceTemplate.tsx
// Data source: keys match the `iconKey` field on services[].keyFacts entries
//              in src/data/index.ts (e.g. "brain", "cogs", "chart-line").

import {
  Brain, Settings, TrendingUp, Plug, ShieldCheck, Rocket, FlaskConical, ClipboardCheck,
  Cloud, Layers, DollarSign, Code2, Server, TestTube2, Lock, Map, Scale, UserCog, Search,
  GraduationCap, Laptop, Award, Users, Atom, Network, Smartphone, WifiOff, Bell, Globe,
  Maximize, Eye, Database, Factory, Zap, Check,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// keyFacts.iconKey → lucide icon. One shared table (was previously keyed by
// the legacy FontAwesome class string, which coupled this file to a UI detail
// of the pre-/v2 renderer); iconKey is a stable, renderer-agnostic label set
// directly on the data alongside the legacy `icon` field.
export const ICON_KEY_MAP: Record<string, LucideIcon> = {
  brain: Brain, cogs: Settings, "chart-line": TrendingUp, plug: Plug, shield: ShieldCheck,
  rocket: Rocket, flask: FlaskConical, "clipboard-check": ClipboardCheck, cloud: Cloud,
  layers: Layers, "dollar-sign": DollarSign, code: Code2, server: Server, vial: TestTube2,
  lock: Lock, map: Map, scale: Scale, "user-tie": UserCog, search: Search,
  "graduation-cap": GraduationCap, "laptop-code": Laptop, certificate: Award, users: Users,
  atom: Atom, "project-diagram": Network, mobile: Smartphone, "wifi-slash": WifiOff, bell: Bell,
  globe: Globe, expand: Maximize, eye: Eye, database: Database, industry: Factory, bolt: Zap,
};

// Looks up a keyFact's icon, warning (not silently substituting) when a
// service entry's iconKey doesn't match this table — e.g. a new keyFact
// added to src/data/index.ts without a corresponding ICON_KEY_MAP entry.
// Check is still the fallback shown to visitors (a card with no icon at all
// would look broken), but the console.warn means the gap surfaces in dev
// tools / server logs instead of only being noticed by eyeballing the page.
export const getKeyFactIcon = (iconKey: string): LucideIcon => {
  const icon = ICON_KEY_MAP[iconKey];
  if (!icon) {
    console.warn(`[v2] No icon mapped for iconKey "${iconKey}" — falling back to Check.`);
    return Check;
  }
  return icon;
};

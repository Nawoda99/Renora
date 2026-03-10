import { icons } from "lucide-react";

const ICONS = icons;

export const ALL_ICON_KEYS = Object.keys(ICONS).sort();

export function iconComponentFromKey(iconKey) {
  if (!iconKey) return undefined;
  return ICONS[iconKey];
}

export function iconFromKey(iconKey, fallback) {
  if (!iconKey) return fallback;
  return ICONS[iconKey] ?? fallback;
}

export const SERVICE_ICON_KEYS = [
  "Home",
  "Building2",
  "Sparkles",
  "Square",
  "Armchair",
  "Droplets",
  "Truck",
  "Hammer",
];

export const ABOUT_ICON_KEYS = ["Shield", "Award", "Users", "Clock", "Star"];

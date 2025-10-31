import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getStrapiURL() {
  return process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";
}

/**
 * Flattens Strapi's nested `data.attributes` structure
 * into a simpler plain object.
 */
export function flattenAttributes(entry: any): any {
  if (!entry) return entry;

  // Handle arrays of entries
  if (Array.isArray(entry)) {
    return entry.map(flattenAttributes);
  }

  // Handle single entry objects with Strapi structure
  if (entry.data) {
    return flattenAttributes(entry.data);
  }

  if (entry.attributes) {
    return { id: entry.id, ...flattenAttributes(entry.attributes) };
  }

  // Recursively flatten nested objects
  if (typeof entry === "object") {
    const result: any = {};
    for (const key in entry) {
      result[key] = flattenAttributes(entry[key]);
    }
    return result;
  }

  // Return primitive values as-is
  return entry;
}
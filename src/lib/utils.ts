// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind + classnames safely
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Flattens Strapi-style nested attributes
 */
export function flattenAttributes(obj: any): any {
  if (!obj) return obj;

  if (obj.data) {
    if (Array.isArray(obj.data)) {
      return obj.data.map((item) => flattenAttributes(item));
    }
    if (obj.data.attributes) {
      return { id: obj.data.id, ...flattenAttributes(obj.data.attributes) };
    }
    return flattenAttributes(obj.data);
  }

  if (typeof obj === "object" && !Array.isArray(obj)) {
    const newObj: any = {};
    for (const key in obj) {
      if (key === "attributes") continue;
      newObj[key] = flattenAttributes(obj[key]);
    }
    return newObj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => flattenAttributes(item));
  }

  return obj;
}

/**
 * Returns full Strapi backend URL
 */
export function getStrapiURL(path: string = ""): string {
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";
  return `${base}${path}`;
}

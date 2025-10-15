// src/data/loaders.ts
import qs from "qs";
import { unstable_noStore as noStore } from "next/cache";
import { flattenAttributes } from "@/lib/utils";


const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

async function fetchData(url: string) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch: ${res.status}`);
  }

  const data = await res.json();
  return flattenAttributes(data);
}

/**
 * ✅ Fetch global page data (header + footer)
 */
export async function getGlobalPageData() {
    //  throw new Error("test error");

  noStore();
  const query = qs.stringify({
    populate: {
      header: { populate: ["logoText", "ctaButton"] },
      footer: { populate: ["logoText", "socialLink"] },
    },
  });

  const url = `${baseUrl}/api/global?${query}`;
  return await fetchData(url);
}

/**
 * ✅ (Optional) Fetch home page data
 */
export async function getHomePageData() {
  const query = qs.stringify({
    populate: {
      blocks: {
        on: {
          "layout.hero-section": {
            populate: {
              image: { fields: ["url", "alternativeText"] },
              link: { populate: true },
            },
          },
          "layout.features-section": {
            populate: { feature: { populate: true } },
          },
        },
      },
    },
  });

  const url = `${baseUrl}/api/homepage?${query}`;
  return await fetchData(url);
}
export async function getGlobalPageMetaData() {
  const query = qs.stringify({
    fields: ["title", "description"],
  });
  const url = `${baseUrl}/api/global?${query}`;

  return await fetchData(url);
}

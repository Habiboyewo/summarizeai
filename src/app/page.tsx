import { HeroSection } from "@/components/custom/HeroSection";
import { FeaturesSection } from "@/components/custom/FeaturesSection";
import { getHomePageData } from "@/data/loaders";

function blockRenderer(block: any) {
  switch (block.__component) {
    case "layout.hero-section":
      return <HeroSection key={block.id} data={block} />;
    case "layout.features-section":
      console.log("Sections data:", block);
      return <FeaturesSection key={block.id} data={block} />;
    default:
      return null;
  }
}

export default async function Home() {
  const strapiData = await getHomePageData();

  console.log("Strapi Flattened Response:", strapiData);

  const blocks = strapiData?.blocks;
  if (!blocks?.length) return <div>No blocks found</div>;

  return (
    <div>
      {blocks.map((block: any) => blockRenderer(block))}
    </div>
  );
}

import LatestProducts from "@/components/home/LatestProducts";
import CategoryGrid from "@/components/home/CategoryGrid";
import BrandStrip from "@/components/home/BrandStrip";
import HeroSlider from "@/components/home/HeroSlider";

export default function Home() {
  return (
    <main aria-label="صفحه اصلی">
      <HeroSlider />
      <BrandStrip />
      <CategoryGrid />
      <LatestProducts />
    </main>
  );
}

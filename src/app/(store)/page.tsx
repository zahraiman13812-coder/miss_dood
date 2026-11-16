import HeroSlider from "@/components/home/HeroSlider";
import BrandStrip from "@/components/home/BrandStrip";
import CategoryGrid from "@/components/home/CategoryGrid";
import LatestProducts from "@/components/home/LatestProducts";
import BuyingGuide from "@/components/home/BuyingGuide";

export default function Home() {
  return (
    <main aria-label="صفحه اصلی">
      <HeroSlider />
      <BrandStrip />
      <CategoryGrid />
      <LatestProducts />
      <BuyingGuide />
    </main>
  );
}
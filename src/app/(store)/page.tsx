import DecorDeck from "@/features/decor/DecorDeck";
import BuyingGuide from "@/components/home/BuyingGuide";
import LatestProducts from "@/components/home/LatestProducts";
import CategoryGrid from "@/components/home/CategoryGrid";
import BrandStrip from "@/components/home/BrandStrip";
import HeroSlider from "@/components/home/HeroSlider";

export default function Home() {
  return (
    <main aria-label="صفحه اصلی">
      <HeroSlider />
      <CategoryGrid />
      <LatestProducts />
      <BrandStrip />
      <DecorDeck />
      <BuyingGuide />
    </main>
  );
}

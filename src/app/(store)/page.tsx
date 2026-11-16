import BrandStrip from "@/components/home/BrandStrip";
import HeroSlider from "@/components/home/HeroSlider";

export default function Home() {
  return (
    <main aria-label="صفحه اصلی">
      <HeroSlider />
      <BrandStrip />
    </main>
  );
}

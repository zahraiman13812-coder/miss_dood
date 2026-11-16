export type Product = {
  slug: string;
  category: string;
  name: string;
  image: string;
  priceToman: number | null;
  description: string;
};

export const latestProducts: Product[] = [
  { slug: "classic-lighter", category: "lighters", name: "فندک کلاسیک", image: "/images/categories/lighters.webp", priceToman: 320_000, description: "طرح فندک درب‌دار با بدنهٔ مستطیلی." },
  { slug: "hookah-set", category: "hookah", name: "قلیون پایه‌دار", image: "/images/categories/hookah.webp", priceToman: 1_850_000, description: "طرح قلیون پایه‌دار با شلنگ و سینی." },
  { slug: "cube-charcoal", category: "charcoal", name: "ذغال مکعبی", image: "/images/categories/charcoal.webp", priceToman: 95_000, description: "نمایی از فرم مکعبی ذغال." },
  { slug: "lighter-fuel", category: "fuel", name: "بنزین فندک", image: "/images/categories/fuel.webp", priceToman: 145_000, description: "طرح بطری سوخت مخصوص فندک." },
];

export function productPrice(value: number | null) {
  return value === null ? "قیمت ثبت نشده" : new Intl.NumberFormat("fa-IR").format(value) + " تومان";
}

export type Product = {
  slug: string;
  name: string;
  image: string;
  priceToman: number | null;
  description: string;
};

export const latestProducts: Product[] = [
  { slug: "classic-lighter", name: "فندک کلاسیک", image: "/images/categories/lighters.webp", priceToman: null, description: "طرح فندک درب‌دار با بدنهٔ مستطیلی." },
  { slug: "hookah-set", name: "قلیون پایه‌دار", image: "/images/categories/hookah.webp", priceToman: null, description: "طرح قلیون پایه‌دار با شلنگ و سینی." },
  { slug: "cube-charcoal", name: "ذغال مکعبی", image: "/images/categories/charcoal.webp", priceToman: null, description: "نمایی از فرم مکعبی ذغال." },
  { slug: "lighter-fuel", name: "بنزین فندک", image: "/images/categories/fuel.webp", priceToman: null, description: "طرح بطری سوخت مخصوص فندک." },
];

export function productPrice(value: number | null) {
  return value === null ? "قیمت ثبت نشده" : new Intl.NumberFormat("fa-IR").format(value) + " تومان";
}

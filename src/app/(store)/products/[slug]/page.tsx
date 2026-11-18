import ProductDetail from "@/features/catalog/ProductDetail";
export default async function ProductPage({params}:{params:Promise<{slug:string}>}) {
  return <ProductDetail slug={(await params).slug}/>;
}

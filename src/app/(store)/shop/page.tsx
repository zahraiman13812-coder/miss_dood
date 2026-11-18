import ShopCatalog from "@/features/catalog/ShopCatalog";
export default async function ShopPage({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}) {
  return <ShopCatalog params={await searchParams}/>;
}

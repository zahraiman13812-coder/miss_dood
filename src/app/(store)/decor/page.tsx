import { redirect } from "next/navigation";

export default function DecorPage() {
  redirect("/shop?category=decor");
}

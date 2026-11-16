import Image from "next/image";
import { decorItems } from "@/data/decor";

export default function DecorPhoto({ item }: { item: typeof decorItems[number] }) {
  return (
    <figure className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-panel">
      <div className="relative min-h-0 flex-1 bg-radial from-accent/10 to-header">
        <Image src={item.image} alt={item.name} fill sizes="(max-width: 380px) 74vw, 304px"
          className="pointer-events-none select-none object-contain p-4" draggable={false} />
      </div>
      <figcaption className="truncate border-t border-line px-4 py-3 text-center font-semibold text-content" title={item.name}>
        {item.name}
      </figcaption>
    </figure>
  );
}

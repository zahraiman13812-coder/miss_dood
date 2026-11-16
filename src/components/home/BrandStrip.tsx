import styles from "./BrandStrip.module.css";

const brands = ["بهمن", "Marlboro", "ایاز", "Al Fakher", "تیر", "Camel", "Nakhla"];

export default function BrandStrip() {
  return (
    <section aria-label="برندها" className="mx-auto max-w-7xl px-4 pb-8 sm:px-8">
      <div className="overflow-hidden rounded-xl border-y border-line bg-linear-to-l from-header via-panel to-header">
        <div dir="ltr" className={styles.window}>
          <div className={styles.track}>
            {[0, 1].map(copy => (
              <ul key={copy} aria-hidden={copy === 1 || undefined} className={styles.group}>
                {brands.map(name => (
                  <li key={name} className="flex min-w-28 flex-1 items-center justify-center gap-4 px-3 py-3 sm:min-w-36">
                    <bdi className="whitespace-nowrap font-serif text-sm font-medium text-accent sm:text-lg">{name}</bdi>
                    <span aria-hidden="true" className="size-1 rotate-45 bg-accent/50"/>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

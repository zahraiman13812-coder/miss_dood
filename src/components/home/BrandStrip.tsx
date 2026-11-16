import styles from "./BrandStrip.module.css";

const brands = ["بهمن", "Marlboro", "ایاز", "Al Fakher", "تیر", "Camel", "Nakhla"];

export default function BrandStrip() {
  return (
    <section
      aria-label="برندها"
      className="mx-auto max-w-7xl px-4 pb-8 sm:px-8"
    >
      <div className="overflow-hidden rounded-2xl border border-line bg-panel">
        <div dir="ltr" className={styles.window}>
          <div className={styles.track}>
            {[0, 1].map((copy) => (
              <ul
                key={copy}
                aria-hidden={copy === 1 || undefined}
                className={styles.group}
              >
                {brands.map((name) => (
                  <li
                    key={name}
                    className="flex min-w-44 flex-1 items-center justify-center px-5 py-5"
                  >
                    <bdi className="whitespace-nowrap font-serif text-2xl text-accent">
                      {name}
                    </bdi>
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
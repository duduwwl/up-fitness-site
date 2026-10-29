import { address, checkedAt, contact, mapsUrl, photos } from "@/content/site";
import { visitMessage, whatsappUrl } from "@/lib/links";
import { navItems } from "@/lib/nav";
import styles from "./footer.module.css";

const ext = { target: "_blank", rel: "noopener noreferrer" } as const;
const NewTab = () => <span className="visually-hidden"> (abre em nova aba)</span>;

export function Footer() {
  // Static page: a build-time Date would freeze anyway; use the content check year explicitly.
  const year = checkedAt.slice(0, 4);
  return (
    <footer className={`on-yellow ${styles.footer}`}>
      <div className="wrap">
        <div className={styles.mark} aria-hidden="true">
          <span className={`${styles.block} ${styles.b1}`}>U</span>
          <span className={`${styles.block} ${styles.b2}`}>P</span>
          <span className={`${styles.block} ${styles.b3}`}>
            <span className={styles.arrow} />
          </span>
        </div>
        <p className="visually-hidden">UP Fitness</p>

        <div className={styles.cols}>
          <nav aria-label="Rodapé">
            <h2 className={styles.colTitle}>Navegue</h2>
            <ul>
              {navItems.map((n) => (
                <li key={n.href}>
                  <a href={n.href}>{n.label}</a>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <h2 className={styles.colTitle}>Fale com a UP</h2>
            <ul>
              <li>
                <a href={whatsappUrl(visitMessage)} {...ext}>
                  WhatsApp {contact.phoneDisplay}
                  <NewTab />
                </a>
              </li>
              <li>
                <a href={contact.instagramUnit} {...ext}>
                  Instagram {contact.instagramUnitHandle}
                  <NewTab />
                </a>
              </li>
              <li>
                <a href={contact.salesUrl} {...ext}>
                  Assinar online
                  <NewTab />
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className={styles.colTitle}>Franquia</h2>
            <ul>
              <li>
                <a href={contact.instagramFranchise} {...ext}>
                  Seja franqueado: {contact.instagramFranchiseHandle}
                  <NewTab />
                </a>
              </li>
            </ul>
          </div>
          <div className={styles.addressCol}>
            <h2 className={styles.colTitle}>{address.region}, Lavras</h2>
            <address>
              {address.street}, {address.district}
              <br />
              {address.city} – {address.state}, CEP {address.postalCode}
            </address>
            <a href={mapsUrl} {...ext}>
              Ver no mapa
              <NewTab />
            </a>
          </div>
        </div>

        <p className={styles.credits}>
          Fotos ilustrativas via Wikimedia Commons:{" "}
          {Object.values(photos).map((p, i, all) => (
            <span key={p.src}>
              <a href={p.page} {...ext}>
                {p.caption.replace(/\. Imagem ilustrativa\.$|\.$/, "")}
                <NewTab />
              </a>
              , {p.credit}, {p.license}
              {i < all.length - 1 ? "; " : "."}
            </span>
          ))}
        </p>

        <div className={styles.bottom}>
          <p>© {year} UP Fitness Academias</p>
          <a className={`btn btn-dark ${styles.top}`} href="#inicio">
            Voltar ao topo
          </a>
        </div>
      </div>
    </footer>
  );
}

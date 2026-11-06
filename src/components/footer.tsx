import { TextEffects } from "./text-effects";
import Image from "next/image";
import { address, checkedAt, contact, mapsUrl } from "@/content/site";
import { visitMessage, whatsappUrl } from "@/lib/links";
import { navItems } from "@/lib/nav";
import styles from "./footer.module.css";

const ext = { target: "_blank", rel: "noopener noreferrer" } as const;
const NewTab = () => <span className="visually-hidden"> (abre em nova aba)</span>;

export function Footer() {
  // Static page: a build-time Date would freeze anyway; use the content check year explicitly.
  const year = checkedAt.slice(0, 4);
  return (
    <TextEffects>
    <footer className={`on-yellow ${styles.footer}`}>
      <div className="wrap">
        <a className={styles.logoLink} href="#inicio" aria-label="UP Fitness — voltar ao início">
          <Image
            className={styles.logo}
            src="/up-fitness-site/images/instagram-logo.webp"
            width={320}
            height={320}
            alt="UP Fitness"
          />
        </a>

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
                <a href="#planos">
                  Assinar online
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
          Fotos da unidade publicadas no Instagram oficial{" "}
          <a href={contact.instagramUnit} {...ext}>
            {contact.instagramUnitHandle}<NewTab />
          </a>.
        </p>

        <div className={styles.bottom}>
          <p>© {year} UP Fitness Academias</p>
          <a className={`btn btn-dark ${styles.top}`} href="#inicio">
            Voltar ao topo
          </a>
        </div>
      </div>
    </footer>
    </TextEffects>
  );
}


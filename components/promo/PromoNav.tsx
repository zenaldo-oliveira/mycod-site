import Link from "next/link";
import styles from "./promo.module.css";

// Links entre as prévias. Não aparecem no menu do site nem na home.
export function PromoNav() {
  return (
    <nav aria-label="Prévias">
      <ul className={styles.navLinks}>
        <li><Link href="/black-friday-preview">Black Friday</Link></li>
        <li><Link href="/servicos-preview">Serviços</Link></li>
        <li><Link href="/promocoes-preview">Promoções</Link></li>
      </ul>
    </nav>
  );
}

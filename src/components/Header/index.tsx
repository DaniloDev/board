import styles from "./styles.module.scss";
import Link from "next/link";

export function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Link href="/">
          <img src="/images/logo.svg" alt="Logo Meu board" />
        </Link>
        <nav>
          <Link href="/">Home</Link>
          <Link href="/board">Meu board</Link>
        </nav>
        <button>Entrar com github</button>
      </div>
    </header>
  );
}

import { signIn, signOut, useSession } from "next-auth/react";
import styles from "./styles.module.scss";
import { FaGithub } from "react-icons/fa";
import { FiX } from "react-icons/fi";

export function SignInButton() {
  const { data: session } = useSession();

  console.log("SESSEION ", session);

  return session ? (
    <button
      type="button"
      className={styles.signInButton}
      onClick={() => signOut()}
    >
      <img src={session.user.image} alt={`Imagem de ${session.user.name}}`} />
      Olá {session.user.name}
      <FiX color="#737388" className={styles.closeIcon} />
    </button>
  ) : (
    <button
      type="button"
      className={styles.signInButton}
      onClick={() => signIn("github")}
    >
      <FaGithub color="#ffb800" />
      Entrar com github
    </button>
  );
}

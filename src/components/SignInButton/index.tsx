import styles from "./styles.module.scss";
import { FaGithub } from "react-icons/fa";
import { FiX } from "react-icons/fi";

export function SignInButton() {
  const session = true;

  return session ? (
    <button type="button" className={styles.signInButton} onClick={() => {}}>
      <img
        src="https://media.licdn.com/dms/image/D4E35AQExHETfBQT8ZA/profile-framedphoto-shrink_200_200/0/1692739618899?e=1693519200&v=beta&t=mj-COWZCR0GeWeWf-FEFcmmj0GndwEIlgLg_fG55uSU"
        alt="USER IMAGE"
      />
      Olá Danilo
      <FiX color="#737388" className={styles.closeIcon} />
    </button>
  ) : (
    <button type="button" className={styles.signInButton} onClick={() => {}}>
      <FaGithub color="#ffb800" />
      Entrar com github
    </button>
  );
}

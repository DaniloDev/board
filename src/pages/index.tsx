import Head from "next/head";
import { GetStaticProps } from "next";
import styles from "../styles/styles.module.scss";

export default function Home() {
  return (
    <>
      <Head>
        <title>Board - Organizando suas tarefas.</title>
      </Head>
      <main className={styles.contentContainer}>
        <img src="/images/board-user.svg" alt="Ferramenta board" />

        <section className={styles.callToAction}>
          <h1>
            Uma ferramenta para seu dia a dia Escreva, planeje e organize-se..
          </h1>
          <p>
            <span>100% Gratuita </span>e online.
          </p>
        </section>

        <div className={styles.donaters}>
          <img
            src="https://media.licdn.com/dms/image/D4E35AQExHETfBQT8ZA/profile-framedphoto-shrink_200_200/0/1692739618899?e=1693519200&v=beta&t=mj-COWZCR0GeWeWf-FEFcmmj0GndwEIlgLg_fG55uSU"
            alt="Usuario apoaidor"
          />
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
    revalidate: 60 * 60,
  };
};

import { useState } from "react";
import Head from "next/head";
import { GetStaticProps } from "next";
import styles from "../styles/styles.module.scss";
import firebase from "../services/firebaseConnection";

const COLLECTION_NAME = "users";

interface HomeProps {
  data: string;
}

type Data = {
  id: string;
  donate: boolean;
  lastDonate: Date;
  image: string;
};

export default function Home({ data }: HomeProps) {
  const [donaters, setDonaters] = useState<Data[]>(JSON.parse(data));
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

        {donaters.length !== 0 && <h3>Apoiadores:</h3>}
        <div className={styles.donaters}>
          {donaters.map((item) => (
            <img key={item.image} src={item.image} alt="Usuario 1" />
          ))}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const donaters = await firebase.firestore().collection(COLLECTION_NAME).get();

  const data = JSON.stringify(
    donaters.docs.map((u) => {
      return {
        id: u.id,
        ...u.data(),
      };
    })
  );

  return {
    props: {
      data,
    },
    revalidate: 60 * 60,
  };
};

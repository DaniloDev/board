import styles from "./styles.module.scss";
import Head from "next/head";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";

interface DonateProps {
  user: {
    id: string;
    nome: string;
    image: string;
  };
}

export default function Donate({ user }: DonateProps) {
  return (
    <>
      <Head>
        <title>Ajude a plataforma board ficar online!</title>
      </Head>
      <main className={styles.container}>
        <img src="/images/rocket.svg" alt="Seja Apoiador" />

        <div className={styles.vip}>
          <img src={user.image} alt="Imagem Apoiador" />
          <span>Parabéns você é um novo apoaidor</span>
        </div>

        <h1>Seja um apoaidor deste projeto 🏆</h1>
        <h3>
          Contribua com apenas <span>R$ 1,00</span>
        </h3>
        <strong>
          Apareça na nossa home, tenha funcionalidades exclusivas.
        </strong>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });

  console.log("SESSION ", session);

  if (!session?.id) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const user = {
    id: session?.id,
    nome: session?.user.name,
    image: session?.user.image,
  };
  return {
    props: {
      user,
    },
  };
};

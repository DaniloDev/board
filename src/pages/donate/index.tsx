import { useState } from "react";
import styles from "./styles.module.scss";
import Head from "next/head";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";

import { PayPalButtons } from "@paypal/react-paypal-js";
import firebase from "../../services/firebaseConnection";

const COLLECTION_NAME = "users";

interface DonateProps {
  user: {
    id: string;
    nome: string;
    image: string;
  };
}

export default function Donate({ user }: DonateProps) {
  const [vip, setVip] = useState(false);
  const handleSaveDonate = async () => {
    await firebase
      .firestore()
      .collection(COLLECTION_NAME)
      .doc(user.id)
      .set({
        donate: true,
        lastDonate: new Date(),
        image: user.image,
      })
      .then(() => {
        setVip(true);
      });
  };

  return (
    <>
      <Head>
        <title>Ajude a plataforma board ficar online!</title>
      </Head>
      <main className={styles.container}>
        <img src="/images/rocket.svg" alt="Seja Apoiador" />

        {vip && (
          <div className={styles.vip}>
            <img src={user.image} alt="Imagem Apoiador" />
            <span>Parabéns {user.nome} você é um(a) novo(a) apoiador(a)</span>
          </div>
        )}

        <h1>Seja um apoiador deste projeto 🏆</h1>
        <h3>
          Contribua com apenas <span>R$ 1,00</span>
        </h3>
        <strong>
          Apareça na nossa home, tenha funcionalidades exclusivas.
        </strong>

        <PayPalButtons
          createOrder={(data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: "1",
                  },
                },
              ],
            });
          }}
          onApprove={(data, actions) => {
            return actions.order.capture().then(function (details) {
              console.log("Compra aprovada: " + details.payer.name.given_name);
              handleSaveDonate();
            });
          }}
        />
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

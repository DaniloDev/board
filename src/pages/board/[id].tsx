import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import firebase from "../../services/firebaseConnection";
import { format } from "date-fns";
import styles from "./task.module.scss";
import Head from "next/head";
import { FiCalendar } from "react-icons/fi";

interface TaskListProps {
  data: string;
}

type Task = {
  id: string;
  created: string | Date;
  createdFormated?: string;
  tarefa: string;
  userId: string;
  nome: string;
};

export default function TaskDetail({ data }: TaskListProps) {
  const task = JSON.parse(data) as Task;
  return (
    <>
      <Head>
        <title>Detalhes da sua tarefa</title>
      </Head>
      <article className={styles.container}>
        <div className={styles.actions}>
          <div>
            <FiCalendar size={30} color="#ffff" />
            <span>Tarefa criada:</span>
            <time>{task.createdFormated}</time>
          </div>
        </div>
        <p>{task.tarefa}</p>
      </article>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  const { id } = params;

  const session = await getSession({ req });

  if (!session?.vip) {
    return {
      redirect: {
        destination: "/board",
        permanent: false,
      },
    };
  }

  const data = await firebase
    .firestore()
    .collection("tarefas")
    .doc(String(id))
    .get()
    .then((snapshot) => {
      return JSON.stringify({
        id: snapshot.id,
        created: snapshot.data().created,
        createdFormated: format(
          snapshot.data().created.toDate(),
          "dd MMMM yyyy"
        ),
        tarefa: snapshot.data().tarefa,
        userId: snapshot.data().userId,
        nome: snapshot.data().nome,
      });
    })
    .catch(() => {
      return {};
    });

  if (Object.keys(data).length === 0) {
    return {
      redirect: {
        destination: "/board",
        permanent: false,
      },
    };
  }

  return {
    props: {
      data,
    },
  };
};

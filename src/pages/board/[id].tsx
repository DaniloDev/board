import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import firebase from "../../services/firebaseConnection";
import { format } from "date-fns";

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
    <div>
      <h1>Página de Detalhes</h1>
      <h2>{task.tarefa}</h2>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  const { id } = params;

  const session = await getSession({ req });

  if (!session?.id) {
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
    });
  return {
    props: {
      data,
    },
  };
};

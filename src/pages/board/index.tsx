import { useState, FormEvent } from "react";
import Head from "next/head";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import styles from "./styles.module.scss";
import { FiPlus, FiCalendar, FiEdit2, FiTrash, FiClock } from "react-icons/fi";
import { SupportButton } from "../../components/SupportButton";
import firebase from "../../services/firebaseConnection";
import format from "date-fns/format";
import Link from "next/link";
import { usePathname } from "next/navigation";

const COLLECTION_NAME = "tarefas";

interface BoardProps {
  user: {
    id: string;
    nome: string;
  };

  data: string;
}

interface Tasklist {
  id: string;
  created: string | Date;
  createdFormated?: string;
  tarefa: string;
  userId: string;
  nome: string;
}

export default function Board({ user, data }: BoardProps) {
  const [input, setInput] = useState("");
  const [taskList, setTaskList] = useState<Tasklist[]>(JSON.parse(data));

  const pathname = usePathname();

  const handleAddTask = async (e: FormEvent) => {
    e.preventDefault();

    if (input === "") {
      alert("Preencha alguma tarefa!");
      return;
    }

    await firebase
      .firestore()
      .collection(COLLECTION_NAME)
      .add({
        created: new Date(),
        tarefa: input,
        userId: user.id,
        nome: user.nome,
      })
      .then((doc) => {
        console.log("Cadastrado com sucesso");

        const data = {
          id: doc.id,
          created: new Date(),
          createdFormated: format(new Date(), "dd MMMM yyyy"),
          tarefa: input,
          userId: user.id,
          nome: user.nome,
        };

        setTaskList([...taskList, data]);

        setInput("");
      })
      .catch((err) => {
        console.log("Erro ao cadastrar", err);
      });
  };

  const handleDeleteTask = async (id: string) => {
    const resp = window.confirm("Deseja realmente excluir a tarefa ?");

    if (resp) {
      await firebase
        .firestore()
        .collection(COLLECTION_NAME)
        .doc(id)
        .delete()
        .then(() => {
          console.log("Deletado com sucesso!");
          let taskDeleted = taskList.filter((item) => {
            return item.id !== id;
          });

          setTaskList(taskDeleted);
        })
        .catch((err) => {
          console.log("ERR ", err);
        });
    } else {
      return;
    }
  };

  return (
    <>
      <Head>
        <title>Minhas tarefas - Board</title>
      </Head>
      <main className={styles.container}>
        <form onSubmit={handleAddTask}>
          <input
            type="text"
            placeholder="Digite sua tarefa..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit">
            <FiPlus size={25} color="#17181f" />
          </button>
        </form>

        <h1>
          Você tem {taskList.length}{" "}
          {taskList.length === 0 || 1 ? "tarefa" : "tarefas"}!
        </h1>

        <section>
          {taskList.map((task) => (
            <article className={styles.taskList} key={task.id}>
              <Link href={`${pathname}/${task.id}`}>
                <p>{task.tarefa}</p>
              </Link>
              <div className={styles.actions}>
                <div>
                  <div>
                    <FiCalendar size={20} color="#ffb800" />
                    <time>{task.createdFormated}</time>
                  </div>
                  <button>
                    <FiEdit2 size={20} color="#00a8ff" />
                    <span>Editar</span>
                  </button>
                </div>

                <button onClick={() => handleDeleteTask(task.id)}>
                  <FiTrash size={20} color="#ff3636" />
                  <span>Excluir</span>
                </button>
              </div>
            </article>
          ))}
        </section>
      </main>

      <div className={styles.vipContainer}>
        <h3>Obrigado por apoiar esse projeto.</h3>
        <div>
          <FiClock size={28} color="#fff" />
          <time>Última doação foi a 3 dias.</time>
        </div>
      </div>

      <SupportButton />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });

  if (!session?.id) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const tasks = await firebase
    .firestore()
    .collection(COLLECTION_NAME)
    .where("userId", "==", session?.id)
    .orderBy("created", "asc")
    .get();

  const data = JSON.stringify(
    tasks.docs.map((u) => {
      return {
        id: u.id,
        createdFormated: format(u.data().created.toDate(), "dd MMMM yyyy"),
        ...u.data(),
      };
    })
  );

  const user = {
    id: session?.id,
    nome: session?.user.name,
  };

  return {
    props: {
      user,
      data,
    },
  };
};

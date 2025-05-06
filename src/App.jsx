import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Card from "./components/TodosCard";
import Loader from "./components/Loader";

const firebaseUrl =
  "https://todosapp-c5197-default-rtdb.asia-southeast1.firebasedatabase.app/";
function App() {
  let taskInput = useRef(null);
  let [todos, setTodos] = useState([]);
  let [formStatus, setFormStatus] = useState(false);

  function handleSubmit() {
    setFormStatus(true);
    let task = taskInput.current.value;
    axios
      .post(`${firebaseUrl}todos.json`, {
        title: task,
      })
      .then(() => {
        setFormStatus(false);
        fetchTodos();
      });
  }

  function fetchTodos() {
    axios.get(`${firebaseUrl}todos.json`).then((todos) => {
      let tempTodos = [];
      for (let key in todos.data) {
        let todo = {
          id: key,
          ...todos.data[key],
        };
        tempTodos.push(todo);
      }
      setTodos(tempTodos);
    });
  }

  function handleDelete(id) {
    axios.delete(`${firebaseUrl}todos/${id}.json`).then(() => {
      fetchTodos();
    });
  }
  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <>
      <div className="w-[400px] mx-auto mt-12">
        <h1 className="text-2xl font-bold">
          Manage your tasks <span className="text-neutral-600">@Sai</span>
        </h1>

        <input
          ref={taskInput}
          className="mt-2 border rounded-xl p-3 w-full focus:outline-none border-neutral-300"
          type="text"
          placeholder="Add task"
        />
        <button
          onClick={handleSubmit}
          className="mt-2 bg-violet-200 py-3 px-5 text-violet-700 rounded-xl flex align-center gap-4 hover:bg-violet-500 cursor-pointer"
        >
          Create Todos{!formStatus ? "" : <Loader />}
        </button>

        <div className="mt-12">
          {todos.map((todo) => (
            <Card
              handleDelete={handleDelete}
              id={todo.id}
              title={todo.title}
              key={todo.id}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default App;

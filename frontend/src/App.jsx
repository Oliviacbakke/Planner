import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:5000/tasks")
      .then((response) => response.json())
      .then((data) => setTasks(data));
  }, []);

  function toggleTask(id) {
  fetch(`http://127.0.0.1:5000/tasks/${id}`, {
    method: "PUT",
  })
    .then((response) => response.json())
    .then((updatedTask) => {
      setTasks(
        tasks.map((task) =>
          task.id === id ? updatedTask : task
        ) 
      );
    });
  }

  function addTask() {
  fetch("http://127.0.0.1:5000/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: newTask,
      completed: false,
    }),
  })
    .then((response) => response.json())
    .then((task) => {
      setTasks([...tasks, task]);
      setNewTask("");
    });
}

  return (
    <div className="App">
    <div className="card">
      <h1>Olivia's Super Awesome Planner</h1>
      <p>Here's all the things I need to be able to lock in - so get hype</p>
    </div>

    <br></br>

    <div className="tasks">
      <h2>Tasks</h2>
      <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              <input type="checkbox" checked={task.completed} onChange={() => toggleTask(task.id)}/>
              {task.title}
            </li>
          ))}
      </ul>
    </div>

    <div className="breaks"></div>

    <div className="tasks">
      <h2>Add New Task</h2>
      <label>Task Name: </label>
      <input type="text" value={newTask} onChange={(e) => setNewTask(e.target.value)}></input>
      <button onClick={addTask}>Add Task</button>
      </div>
    </div>
  );
}

export default App;
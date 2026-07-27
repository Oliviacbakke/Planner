import { useState, useEffect } from "react";
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
      setTasks((prevTasks) =>
  prevTasks.map((task) =>
    task.id === id ? updatedTask : task
  )
);
    });
  }

  function deleteCompletedTasks() {
  const completedTasks = tasks.filter(task => task.completed);

  completedTasks.forEach(task => {
    fetch(`http://127.0.0.1:5000/tasks/${task.id}`, {
      method: "DELETE",
    });
  });

  setTasks(tasks.filter(task => !task.completed));
}

  function addTask() {
  fetch("http://127.0.0.1:5000/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: newTask,
    }),
  })
  .then(() => {
    fetch("http://127.0.0.1:5000/tasks")
      .then(response => response.json())
      .then(data => {
        setTasks(data);
      });
  });
  

  setNewTask("");
}

  function deleteTask(id) {
    fetch(`http://127.0.0.1:5000/tasks/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setTasks((prevTasks) =>
          prevTasks.filter((task) => task.id !== id)
        );
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
      <button onClick={addTask}>Add Task</button>
      <input type="text" value={newTask} onChange={(e) => setNewTask(e.target.value)}></input>
      </div>
    
    <br></br>

    <div className="tasks">
      <h2>Delete Completed Tasks</h2>
      <button onClick={deleteCompletedTasks}>Delete Completed Tasks</button>
    </div>
    </div>
  );
}

export default App;
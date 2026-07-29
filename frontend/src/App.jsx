import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [schedules, setSchedules] = useState([]);
  const [newSchedule, setNewSchedule] = useState("");
  const [date, setDate] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:5000/tasks")
      .then((response) => response.json())
      .then((data) => setTasks(data)); 
    fetch("http://127.0.0.1:5000/schedules")
      .then((response) => response.json())
      .then((data) => setSchedules(data));}, []);

  function toggleTask(id) {
    fetch(`http://127.0.0.1:5000/tasks/${id}`, {
      method: "PUT",})
      .then((response) => response.json())
      .then((updatedTask) => {
        setTasks((prevTasks) =>
    prevTasks.map((task) =>
      task.id === id ? updatedTask : task));});}

  function deleteCompletedTasks() {
  const completedTasks = tasks.filter(task => task.completed);
  completedTasks.forEach(task => {
    fetch(`http://127.0.0.1:5000/tasks/${task.id}`, {
      method: "DELETE",});});
  setTasks(tasks.filter(task => !task.completed));}

  function deleteSchedule(id) {
    fetch(`http://127.0.0.1:5000/schedules/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setSchedules((prevSchedules) =>
          prevSchedules.filter((schedule) => schedule.id !== id));});}

  function addTask() {
    fetch("http://127.0.0.1:5000/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",},
      body: JSON.stringify({
        title: newTask, due_date: dueDate}),})
    .then(() => {
      fetch("http://127.0.0.1:5000/tasks")
        .then(response => response.json())
        .then(data => {
          setTasks(data);});});
    setNewTask("");}

  function addSchedule() {
    fetch("http://127.0.0.1:5000/schedules", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",},
      body: JSON.stringify({
        title: newSchedule, date: date, start: start, end: end}),})
    .then(() => {
      fetch("http://127.0.0.1:5000/schedules")
        .then(response => response.json())
        .then(data => {
          setSchedules(data);});});
    setNewSchedule("");}

  function deleteTask(id) {
    fetch(`http://127.0.0.1:5000/tasks/${id}`, {
      method: "DELETE",})
      .then(() => {
        setTasks((prevTasks) =>
          prevTasks.filter((task) => task.id !== id));});}

  function deleteSchedule(id) {
    fetch(`http://127.0.0.1:5000/schedules/${id}`, {
      method: "DELETE",})
      .then(() => {
        setSchedules((prevSchedules) =>
    prevSchedules.filter((schedule) => schedule.id !== id));});}

  const sortedTasks = [...tasks].sort(
  (a, b) => new Date(a.due_date) - new Date(b.due_date));

  const sortedSchedules = [...schedules].sort(
  (a, b) => new Date(a.date) - new Date(b.date));

  const groupedTasks = sortedTasks.reduce((groups, task) => {
  if (!groups[task.due_date]) {
    groups[task.due_date] = [];}
  groups[task.due_date].push(task);
  return groups;}, {});

  const groupedSchedules = sortedSchedules.reduce((groups, schedule) => {
  if (!groups[schedule.date]) {
    groups[schedule.date] = [];}
  groups[schedule.date].push(schedule);
  return groups;}, {});

  return (
    <div className="App">
      <div className="card">
        <h1>Olivia's Super Awesome (ish) Planner</h1>
      </div>

      <div className="planner-layout">
        <div className="left_column">
          <div className="task_header">
            <p>Tasks</p>
          </div>

          <div className="tasks">
            {Object.entries(groupedTasks).map(([date, tasks]) => (
              <div key={date}>
                <h3>{new Date(date).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",})}</h3>
                  <ul>{tasks.map((task) => (
                    <li key={task.id}>
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTask(task.id)}/>
                        {task.title}
                    </li>))}
                  </ul>
              </div>))}
          </div>

          <div className="tasks">
            <h2>Add New Task</h2>
            <p>Name: <input type="text" value={newTask} onChange={(e) => setNewTask(e.target.value)}></input> <br></br></p>
            <label>Due Date: </label>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}/> <br></br>
            <button className="button" onClick={addTask}>Add Task</button>
            </div>

          <div className="tasks">
            <h2>Delete Completed Tasks</h2>
            <button className="button" onClick={deleteCompletedTasks}>Delete Tasks</button>
          </div>
          </div>


        <div className="right_column">
          <div className="schedule_header">
            <p>Schedule</p>
          </div>

            <div className="schedules">
              {Object.entries(groupedSchedules).map(([date, schedules]) => (
                <div key={date}>
                  <h3>{new Date(date + "T00:00:00").toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",})}</h3>
                    <ul>{schedules.map((schedule) => (
                      <li key={schedule.id}>
                        {schedule.title}: {schedule.start} - {schedule.end}
                        <button className="button" onClick={() => deleteSchedule(schedule.id)}>
                            Delete
                          </button>
                      </li>))}
                    </ul>
              </div>))}
            </div>
          
          <div className="schedules">
            <h2>Add New Event</h2>
            <p>Name: <input type="text" value={newSchedule} onChange={(e) => setNewSchedule(e.target.value)}></input> <br></br></p>
            <label>Date: </label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)}/> <br></br>
            <label>Start Time: </label>
            <input
              type="time"
              value={start}
              onChange={(e) => setStart(e.target.value)}/>
            <br />
            <label>End Time: </label>
            <input
              type="time"
              value={end}
              onChange={(e) => setEnd(e.target.value)}/>
            <button className="button" onClick={addSchedule}>Add Event</button>
          </div>
        </div>
      </div>

    </div>
  );
}

export default App;
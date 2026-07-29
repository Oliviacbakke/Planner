from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

def get_db_p():
    conn = sqlite3.connect("planner.db")
    conn.row_factory = sqlite3.Row
    return conn

def get_db_s():
    conn = sqlite3.connect("schedules.db")
    conn.row_factory = sqlite3.Row
    return conn

def create_database():
    connection = sqlite3.connect("planner.db")
    connection.execute("""
        CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY,
        title TEXT,
        completed BOOLEAN,
        due_date TEXT
        )
        """)
    connection.commit()
    connection.close()

def create_database_schedule():
    connection = sqlite3.connect("schedules.db")
    connection.execute("""
        CREATE TABLE IF NOT EXISTS schedules (
        id INTEGER PRIMARY KEY,
        title TEXT,
        date TEXT, 
        start TEXT,
        end TEXT
        )
        """)
    connection.commit()
    connection.close()
    
create_database()
create_database_schedule()

@app.route("/")
def home():
    return "Planner backend is running!"

@app.route("/tasks")
def get_tasks():
    connection = get_db_p()
    tasks = connection.execute("SELECT * FROM tasks").fetchall()
    connection.close()
    return jsonify([
    {
        "id": task["id"],
        "title": task["title"],
        "completed": bool(task["completed"]),
        "due_date": task["due_date"]
    }
    for task in tasks
])

@app.route("/schedules")
def get_schedule():
    connection = get_db_s()
    schedules = connection.execute("SELECT * FROM schedules").fetchall()
    connection.close()
    return jsonify([
    {
        "id": schedule["id"],
        "title": schedule["title"],
        "date": schedule["date"],
        "start": schedule["start"],
        "end": schedule["end"]
    }
    for schedule in schedules
])

@app.route("/tasks/<int:id>", methods=["PUT"])
def update_tasks(id):
    connection = get_db_p()
    task = connection.execute(
        "SELECT * FROM tasks WHERE id = ?",
        (id,)
    ).fetchone()
    if task is None:
        connection.close()
        return {"error": "Task not found"}, 404
    new_status = not task["completed"]
    connection.execute(
        "UPDATE tasks SET completed = ? WHERE id = ?",
        (new_status, id))
    connection.commit()
    connection.close()
    return {"id": id, "title": task["title"], "completed": new_status, "due_date": task["due_date"]}

@app.route("/tasks", methods=["POST"])
def add_task():
    new_task = request.json
    connection = get_db_p()
    connection.execute("INSERT INTO tasks (title, completed, due_date) VALUES (?, ?, ?)", (new_task["title"], False, new_task["due_date"]))
    connection.commit()
    connection.close()
    return  {"message": "Task added"}

@app.route("/schedules", methods=["POST"])
def add_schedule():
    new_schedule = request.json
    connection = get_db_s()
    connection.execute("INSERT INTO schedules (title, date, start, end) VALUES (?, ?, ?, ?)", (new_schedule["title"], new_schedule["date"], new_schedule["start"], new_schedule["end"]))
    connection.commit()
    connection.close()
    return  {"message": "Schedule added"}

@app.route("/tasks/<int:id>", methods=["DELETE"])
def delete_task(id):
    connection = get_db_p()
    connection.execute("DELETE FROM tasks WHERE id = ?", (id,))
    connection.commit()
    connection.close()
    return {"message": "Task deleted"}

@app.route("/schedules/<int:id>", methods=["DELETE"])
def delete_schedule(id):
    connection = get_db_s()
    connection.execute("DELETE FROM schedules WHERE id = ?", (id,))
    connection.commit()
    connection.close()
    return {"message": "Schedule deleted"}

if __name__ == "__main__":
    app.run(debug=True)
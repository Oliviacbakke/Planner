from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

def get_db():
    conn = sqlite3.connect("planner.db")
    conn.row_factory = sqlite3.Row
    return conn

def create_database():
    connection = sqlite3.connect("planner.db")
    connection.execute("""
        CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY,
        title TEXT,
        completed BOOLEAN
        )
        """)
    connection.commit()
    connection.close()
    
create_database()

@app.route("/")
def home():
    return "Planner backend is running!"

@app.route("/tasks")
def get_tasks():
    connection = get_db()
    tasks = connection.execute("SELECT * FROM tasks").fetchall()
    connection.close()
    return jsonify([
    {
        "id": task["id"],
        "title": task["title"],
        "completed": bool(task["completed"])
    }
    for task in tasks
])

@app.route("/tasks/<int:id>", methods=["PUT"])
def update_tasks(id):
    connection = get_db()
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
    return {"id": id, "title": task["title"], "completed": new_status}

@app.route("/tasks", methods=["POST"])
def add_task():
    new_task = request.json
    connection = get_db()
    connection.execute("INSERT INTO tasks (title, completed) VALUES (?, ?)", (new_task["title"], False))
    connection.commit()
    connection.close()
    return  {"message": "Task added"}

@app.route("/tasks/<int:id>", methods=["DELETE"])
def delete_task(id):
    connection = get_db()
    connection.execute("DELETE FROM tasks WHERE id = ?", (id,))
    connection.commit()
    connection.close()
    return {"message": "Task deleted"}

if __name__ == "__main__":
    app.run(debug=True)
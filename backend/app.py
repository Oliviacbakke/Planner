from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

tasks = [
    {
        "id": 1,
        "title": "Finish CS homework",
        "completed": False
    },
    {
        "id": 2,
        "title": "Apply for internship",
        "completed": False
    }
]

@app.route("/")
def home():
    return "Planner backend is running!"

@app.route("/tasks")
def get_tasks():
    return tasks

@app.route("/tasks/<int:id>", methods=["PUT"])
def update_tasks(id):
    for task in tasks:
        if task["id"] == id:
            task["completed"] = not task["completed"]
            return task
    return {"error": "Task not found"}, 404

@app.route("/tasks", methods=["POST"])
def add_task():
    new_task = request.json
    task = {"id": len(tasks) + 1, "title": new_task["title"], "completed": False}
    tasks.append(task)
    return task



if __name__ == "__main__":
    app.run(debug=True)
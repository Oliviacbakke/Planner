from flask import Flask

app = Flask(__name__)

tasks = [
    {
        "id": 1,
        "title": "Finish CS homework",
        "completed": False
    },
    {
        "id": 2,
        "title": "Apply for internship",
        "completed": True
    }
]

@app.route("/")
def home():
    return "Planner backend is running!"

@app.route("/tasks")
def get_tasks():
    return tasks

if __name__ == "__main__":
    app.run(debug=True)
document.addEventListener("DOMContentLoaded", loadTasks);

function addTask() {
    let taskInput = document.getElementById("task");
    let taskText = taskInput.value.trim();

    if (taskText === "") return;

    let taskList = document.getElementById("task-list");

    let li = document.createElement("li");
    li.textContent = taskText;
    li.addEventListener("click", toggleTask);

    let deleteBtn = document.createElement("button");
    deleteBtn.textContent = "X";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.addEventListener("click", deleteTask);

    li.appendChild(deleteBtn);
    taskList.appendChild(li);

    saveTasks();
    taskInput.value = "";
}

function toggleTask(event) {
    event.target.classList.toggle("completed");
    saveTasks();
}

function deleteTask(event) {
    event.stopPropagation();
    event.target.parentElement.remove();
    saveTasks();
}

function saveTasks() {
    let tasks = [];
    document.querySelectorAll("#task-list li").forEach(task => {
        tasks.push({ text: task.textContent.slice(0, -1), completed: task.classList.contains("completed") });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    let storedTasks = localStorage.getItem("tasks");
    if (!storedTasks) return;

    let taskList = document.getElementById("task-list");
    JSON.parse(storedTasks).forEach(taskData => {
        let li = document.createElement("li");
        li.textContent = taskData.text;
        if (taskData.completed) li.classList.add("completed");
        li.addEventListener("click", toggleTask);

        let deleteBtn = document.createElement("button");
        deleteBtn.textContent = "X";
        deleteBtn.classList.add("delete-btn");
        deleteBtn.addEventListener("click", deleteTask);

        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });
}

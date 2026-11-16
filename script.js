
let input = document.querySelector("#taskInput");

let text = "Add your new task. . . .";
let index = 0;
let deleting = false;

function typeEffect() {
    if (!deleting) {
        input.placeholder = text.substring(0, index + 1);
        index++;

        if (index === text.length) {
            deleting = true;
            setTimeout(typeEffect, 900);
            return;
        }
    } else {
        input.placeholder = text.substring(0, index - 1);
        index--;

        if (index === 0) {
            deleting = false;
        }
    }
    setTimeout(typeEffect, deleting ? 50 : 100);
}

typeEffect();

const taskInput = document.querySelector("#taskInput");
const addTaskBtn = document.querySelector("#addTask");
const taskList = document.querySelector(".task-list");
const allBtn = document.querySelector(".all");
const pendingBtn = document.querySelector(".pending");
const completedBtn = document.querySelector(".completed");

let tasks = [];

try {
    const savedTasks = localStorage.getItem("todoTasks");

    if (savedTasks !== null) {
        const parsedTasks = JSON.parse(savedTasks);

        if (Array.isArray(parsedTasks)) {
            tasks = parsedTasks;
        }
    }
} catch (error) {
    console.error("Error loading tasks:", error);
}

let currentFilter = "all";
let nextId = Math.max(
    0,
    ...tasks.map(task => Number(task.id) || 0)
) + 1;

function saveTasks() {
    localStorage.setItem("todoTasks", JSON.stringify(tasks));
}

function displayTasks() {
    taskList.innerHTML = "";

    let filteredTasks = tasks.filter(task => {
        if (currentFilter === "pending") {
            return !task.completed;
        }

        if (currentFilter === "completed") {
            return task.completed;
        }

        return true;
    });

    filteredTasks.forEach(task => {
        const taskDiv = document.createElement("div");
        taskDiv.className = "tasks";
        taskDiv.dataset.id = task.id;

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = `task-${task.id}`;
        checkbox.checked = task.completed;

        const label = document.createElement("label");
        label.htmlFor = `task-${task.id}`;
        label.textContent = task.text;

        if (task.completed) {
            label.style.textDecoration = "line-through";
            label.style.textDecorationColor = "yellow";
            label.style.textDecorationThickness = "2px";
            label.style.opacity = "0.6";
        }

        const deleteImg = document.createElement("img");
        deleteImg.src = "./icons8-delete-24.png";
        deleteImg.alt = "Delete task";
        deleteImg.title = "Delete task";

        taskDiv.append(checkbox, label, deleteImg);
        taskList.appendChild(taskDiv);
    });

    console.log("Total Tasks:", tasks.length);
    console.log(
        "Pending Tasks:",
        tasks.filter(task => !task.completed).length
    );
    console.log(
        "Completed Tasks:",
        tasks.filter(task => task.completed).length
    );
}

function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Please enter a task!");
        taskInput.focus();
        return;
    }

    const newTask = {
        id: nextId++,
        text: taskText,
        completed: false
    };

    tasks.push(newTask);
    saveTasks();
    displayTasks();
    taskInput.value = "";

    if (currentFilter !== "completed") {
        taskList.scrollTop = taskList.scrollHeight;
    }

    taskInput.focus();
}

addTaskBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        addTask();
    }
});

taskList.addEventListener("change", function(event) {
    if (event.target.type === "checkbox") {
        const taskDiv = event.target.closest(".tasks");
        const taskId = Number(taskDiv.dataset.id);
        const task = tasks.find(task => Number(task.id) === taskId);

        if (task) {
            task.completed = event.target.checked;
            saveTasks();

            const previousScrollPosition = taskList.scrollTop;
            displayTasks();
            taskList.scrollTop = previousScrollPosition;
        }
    }
});

taskList.addEventListener("click", function(event) {
    if (event.target.tagName === "IMG") {
        const taskDiv = event.target.closest(".tasks");
        const taskId = Number(taskDiv.dataset.id);

        tasks = tasks.filter(task => Number(task.id) !== taskId);
        saveTasks();

        const previousScrollPosition = taskList.scrollTop;
        displayTasks();
        taskList.scrollTop = previousScrollPosition;
    }
});

allBtn.addEventListener("click", function() {
    currentFilter = "all";
    displayTasks();
});

pendingBtn.addEventListener("click", function() {
    currentFilter = "pending";
    displayTasks();
});

completedBtn.addEventListener("click", function() {
    currentFilter = "completed";
    displayTasks();
});

displayTasks();

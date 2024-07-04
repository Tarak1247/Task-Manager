// Get elements
const taskInput = document.getElementById('task-input');
const deadlineInput = document.getElementById('deadline-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');
const filterCompleted = document.getElementById('filter-completed');
const filterActive = document.getElementById('filter-active');

// Initialize tasks array
let tasks = [];

// Load tasks from local storage
if (localStorage.tasks) {
    tasks = JSON.parse(localStorage.tasks);
    renderTasks();
}

// Add task event listener
addTaskBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const task = taskInput.value.trim();
    const deadline = deadlineInput.value;
    if (task) {
        tasks.push({ task, deadline, completed: false });
        localStorage.tasks = JSON.stringify(tasks);
        renderTasks();
        taskInput.value = '';
        deadlineInput.value = '';
    }
});

// Render tasks
function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach((task) => {
        const taskElement = document.createElement('li');
        taskElement.textContent = `${task.task} - Deadline: ${task.deadline}`;
        if (task.completed) {
            taskElement.classList.add('completed');
        }
        taskElement.addEventListener('click', () => {
            task.completed = !task.completed;
            localStorage.tasks = JSON.stringify(tasks);
            renderTasks();
        });
        taskList.appendChild(taskElement);
    });
}

// Filter tasks event listener
filterCompleted.addEventListener('change', () => {
    renderTasks();
});

filterActive.addEventListener('change', () => {
    renderTasks();
});

// Filter tasks function
function filterTasks() {
    const filteredTasks = tasks.filter((task) => {
        if (filterCompleted.checked && task.completed) return true;
        if (filterActive.checked && !task.completed) return true;
        return false;
    });
    taskList.innerHTML = '';
    filteredTasks.forEach((task) => {
        const taskElement = document.createElement('li');
        taskElement.textContent = `${task.task} - Deadline: ${task.deadline}`;
        if (task.completed) {
            taskElement.classList.add('completed');
        }
        taskElement.addEventListener('click', () => {
            task.completed = !task.completed;
            localStorage.tasks = JSON.stringify(tasks);
            renderTasks();
        });
        taskList.appendChild(taskElement);
    });
}

// Edit task function
function editTask(taskElement) {
    const taskText = taskElement.textContent;
    const taskInput = document.createElement('input');
    taskInput.type = 'text';
    taskInput.value = taskText;
    taskElement.innerHTML = '';
    taskElement.appendChild(taskInput);
    taskInput.addEventListener('blur', () => {
        const newTaskText = taskInput.value.trim();
        if (newTaskText) {
            const taskIndex = tasks.findIndex((task) => task.task === taskText);
            tasks[taskIndex].task = newTaskText;
            localStorage.tasks = JSON.stringify(tasks);
            renderTasks();
       }
    });
}

// Delete task function
function deleteTask(taskElement) {
    const taskText = taskElement.textContent;
    const taskIndex = tasks.findIndex((task) => task.task === taskText);
    tasks.splice(taskIndex, 1);
    localStorage.tasks = JSON.stringify(tasks);
    renderTasks();
}

// Add event listeners to task elements
taskList.addEventListener('click', (e) => {
    if (e.target.tagName === 'LI') {
        const taskElement = e.target;
        if (e.ctrlKey) {
            editTask(taskElement);
        } else if (e.shiftKey) {
            deleteTask(taskElement);
        } else {
            taskElement.classList.toggle('completed');
            const taskIndex = tasks.findIndex((task) => task.task === taskElement.textContent);
            tasks[taskIndex].completed =!tasks[taskIndex].completed;
            localStorage.tasks = JSON.stringify(tasks);
        }
    }
});

const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todo-list");
const filterOption = document.querySelector(".filter-todo");

// Event listeners
document.addEventListener("DOMContentLoaded", getLocalTodos);
todoButton.addEventListener("click", addTodo);
todoList.addEventListener("click", deleteCheck);
filterOption.addEventListener("change", filterTodo);

//Load filter option from local storage
document.addEventListener("DOMContentLoaded", function() {
    const savedFilterOption = localStorage.getItem("filterOption");
    if (savedFilterOption) {
        filterOption.value = savedFilterOption;
        filterTodo(); // Apply the saved filter option
    }
});

function addTodo(event) {
    event.preventDefault();
    const todoText = todoInput.value.trim(); // Trim whitespace from input
    if (todoText === "") {
        return; // Exit function if input is empty
    }
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");
    const newTodo = document.createElement("li");
    newTodo.innerText = todoInput.value; 
    newTodo.classList.add("todo-item");
    todoDiv.appendChild(newTodo);
    
    // Adding to local storage 
    saveLocalTodos(todoInput.value);

    const completedButton = document.createElement("button");
    completedButton.innerHTML = '<i class="fas fa-check-circle"></i>';
    completedButton.classList.add("complete-btn");
    todoDiv.appendChild(completedButton);

    const trashButton = document.createElement("button");
    trashButton.innerHTML = '<i class="fas fa-trash"></i>';
    trashButton.classList.add("trash-btn");
    todoDiv.appendChild(trashButton);
    
    todoList.appendChild(todoDiv);
    todoInput.value = "";
}

function deleteCheck(e) {
    const item = e.target;

    if(item.classList[0] === "trash-btn") {
        const todo = item.parentElement;
        todo.classList.add("slide");

        removeLocalTodos(todo);
        todo.addEventListener("transitionend", function() {
            todo.remove();
        });
    }

    if(item.classList[0] === "complete-btn") {
        const todo = item.parentElement;
        todo.classList.toggle("completed");

        // Update completion status in local storage
        updateLocalCompletion(todo);
    }
}

function filterTodo() {
    const todos = todoList.childNodes;
    todos.forEach(function(todo) {
        switch(filterOption.value) {
            case "all": 
                todo.style.display = "flex";
                break;
            case "completed": 
                if(todo.classList.contains("completed")) {
                    todo.style.display = "flex";
                } else {
                    todo.style.display = "none";
                }
                break;
            case "incomplete":
                if(!todo.classList.contains("completed")) {
                    todo.style.display = "flex";
                } else {
                    todo.style.display = "none";
                }
                break;
        }
    });

    // Save the selected filter option to local storage
    localStorage.setItem("filterOption", filterOption.value);
}

function saveLocalTodos(todo, isCompleted = false) {
    let todos;
    if(localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    todos.push({ text: todo, completed: isCompleted }); // Save both text and completion status
    localStorage.setItem("todos", JSON.stringify(todos));
}

function getLocalTodos() {
    let todos;
    if(localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    todos.forEach(function(todo) {
        if (todo && todo.text) {
            const todoDiv = document.createElement("div");
            todoDiv.classList.add("todo");

            const newTodo = document.createElement("li");
            newTodo.innerText = todo.text;
            newTodo.classList.add("todo-item");
            todoDiv.appendChild(newTodo);

            if (todo.completed) {
                todoDiv.classList.add("completed");
            }

            const completedButton = document.createElement("button");
            completedButton.innerHTML = '<i class="fas fa-check-circle"></i>';
            completedButton.classList.add("complete-btn");
            todoDiv.appendChild(completedButton);

            const trashButton = document.createElement("button");
            trashButton.innerHTML = '<i class="fas fa-trash"></i>';
            trashButton.classList.add("trash-btn");
            todoDiv.appendChild(trashButton);

            todoList.appendChild(todoDiv);
        }
    });
}

function removeLocalTodos(todo) {
    const todoText = todo.children[0].innerText;
    let todos = JSON.parse(localStorage.getItem("todos"));
    todos = todos.filter(item => item.text !== todoText);
    localStorage.setItem("todos", JSON.stringify(todos));
}

function updateLocalCompletion(todo) {
    const todoText = todo.children[0].innerText;
    let todos = JSON.parse(localStorage.getItem("todos"));
    const index = todos.findIndex(item => item.text === todoText);
    todos[index].completed = todo.classList.contains("completed");
    localStorage.setItem("todos", JSON.stringify(todos));
}

// Load todos from localStorage
function loadTodos() {
    const todos = JSON.parse(localStorage.getItem("todos")) || { "todoList": [] };
    console.log(todos);
    return todos;
}

// Add a new todo to localStorage
function addTodoToLocalStorage(todo) {
    const todos = loadTodos();
    todos.todoList.push(todo);
    localStorage.setItem("todos", JSON.stringify(todos));
}

// Filter todos based on the selected action
function executeFilterAction(event) {
    const element = event.target;
    const value = element.getAttribute("data-filter");
    refreshTodos(value); // Pass the filter type to the refresh function
}

// Edit a todo item
function executeEditAction(event) {
    const todoList = document.getElementById("todoList").children;
    const element = event.target;

    for (let todoItem of todoList) {
        if (todoItem.contains(element)) {
            const textDiv = todoItem.querySelector('div');
            const newText = prompt("Edit your todo", textDiv.textContent);
            if (newText) {
                textDiv.textContent = newText.trim();
                updateTodoInLocalStorage(todoItem.getAttribute("id"), newText.trim());
            }
            break;
        }
    }
    refreshTodos("all"); // Refresh the todos after editing
}

// Delete a todo item
function executeDeleteAction(event) {
    const todos = loadTodos();
    const element = event.target;
    const todoId = element.parentElement.parentElement.getAttribute("id");

    const updatedTodos = todos.todoList.filter(todo => todo.id !== todoId);
    localStorage.setItem("todos", JSON.stringify({ "todoList": updatedTodos }));

    refreshTodos("all"); // Refresh the todos after deleting
}

// Mark a todo as completed/incomplete
function executeCompleteAction(event) {
    const todos = loadTodos();
    const element = event.target;
    const todoId = element.parentElement.parentElement.getAttribute("id");

    todos.todoList.forEach(todo => {
        if (todo.id === todoId) {
            todo.isCompleted = !todo.isCompleted;
        }
    });

    localStorage.setItem("todos", JSON.stringify(todos));
    refreshTodos("all"); // Refresh the todos after marking as complete/incomplete
}

// Update a todo in localStorage
function updateTodoInLocalStorage(id, newText) {
    const todos = loadTodos();
    todos.todoList.forEach(todo => {
        if (todo.id === id) {
            todo.text = newText;
        }
    });
    localStorage.setItem("todos", JSON.stringify(todos));
}

// Add the todo item to the HTML list
function appendTodoInHtml(todoItem) {
    const todoList = document.getElementById("todoList");

    const todo = document.createElement("li");
    todo.setAttribute("id", todoItem.id);

    const textDiv = document.createElement("div");
    textDiv.textContent = todoItem.text;
    todo.classList.add("todoItem");

    if (todoItem.isCompleted) {
        todo.classList.add("completed");
    }

    const wrapper = document.createElement("div");
    wrapper.classList.add("todoButtons");

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.classList.add("editBtn");

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("deleteBtn");

    const completeBtn = document.createElement("button");
    completeBtn.textContent = todoItem.isCompleted ? "Incomplete" : "Complete";
    completeBtn.classList.add("completeBtn");
    todoItem.isCompleted ? todo.classList.add("isCompleted") : null;

    editBtn.addEventListener("click", executeEditAction);
    deleteBtn.addEventListener("click", executeDeleteAction);
    completeBtn.addEventListener("click", executeCompleteAction);

    wrapper.appendChild(editBtn);
    wrapper.appendChild(deleteBtn);
    wrapper.appendChild(completeBtn);

    todo.appendChild(textDiv);
    todo.appendChild(wrapper);

    todoList.appendChild(todo);
}

// Reset the HTML todo list
function resetTodosHtml() {
    const todoList = document.getElementById("todoList");
    todoList.innerHTML = ''; // Clear all todos from the HTML list
}

// Refresh todos based on filter criteria (all, pending, completed)
function refreshTodos(filter = "all") {
    resetTodosHtml(); // Clear the HTML list before appending new todos

    const todos = loadTodos();

    if (filter === "all") {
        todos.todoList.forEach(todo => {
            appendTodoInHtml(todo);
        });
    } else if (filter === "pending") {
        todos.todoList.forEach(todo => {
            if (!todo.isCompleted) {
                appendTodoInHtml(todo);
            }
        });
    } else if (filter === "completed") {
        todos.todoList.forEach(todo => {
            if (todo.isCompleted) {
                appendTodoInHtml(todo);
            }
        });
    }
}

// Add a new todo
function addNewTodo() {
    const todoInput = document.getElementById("todoInput");
    const todoText = todoInput.value;
    if (todoText === '') {
        alert("Please write something for the todo");
    } else {
        const newTodo = { id: (loadTodos().todoList.length + 1).toString(), text: todoText, isCompleted: false };
        addTodoToLocalStorage(newTodo);
        todoInput.value = '';
        refreshTodos("all"); // Refresh after adding a new todo
    }
}

// Initialize event listeners after DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    const todoInput = document.getElementById("todoInput");
    const submitButton = document.getElementById("addTodo");
    const filterBtns = document.getElementsByClassName("filterBtn");

    Array.from(filterBtns).forEach(btn => {
        btn.addEventListener("click", executeFilterAction);
    });

    submitButton.addEventListener("click", () => {
        const todoText = todoInput.value;
        if (todoText === '') {
            alert("Please write something for the todo");
        } else {
            const newTodo = { id: (loadTodos().todoList.length + 1).toString(), text: todoText, isCompleted: false };
            addTodoToLocalStorage(newTodo);
            todoInput.value = '';
            refreshTodos("all"); // Refresh after adding a new todo
        }
    });

    todoInput.addEventListener("change", (event) => {
        const todoText = event.target.value;
        event.target.value = todoText.trim();
        console.log(event.target.value);
    });

    refreshTodos(); // Initial loading of todos when the page is loaded

    document.addEventListener("keypress", (event) => {
        if (event.code === 'Enter') {
            addNewTodo();
        }
    });
});

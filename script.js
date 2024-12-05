let currentFilter = "all";

function saveTodosToLocalStorage(todos) {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function getTodosFromLocalStorage() {
  const todos = localStorage.getItem("todos");
  return todos ? JSON.parse(todos) : [];
}

function renderTodos() {
  const todos = getTodosFromLocalStorage();
  const mainContainer = document.querySelector(".main-container");

  const filteredTodos = todos.filter((todo) => {
    if (currentFilter === "all") {
      return true;
    } else if (currentFilter === "pending") {
      return todo.status === "pending";
    } else if (currentFilter === "completed") {
      return todo.status === "completed";
    }
  });

  if (filteredTodos.length === 0) {
    mainContainer.innerHTML = "<p>No tasks found !</p>";
  } else {
    mainContainer.innerHTML = filteredTodos
      .map(
        (todo, index) => `
        <div class="todos">
          <label id="todos">
            <input type="checkbox" data-index="${index}" ${
          todo.status === "completed" ? "checked" : ""
        } />
            <span class="todo-name">${todo.name}</span>
          </label>
          <div class="btn">
            <button class="edit" data-index="${index}">Edit</button>
            <button class="delete" data-index="${index}">Delete</button>
          </div>
        </div>
      `
      )
      .join("");
  }

  document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
    checkbox.addEventListener("change", toggleStatus);
  });

  document.querySelectorAll(".edit").forEach((editButton) => {
    editButton.addEventListener("click", editTodo);
  });

  document.querySelectorAll(".delete").forEach((deleteButton) => {
    deleteButton.addEventListener("click", deleteTodo);
  });
}

function toggleStatus(event) {
  const index = event.target.dataset.index;
  const todos = getTodosFromLocalStorage();
  todos[index].status = event.target.checked ? "completed" : "pending";
  saveTodosToLocalStorage(todos);
  renderTodos();
}

function editTodo(event) {
  const index = event.target.dataset.index;
  const todos = getTodosFromLocalStorage();
  const newName = prompt("Edit your todo:", todos[index].name);

  if (newName && newName !== todos[index].name) {
    todos[index].name = newName;
    saveTodosToLocalStorage(todos);
    renderTodos();
  }
}

function deleteTodo(event) {
  const index = event.target.dataset.index;
  const todos = getTodosFromLocalStorage();
  todos.splice(index, 1);
  saveTodosToLocalStorage(todos);
  renderTodos();
}

function clearAllTodos() {
  localStorage.removeItem("todos");
  renderTodos();
}

function filterTodos(filter) {
  currentFilter = filter;
  renderTodos();

  document.querySelectorAll(".all-link a").forEach((link) => {
    link.classList.remove("active");
  });

  const activeLink = document.querySelector(
    `.all-link a[href='#'][onclick*="${filter}"]`
  );
  if (activeLink) {
    activeLink.classList.add("active");
  }
}

function addTodo() {
  const input = document.getElementById("input");
  const newTodoName = input.value.trim();

  if (newTodoName) {
    const todos = getTodosFromLocalStorage();
    const newTodo = {
      name: newTodoName,
      status: "pending",
    };
    todos.push(newTodo);
    saveTodosToLocalStorage(todos);
    input.value = "";
    renderTodos();
  }
}

document.querySelector(".add-btn").addEventListener("click", addTodo);
document.getElementById("input").addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    addTodo();
  }
});

renderTodos();

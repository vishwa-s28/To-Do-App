let currentFilter = "all";
const apiUrl = "http://localhost:3000/todos";

async function getTodosFromServer() {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const todos = await response.json();
    return todos;
  } catch (error) {
    console.error("Error fetching todos:", error);
    return [];
  }
}

async function saveTodoToServer(newTodo) {
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        todo: newTodo.name,
        status: newTodo.status,
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error adding todo:", error);
  }
}

async function updateTodoOnServer(id, updatedTodo) {
  try {
    const response = await fetch(`${apiUrl}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTodo),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating todo:", error);
  }
}

async function deleteTodoOnServer(id) {
  try {
    const response = await fetch(`${apiUrl}/${id}`, {
      method: "DELETE",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting todo:", error);
  }
}

async function deleteAllTodosOnServer() {
  try {
    const response = await fetch(`${apiUrl}/all`, {
      method: "DELETE",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting todo:", error);
  }
}

async function renderTodos() {
  const todos = await getTodosFromServer();
  const mainContainer = document.querySelector(".main-container");

  const filteredTodos = todos.filter((todo) => {
    if (currentFilter === "all") {
      return true;
    } else if (currentFilter === "pending") {
      return todo.status === false;
    } else if (currentFilter === "completed") {
      return todo.status === true;
    }
  });

  if (filteredTodos.length === 0) {
    mainContainer.innerHTML = "<p>No tasks found !</p>";
  } else {
    mainContainer.innerHTML = filteredTodos
      .map(
        (todo) => `  
        <div class="todos">
          <label id="todos">
            <input type="checkbox" data-id="${todo.id}" ${
          todo.status === true ? "checked" : ""
        } />
            <span class="todo-name">${todo.todo}</span>
          </label>
          <div class="btn">
            <button class="edit" data-id="${todo.id}">Edit</button>
            <button class="delete" data-id="${todo.id}">Delete</button>
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

  document.getElementById("input").focus();
}

async function toggleStatus(event) {
  const id = event.target.dataset.id;
  const todos = await getTodosFromServer();
  const todo = todos.find((todo) => todo.id === parseInt(id));

  const updatedTodo = {
    todo: todo.todo,
    status: event.target.checked ? true : false,
  };

  await updateTodoOnServer(id, updatedTodo);
  renderTodos();
}

async function editTodo(event) {
  const id = event.target.dataset.id;
  const todos = await getTodosFromServer();
  const todo = todos.find((todo) => todo.id === parseInt(id));

  const newName = prompt("Edit your todo:", todo.todo);

  if (newName && newName !== todo.todo) {
    const updatedTodo = {
      todo: newName,
      status: todo.status,
    };
    await updateTodoOnServer(id, updatedTodo);
    renderTodos();
  }
}

async function deleteTodo(event) {
  const id = event.target.dataset.id;
  await deleteTodoOnServer(id);
  renderTodos();
}

function clearAllTodos() {
  alert("Are you sure to clear all todos?");
  deleteAllTodosOnServer();
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

async function addTodo() {
  const input = document.getElementById("input");
  const newTodoName = input.value.trim();
  if (!newTodoName) {
    alert("please enter task");
    return;
  }

  const newTodo = {
    name: newTodoName,
    status: false,
  };

  await saveTodoToServer(newTodo);
  input.value = "";
  renderTodos();
}

document.getElementById("input").addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    addTodo();
  }
});

renderTodos();

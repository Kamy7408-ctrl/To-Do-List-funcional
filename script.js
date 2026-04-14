// ==============================
// SELEÇÃO DE ELEMENTOS
// ==============================

const taskInput = document.getElementById("taskInput");
const prioritySelect = document.getElementById("prioritySelect");
const addTaskButton = document.getElementById("addTaskButton");
const taskList = document.getElementById("taskList");
const feedback = document.getElementById("feedback");
const counter = document.getElementById("counter");


// ==============================
// FUNÇÃO UTILITÁRIA
// ==============================

/**
 * Cria um elemento HTML com classe e conteúdo opcional
 */
function createElement(tag, className, textContent = "") {
    const element = document.createElement(tag);

    if (className) element.className = className;
    if (textContent) element.textContent = textContent;

    return element;
}


// ==============================
// FEEDBACK PARA O USUÁRIO
// ==============================

function showFeedback(message) {
    feedback.textContent = message;

    // Limpa após alguns segundos
    setTimeout(() => {
        feedback.textContent = "";
    }, 2000);
}


// ==============================
// CONTADOR DE TAREFAS
// ==============================

function updateCounter() {
    const total = document.querySelectorAll(".task-item").length;
    counter.textContent = `Total: ${total}`;
}


// ==============================
// SALVAR / CARREGAR (LOCALSTORAGE)
// ==============================

function saveTasks() {
    localStorage.setItem("tasks", taskList.innerHTML);
}

function loadTasks() {
    const savedTasks = localStorage.getItem("tasks");

    if (savedTasks) {
        taskList.innerHTML = savedTasks;

        // Reaplicar eventos (IMPORTANTE)
        document.querySelectorAll(".task-item").forEach((li) => {
            const checkbox = li.querySelector(".task-complete");
            const removeButton = li.querySelector(".task-remove");

            addTaskEvents(li, checkbox, removeButton);
        });
    }

    updateCounter();
}


// ==============================
// EVENTOS DA TAREFA
// ==============================

function addTaskEvents(li, checkbox, removeButton) {

    // Concluir tarefa
    checkbox.addEventListener("change", () => {
        li.classList.toggle("completed");
        checkbox.setAttribute("aria-checked", checkbox.checked);

        saveTasks();
    });

    // Remover tarefa
    removeButton.addEventListener("click", () => {
        li.remove();

        updateCounter();
        saveTasks();
        showFeedback("Tarefa removida");
    });

    // Acessibilidade
    checkbox.setAttribute("aria-label", "Marcar tarefa como concluída");
    removeButton.setAttribute("aria-label", "Remover tarefa");
}


// ==============================
// RESET DO FORMULÁRIO
// ==============================

function resetForm() {
    taskInput.value = "";
    prioritySelect.value = "baixa";
    taskInput.focus();
}


// ==============================
// CRIAR NOVA TAREFA
// ==============================

function createTask() {
    const taskText = taskInput.value.trim();
    const priority = prioritySelect.value;

    // Validação
    if (!taskText) {
        showFeedback("Digite uma tarefa!");
        return;
    }

    // Criando elementos
    const li = createElement("li", "task-item");

    const spanText = createElement("span", "task-text", taskText);

    const spanPriority = createElement(
        "span",
        `task-priority ${priority}`,
        priority.toUpperCase()
    );

    const checkbox = createElement("input", "task-complete");
    checkbox.type = "checkbox";

    const removeButton = createElement("button", "task-remove", "✕");

    // Adiciona eventos
    addTaskEvents(li, checkbox, removeButton);

    // Monta elemento
    li.append(spanText, spanPriority, checkbox, removeButton);
    taskList.appendChild(li);

    // Atualizações
    updateCounter();
    saveTasks();
    showFeedback("Tarefa adicionada");

    resetForm();
}


// ==============================
// EVENTOS GLOBAIS
// ==============================

// Botão adicionar
addTaskButton.addEventListener("click", createTask);

// Enter no input
taskInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        createTask();
    }
});

// Carregar tarefas ao iniciar
window.addEventListener("load", loadTasks);

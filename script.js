// Elementos do DOM
const taskInput = document.getElementById('taskInput');
const prioritySelect = document.getElementById('prioritySelect');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');

// Array para armazenar as tarefas
let tasks = [];

// Carregar tarefas do localStorage ao iniciar
window.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    renderTasks();
});

// Adicionar tarefa ao clicar no botão
addTaskBtn.addEventListener('click', addTask);

// Adicionar tarefa ao pressionar Enter
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Função para adicionar tarefa
function addTask() {
    const taskText = taskInput.value.trim();
    const priority = prioritySelect.value;
    
    if (taskText === '') {
        alert('Por favor, digite uma tarefa!');
        return;
    }
    
    const task = {
        id: Date.now(),
        text: taskText,
        priority: priority,
        completed: false
    };
    
    tasks.push(task);
    saveTasks();
    renderTasks();
    
    // Limpar input
    taskInput.value = '';
    taskInput.focus();
}

// Função para renderizar tarefas
function renderTasks() {
    taskList.innerHTML = '';
    
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.priority}${task.completed ? ' completed' : ''}`;
        
        li.innerHTML = `
            <input 
                type="checkbox" 
                class="task-checkbox" 
                ${task.completed ? 'checked' : ''}
                onchange="toggleTask(${task.id})"
            >
            <span class="task-text">${task.text}</span>
            <span class="task-priority ${task.priority}">${task.priority}</span>
            <button class="delete-btn" onclick="deleteTask(${task.id})">Remover</button>
        `;
        
        taskList.appendChild(li);
    });
}

// Função para alternar status de conclusão
function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
    }
}

// Função para deletar tarefa
function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
}

// Função para salvar no localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Função para carregar do localStorage
function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }
}

// Expor funções globalmente para uso inline
window.toggleTask = toggleTask;
window.deleteTask = deleteTask;

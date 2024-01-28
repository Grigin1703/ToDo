// Находим нуджные элементы на странице 
const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const taskList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');


let tasks = [];

if (localStorage.getItem('tasks')){
    tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.forEach((task) => renderTask(task));
}


checkEmptyList();

// Добавление задачи
form.addEventListener('submit', addTask);
// Удаление задачи 
taskList.addEventListener('click', deleteTask)
// отмечаем задачу завершённой 
taskList.addEventListener('click', doneTask)

// Функции
function addTask (event){
    // отменяем отправку формы
    event.preventDefault();

    // Достаем текс задачи из поля ввода
    const taskText = taskInput.value;

    // Описываем задачу в виде объекта 
    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false,
    };

    // добавляем задачу в массив с задачами 
    tasks.push(newTask);

    saveToLocalStorage();

    renderTask(newTask);
 
    // Очищаем поле ввода и возвращаем фокус на него
    taskInput.value = '';
    taskInput.focus();
 
    checkEmptyList();
}

function deleteTask(event){
    // Провереям если клик был не по кнопке "удалить задачу"
    if (event.target.dataset.action !== 'delete') return;

    const parenNode = event.target.closest('li');

    // Определяем ID задачи
    const id = parenNode.id;

    // Находим индекс задачи в массиве
    const index = tasks.findIndex((task) => task.id == id);


    // Удаляем задачу из массива с задачами
    tasks.splice(index, 1);
    saveToLocalStorage();

    // Удаляем задача из разметки
    parenNode.remove();

    checkEmptyList();
    
}

function doneTask(event){

    // Проверяем если клик был не по кнопке "задача выполнена"
    if (event.target.dataset.action !== 'done') return;

    const parentNode = event.target.closest('.list-group-item');

    // Орпеделяем ID задачи
    const id = parentNode.id;
    const task = tasks.find((task) => task.id == id);
    task.done = !task.done;


    saveToLocalStorage();

    const taskTitle = parentNode.querySelector("span");
    taskTitle.classList.toggle('task-title--done');

}

function checkEmptyList(){
    if (tasks.length === 0){
        const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
        <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
        <div class="empty-list__title">Список дел пуст</div>
        </li>`;

        taskList.insertAdjacentHTML("afterbegin", emptyListHTML);
    } else{
        const emptyListEl = document.querySelector('#emptyList');
        emptyListEl ? emptyListEl.remove(): null;
    }
}

function saveToLocalStorage(){
    localStorage.setItem('tasks', JSON.stringify(tasks))
}

function renderTask(task){
    // формируем css класс
    const cssClass = task.done ? "task-title task-title--done" : "task-title";

    // Формируем разметку для новой задачи
    const taskHTML = `
                    <li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
                    <span class="${cssClass}">${task.text}</span>
                    <div class="task-item__buttons">
                        <button type="button" data-action="done" class="btn-action">
                            <img src="./img/tick.svg" alt="Done" width="18" height="18">
                        </button>
                        <button type="button" data-action="delete" class="btn-action">
                            <img src="./img/cross.svg" alt="Done" width="18" height="18">
                        </button>
                    </div>
                </li>`;
     
    // Добавляем задачу на страницу
    taskList.insertAdjacentHTML('beforeend', taskHTML);
}
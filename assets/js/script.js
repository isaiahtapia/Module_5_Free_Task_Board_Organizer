const $taskTodo = $('.todo');
const $taskInProgress = $('.in-progress');
const $addTaskBtn = $('#add-task');
const $taskDone = $('.done');

// Function that creates a task
function createTask() {
    const taskId = generateRandomNumber();
    const $taskTitle = $('#task-title');
    const $description = $('#description-info');
    const $dueDate = $('#dueDate');

    const Task = {
        taskId: taskId,
        title: $taskTitle.val(),
        description: $description.val(),
        dueDate: $dueDate.val(),
        done: false
    };

    let tasks = getTaskData();

    if (!tasks) {
        tasks = [];
    }

    tasks.push(Task);

    localStorage.setItem('tasks', JSON.stringify(tasks));

    $taskTitle.val('');
    $description.val('');
    $dueDate.val('');

    $('#formModal').modal('hide');

    outputTasks();
}
//Get tasks object from local storage
function getTaskData() {
    const taskData = JSON.parse(localStorage.getItem('tasks'));
    return taskData;
}

//Create a function that deletes a task
function deleteTask(eventObj) {
    const btn = $(eventObj.target);
    const taskId = btn.closest('article').data('id');
    let tasks = getTaskData();
    const filtered = tasks.filter(taskObj => taskObj.taskId !== taskId);

    localStorage.setItem('tasks', JSON.stringify(filtered));
    btn.closest('article').remove();
    outputTasks();
}

//Create the drag function
function setDrag() {
    $('main').on('mousedown', 'article', function() {
        $(this).draggable({
            opacity: .5,
            zIndex: 200,
            helper: 'clone'
        });
    });
}

function outputTasks() {
    const tasks = getTaskData();
    if (tasks) {
        $taskTodo.empty();
        $taskInProgress.empty();
        $taskDone.empty();

        tasks.forEach(function (taskObj) {
            const $taskEl = $(`
                <article data-id="${taskObj.taskId}" class="bg-white p-3 border m-3">
                  <h5>Task Name: ${taskObj.title}</h5>
                  <p>Description: ${taskObj.description}</p>
                  <p>Due Date: ${taskObj.dueDate}</p>
                  <button class="btn bg-danger text-white">Delete</button>
                </article>
            `);

            if (taskObj.done) {
                $taskDone.append($taskEl);
                $taskEl.addClass('done');
            } else if (taskObj.taskInProgress) {
                $taskInProgress.append($taskEl);
                $taskEl.addClass('in-progress');
            } else {
                $taskTodo.append($taskEl);
            }
        });

        setDrag();
    }
}

function handleTaskDrop(eventObj, ui) {
    const taskCard = $(eventObj.target);
    const taskId = ui.draggable.data('id');
    const tasks = getTaskData();
    const task = tasks.find(taskObj => taskObj.taskId === taskId);

    if (taskCard.hasClass('in-progress')) {
        task.done = false;
        task.taskInProgress = true;
    } else if (taskCard.hasClass('done')) {
        task.done = true;
        task.taskInProgress = false;
    } else {
        task.done = false;
        task.taskInProgress = false;
    }

    localStorage.setItem('tasks', JSON.stringify(tasks));
    outputTasks();
}

function generateRandomNumber() {
    const min = Math.pow(10, 14); // Minimum 15-digit number
    const max = Math.pow(10, 15) - 1; // Maximum 15-digit number

    return Math.floor(Math.random() * (max - min + 1) + min);
}

function init() {
    $('#dueDate').datepicker({
        minDate: 0
    });

    $('main').on('click', 'button.bg-danger', deleteTask);
    $addTaskBtn.on('click', createTask);
    outputTasks();
}

init();
//labels
const titleInput = document.getElementById('title-label');
const descriptionInput = document.getElementById('description-label');
const dateInput = document.getElementById('date-label');

//containers
const listWrapper = document.getElementById('list-wrapper');
const formContainer = document.getElementById('form-container');
//btn
const showFormButton = document.getElementById('show-form-button');
const addTaskButton = document.getElementById('add-btn');
const editTaskButton = document.getElementById('edit-btn');
const closeFormButton = document.getElementById('close-form');


class TaskApi{

    constructor() {
        if (localStorage.getItem("taskList") === null){
            this.tasklist = [];
        } else {
            this.tasklist = JSON.parse(localStorage.getItem("taskList"));
        }
        this.showList();
    }

    getTask(id){
        return this.tasklist.find(task => {
            return task.id === id;
        })

    }
    getList(){
        return this.tasklist;
    };

    addTask(task){
        this.tasklist.push({
            id: this.createUUID(),
            ...task
        });
        this.clearForm();
        this.saveInLocalStorage();
    };

    editTask(task){
        const index = this.tasklist.indexOf(task);
        editTaskButton.addEventListener('click', confirmEdit);
        function confirmEdit(){
            taskApi.editChangeValue(index);
            taskApi.showList();
            taskApi.saveInLocalStorage();
            addTaskButton.classList.remove('hidden');
            editTaskButton.classList.add('hidden');
            formContainer.classList.add('hidden')
            editTaskButton.removeEventListener('click',confirmEdit);
            }
    }




    deleteTask(id){
        this.tasklist = this.tasklist.filter(task => {
            return task.id !== id;
        })
        this.showList();
        this.saveInLocalStorage();
    }

    marksDone(id){
        const taskToEdit = this.getTask(id);
        const indexOfTaskToEdit = this.tasklist.indexOf(taskToEdit);
        this.tasklist[indexOfTaskToEdit].isDone = !this.tasklist[indexOfTaskToEdit].isDone;
        this.showList();
    }

    showList(){
        this.clearList()
        this.tasklist.forEach(task => {
            this.createTaskContainer(task);
        })

    }

    createTaskContainer(task){
        const container = this.createDiv('task-container', listWrapper);

        this.createTaskPlacements(container, task);

        const btnContainer = this.createDiv('btn-container', container)
        this.createEditButton(task.id, btnContainer);

        this.createDeleteButton(task.id, btnContainer);

        this.createMarksDoneButton(task.id, btnContainer);

        if(task.isDone){
            container.classList.add('done')
        }

    }

    createTaskPlacements(container, task){
        const title = this.createDiv('title-container', container);
        title.innerText = task.title;

        const priority = this.createDiv('priority-container', container);
        priority.innerText = `Priority: ${task.priority}`

        const description = this.createDiv('description-container', container);
        description.innerText = task.description;

        const date = this.createDiv('date-container', container);
        date.innerText = task.date;


    }

    createDiv(className, parent){
        const div = document.createElement('div');
        div.classList.add(className);
        parent.appendChild(div)
        return div;
    }

    createEditButton(dataInfo, container){
        const button = document.createElement('button');
        button.dataset.id = dataInfo;
        button.classList.add('btn');
        button.innerText = "Edit";
        //this insue, need to use arrow function
        button.addEventListener('click', (e) =>{
            showForm();
            addTaskButton.classList.add('hidden');
            editTaskButton.classList.remove('hidden');
            const id = e.target.dataset.id
            const taskToEdit = this.getTask(id);
            this.getCurrentTaskValue(taskToEdit)
            this.editTask(taskToEdit);
        });

        // addTaskButton.classList.remove('hidden');
        // editTaskButton.classList.add('hidden');


        container.appendChild(button);

    }

    createDeleteButton(dataInfo,container){
        const button = document.createElement('button');
        button.dataset.id = dataInfo;
        button.classList.add('btn');
        button.innerText = "Delete";
        button.addEventListener('click', (e) =>{
            const id = e.target.dataset.id
            this.deleteTask(id);
        });
        container.appendChild(button);

    }

    createMarksDoneButton(dataInfo, container){
        const button = document.createElement('button');
        button.dataset.id = dataInfo;
        button.classList.add('btn');
        button.innerText = "Done";
        button.addEventListener('click', (e) =>{
            const id = e.target.dataset.id
            this.marksDone(id);
        });
        container.appendChild(button);
    }
    clearList(){
        //change to last child
        listWrapper.innerHTML = ""
    }

    editChangeValue(index){
        this.tasklist[index].title = titleInput.value;
        this.tasklist[index].description = descriptionInput.value;
        this.tasklist[index].date = dateInput.value;
        this.tasklist[index].priority = document.querySelector('input[name="priority"]:checked').value;
    }
    getCurrentTaskValue(taskToEdit){
        document.querySelector(`input[name="priority"][value = ${taskToEdit.priority}]`).checked = true;
        titleInput.value = taskToEdit.title
        descriptionInput.value = taskToEdit.description
        dateInput.value = taskToEdit.date;
    }

    saveInLocalStorage(){
        localStorage.setItem("taskList",JSON.stringify(this.tasklist));
    }

    clearForm(){
        document.querySelector('input[name="priority"]:checked');
        titleInput.value = '';
        descriptionInput.value = '';
        dateInput.value = '';
    }
    createUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

}

const taskApi = new TaskApi();


class Task {
    constructor(title, description, date, priority) {
        this.title = title;
        this.description = description;
        this.date = date;
        this.priority = priority;
        this.isDone = false;
    }
};




function showForm(){
    formContainer.classList.toggle('hidden');
}

addTaskButton.addEventListener('click', e => {
    const priorityInput = document.querySelector('input[name="priority"]:checked');

    e.preventDefault();
    const task = new Task(titleInput.value, descriptionInput.value, dateInput.value, priorityInput.value);
    taskApi.addTask(task);
    taskApi.showList();
    showForm();
});

closeFormButton.addEventListener('click', ()=>{
    formContainer.classList.add('hidden');
})




showFormButton.addEventListener('click', showForm);


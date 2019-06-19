// Compare completed to https://freshman.tech/todo-list/

// Define variables
var todos = JSON.parse(localStorage.getItem("todoList"));
var inputBox = document.getElementById('todo-input');
var submitBtn = document.getElementById('submit-todo');
var list = document.getElementById('list-display');

// Create new list if nothing exists
if(!todos){
	todos = [];
}

// Clear a specified field
let resetField = (field) => {
	// Clear field value
	field.value = "";
};

// Add an array to storage
let addToStorage = (arr) => {
	// Save arr in local storage
	localStorage.setItem("todoList", JSON.stringify(arr));
	// Reload list
	populateList();
	// Add events to new items
	addEvents();
};

// Clear the todo list
let clearList = () => {
	list.innerHTML = "";
};

// Load items into list
let populateList = () => {
	// Clear the list
	clearList();
	// Loop through all todo items
	for(let i = 0; i < todos.length; i++){
		// Create a new element
		let listItem = document.createElement("div");
		listItem.classList.add("list-item");
		// Assign data values
		listItem.setAttribute("data-id", todos[i].id);
		// Add line if not last element
		let divider = "";
		if(i != todos.length - 1){
			divider = "<hr>";
		}
		// If task is complete linethrough
		let completeClass = "";
		if(todos[i].done === true){
			listItem.classList.add("task-complete");
			completeClass = "hidden";
		}
		// Alter content of element
		listItem.innerHTML = `<div class="list-row"><h2 class="task-desc">${todos[i].title}</h2>
		<span class="close-task ${completeClass}" data-id="${todos[i].id}">
		<i class="fas fa-check fa-2x"></i>
		</span>
		<span class="delete-task" data-id="${todos[i].id}">
		<i class="fas fa-times fa-2x"></i>
		</span>
		</div>
		<div class="task-time">${todos[i].time}</div>
		${divider}`;
		// Append to DOM parent
		list.append(listItem);
	}
};

// Create a new Todo item
let createNewItem = () => {
	if(!inputBox.value){
		return;
	}
	// Generate new todo item
	let newTodo = {
		id: generateUniqueID(),
		time: timeStamp(),
		title: inputBox.value.trim(),
		done: false
	};
	// Push to list
	todos.push(newTodo);
	// Update local storage
	addToStorage(todos);
	// Reset input
	resetField(inputBox);
};

// Generate a unique id value
let generateUniqueID = () => {
	// Store the time in a new variable
	let date = new Date().getTime();
	// Replace 'x' and 'y' chracters with the results of function
	let uID = `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`.replace(/[xy]/g, function(c){
		// Generate a random number (r)
		let r = (date + Math.random() * 16) % 16 | 0;
		date = Math.floor(date / 16);
		// If character is 'x' replace with 'r', else replace with r&0x3 or 0x8 if r&0x3 is 0
		return(c == 'x' ? r : (r&0x3|0x8)).toString(16);
	});
	return uID;
};

// Generate a timestamp
let timeStamp = () => {
	// Generate new date
	let date = new Date();
	// Detect month & prefix with '0' if necessary
	let month = date.getMonth() + 1;
	if(month < 10){
		month = "0" + month;
	}
	// Split string and return in correct format
	date = date.toString();
	date = date.split(" ");
	date = `${date[2]}/${month}/${date[3]} ${date[4]}`
	return date;
}

// Search through the list
let searchArr = (val, arr, key) =>{
	for(let i = 0; i < arr.length; i++){
		if(val == arr[i][key]){
			return [arr[i], i];
		}
	}
};

// Delete todo item
function deleteItem(){
	// Search the array for the bug id
	let searchResult = searchArr(this.getAttribute("data-id"), todos, "id");
	// Delete record form the array and update
	todos.splice(searchResult[1], 1);
	// Update local storage
	addToStorage(todos);
}

// Complete todo item
function toggleStatus(){
	// Search the array for bug id
	let searchResult = searchArr(this.getAttribute("data-id"), todos, "id");
	// Set "done"status to true
	if(searchResult[0].done == true){
		searchResult[0].done = false;
	} else{
		searchResult[0].done = true;
	}
	// Replace item in array with updated item
	todos[searchResult[1]] = searchResult[0];
	// Update local storage
	addToStorage(todos);
}

// Load all event handlers
let addEvents = () => {
	// Submit button
	submitBtn.addEventListener("click", createNewItem);
	// 'Check' buttons
	let checkBtns = document.querySelectorAll(".close-task");
	for(let i = 0; i < checkBtns.length; i++){
		checkBtns[i].addEventListener("click", toggleStatus);
	}
	// Close buttons
	let closeBtns = document.querySelectorAll(".delete-task");
	for(let j = 0; j < closeBtns.length; j++){
		closeBtns[j].addEventListener("click", deleteItem);
	}
};

// Initialise all relevant items
let init = () => {
	// Load list display
	populateList();
	// Load event listeners
	addEvents();
};

// Start the application
window.onload = init();
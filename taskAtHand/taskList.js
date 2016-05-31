function Task(name) { //it uses that to set the name field in the object
	this.name = name;
	this.id = Task.nextTaskId++; // Task.nextTaskId field to the Task object contructor to keep track of what the nect unique task ID should be
	this.created = new Date();
	this.priority = Task.priorities.normal;
	this.status = Task.statuses.notStarted;
	this.pctComplete = 0;
	this.startDate = null;
	this.dueDate = null;
}
// Define some "static variables" on the task object
Task.nextTaskId = 1; 
Task.priorities = {
	none: 0,
	low: 1,
	normal: 2,
	high: 3
};
Task.statuses = {
	none: 0,
	notStarted: 1,
	started: 2,
	completed: 3
};

function TaskList(tasks) {
	tasks = tasks || [];

	this.getTasks = function() { // the public getTasks() method that simply returns the array
		return tasks;
	};

	this.addTask = function(task) { // the pulic addTask() method that takes a Task object and appends it to the enf of the array
		tasks.push(task);
		return this;
	};

	this.removeTask = function(taskId) { // the puclic removeTask() method takes a task ID as a parameter and removes the associated task from the list
		var i = getTaskIndex(taskId); // get the index of the task by calling getTaskIndex()
		if (i >= 0) {
			var task = tasks[i]; 
			tasks.splice(i, 1); //uses the array.splice() method to remove it from the tasks array
			return task;
		}
		return null;
	};

	this.getTask = function(taskId) { // the puclic getTask() method used to takes a task ID as a parameter and also uses the getTaskIndex() method to find it
		var index = getTaskIndex(taskId);
		return (index >= 0 ? tasks[index] : null);
	};

	this.each = function(callback) { // the public each() method will takes a reference to a callback function as a parameter. it loops over the array of tasks and executes the callback function for each task in the array. this method can be uses to iterate over all tasks in the list
		for (var i in tasks) {
			callback(tasks[i]);
		}
	};

	function getTaskIndex(taskId) { // the getTaskIndex() method is a privete mehthod that takes a task ID as a parameter and searches through the array to dinf the task with that ID
		for (var i in tasks) {
			if (tasks[i].id == taskId) {
				return parseInt(i);
			}
		}
		//not found
		return -1;
	}

}
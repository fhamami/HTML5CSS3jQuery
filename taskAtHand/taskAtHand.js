"use strict";

function TaskAtHandApp() {
	var version = "v3.3",
		appStorage = new AppStorage("taskAtHand"),
		taskList = new TaskList(),
		timeoutId = 0;

	function setStatus(message) {
		$("#app>footer").text(message);
	}

	this.start = function() {

		// event handler to the text field when the user is done typing
		$("#new-task-name").keypress(function(e) { //get ID new-task-name by jQuery, then add a keypress() event handler to execute every time the evebt is triggered
			if (e.which == 13) { //Enter key 
				addTask(); //when the user presses the enter key we wall the addTask() method
				return false; //then it returns false, because to tell the system that we handled the key press event, and don't want it to do the default action.
			}
		})
		.focus();

		$("#theme").change(onChangeTheme);

		$("#app header").append(version);
		loadTaskList();
		setStatus("ready");
	};

	//this method will get the name of the task and add a new list item to the <ul>
	function addTask() {
		var taskName = $("#new-task-name").val(); //get value of the new-task-name text field using jQuery's val() method.
		if (taskName) {
			var task = new Task(taskName);
			taskList.addTask(task);
			appStorage.setValue("nextTaskId", Task.nextTaskId);
			addTaskElement(task);
			saveTaskList();
			//reset the text field
			$("#new-task-name").val("").focus();
		}
	}
	
	function addTaskElement(task) { //this method will create a new <li> 
		// var $task = $("<li></li>");
		var $task = $("#task-template .task").clone(); //clone() method to make a copy of it
		var $delete = $("<button class='delete'>X</button>");
		var $moveUp = $("<button class='move-up>^</button>");
		var $moveDown = $("<button class='move-up>v</button>");
		// $task.text(taskName); //and then assign to the $task variable and fill the task name using the text() method
		$task.append($delete)
			.append($moveUp)
			.append($moveDown)
			.append("<span class='task-name'>" + task + "</span>");

		$task.data("task-id", task.id); // after creating a new task element in the DOM, set the task ID using a custom data attribute named "task-id"

		$("span.task-name", $task).text(task.name);

		$("#task-list").append($task);

		$("button.delete", $task).click(function() {
			// $task.remove();
			removeTask($task);
		});
		$("button.move-up", $task).click(function() {
			// $task.insertBefore($task.prev());
			moveTask($task, true);
		});
		$("button.move-down", $task).click(function() {
			// $task.insertAfter($task.next());
			moveTask($task, false);
		});

		$delete.click(function() {
			$task.remove();
		});

		//when the move up or move down button is clicked, it finds the previous or next task element using prev() and next() methods. Then it ises the jQuery insertBefore() and isertAfter() methods to move the task element up or down the tasklist.
		$moveUp.click(function() {
			$task.insertBefore($task.prev());
		});

		$moveDown.click(function() {
			$task.insertAfter($task.next());
		});

		$("button.toggle-details", $task).click(function() {
			toggleDetails($task);
		});

		$("span.task-name", $task).click(function() {
			onEditTaskName($(this));
		});

		$("input.task-name", $task).change(function() {
			onChangeTaskName($(this));
		})

		.blur(function() { //if the user clicks off the filed without changing anything, we will not get a chenge event and the text field will not get hidden. we can get a blur event when this happens though.
			$(this).hide().siblings("span.task-name").show();
		});

		$task.click(function() { onSelectTask($task); });



		// DATA BIDING

		//Populate all of the details fields
		$(".details input, .details select", $task).each(function() { // finds all <input> and <select> elements inside the task element //jQuery each method is used to iterate over the set of selected elements, passing in a callback function
			var $input = $(this);
			var fieldName = $input.data("field"); // the data() method used to get the value of the data-field
			$input.val(task[fieldName]); // get the value from the Task object using square brackets
		});

		$(".details input, .details select", $task).change(function() {
			onChangeTaskDetails(task.id, $(this));
			// whenever the user changes the value of a form control we want to automatically save it back to the data model
		});

	}

	function onEditTaskName($span) {
		$span.hide()
			.siblings("input.task-name")
			.val($span.text())
			.show()
			.focus();
	}

	function onChangeTaskName($input) {
		$input.hide();
		var $span = $input.siblings("span.task-name");
		if ($input.val()) {
			$span.text($input.val());
		}
		$span.show();
	}

	// function saveTaskList() { //the saveTaskList() method finds all of the task name <span> elements for each task in the list.
	// 	var tasks = [];
	// 	$("#task-list .task span.task-name").each(function() { //jQuery each() method is used to iterate over the elements
	// 		tasks.push($(this).text())
	// 	});
	// 	appStorage.setValue("taskList", tasks); //to store the task array using the key "taskList"
	// }

	function saveTaskList() { // to save our new TaskList object
		if (timeoutId) clearTimeout(timeoutId);
		setStatus("saving changes...", true);
		timeoutId = setTimeout(function() {
			appStorage.setValue("taskList", taskList.getTasks()); // getTasks() method of the task list to get the array of Task objects
			timeoutId = 0;
			setStatus("changes saved.");
		},
		2000);
	}

	function removeTask($task) {
		$task.remove();
		saveTaskList();
	}

	function moveTask($task, moveUp) {
		if (moveUp) {
			$task.insertBefore($task.prev());
		}
		else {
			$task.insertAfter($task.next());
		}
		saveTaskList();
	}

	// function loadTaskList() {
	// 	var tasks = appStorage.getValue("taskList");
	// 	if (tasks) {
	// 		for (var i in tasks) {
	// 			addTaskElement(tasks[i]);
	// 		}
	// 	}
	// }

	function loadTaskList() { //update the loadTaskList() method to load the data
		var tasks = appStorage.getValue("taskList"); // get task array from localStorage and pass that as parameter into the TaskList object contructor
		taskList = new TaskList(tasks);
		rebuildTaskList();
	}


	function onSelectTask($task) {
		if ($task) {
			// Unselect other tasks
			$task.siblings(".selected").removeClass("selected");
			// Selecet this task
			$task.addClass("selected");
		}
	}

	function onChangeTheme() {
		var theme = $("#theme>option").filter(":selected").val(); //this method gets the selectted option from the list by getting its <option> elements and then finding the selected option using jQuery's :selected selector inside the filter() method.
		setTheme(theme);
		appStorage.setValue("theme", theme);
	}

	function setTheme(theme) {
		$("#theme-style").attr("href", "themes/" + theme + ".css");
	}

	function loadTheme() {
		var theme = appStorage.getValue("theme");
		if (theme) {
			setTheme(theme);
			$("#theme>option[value=" + theme + "]")
				.attr("selected","selected");
		};
		//this method gets the theme nama from localStorage. If it finds one, it calls setTheme() to set it. Then it selects the theme in the drop-down by finding the <option> in the list that has the theme name for its value, and sets the selected attribute on it. The final thing to do is add a call to loadTheme() from the start() method.
	}

	function rebuildTaskList() { // create the task element in the DOM
		//remove any old task elements
		$("#task-list").empty();
		//create DOM element for each task
		taskList.each(function(task) {
			addTaskElement(task); // build the task elements for each one
		});
	}

	function toggleDetails($task) {
		$(".details", $task).slideToggle(); // the slideToggle() method is an animation function that toggles the visibility of an element
		$("button.toggle-details", $task).toggleClass("expanded");
	}

	function onChangeTaskDetails(taskId, $input) {
		var task = taskList.getTask(taskId) // gets the task object from the task list with the specified ID
		if (task) {
			var fieldName = $input.data("field"); // get tht Task object field name from the element's data-field attribute
			task[fieldName] = $input.val(); // set the value of the field on the Task object to the value of the form control elemet
			saveTaskList(); // to commit the change to localStorage
		}
	}

	function setStatus(msg, noFade) {
		$("#app>footer").text(msg).show();
		if (!noFade) {
			$("#app>footer").fadeOut(1000); // jQuery fadeOut() method to gradually fade out the message over 1000 miliseconds, or one second.
		}
	}


}

$(function() {
	window.app = new TaskAtHandApp();
	window.app.start();
});

// 84
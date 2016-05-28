"use strict";

function TaskAtHandApp(){
	var version = "v1.3", appStorage = new AppStorage("taskAtHand");

	function setStatus(message){
		$("#app>footer").text(message);
	}

	this.start = function(){

		// event handler to the text field when the user is done typing
		$("#new-task-name").keypress(function(e){ //get ID new-task-name by jQuery, then add a keypress() event handler to execute every time the evebt is triggered
			if (e.which == 13) { //Enter key 
				addTask(); //when the user presses the enter key we wall the addTask() method
				return false; //then it returns false, because to tell the system that we handled the key press event, and don't want it to do the default action.
			}
		})
		.focus();

		$("#app header").append(version);
		setStatus("ready");
	};

	//this method will get the name of the task and add a new list item to the <ul>
	function addTask(){
		var taskName = $("#new-task-name").val(); //get value of the new-task-name text field using jQuery's val() method.
		if (taskName){
			addTaskElement(taskName);
			//reset the text field
			$("#new-task-name").val("").focus();
		}
	}
	function addTaskElement(taskName){ //this method will create a new <li> 
		var $task = $("<li></li>");
		var $delete = $("<button class='delete'>X</button>");
		var $moveUp = $("<button class='move-up>^</button>");
		var $moveDown = $("<button class='move-up>v</button>");
		// $task.text(taskName); //and then assign to the $task variable and fill the task name using the text() method
		$task.append($delete)
			.append($moveUp)
			.append($moveDown)
			.append("<span class='task-name'>" + taskName + "</span>");

		var $task = $("#task-template .task").clone(); //clone() method to make a copy of it

		$("span.task-name", $task).text(taskName);

		$("#task-list").append($task);

		$("button.delete", $task).click(function() {
			// $task.remove();
			removeTask($task);
		});
		$("button.move-up", $task).click(function() {
			// $task.insertBefore($task.prev());
			moveTask($task, true);
		});
		$("button.move-down", $task).click(function(){
			// $task.insertAfter($task.next());
			moveTask($task, false);
		});

		$delete.click(function(){
			$task.remove();
		});

		//when the move up or move down button is clicked, it finds the previous or next task element using prev() and next() methods. Then it ises the jQuery insertBefore() and isertAfter() methods to move the task element up or down the tasklist.
		$moveUp.click(function(){
			$task.insertBefore($task.prev());
		});

		$moveDown.click(function(){
			$task.insertAfter($task.next());
		});

		$("span.task-name", $task).click(function(){
			onEditTaskName($(this));
		});

		$("input.task-name", $task).change(function(){
			onChangeTaskName($(this));
		})

		.blur(function(){ //if the user clicks off the filed without changing anything, we will not get a chenge event and the text field will not get hidden. we can get a blur event when this happens though.
			$(this).hide().siblings("span.task-name").show();
		});

	}

	function onEditTaskName($span){
		$span.hide()
			.siblings("input.task-name")
			.val($span.text())
			.show()
			.focus();
	}

	function onChangeTaskName($input){
		$input.hide();
		var $span = $input.siblings("span.task-name");
		if ($input.val()){
			$span.text($input.val());
		}
		$span.show();
	}

	function saveTaskList(){ //the saveTaskList() method finds all of the task name <span> elements for each task in the list.
		var tasks = [];
		$("#task-list .task span.task-name").each(function(){ //jQuery each() method is used to iterate over the elements
			tasks.push($(this).text())
		});
		appStorage.setValue("taskList", tasks); //to store the task array using the key "taskList"
	}

	function removeTask($task){
		$task.remove();
		saveTaskList();
	}

	function moveTask($task, moveUp){
		if (moveUp){
			$task.insertBefore($task.prev());
		}
		else {
			$task.insertAfter($task.next());
		}
		saveTaskList();
	}

}

$(function() {
	window.app = new TaskAtHandApp();
	window.app.start();
});
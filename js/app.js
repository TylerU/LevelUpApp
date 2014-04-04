"use strict";

/*
Todo:
 - Some kind of validation system for new todos
 - On project deletion, make sure we aren't viewing that project
 - Can delete projects forever
 - Can un-delete projects
 - Can un-finish tasks
 - Actually parse date inputs correctly
 - Actually parse duration inputs correctly
 - Let the user know where he/she is going wrong on input
 - Focus project name input on show
 - Recurring tasks?

 - Calendar integration 
	- New fields in Task calss
	- Events for adding, removing, changing, task schedules




 Done: 
  - Connect to a back end
	- Angular service for logging in, adding, removing, editing tasks, including scheduling stuff and adding and removing and renaming projects
 - Integrate JQuery UI calendar for date input
 - Only able to edit one todo at a time
 - Can delete projects
 - Some kind of Task class with some kind of copy and creation functionality

*/

var App = angular.module("todo",['ui.bootstrap', 'ui.calendar', 'ngRoute']);

App.controller("TodoCtrl",function  ($scope, ParseService) {
	$scope.init = function  () {
		$scope.model = [
			{
				name : "Primary" , list : [
					{ taskName : "Create an Angular-js TodoList" , isDone : false, dueDate: "1/23/14", duration: "2 hours" },
					{ taskName : "Understanding Angular-js Directives" , isDone : true, dueDate: "1/23/14", duration: "3 hours" }
				],
				visible: true
			},
			{
				name : "Secondary" , list : [
					{ taskName : "Build an open-source website builder" , isDone : false, dueDate: "1/23/14", duration: "5 hours" },
					{ taskName : "BUild an Email Builder" , isDone : false, dueDate: "1/23/14", duration: "1 hours" }
				],
				visible: true
			}
		];

		ParseService.getTasks().done(function(a){
			console.log(a);
		}).fail(function(err){
			console.log(err);
		});
	};

	//PLEASE MOVE TO A DIRECIVE SOON
	$scope.currentlyDragging = null;

	$scope.dragStart = function(event, ui){
		$scope.currentlyDragging = angular.element(event.target).scope().todo;
	};
	$scope.drag = function(event, ui) {
    };

	$scope.dragEnd = function(event, ui){
		setTimeout(function(){
			$scope.currentlyDragging = null;	
		}, 100);
	};
	//END TERRIBLE


	$scope.currentShow = 0;
	$scope.setCurrentShow = function(i){
		$scope.currentShow = i;
	};
	$scope.getCurrentShow = function(){
		return $scope.currentShow;
	};

	$scope.placeholderDate = "Jan 3";
	$scope.placeholderDuration = "1 hour";
	$scope.placeholderName = "Task Name";
});

App.controller("ProjectCtrl",function  ($scope) {
	$scope.startAddingProject = function(){
		$scope.addingNewProject = true;
		$scope.newProject = "";
	};
	$scope.cancelProjectAdd = function(){
		$scope.addingNewProject = false;
	};
	$scope.removeProject = function(name){
		for(var i = 0; i < $scope.model.length; i++){
			if($scope.model[i].name == name){
				$scope.model[i].visible = false;
				break;	
			} 
		}
	};
	$scope.changeTodo = function  (i) {
		$scope.setCurrentShow(i);
	};
	$scope.addProject = function(){
		$scope.model.push({
			name: $scope.newProject,
			list : [],
			visible: true
		});
		$scope.addingNewProject = false;
		$scope.newProject = "";		
	};
	$scope.addingNewProject = false;
	$scope.newProject = "";
});

App.controller("TodoListCtrl",function  ($scope) {
	function validInputTodo(todo){
		if(todo.dueDate !== "" && !isValidDateString(todo.dueDate)){
			return false;
		}
		if(todo.duration !== "" && !isValidDurationString(todo.duration)){
			return false;
		}

		console.log("valid");
		return true;

	}
	$scope.addTodo = function  () {
		if(validInputTodo($scope.newTodo)){
			/*Should prepend to array*/
			$scope.model[$scope.currentShow].list.splice(0,0,{taskName : $scope.newTodo.taskName, dueDate: stringToMoment($scope.newTodo.dueDate).toString(), duration: $scope.newTodo.duration, isDone : false });
			/*Reset the Field*/
			$scope.newTodo = {duration: "", taskName: "", dueDate: moment().format("MM/DD/YYYY")};
			// $scope.addTodoForm.$setPristine();
		}
		else{
			// $scope.addTodoForm.$setDirty();
		}
	};

	$scope.deleteTodo = function  (index) {
		$scope.model[$scope.currentShow].list.splice(index, 1);
	};

	/* Filter Function for All | Incomplete | Complete */
	$scope.showFn = function  (todo) {
		if ($scope.show === "All") {
			return true;
		}else if(todo.isDone && $scope.show === "Complete"){
			return true;
		}else if(!todo.isDone && $scope.show === "Incomplete"){
			return true;
		}else{
			return false;
		}
	};
	$scope.onCompleteTodo = function(todo) {
        todo.isDone = !todo.isDone; //toggle value
	};

	$scope.startEditing = function(todo){
		console.log('trying');
		if($scope.currentlyDragging === todo) return;

		if($scope.currentEditingTodo != null){
			$scope.saveEditing();
		}
		$scope.currentEditingTodo = todo;
		$scope.editedTodo = {duration: todo.duration, taskName: todo.taskName, dueDate: todo.dueDate};
	};
	$scope.currentlyEditing = function(todo){
		return $scope.currentEditingTodo === todo;
	};
	$scope.saveEditing = function(){
		if(validInputTodo($scope.editedTodo)){
			$scope.currentEditingTodo.duration = $scope.editedTodo.duration;
			$scope.currentEditingTodo.taskName = $scope.editedTodo.taskName;
			$scope.currentEditingTodo.dueDate = $scope.editedTodo.dueDate;

			$scope.currentEditingTodo = null;
			$scope.editedTodo = null;
		}
	};
	$scope.cancelEditing = function(){
		$scope.currentEditingTodo = null;
		$scope.editedTodo = null;
	};

	$scope.show = "Incomplete";
	$scope.newTodo = {duration: "", taskName: "", dueDate: moment().format("MM/DD/YYYY")};
	$scope.currentEditingTodo = null;
	$scope.editedTodo = null;

});

App.controller("TodoCalendarCtrl",function  ($scope) {
    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

	$scope.events = [
      {title: 'All Day Event',start: new Date(y, m, 1)},
      {title: 'Long Event',start: new Date(y, m, d - 5),end: new Date(y, m, d - 2)},
      {id: 999,title: 'Repeating Event',start: new Date(y, m, d - 3, 16, 0),allDay: false},
      {id: 999,title: 'Repeating Event',start: new Date(y, m, d + 4, 16, 0),allDay: false},
      {title: 'Birthday Party',start: new Date(y, m, d + 1, 19, 0),end: new Date(y, m, d + 1, 22, 30),allDay: false},
      {title: 'Click for Google',start: new Date(y, m, 28),end: new Date(y, m, 29),url: 'http://google.com/'}
    ];

    $scope.alertEventOnClick = function(){

    };
    
    $scope.alertOnDrop = function(droppedTime, allDay){
    	var newEvent = {
    		title: $scope.currentlyDragging.taskName,
    		start: droppedTime,
    		allDay: allDay,
    		end: moment(droppedTime).add("minutes", stringToDuration($scope.currentlyDragging.duration).asMinutes()).toString(),
    		extraJunk: $scope.currentlyDragging
    	};
		// $scope.myCalendar.fullCalendar( 'renderEvent', newEvent , true )
		$scope.events.push(newEvent);
    };
    
    $scope.onEventChange = function(event, dayDelta, minuteDelta, revertFunc, jsEvent, ui, view){
    	console.log(event);
    };

	$scope.uiConfig = {
      calendar:{
        height: 450,
        editable: true,
        droppable: true,
		header: {
		},
		defaultView: "agendaWeek",
        dayClick: $scope.alertEventOnClick,
        eventDrop: $scope.onEventChange,
        eventResize: $scope.onEventChange,
        drop: $scope.alertOnDrop,
      }
    };
    $scope.eventSources = [$scope.events];
});

// $(document).ready(function() {

// 	var date = new Date();
// 	var d = date.getDate();
// 	var m = date.getMonth();
// 	var y = date.getFullYear();
	
// 	$('#calendar').fullCalendar({
// 		header: {
// 		},
// 		defaultView: "agendaWeek",
// 		editable: true,
// 		droppable: true, // this allows things to be dropped onto the calendar !!!
// 		drop: function(date, allDay) { // this function is called when something is dropped
		
// 			// retrieve the dropped element's stored Event Object
// 			var originalEventObject = $(this).data('eventObject');
			
// 			// we need to copy it, so that multiple events don't have a reference to the same object
// 			var copiedEventObject = $.extend({}, originalEventObject);
			
// 			// assign it the date that was reported
// 			copiedEventObject.start = date;
// 			copiedEventObject.allDay = allDay;
			
// 			// render the event on the calendar
// 			// the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
// 			$('#calendar').fullCalendar('renderEvent', copiedEventObject, true);
// 		},

// 		events: [
// 			{
// 				title: 'All Day Event',
// 				start: new Date(y, m, 1)
// 			},
// 			{
// 				title: 'Long Event',
// 				start: new Date(y, m, d-5),
// 				end: new Date(y, m, d-2)
// 			},
// 			{
// 				id: 999,
// 				title: 'Repeating Event',
// 				start: new Date(y, m, d-3, 16, 0),
// 				allDay: false
// 			},
// 			{
// 				id: 999,
// 				title: 'Repeating Event',
// 				start: new Date(y, m, d+4, 16, 0),
// 				allDay: false
// 			},
// 			{
// 				title: 'Meeting',
// 				start: new Date(y, m, d, 10, 30),
// 				allDay: false
// 			},
// 			{
// 				title: 'Lunch',
// 				start: new Date(y, m, d, 12, 0),
// 				end: new Date(y, m, d, 14, 0),
// 				allDay: false
// 			},
// 			{
// 				title: 'Birthday Party',
// 				start: new Date(y, m, d+1, 19, 0),
// 				end: new Date(y, m, d+1, 22, 30),
// 				allDay: false
// 			},
// 			{
// 				title: 'Click for Google',
// 				start: new Date(y, m, 28),
// 				end: new Date(y, m, 29),
// 				url: 'http://google.com/'
// 			}
// 		]
// 	});


// 	makeAllDraggable();
// });

// function makeAllDraggable(){
// 		$('.todoTask').each(function() {
	
// 		// create an Event Object (http://arshaw.com/fullcalendar/docs/event_data/Event_Object/)
// 		// it doesn't need to have a start or end
// 		var eventObject = {
// 			title: $.trim($(this).text()) // use the element's text as the event title
// 		};
		
// 		// store the Event Object in the DOM element so we can get to it later
// 		$(this).data('eventObject', eventObject);
		
// 		// make the event draggable using jQuery UI
// 		$(this).draggable({
// 			zIndex: 999,
// 			revert: true,      // will cause the event to go back to its
// 			revertDuration: 0  //  original position after the drag
// 		});
		
// 	});
// }
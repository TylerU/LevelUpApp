"use strict";

/**
 * Creates a new CalendarEvent with the given start and end moments.
 * @param {string} name
 * @param {moment} start
 * @param {moment} end
 */
function CalendarEvent(name, start, end) {
	this.name = name;
	this.start = start;
	this.end = end;
}

CalendarEvent.prototype.clone = function() {
	var clonedName = this.name;
	var clonedStart = this.start.clone();
	var clonedEnd = this.end.clone();
	return new CalendarEvent(clonedName, clonedStart, clonedEnd);
};

CalendarEvent.prototype.getName = function() {
	return this.name;
};

CalendarEvent.prototype.getStart = function() {
	return this.start;
};

CalendarEvent.prototype.getEnd = function() {
	return this.end;
};

CalendarEvent.prototype.setName = function(name) {
	this.name = name;
};

CalendarEvent.prototype.setStart = function(start) {
	this.start = start;
};

CalendarEvent.prototype.setEnd = function(end) {
	this.end = end;
};

/**
 * Creates a new Task with given duration.
 * @param {string} name
 * @param {moment.duration} duration
 */
function TodoTask(name, duration) {
	this.name = name;
	this.duration = duration;
	this.scheduledEvents = [];
}

TodoTask.prototype.clone = function() {
	var clonedName = this.name;
	var clonedDuration = moment.duration(this.duration);
	var clonedTask = new TodoTask(clonedName , clonedDuration);
	for(var i = 0; i < this.scheduledEvents.length; i++) {
		clonedTask.addScheduledEvent(this.scheduledEvents[i].clone());
	}
	return clonedTask;
};

TodoTask.prototype.getName = function() {
	return this.name;
};

TodoTask.prototype.getDuration = function() {
	return this.duration;
};

/**
 * Get the Project associated with this TodoTask
 * @return {Project} project
 */
TodoTask.prototype.getProject = function() {
	return this.project
};

TodoTask.prototype.getScheduledEvents = function() {
	return this.scheduledEvents;
};

TodoTask.prototype.setName = function(name) {
	this.name = name;
};

TodoTask.prototype.setDuration = function(duration) {
	this.duration = duration;
};

/**
 * Set the Project associated with this TodoTask
 * @return {Project}
 */
TodoTask.prototype.setProject = function(project) {
	this.project = project;
};

TodoTask.prototype.addScheduledEvent = function(calEvent) {
	this.scheduledEvents.push(calEvent);
};

/**
 * Creates a new Project with given name
 * @param {string} name
 */
function Project(name) {
	this.name = name;
}

Project.prototype.clone = function() {
	var clonedName = this.name;
	return new Project(clonedName)
};

Project.prototype.getName = function() {
	return this.name;
};

Project.prototype.setName = function(name) {
	this.name = name;
};


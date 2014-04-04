'use strict';

/* Services */

App.factory('ParseService', function(){
    // Initialize Parse API and objects.
    Parse.initialize("zjZTdXUZMZB5ldCnCRK9cw2EfOoyHGrwSVlTZVGO", "negIy8ZloPJHdRvBz8UTaxfwJcNTz933uffbzEUp");

    /**
     * ParseService Object
     * This is what is used by the controllers to save and retrieve data from Parse.com.
     * Moving all the Parse.com specific stuff into a service allows me to later swap it out 
     * with another back-end service provider without modifying my controller much, if at all.
     */
    return {
      name: "Parse",

      // Login a user
      login : function login(username, password, callback) {
        var dfd = new jQuery.Deferred();
    	  Parse.User.logIn(username, password, {
    	    success: function(user) {
            dfd.resolve();
    	    },
    	    error: function(user, error) {
            dfd.reject(error);
    	    }
        });
        return dfd.promise();
      },

      // // Login a user using Facebook
      // FB_login : function FB_login(callback) {
      //   Parse.FacebookUtils.logIn(null, {
      //     success: function(user) {
      //       if (!user.existed()) {
      //         alert("User signed up and logged in through Facebook!");
      //       } else {
      //         alert("User logged in through Facebook!");
      //       }
      //       loggedInUser = user;
      //     },
      //     error: function(user, error) {
      //       alert("User cancelled the Facebook login or did not fully authorize.");
      //     }
      //   });
      // },

      // Register a user
      signUp : function signUp(username, password, callback) {
        var dfd = new jQuery.Deferred();
      	Parse.User.signUp(username, password, { ACL: new Parse.ACL() }, {
            success: function(user) {
                dfd.resolve();
            },

            error: function(user, error) {
              dfd.reject(error);
            }
        });
        return dfd.promise();
      },

      // Logout current user
      logout : function logout(callback) {
        var dfd = new jQuery.Deferred();
        dfd.resolve();
        Parse.User.logOut();
        return dfd;
      },

      // Get current logged in user
      getUser : function getUser() {
          return Parse.User.current();
      },


      /********************************************************************
       *             Functions below are for tasks/projects.              *
       *               Every action involves Parse server.                *
       *        Parameters of functions are mostly local objects.         *
       ********************************************************************/
      
      /// Task functions:

      // Add a task to parse server, "task" should be a local task object.
      addTask : function addTask(task) {
        var dfd = new jQuery.Deferred();
        var ParseTask = Parse.Object.extend("ParseTask");
        var task_parse = new ParseTask();
        task.parseObj = task_parse;
        task_parse.save({
          name: task.getName(),
          duration: task.getDuration(),
          project: task.getProject(),
          scheduledEvent: task.getScheduledEvents()
        }, {
        success: function(task_parse) {
          dfd.resolve();
        },
        error: function(task_parse, error) {
          dfd.reject(error);
        }
      });
        return dfd.promise();
      },

      // Delete a task from parse server, "task" should be a local task object.
      deleteTask : function deleteTask(task) {
        var dfd = new jQuery.Deferred();
        var task_parse = task.parseObj;
        task_parse.destroy({
          success: function(task_parse) {
            dfd.resolve();
          },
          error: function(task_parse, error) {
            dfd.reject(error);
          }
        });
        return dfd.promise();
      },

      // Update a task in the parse server, "task" should be a local task object.
      updateTask : function updateTask(task) { // TODO Needs more parameter
        var dfd = new jQuery.Deferred();
        var task_parse = task.parseObj;
        task_parse.set("name", task.getName());
        task_parse.set("duration", task.getDuration());
        task_parse.set("project", task.getProjects());
        task_parse.set("scheduledEvent", task.getScheduledEvents());
        dfd.resolve();
        return dfd.promise();
      },

      // This function changes the name of both local task, and parse_task.
      renameTask : function renameTask(task, name) {
        var dfd = new jQuery.Deferred();
        var task_parse = task.parseObj;
        task.name = name;
        task_parse.set("name", name);
        dfd.resolve();
        return dfd.promise();
      },

      // Return all tasks of current user, in ascending name order.
      getTasks : function getTasks() {
        var dfd = new jQuery.Deferred();
        var query = new Parse.Query("ParseTask");
        query.ascending("name");
        query.equalTo("owner", this.getUser().id);
        query.find({
          success: function(results) {
            dfd.resolve(results);
          },
          error: function(error) {
            dfd.reject(error);
          }
        });
        return dfd.promise();
      },

      /// Project functions:

      // Adding a project to parse server, "project" should be a local object.
      addProject : function addProject(project) {
        var dfd = new jQuery.Deferred();
        var ParseProject = Parse.Object.extend("ParseProject");
        var project_parse = new ParseProject();
        project.parseObj = project_parse;
        project_parse.save({
          name: project.getName()
        }, {
        success: function(task_parse) {
          dfd.resolve();
        },
        error: function(task_parse, error) {
          dfd.reject(error);
        }
      });
        return dfd.promise();
      },

      // Deleting a project from parse server, "project" should be a local object.
      deleteProject : function deleteProject(project) {
        var dfd = new jQuery.Deferred();
        var project_parse = project.parseObj;
        project_parse.destroy({
          success: function(project_parse) {
            dfd.resolve();
          },
          error: function(project_parse, error) {
            dfd.reject(error);
          }
        });
        return dfd.promise();
      },

      // Update the project from server, right now it's only changing the name. "project" should be a local object.
      updateProject : function updateProject(project) {
        var dfd = new jQuery.Deferred();
        var project_parse = project.parseObj;
        project_parse.set("name", project.getName());
        dfd.resolve();
        return dfd.promise();
      },

      // Renaming the project for both local project, and parse server.
      renameProject : function renameProject(project, name) {
        var dfd = new jQuery.Deferred();
        var project_parse = project.parseObj;
        project.name = name;
        project_parse.set("name", name);
        dfd.resolve();
        return dfd.promise();
      },

      // Get a list of all user projects, in ascending name order.
      getProjects : function getProjects() {
        var dfd = new jQuery.Deferred();
        var query = new Parse.Query("ParseProject");
        query.ascending("name");
        query.equalTo("owner", this.getUser().id);
        query.find({
          success: function(results) {
            dfd.resolve(results);
          },
          error: function(error) {
            dfd.reject(error);
          }
        });
        return dfd.promise();
      },

      // This function returns true if the user is currently logged in, false otherwise.
      userLoggedIn : function userLoggedIn() {
        return Parse.User.current() != null;
      }
    };
});
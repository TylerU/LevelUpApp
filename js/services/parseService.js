'use strict';

/* Services */

App.factory('ParseService', function(){
    // Initialize Parse API and objects.
    Parse.initialize("63ICi1wvureE0W4gOv3RxShCaAmXv6i34fyAjtJx", "vq3xcnkduj6hlDUhqiqEeN6pQdoBnwiKHH10BJf5");

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

      // Login a user using Facebook
      FB_login : function FB_login() {
          var dfd = new jQuery.Deferred();

          Parse.FacebookUtils.logIn(null, {
               success: function(user) {
                    dfd.resolve();
               },
               error: function(user, error) {
                    dfd.reject(error);
               }
         });
         return dfd.promise();
      },

      // Register a user
      signUp : function signUp(username, password) {
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

      // This function returns true if the user is currently logged in, false otherwise.
      userLoggedIn : function userLoggedIn() {
        return Parse.User.current() != null;
      }


    };
});
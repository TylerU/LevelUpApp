"use strict";

App.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/home', {
        templateUrl: 'routes/homepage.html',
        controller: ''
      }).
      when('/login', {
        templateUrl: 'routes/login.html',
        controller: 'LoginCtrl'
      }).
      when('/todo', {
        templateUrl: 'routes/mainTodo.html',
        controller: 'TodoCtrl'
      }).
      otherwise({
        redirectTo: '/home'
      });
}]);

App.run( function($rootScope, $location, ParseService) {
     // register listener to watch route changes
     $rootScope.$on( "$routeChangeStart", function(event, next, current) {
       if ( !ParseService.userLoggedIn() ) {
         // no logged user, we should be going to #login
         if ( next.templateUrl == "routes/login.html" ) {
           // already going to #login, no redirect needed
         } else {
           // not going to #login, we should redirect now
           $location.path( "/login" );
         }
       }
     });
  });
"use strict";

App.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/home', {
        templateUrl: 'routes/home.html',
        controller: ''
      }).
      when('/login', {
        templateUrl: 'routes/login.html',
        controller: 'LoginCtrl'
      }).
      when('/main', {
        templateUrl: 'routes/main.html',
        controller: 'LevelUpAppCtrl'
      }).
      otherwise({
        redirectTo: '/home'
      });
}]);

App.run( function($rootScope, $location, ParseService) {
     // register listener to watch route changes
     $rootScope.$on( "$routeChangeStart", function(event, next, current) {
       if ( !ParseService.userLoggedIn() ) {
         if ( next.templateUrl == "routes/main.html" ) {
             $location.path( "/login" );
         }
       }
       else{
           if ( next.templateUrl == "routes/main.html" ) {
           } else {
               $location.path( "/main" );
           }

       }
     });
  });
"use strict";

/*
Todo:
User should be able to:
- Remove skills
- Edit skills
- Remove activity posts
- Edit activity posts

-Add friends
-View friends' stuff

-Load activity stuff

-Validate all inputs

*/

var App = angular.module("levelup",['ngRoute', 'ui.keypress']);

App.controller("LevelUpAppCtrl",function  ($scope, ParseService, $location, $rootScope) {
    $scope.difficultyOptions = [
        "Easy",
        "Medium",
        "Hard",
        "Very difficult, but I've done it before",
        "Very difficult and it was completely new"
    ];

    $scope.logout = function(){
        ParseService.logout();
        $location.path( "/home" );
    };

    $scope.logChange = function(){
        if(ParseService.userLoggedIn()){
            $scope.logout();
        }
        else{
            $location.path("/login");
        }
    };

    $scope.loginOrLogout = function(){
        if(ParseService.userLoggedIn()){
            return $scope.getUsersName() + ", Log out";
        }
        else{
            return "Sign up / Log in";
        }
    };

    $scope.getUsersName = function(){
        return ParseService.getUsersName();
    };
});

App.controller("LevelUpMainCtrl",function  ($scope, ParseService, $location, $rootScope) {
    $scope.skills = [];
    $scope.activities = [];

    $scope.setActivities = function(a){
        $rootScope.$apply($scope.activities = a);
    };

    $scope.setSkills = function(s){
        $rootScope.$apply($scope.skills = s);
    };

    $scope.init = function  () {
        //Get skills
        setTimeout(function(){//Set time out so that our apply calls happen not inside here
            ParseService.getSkills().done(function(model){
                $scope.setSkills(model.skills);
                $scope.setActivities(model.activities);
            }).fail(function(err){
                console.log(err);
            });
        }, 0);
    };

});


App.controller("SkillsCtrl", function($scope, $rootScope, ParseService){

    $scope.newSkillName = "";
    $scope.addSkill = function(){
        ParseService.addSkill($scope.newSkillName).done(function(){
            $scope.setActivities($scope.activities);
        }).fail(function(err){
            console.log(err);
        });
        $scope.newSkillName = "";
    };
});


App.controller("ActivityCtrl", function($scope, ParseService, $rootScope){
    $scope.activitySkill = "";
    $scope.activityDescription = "";
    $scope.activityDifficulty = "";
    $scope.activityTime = "";

    $scope.addActivity = function(){
        var prevLevel = $scope.activitySkill.getLevel();
        ParseService.addActivity($scope.activitySkill, $scope.activityDescription, $scope.difficultyOptions.indexOf($scope.activityDifficulty), parseFloat($scope.activityTime)).done(function(na){
            if(prevLevel != na.getSkill().getLevel()){
                na.levelUp(true);
            }
            $rootScope.$digest();
        }).fail(function(err){
            console.log(err);
        });
        $scope.activitySkill = "";
        $scope.activityDescription = "";
        $scope.activityDifficulty = "";
        $scope.activityTime = "";
    };
});



App.controller("LoginCtrl", function($scope, $location, ParseService){
    $scope.loginEmail = "";
    $scope.loginPassword = "";
    $scope.signUpEmail = "";
    $scope.signUpFirstName = "";
    $scope.signUpLastName = "";
    $scope.signUpPassword = "";
    $scope.loginErrorMessage = "";
    $scope.signUpErrorMessage = "";

    function loginInfoErrors(email, password){
        if(!email){
            return "Please enter an email address";
        }
        if(!password){
            return "Please enter a password";
        }
        return null;
    }

    function signUpInfoErrors(email, first, last, password){
        if(!email){
            return "Please enter an email address";
        }
        if(!password){
            return "Please enter a password";
        }
        if(!first){
            return "Please enter a first name";
        }
        if(!last){
            return "Please enter a last name";
        }
        return null;
    }

    $scope.login = function(){
        $scope.loginErrorMessage = "";
        var errors = loginInfoErrors($scope.loginEmail, $scope.loginPassword);

        if(!errors){
            ParseService.login($scope.loginEmail, $scope.loginPassword).done(function(){
                $scope.$apply( $location.path( "/main" ) );
            }).fail(function(err){
                $scope.$apply(function(){
                    $scope.loginErrorMessage = err;
                });
            });
        }
        else{
            $scope.loginErrorMessage = errors;
        }
    };


    $scope.signUp = function(){
        $scope.signUpErrorMessage = "";
        var errors = signUpInfoErrors($scope.signUpEmail, $scope.signUpFirstName, $scope.signUpLastName, $scope.signUpPassword);

        if(!errors){
            ParseService.signUp($scope.signUpEmail, $scope.signUpFirstName, $scope.signUpLastName, $scope.signUpPassword).done(function(){
                $scope.$apply( $location.path( "/main" ) );
            }).fail(function(err){
                $scope.$apply(function(){
                    $scope.signUpErrorMessage = err;
                })
            });
        }
        else{
            $scope.signUpErrorMessage = errors;
        }
    };
});
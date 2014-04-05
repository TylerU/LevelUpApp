"use strict";

/*
Todo:


*/

var App = angular.module("levelup",['ngRoute']);

App.controller("LevelUpAppCtrl",function  ($scope, ParseService, $location) {
	$scope.init = function  () {
        $scope.difficultyOptions = [
            "Easy",
            "Medium",
            "Hard",
            "Very difficult, but I've done it before",
            "Very difficult, but it's completely new"
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
                return "Log out";
            }
            else{
                return "Log in";
            }
        };

        $scope.model = {
            userSkills: [
                {name: "Cooking",
                    level: 12,
                    totalxp: 12854,
                    nextLevel: 15000,
                    lastLevel: 12000
                },
                {name: "Programming",
                    level: 42,
                    totalxp: 144986,
                    nextLevel: 150000,
                    lastLevel: 110000
                }
            ],
            newsFeed: [
                {
                    text: "You leveled up your COOKING skill"
                }
            ]
        };

        $scope.addSkill = function(){

        };

        $scope.addActivity = function(){

        }
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


//

});
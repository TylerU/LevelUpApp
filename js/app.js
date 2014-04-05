"use strict";

/*
Todo:


*/

var App = angular.module("levelup",['ngRoute']);

App.controller("LevelUpAppCtrl",function  ($scope) {
	$scope.init = function  () {
        $scope.difficultyOptions = [
            "Easy",
            "Medium",
            "Hard",
            "Very difficult, but I've done it before",
            "Very difficult, but it's completely new"
        ];

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

App.controller("LoginCtrl", function($scope, ParseService){
    $scope.loginUserName = "";
    $scope.loginPassword = "";
    $scope.signUpEmail = "";
    $scope.signUpFirstName = "";
    $scope.signUpLastName = "";
    $scope.signUpPassword = "";
    $scope.loginErrorMessage = "";
    $scope.signUpErrorMessage = "";

    $scope.login = function(){

    };

    $scope.fbLogin = function(){

    };

    $scope.signUp = function(){

    };

    $scope.fbSignUp = function(){

    };
//    $scope.$apply( $location.path( "/todo" ) );

});
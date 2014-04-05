"use strict";

/*
Todo:


*/

var App = angular.module("levelup",[]);

App.controller("LevelUpAppCtrl",function  ($scope) {
	$scope.init = function  () {
        $scope.difficultyOptions = [
            "Easy",
            "Medium Difficulty",
            "Very hard, but I've done it before",
            "Very hard and completely new"
        ]
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
        }
	};
});
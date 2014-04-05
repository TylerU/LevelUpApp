'use strict';

/* Services */
App.factory('ParseService', function(){
    // Initialize Parse API and objects.
    Parse.initialize("63ICi1wvureE0W4gOv3RxShCaAmXv6i34fyAjtJx", "vq3xcnkduj6hlDUhqiqEeN6pQdoBnwiKHH10BJf5");

    var skills = null;
    var skillsTemp = {};
    var recentActivities = null;

    function skillFromParseObject(skill){
        var s = new Skill(skill.get("name"), skill.get("totalxp"));
        s._parseObj = skill;
        return s;
    }

    function activityFromParseObj(act, skill){
        var a = new Activity(act.get("description"), act.get("time"), act.get("difficulty"), skill, act.createdAt);
        a._parseObj = act;
        return a;
    }

    function getRecentActivitiesAndResolve(dfd){
        var Activity = Parse.Object.extend("Activity");
        var query = new Parse.Query(Activity);
        query.equalTo("owner", Parse.User.current().id);
        query.ascending("createdAt");
        query.limit(10);
        query.find({
            success: function(results){
                recentActivities = [];
                for(var i = 0; i < results.length; i++){
                    var object = results[i];
                    var na = activityFromParseObj(object, skillsTemp[object.get("skill")]);
                    recentActivities.unshift(na);
                }
                dfd.resolve({skills: skills, activities: recentActivities});
            },
            error: function(err){
                dfd.reject(err);
            }
        });
    }

    function getSkillsAndResolve(dfd){
        var Skill = Parse.Object.extend("Skill");
        var query = new Parse.Query(Skill);
        query.equalTo("owner", Parse.User.current().id);
        query.ascending("createdAt");

        skillsTemp = {};

        query.find({
            success: function(results) {
                skills = [];

                for (var i = 0; i < results.length; i++) {
                    var object = results[i];
                    var ns = skillFromParseObject(object);
                    skills.unshift(ns);
                    skillsTemp[ns._parseObj.id] = ns;
                }

                getRecentActivitiesAndResolve(dfd);
            },
            error: function(error) {
//                console.log(error);
                dfd.reject(error.message);
            }
        });
    }

    function getSkillIdFromName(skill){
        if(skills){
            for(var i = 0; i < skills.length; i++){
                var s = skills[i];
                if(s.getName() == skill){
                    return s._parseObj.id;
                }
            }
        }
        return null;
    }

    return {
        name: "Parse",

        // Login a user
        login : function login(email, password) {
            var dfd = new jQuery.Deferred();
            Parse.User.logIn(email, password, {
                success: function(user) {
                    dfd.resolve();
                },
                error: function(user, error) {
                    dfd.reject(error.message);
                }
            });
            return dfd.promise();
        },

        // Register a user
        signUp : function signUp(email, firstname, lastname, password) {
            var dfd = new jQuery.Deferred();
            var user = new Parse.User();
            user.set("email", email);
            user.set("username", email);
            user.set("firstname", firstname);
            user.set("lastname", lastname);
            user.set("password", password);

            var promise = user.signUp(null, {
                success: function(user) {
                    dfd.resolve();
                },
                error: function(user, error) {
                    dfd.reject(error.message);
                }
            });

            return dfd.promise();
        },

        // Logout current user
        logout : function logout(callback) {
            var dfd = new jQuery.Deferred();
            dfd.resolve();
            Parse.User.logOut();
            return dfd.promise();
        },

        // Get current logged in user
        getUser : function getUser() {
            return Parse.User.current();
        },

        getUsersName: function(){
            return Parse.User.current().get('firstname');
        },

        // This function returns true if the user is currently logged in, false otherwise.
        userLoggedIn : function userLoggedIn() {
            return Parse.User.current() != null;
        },

        getSkills: function(){
            var dfd = new jQuery.Deferred();

            if(skills){
                dfd.resolve(skills);
            }
            else{
                getSkillsAndResolve(dfd);
            }
            return dfd.promise();
        },

        addSkill: function(skillName){
            var dfd = new jQuery.Deferred();

            var Skill = Parse.Object.extend("Skill");
            var skill = new Skill();

            skill.set("owner", Parse.User.current().id);
            skill.set("name", skillName);
            skill.set("totalxp", 0);

            skill.save(null, {
                success: function(newSkill) {
                    skills.unshift(skillFromParseObject(newSkill));
                    dfd.resolve(newSkill);
                },
                error: function(newSkill, error) {
                    dfd.reject(error.message);
                }
            });

            return dfd.promise();
        },

        addActivity: function(skill, description, difficulty, time){
            var dfd = new jQuery.Deferred();

            var Activity = Parse.Object.extend("Activity");
            var activity = new Activity();

            activity.set("owner", Parse.User.current().id);
            activity.set("skill", skill._parseObj.id);
            activity.set("description", description);
            activity.set("difficulty", difficulty + 1);
            activity.set("time", time);

            activity.save(null, {
                success: function(newActivity) {
//                    .push(activityFromParseObject(newActivity));
                    var na = activityFromParseObj(newActivity, skill);
                    recentActivities.unshift(na);
                    skill._parseObj.set("totalxp", skill.getTotalXp() + na.getXpGained());
                    skill._parseObj.save(null, {
                        success: function (obj) {
                            skill.setTotalXp(obj.get("totalxp"));
                            dfd.resolve(na);
                        },
                        error: function (err) {
                            dfd.reject(err.message);
                        }
                    });
                },
                error: function(activity, error) {
                    dfd.reject(error.message);
                }
            });


            return dfd.promise();
        }
    };
});
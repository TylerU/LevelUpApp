"use strict";

function Skill(name, xp){
    this.name = name;
    this.totalxp = xp;
}

Skill.prototype.getName = function(){
    return this.name;
};

Skill.prototype.getLevel = function(){
//    return Math.floor((1/3)*(-50 + Math.sqrt(3*this.totalxp + 2500)));
    return Math.floor((1/4)*(-15 + Math.sqrt(4*this.totalxp + 225)));
};

Skill.prototype.getProgress = function(){
    return (this.getTotalXp() - this.getLastLevelXp()) / (this.getNextLevelXp() - this.getLastLevelXp()) * 100;
};

Skill.prototype.getTotalXp = function(){
    return this.totalxp;
};

Skill.prototype.setTotalXp = function(xp){
    this.totalxp = xp;
};

Skill.prototype.getNextLevelXp = function(){
    return this.getXpFromLevel(this.getLevel() + 1);
};

Skill.prototype.getLastLevelXp = function(){
    return this.getXpFromLevel(this.getLevel());
};

Skill.prototype.getXpFromLevel = function(level){
    return 4*level*level + 30*level;
//    return 3*level*level + 100*level;
};




function Activity(description, time, difficulty, skill, date){
    this.description = description;
    this.time = time;
    this.difficulty = difficulty;
    this.skill = skill;
    this.leveledUp = false;
    this.date = date;
}

Activity.prototype.getDescription = function(){
    return this.description;
};

Activity.prototype.getXpGained = function(){
//    console.log(this.getHours());
//    console.log(this.getDifficultyLevel())
    return this.getHours() * this.getDifficultyLevel();
};

Activity.prototype.getSkill = function(){
    return this.skill;
};

Activity.prototype.getSkillName = function(){
    return this.skill.getName();
};

Activity.prototype.getHours = function(){
    return this.time;
};

Activity.prototype.getDifficultyLevel = function(){
    return this.difficulty;
};

Activity.prototype.levelUp = function(tf){
    this.leveledUp = tf;
}

Activity.prototype.getDate = function(){
    return this.date;
}
//dependencies

const inquirer = require('inquirer');
const Enemy = require('./Enemy');
const Player = require('./Player');

//game contructor object
function Game() {
    //Game object poperties
    //current enemy, and player are undefined. We will assign when initializeGame() method is called
    this.roundNumber = 0;
    this.isPlayerTurn = false;
    this.enemies = [];
    this.currentEnemy;
    this.player;
}

//intitializeGame() method using prototype syntax; this is where we set up Enemy and Player objects
Game.prototype.initializeGame = function() {
    //populate the enemies array
    this.enemies.push(new Enemy('goblin', 'sword'));
    this.enemies.push(new Enemy('orc', 'baseball bat'));
    this.enemies.push(new Enemy('skeleton', 'axe'));

    //keep track of which Enemy object is currently fighting the Player. When game starts this will be first object in the array
    this.currentEnemy = this.enemies[0];

    //prompt user for thier name, which will become the Player name
    inquirer
        .prompt({
            type: 'text',
            name: 'name',
            message: 'What is your name?'
        })

        //destructure name from the prompt object
        .then(({name}) => {
                this.player = new Player (name);
        
        //test the object creation
        // console.log(this.currentEnemy, this.player);

        //placeholder for starting a new round
        this.startNewBattle();
            })

}


module.exports = Game;
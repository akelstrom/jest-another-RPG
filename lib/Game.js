//dependencies

const inquirer = require("inquirer");
const Enemy = require("./Enemy");
const Player = require("./Player");

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
Game.prototype.initializeGame = function () {
  //populate the enemies array
  this.enemies.push(new Enemy("goblin", "sword"));
  this.enemies.push(new Enemy("orc", "baseball bat"));
  this.enemies.push(new Enemy("skeleton", "axe"));

  //keep track of which Enemy object is currently fighting the Player. When game starts this will be first object in the array
  this.currentEnemy = this.enemies[0];

  //prompt user for thier name, which will become the Player name
  inquirer
    .prompt({
      type: "text",
      name: "name",
      message: "What is your name?",
    })

    //destructure name from the prompt object
    .then(({ name }) => {
      this.player = new Player(name);

      //placeholder for starting a new round
      this.startNewBattle();
    });
};

Game.prototype.startNewBattle = function () {
  //establish who goes first based on agility values
  if (this.player.agility > this.currentEnemy.agility) {
    this.isPlayerTurn = true;
  } else {
    this.isPlayerTurn = false;
  }

  //display the Player Object stats
  console.log("Your stats are as follows:");
  console.table(this.player.getStats());

  //display description of the current enemy
  console.log(this.currentEnemy.getDescription());

  //call battle method, main event of the agme that will run indefinate amount of times
  this.battle();
};

Game.prototype.battle = function () {
  if (this.isPlayerTurn) {
    //prompt user to attack or use a potion
    inquirer
      .prompt({
        type: "list",
        message: "what would you like to do?",
        name: "action",
        choices: ["Attack", "Use potion"],
      })
      //(remember to always use arrow function as a .then callback for inquirer)
      //if using a potion:
      .then(({ action }) => {
        if (action === "Use potion") {
          //if there is no potion in inventory
          if (!this.player.getInventory()) {
            console.log("You don't have any potions!");
            return this.checkEndOfBattle();
          }
          //promt user for which potion he would like to use
          inquirer
            .prompt({
              type: "list",
              message: "Which potion would you like to use?",
              name: "action",
              choices: this.player
                .getInventory()
                .map((item, index) => `${index + 1}: ${item.name}`),
            })
            .then(({ action }) => {
              //after a player uses a potion
              const potionDetails = action.split(": ");

              this.player.usePotion(potionDetails[0] - 1);
              console.log(`You used a ${potionDetails[1]} potion.`);
              this.checkEndOfBattle();
            });
        } else {
          //if player attacks
          const damage = this.player.getAttackValue();
          //subtract health from the player based on enemy attack value
          this.currentEnemy.reduceHealth(damage);

          console.log(`You attacked the ${this.currentEnemy.name}`);
          console.log(this.currentEnemy.getHealth());
          this.checkEndOfBattle();
        }
      });
  } else {
    //after enemy attacks
    const damage = this.currentEnemy.getAttackValue();
    this.player.reduceHealth(damage);

    console.log(`You were attacked by the ${this.currentEnemy.name}`);
    console.log(this.player.getHealth());
    this.checkEndOfBattle();
  }
};

Game.prototype.checkEndOfBattle = function () {
  if (this.player.isAlive() && this.currentEnemy.isAlive()) {
    this.isPlayerTurn = !this.isPlayerTurn;
    this.battle();
  } else if (this.player.isAlive() && !this.currentEnemy.isAlive()) {
    console.log(`You've defeated the ${this.currentEnemy.name}`);

    this.player.addPotion(this.currentEnemy.potion);
    console.log(`${this.player.name} found a ${this.currentEnemy.potion.name} potion`);

    this.roundNumber++;

    if (this.roundNumber < this.enemies.length) {
      this.currentEnemy = this.enemies[this.roundNumber];
      this.startNewBattle();
    } else {
      console.log("You win!");
    }
  } else {
    console.log("You've been defeated!");
  }
};

module.exports = Game;

// the Game object used by the phaser.io library
var stateActions = { preload: preload, create: create, update: update };

// Phaser parameters:
// - game width
// - game height
// - renderer (go for Phaser.AUTO)
// - element where the game will be drawn ('game')
// - actions on the game state (or null for nothing)
var game = new Phaser.Game(980, 600, Phaser.AUTO, 'game', stateActions);

var score = 0;

var width = 980;
var height = 600;
var gapSize = 100;
var gapMargin = 50;
var blockHeight = 50;
var background;
/*
var score = 0;
if (score < 1) {
  score += 1;
}
if (score >= 1) {
  score += 2;
} */

var labelScore;

var player;

var pipes = [];

//player.anchor.setTo(0, 0);
//player.anchor.setTo(1, 1);

/*
 * Loads all resources for the game and gives them names.
 */
function preload() {
    //game.load.image("playerImg", "../assets/skeleton.png");
    game.load.spritesheet('playerImg', '../assets/Bird.png', 598, 402, 8);
    game.load.audio("score", "../assets/point.ogg");
    game.load.image("pipeBlock","../assets/cloud.png");
    game.load.image("backgroundImg", "../assets/Field.jpg");
}

/*
 * Initialises the game. This function is only called once.
 */
function create() {
    pauseGame();
    game.physics.startSystem(Phaser.Physics.ARCADE);
    background = game.add.image(0, 0, "backgroundImg");
    background.scale.setTo(1.5,1.5);
    game.add.text(350, 20, "Welcome to my Game",{font: "25px Arial", fill: "#000"});
    player = game.add.sprite(100, 200, "playerImg");
    player.scale.setTo(0.1, 0.1);
    game.physics.arcade.enable(player);
    player.body.velocity.y = -100;
    player.body.gravity.y = 450;
    player.body.collideWorldBounds = true;
    player.body.bounce.set(0.8,0.8,0.8,0.8);
    game.input.onDown.add(clickHandler);

    game.input.keyboard.addKey(Phaser.Keyboard.A).onDown.add(resetGame);

    game.input.keyboard.addKey(Phaser.Keyboard.P).onDown.add(pauseGame);

  //  game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(spaceHandler);
  //  generatePipe();
    game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(playerJump);

    var pipeInterval = 1.75 * Phaser.Timer.SECOND;
    game.time.events.loop(pipeInterval, generatePipe);

    //alert("Are you ready to start the game?");
    labelScore = game.add.text(20, 20, "0", {fill: "#000"});


    player.animations.add('walk');

    player.animations.play('walk', 50, true);

    //game.add.tween(sprite).to({ x: game.width }, 10000, Phaser.Easing.Linear.None, true);

    cursors = game.input.keyboard.createCursorKeys();
}
    /*
    game.input.keyboard.addKey(Phaser.Keyboard.RIGHT).onDown.add(moveRight);
    game.input.keyboard.addKey(Phaser.Keyboard.LEFT).onDown.add(moveLeft);
    game.input.keyboard.addKey(Phaser.Keyboard.UP).onDown.add(moveUp);
    game.input.keyboard.addKey(Phaser.Keyboard.DOWN).onDown.add(moveDown);
    */

function update(){
    game.physics.arcade.overlap(player, pipes, pregameOver);
    if (player.x >= 300)
    {
        player.scale.x += 0.01;
        player.scale.y += 0.01;
    }
    /*
    if (cursors.left.isDown)
    {
    	sprite.body.moveLeft(400);
    }
    else if (cursors.right.isDown)
    {
    	sprite.body.moveRight(400);
    }

    if (cursors.up.isDown)
    {
    	sprite.body.moveUp(400);
    }
    else if (cursors.down.isDown)
    {
    	sprite.body.moveDown(400);
    }
    */
}

/*
function autoScroll(){

}
*/

function resetGame(){
  score = 0;
  game.state.restart();
}

function pregameOver() {

    player.kill();
    game.add.text(320, 230, "Game Over",{font: "65px Arial", fill: "#000"});
    game.time.events.add(Phaser.Timer.SECOND / 4, function(){
        scorer(score);
    });
}

function changeScore() {
    score = score + 1;
    labelScore.setText(score.toString());
}

function clickHandler(event) {

}

function spaceHandler() {
    game.sound.play("score");
}

function addPipeCloud(x, y) {
    var pipeBlock = game.add.sprite(x,y,"pipeBlock");
    game.physics.arcade.enable(pipeBlock);
    pipeBlock.body.velocity.x = -200;
    pipeBlock.scale.setTo(0.1, 0.1);
    pipes.push(pipeBlock);
}

/*
function generatePipe() {
    var gap = game.rnd.integerInRange(1 ,5);
    for (var count = 0; count < 12; count++) {
        if (count != gap && count != gap+1) {
            addPipeTree(940, count * 50);
        }
    }
    changeScore();
}
*/
function pauseGame(){
    if (game.paused === true){
      game.paused = false;
    }
    else {
      game.paused = true;
    }
}

function generatePipe() {
    // this is where the gap starts  1
    var gapStart = game.rnd.integerInRange(gapMargin, height - gapSize - gapMargin);

    for(var y = gapStart; y > 0; y -= blockHeight) {
        // y is the coordinate of the bottom of the block, subtract blockHeight
        // to get the top                                                   2
        addPipeCloud(width, y - blockHeight);
    }
    for(y = gapStart + gapSize; y<height; y += blockHeight){
        addPipeCloud(width, y);
    }
    changeScore();

    for(var bottomOfBlock = gapStart; bottomOfBlock > 0; bottomOfBlock -= blockHeight) {
      var topOfBlock = bottomOfBlock - blockHeight;
      addPipeCloud(width, topOfBlock);
  }
}

function playerJump() {
    player.body.velocity.y = -200;
    game.paused = false;
}

function scorer(score) {
    var playerName = prompt("What's your name?");
    if (playerName === "")
        playerName = "Anonymous";
    var scoreEntry = "<li>" + playerName + " : " + score.toString() + "</li>" ;
    $("#content").append(scoreEntry);
}

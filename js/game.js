// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/hero.png";

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "images/monster.png";

// Game objects
var hero = {
	speed: 256, // movement in pixels per second
	deaths: 0 
};
var monster = {
	speed:120,
	tagTimeMax:1000,
	tagTime:1000
};
var monstersCaught = 0;

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a monster
var reset = function () {
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;
	resetMonster();

};

var resetMonster = function (){

	// Throw the monster somewhere on the screen randomly
	monster.x = 32 + (Math.random() * (canvas.width - 64));
	monster.y = 32 + (Math.random() * (canvas.height - 64));
}

// Update game objects
var update = function (modifier) {
	if (38 in keysDown) { // Player holding up
		hero.y -= hero.speed * modifier;
	}
	if (40 in keysDown) { // Player holding down
		hero.y += hero.speed * modifier;
	}
	if (37 in keysDown) { // Player holding left
		hero.x -= hero.speed * modifier;
	}
	if (39 in keysDown) { // Player holding right
		hero.x += hero.speed * modifier;
	}

	// Are they touching?
	var touchingness = 32 // probably the size of the monster
	if (
		hero.x <= (monster.x + touchingness)
		&& monster.x <= (hero.x + touchingness)
		&& hero.y <= (monster.y + touchingness)
		&& monster.y <= (hero.y + touchingness)
	) {
		//are they touching from the top position?
		if(hero.y < monster.y)
		{
			++monstersCaught;
			resetMonster();
		}
		else { //die
			var ctx = canvas.getContext("2d");
			hero.deaths++;
			monstersCaught = 0;
			reset();
			}
		}
		//Move the monster
	if(Math.random() > .5){
			monster.x+= monster.speed * modifier;
			if (monster.x > canvas.width) 
				{
					monster.x = 0;
					monster.y = 32 + (Math.random() * (canvas.height - 64));
				}
		}
};

// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

	if (monsterReady) {
		ctx.drawImage(monsterImage, monster.x, monster.y);
	}

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Goblins caught: " + monstersCaught, 32, 32);
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "rigth";
	ctx.textBaseline = "top";
	ctx.fillText("Hero Deaths: " + hero.deaths, 300, 32);
};
var addMonster = function(){

}

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;
};

// Let's play this game!
//Start out with the hero in the middle
hero.x = canvas.width / 2;
hero.y = canvas.height / 2;
reset();
var then = Date.now();
setInterval(main, 1); // Execute as fast as possible
//setTimeout( monster.tagTime)

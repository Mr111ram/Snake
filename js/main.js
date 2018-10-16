const 
	canvas 	= document.getElementById ("game"),
	ctx		= canvas.getContext ("2d");

let 
	playerX			= 50,
	playerY			= 50,
	velocityX		= 0,
	velocityY		= 0,
	blockSize		= 20,
	speed			= 3,
	baseSpeed		= speed,
	trail			= [],
	apples			= [],
	tail			= 100,
	tailSafeZone	= 20,
	gameStart		= false,
	firstKeyPress	= false,
	cooldown		= false,
	score			= 0,
	fps				= Math.round (1000 / 60);

canvas.width  = window.innerWidth;
canvas.height = window.innerHeight; 

addEventListener ("keydown", function (event){

	if (!firstKeyPress && [37,38,39,40].indexOf(event.keyCode) > -1 ){
		setTimeout(function() {gameStart = true;}, 1000);
	  	firstKeyPress = true;
		spawnApple();
	}

	if (cooldown) return false;

  	if (event.keyCode === 37 && !(velocityX > 0)){
		velocityX = -speed;
		velocityY = 0;
	}
  
	if (event.keyCode === 38 && !(velocityY > 0)){
		velocityX = 0;
		velocityY = -speed;
	}
  
	if (event.keyCode === 39 && !(velocityX < 0)){
		velocityX = speed; 
		velocityY = 0;
	}
  
	if (event.keyCode === 40 && !(velocityY < 0)){
		velocityX = 0;
		velocityY = speed;
	}

	cooldown = true;

	setTimeout(function() {cooldown = false;}, 100);
});

setInterval(function loop (){
	ctx.fillStyle = "#1f1f1f";
	ctx.fillRect (0, 0, canvas.width, canvas.height);

	playerX += velocityX;
	playerY += velocityY;

	if (playerX + blockSize < 0)
		playerX = canvas.width;

	if (playerY + blockSize < 0)
		playerY = canvas.height;

	if (playerX > canvas.width)
		playerX = 0;

	if (playerY > canvas.height)
		playerY = 0;

	ctx.fillStyle = 'LimeGreen';

	for (let i = 0; i < trail.length; i++){
		ctx.fillStyle = trail[i].color || 'lime';
		ctx.fillRect (trail[i].x, trail[i].y, blockSize, blockSize);
	}

	trail.push({x: playerX, y: playerY, color: ctx.fillStyle});

	if (trail.length > tail) trail.shift ();

	if (trail.length >= tail){
		for(let i = trail.length - tailSafeZone; i >= 0; i--){
			if (
				playerX < (trail[i].x + blockSize)
				&& playerX + blockSize > trail[i].x
				&& playerY < (trail[i].y + blockSize)
				&& playerY + blockSize > trail[i].y
			){
				tail = 10; 
				speed = baseSpeed;			  
				for(let t = 0; t < trail.length; t++){
					trail[t].color = 'red';  
					score = 0;
					document.getElementById ("score").innerText = score;
					if ( t >= trail.length - tail ) break;
		  		}
			}
	  	}
	}

	for (let a = 0; a < apples.length; a++){
		ctx.fillStyle = apples[a].color;
		ctx.fillRect(apples[a].x, apples[a].y, blockSize, blockSize);
	}

	for (let a = 0; a < apples.length; a++){
		if (
			playerX < (apples[a].x + blockSize)
			&& playerX + blockSize > apples[a].x
			&& playerY < (apples[a].y + blockSize)
			&& playerY + blockSize > apples[a].y
		){
			apples.splice (a, 1); 
			tail += 10; 
			speed += .1; 
			spawnApple (); 
			score++;
			document.getElementById ("score").innerText = score;
			break;
		}
	}

}, fps);

function spawnApple (){
	let
		newApple = {
			x: ~~(Math.random() * canvas.width),
			y: ~~(Math.random() * canvas.height),
			color: 'red'
		};

	if (
		(newApple.x < blockSize || newApple.x > canvas.width - blockSize)||
		(newApple.y < blockSize || newApple.y > canvas.height - blockSize)
	){
		spawnApple ();
		return;
	}

	for (let i = 0; i < tail.length; i++){
		if (
			newApple.x < (trail[i].x + blockSize)
			&& newApple.x + blockSize > trail[i].x
			&& newApple.y < (trail[i].y + blockSize)
			&& newApple.y + blockSize > trail[i].y
		){
			spawnApple ();
			return;
		}
	}

	apples.push (newApple);

	if (apples.length < 3 && ~~(Math.random() * 1000) > 700)
		spawnApple();
	
}
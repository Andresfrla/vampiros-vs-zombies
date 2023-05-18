const canvas = document.getElementById('gameplay');
const ctx = canvas.getContext('2d');    
let requestId;
let frames = 0;
let gravity = 9.0;
let zombies = [];
let PumpkinToAdd = [];

function clearCanvas (){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function vampireAnimation (){ 
    if (frames % 20 === 0){     
            if (vampire.animate === 4){
            vampire.animate = 0;
        } else {
            vampire.animate++;
        }
}
}

function checkCollisions (){
    if (vampire.x <= 0 ){
        vampire.x = canvas.width - vampire.width;
    } else if (vampire.x > canvas.width) {
        vampire.x = 0;
    }

    zombies.forEach((zombie, i) => {
        if(vampire.isTouching(zombie) && vampire.scale === false) {
            zombies.splice(i, 1);
            vampire.hp--;
        }
    })

    zombies.forEach((zombie, i) => {
        if(vampire.isTouching(zombie) && vampire.scale === true) {
            zombies.splice(i, 1);
        }
    })    

    PumpkinToAdd.forEach((pumpkin, i) => {
        if(vampire.isTouching(pumpkin)){
            vampire.scale = true;
            setTimeout(() => {vampire.scale = false} , 2900) 
            PumpkinToAdd.splice(i, 1);
            zombies.splice(i, 1);
        }
    })

    zombies.forEach((zombie) => {
        if(zombie.x <= 0){
            zombie.x = canvas.width - zombie.width;
        } else if (zombie.x > canvas.width){
            zombie.x = 0;
        }

        if (
        (zombie.x < block.x + block.width &&
        zombie.x + zombie.width > block.x &&
        zombie.y < block.y + block.height &&
        zombie.y + zombie.height > block.y) ||
        (zombie.x < block.x1 + block.width &&
        zombie.x + zombie.width > block.x1 &&
        zombie.y < block.y1 + block.height &&
        zombie.y + zombie.height > block.y1)
        ) {
        zombie.vy = 0;
        zombie.y = block.y - zombie.height; 
        }
    })


    if (
        (vampire.x < block.x + block.width &&
        vampire.x + vampire.width > block.x &&
        vampire.y < block.y + block.height &&
        vampire.y + vampire.height > block.y) ||
        (vampire.x < block.x1 + block.width &&
        vampire.x + vampire.width > block.x1 &&
        vampire.y < block.y1 + block.height &&
        vampire.y + vampire.height > block.y1)
        ) {
        vampire.vy = 0;
        vampire.y = block.y - vampire.height; 
        }
}

function generateZombies (){
    if (frames % 200 === 0){
        const randomPosition = Math.floor(Math.random() * canvas.width - 50)
        const zombie = new Zombie(randomPosition);
        zombies.push(zombie)
    }
}

function generatePumpkin (){
    if (frames % 550 === 0){
        const randomPosition = Math.floor(Math.random() * canvas.width - 50)
        const pumpkin = new Pumpkin(randomPosition);
        PumpkinToAdd.push(pumpkin)
    }
}
function drawPumpkin (){
    PumpkinToAdd.forEach(pumpkin => pumpkin.draw())
}

function drawZombies(){
    zombies.forEach(zombie => zombie.draw())
}

function zombieAnimation() {
    zombies.forEach((zombie) => {
            if (frames % 30 === 0){
        if (zombie.animate === 4){
            zombie.animate = 0;
        } else {
            zombie.animate++;
        }}})
    }

function pumpkinAnimation(){
    PumpkinToAdd.forEach((pumpkin) => {
        if (frames % 20 === 0){
    if (pumpkin.animate === 7){
        pumpkin.animate = 0;
    } else {
        pumpkin.animate++;
    }}})
}

function updateGame() {
    frames++;
    clearCanvas();
    background.draw();
    vampireAnimation();
    vampire.draw();
    vampire.x += vampire.vx; 
    vampire.y += vampire.vy; 
    vampire.y += gravity;
    block.draw(); 
    generateZombies();
    drawZombies(); 
    zombieAnimation();
    generatePumpkin ();
    drawPumpkin ();
    pumpkinAnimation();
    checkCollisions();
    drawInfo();
    gameOver();
    WinTheGame();
    if (requestId){
        requestAnimationFrame(updateGame);
    }
}

function gameOver(){
    if (vampire.hp === 0){
        ctx.font = '100px Verdana'
        ctx.strokeStyle = 'red'
        ctx.lineWidth = 2;
        ctx.strokeText('Game Over', canvas.width/2 -300, canvas.height/2)
        ctx.drawImage(background.img2, canvas.width/2 -300, canvas.height/2 -300)
        requestId = cancelAnimationFrame(requestId)
    }
}

function drawInfo(){
    ctx.font = '24px Verdana'
    ctx.strokeStyle = 'red'
    ctx.lineWidth = 2;
    ctx.strokeText(`HP: ${vampire.hp}`, 50, 30)
}

function startGame(){
    if(!requestId){
        requestId = requestAnimationFrame(updateGame);
    }
}

function WinTheGame(){
    if (frames > 500 && zombies == 0){
        ctx.font = '100px Verdana'
        ctx.strokeStyle = 'Green'
        ctx.lineWidth = 2;
        ctx.strokeText('You Win', canvas.width/2 -300, canvas.height/2)
        const youWin = new Image();
        youWin.src = 'images/youWin.png';
        ctx.drawImage(youWin, 0, 0, 300, 300)
        requestId = cancelAnimationFrame(requestId)
    }
}

window.onload = () => {
    startGame();
}

// CLASSES

class Background {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.width = canvas.width;
        this.height = canvas.height;
        this.img = new Image();
        this.img.src = 'sources/Battleground.png';
        this.img.onload = () => {
            this.draw()
        }
    }

    draw() {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
    }
}

class Vampire {
    constructor() {
        this.width = 100;
        this.height = 120;
        this.width2 = 170;
        this.height2 = 120;
        this.y =  150;
        this.x = 200;
        this.vx = 0;
        this.vy = 0;
        this.animate = 0; // Movimiento de izquierda a derecha
        this.position = 0;
        this.scale = false,
        this.jumpStreng = 14;
        this.hp = 3;
        this.img2 = new Image();
        this.img2.src = 'sources/pumpkinPortal.png'
        this.img = new Image();
        this.img.src = 'sources/vampireSprite.png'
        this.img.onload = () => {
            this.draw()
        }
        this.img2.onload = () => {
            this.draw()
        }
    }

    draw (){
        if (this.y > canvas.height - this.height) {
            this.y = canvas.height - this.height 
        } else {
            this.vy++
        } 
        
        if (this.scale){
        ctx.drawImage(
            this.img2,
            (this.animate * 640) / 5,
            (this.position * 400) / 4,
            640/5,
            400/4,
            this.x,
            this.y,
            this.width2,
            this.height2
        )} 

        else {
        ctx.drawImage(
            this.img,
            (this.animate * 400) / 5,
            (this.position * 450) / 4,
            400/5,
            450/4,
            this.x,
            this.y,
            this.width,
            this.height
        )}
    }

    moveLeft() {
        this.vx -= 3;
        if (this.vx < -3) { this.vx = -3}
        this.position = 2;
        if (this.vx === 0){this.position = 0}
    }
    
    moveRight() {
        this.vx += 3;
        if (this.vx > 3) {this.vx = 3}
        this.position = 1;
        if (this.vx === 0){this.position = 0}
    }

    jump(){
        this.vy = -2*this.jumpStreng;
        this.position = 3;
    }

    isTouching(obstacle) {
        return (
        this.x < obstacle.x + obstacle.width && this.x + this.width > obstacle.x &&
        this.y < obstacle.y + obstacle.height && this.y + this.height > obstacle.y
        )
    }
}

class Block {
    constructor() {
        this.x = 200;
        this.y = 300;
        this.x1 = 700;
        this.y1 = 300;
        this.width = 150;
        this.height = 30;
        this.img = new Image();
        this.img.src = 'sources/block.png';
        this.img.onload = () => {
            this.draw()
        }
    }

    draw() {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
        ctx.drawImage(this.img, this.x1, this.y1, this.width, this.height)
    }

}

class Zombie {
    constructor(x = 0) {
        this.width = 50;
        this.height = 80;
        this.y =  0;
        this.x = x;
        this.vx = 0,
        this.vy = 0,
        this.animate = 0; // Movimiento de izquierda a derecha
        this.position = 0;
        this.looking = Math.random() < 0.5 ? 'left' : 'right';;
        this.xDirection = 0.2;
        this.hp = 1;
        this.img = new Image();
        this.img.src = 'sources/zombieSprite.png'
        this.img.onload = () => {
            this.draw();
        }
        this.imgInverted = new Image();
        this.imgInverted.src = 'sources/zombieSpriteInverted.png'
        this.imgInverted.onload = () => {
            this.draw();
        }
    }

    draw (){
        if (this.y > canvas.height - this.height) {
            this.y = canvas.height - this.height 
        } else {
            this.vy++
        } 
            if (this.looking === 'left'){
            ctx.drawImage(
            this.imgInverted,
            (this.animate * 249) / 8,
            (this.position * 128)/2,
            249/8,
            128/2,
            this.x += this.xDirection,
            this.y++,
            this.width,
            this.height
        );
        } else {
            ctx.drawImage(
            this.img,
            (this.animate * 248) / 8,
            (this.position * 128)/2,
            249/8,
            128/2,
            this.x -= this.xDirection,
            this.y++,
            this.width,
            this.height
            );
        }}

    isTouching(obstacle) {
        return (
        this.x < obstacle.x + obstacle.width && this.x + this.width > obstacle.x &&
        this.y < obstacle.y + obstacle.height && this.y + this.height > obstacle.y
        )
    }
}

class Pumpkin {
    constructor(x) {
        this.x = x;
        this.y = 0;
        this.animate = 0;
        this.position = 0;
        this.width = 30;
        this.height = 30;
        this.img = new Image();
        this.img.src = 'sources/pumpkinSprite.png';
    }

    draw() {
        this.y++;
        ctx.drawImage(
            this.img, 
            (this.animate * 124)/8,
            this.position * 16,
            124/8,
            16,
            this.x, 
            this.y, 
            this.width, 
            this.height);
    } 
} 

// INSTANCES
const background = new Background();
const vampire = new Vampire();
const block = new Block();
const zombie = new Zombie();
const pumpkin = new Pumpkin();


// LISTENERS

document.addEventListener('keydown', e => {
    switch (e.keyCode){
    case 37:
        e.preventDefault()
        vampire.moveLeft()
        return;
    case 39:
        e.preventDefault()
        vampire.moveRight()
        return;
    case 38:
        e.preventDefault()
        vampire.jump()
        return;
}})

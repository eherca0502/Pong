const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");

const modeSelectDiv = document.querySelector(".mode-select");
const levelSelectDiv = document.querySelector(".level-select");
const gameContainer = document.querySelector(".game-container");

const twoPlayersBtn = document.getElementById("twoPlayersBtn");
const vsComputerBtn = document.getElementById("vsComputerBtn");

const winnerScreen = document.querySelector(".winner-screen");
const winnerText = document.getElementById("winnerText");
const restartBtn = document.getElementById("restartBtn");

let vsComputer = false;
let aiSpeed = 4;
let aiErrorChance = 0.2;

let player1Y, player2Y, ballX, ballY, ballSpeedX, ballSpeedY;
let player1Score = 0, player2Score = 0;
const keys = {};

canvas.width = 600;
canvas.height = 400;


const hitSound = new Audio("preview.mp3");
const scoreSound = new Audio("score.wav");
const winSound = new Audio("win.wav");

twoPlayersBtn.addEventListener("click", () => startGame(false));
vsComputerBtn.addEventListener("click", () => {
    vsComputer = true;
    modeSelectDiv.style.display = "none";
    levelSelectDiv.style.display = "block";
});


levelSelectDiv.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => {
        const level = btn.dataset.level;
        if(level === "easy") { aiSpeed = 3; aiErrorChance = 0.3; }
        if(level === "medium") { aiSpeed = 5; aiErrorChance = 0.15; }
        if(level === "hard") { aiSpeed = 7; aiErrorChance = 0.05; }
        startGame(true);
    });
});

function startGame(isVsComputer) {
    vsComputer = isVsComputer;
    modeSelectDiv.style.display = "none";
    levelSelectDiv.style.display = "none";
    gameContainer.style.display = "block";

    player1Y = canvas.height/2 - 40;
    player2Y = canvas.height/2 - 40;
    ballX = canvas.width/2 - 7.5;
    ballY = canvas.height/2 - 7.5;
    ballSpeedX = 4;
    ballSpeedY = 4;
    player1Score = 0;
    player2Score = 0;

    winnerScreen.style.display = "none";

    document.addEventListener("keydown", e => keys[e.key] = true);
    document.addEventListener("keyup", e => keys[e.key] = false);

    draw();
}

// Botón reiniciar
restartBtn.addEventListener("click", () => {
    winnerScreen.style.display = "none";
    player1Score = 0;
    player2Score = 0;
    ballX = canvas.width/2 - 7.5;
    ballY = canvas.height/2 - 7.5;
    ballSpeedX = 4 * (Math.random() > 0.5 ? 1 : -1);
    ballSpeedY = 4 * (Math.random() > 0.5 ? 1 : -1);
    draw();
});

function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawBall(x, y, size, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x + size/2, y + size/2, size/2, 0, Math.PI*2);
    ctx.fill();
}

function draw() {
    drawRect(0, 0, canvas.width, canvas.height, "#111"); 
    drawRect(10, player1Y, 10, 80, "#00ffcc"); 
    drawRect(canvas.width - 20, player2Y, 10, 80, "#ff00cc"); 
    drawBall(ballX, ballY, 15, "#ffff00"); 

    
    document.getElementById("player1").innerText = player1Score;
    document.getElementById("player2").innerText = player2Score;

 
    if(keys["w"] && player1Y > 0) player1Y -= 6;
    if(keys["s"] && player1Y < canvas.height - 80) player1Y += 6;


    if(vsComputer) {
        const centerPaddle = player2Y + 40;
        if(Math.random() > aiErrorChance) {
            if(centerPaddle < ballY + 7.5) player2Y += aiSpeed;
            if(centerPaddle > ballY + 7.5) player2Y -= aiSpeed;
        }
        if(player2Y < 0) player2Y = 0;
        if(player2Y > canvas.height - 80) player2Y = canvas.height - 80;
    } else {
        if(keys["ArrowUp"] && player2Y > 0) player2Y -= 6;
        if(keys["ArrowDown"] && player2Y < canvas.height - 80) player2Y += 6;
    }

    ballX += ballSpeedX;
    ballY += ballSpeedY;

 
    if(ballY <=0 || ballY + 15 >= canvas.height) {
        ballSpeedY *= -1;
        hitSound.play();
    }


    if(ballX <=20 && ballY + 15 >= player1Y && ballY <= player1Y + 80) {
        ballSpeedX *= -1;
        hitSound.play();
    }
    if(ballX + 15 >= canvas.width - 20 && ballY + 15 >= player2Y && ballY <= player2Y + 80) {
        ballSpeedX *= -1;
        hitSound.play();
    }


    const maxScore = 10;
    if(ballX < 0) {
        player2Score++;
        scoreSound.play();
        resetBall();
    }
    if(ballX + 15 > canvas.width) {
        player1Score++;
        scoreSound.play();
        resetBall();
    }

   
    if(player1Score >= maxScore || player2Score >= maxScore) {
        const winner = player1Score >= maxScore ? "Jugador 1" : (vsComputer ? "Computadora" : "Jugador 2");
        winnerText.innerText = `¡${winner} GANA!`;
        winnerScreen.style.display = "flex";
        winSound.play();
        return;
    }

    requestAnimationFrame(draw);
}

function resetBall() {
    ballX = canvas.width/2 - 7.5;
    ballY = canvas.height/2 - 7.5;
    ballSpeedX *= -1;
    ballSpeedY = 4 * (Math.random() > 0.5 ? 1 : -1);
}

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const levelCounter = document.getElementById('level');

canvas.width = 800;
canvas.height = 600;

let level = 1;
let ball = {
    x: canvas.width / 2,
    y: canvas.height - 30,
    radius: 10,
    dx: 2,
    dy: -2,
    color: '#0095DD'
};

let cylinders = [];
const minLayers = 15;
const maxLayers = 100;

function randomColor() {
    return `#${Math.floor(Math.random()*16777215).toString(16)}`;
}

function createCylinders() {
    cylinders = [];
    const numLayers = Math.floor(Math.random() * (maxLayers - minLayers + 1)) + minLayers;
    const layerHeight = canvas.height / numLayers;

    for (let i = 0; i < numLayers; i++) {
        const numCylinders = Math.floor(Math.random() * 5) + 1;
        const cylinderWidth = canvas.width / numCylinders;

        for (let j = 0; j < numCylinders; j++) {
            cylinders.push({
                x: j * cylinderWidth,
                y: i * layerHeight,
                width: cylinderWidth,
                height: layerHeight,
                opening: Math.random() * (cylinderWidth - 40) + 20,
                openingPosition: Math.random() * (cylinderWidth - 40) + 20,
                rotation: 0,
                color: randomColor()
            });
        }
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();
}

function drawCylinders() {
    cylinders.forEach(cylinder => {
        ctx.save();
        ctx.translate(cylinder.x + cylinder.width / 2, cylinder.y + cylinder.height / 2);
        ctx.rotate(cylinder.rotation);
        ctx.translate(-(cylinder.x + cylinder.width / 2), -(cylinder.y + cylinder.height / 2));

        ctx.fillStyle = cylinder.color;
        ctx.fillRect(cylinder.x, cylinder.y, cylinder.width, cylinder.height);

        ctx.fillStyle = '#fff';
        ctx.fillRect(cylinder.x + cylinder.openingPosition, cylinder.y, cylinder.opening, cylinder.height);

        ctx.restore();
    });
}

function updateBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Bounce off walls
    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.dx = -ball.dx;
    }
    if (ball.y - ball.radius < 0) {
        ball.dy = -ball.dy;
    }

    // Check if ball passed through all layers
    if (ball.y > canvas.height) {
        level++;
        levelCounter.textContent = level;
        resetBall();
        createCylinders();
        updateBallProperties();
    }

    // Check collision with cylinders
    cylinders.forEach((cylinder, index) => {
        if (ball.y + ball.radius > cylinder.y && 
            ball.y - ball.radius < cylinder.y + cylinder.height &&
            ball.x + ball.radius > cylinder.x && 
            ball.x - ball.radius < cylinder.x + cylinder.width) {
            
            const relativeX = (ball.x - cylinder.x - cylinder.width / 2) / (cylinder.width / 2);
            const relativeOpeningPosition = (cylinder.openingPosition + cylinder.opening / 2 - cylinder.width / 2) / (cylinder.width / 2);

            if (Math.abs(relativeX - relativeOpeningPosition) > cylinder.opening / cylinder.width) {
                ball.dy = -ball.dy;
            } else {
                cylinders.splice(index, 1);
            }
        }
    });
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height - 30;
    ball.dx = 2;
    ball.dy = -2;
}

function updateBallProperties() {
    // Randomly change ball properties
    ball.radius = Math.random() * 10 + 5;
    ball.color = randomColor();
    const speedIncrease = Math.random() * 0.5 + 1;
    ball.dx *= speedIncrease;
    ball.dy *= speedIncrease;
}

function rotateCylinders() {
    cylinders.forEach(cylinder => {
        cylinder.rotation += 0.02;
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCylinders();
    drawBall();
    updateBall();
    rotateCylinders();
    requestAnimationFrame(draw);
}

createCylinders();
draw();

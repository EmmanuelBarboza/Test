const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const restartButton = document.getElementById('restartButton');

// Configuración del canvas
canvas.width = 800;
canvas.height = 600;

// Jugador
const player = {
    x: canvas.width / 2,
    y: canvas.height - 50,
    width: 50,
    height: 50,
    speed: 5,
    color: '#3498db'
};

// Balas
let bullets = [];
const bulletSpeed = 7;
const bulletSize = 5;

// Obstáculos
let obstacles = [];
let score = 0;
let gameSpeed = 2;
let gameOver = false;

// Controles
const keys = {
    left: false,
    right: false,
    space: false
};

// Eventos de teclado
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') keys.left = true;
    if (e.key === 'ArrowRight') keys.right = true;
    if (e.key === ' ') keys.space = true;
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft') keys.left = false;
    if (e.key === 'ArrowRight') keys.right = false;
    if (e.key === ' ') keys.space = false;
});

// Función de reinicio
function resetGame() {
    // Reiniciar variables del juego
    player.x = canvas.width / 2;
    bullets = [];
    obstacles = [];
    score = 0;
    gameSpeed = 2;
    gameOver = false;
    
    // Actualizar puntuación
    scoreElement.textContent = score;
    
    // Ocultar botón de reinicio
    restartButton.style.display = 'none';
}

// Evento de reinicio
restartButton.addEventListener('click', resetGame);

// Crear bala
function createBullet() {
    bullets.push({
        x: player.x + player.width / 2 - bulletSize / 2,
        y: player.y,
        width: bulletSize,
        height: bulletSize,
        color: '#2ecc71'
    });
}

// Crear obstáculos
function createObstacle() {
    const width = Math.random() * 100 + 50;
    const x = Math.random() * (canvas.width - width);
    obstacles.push({
        x: x,
        y: -50,
        width: width,
        height: 30,
        color: '#e74c3c'
    });
}

// Actualizar juego
function update() {
    if (gameOver) return;

    // Mover jugador
    if (keys.left && player.x > 0) {
        player.x -= player.speed;
    }
    if (keys.right && player.x < canvas.width - player.width) {
        player.x += player.speed;
    }

    // Disparar
    if (keys.space) {
        createBullet();
        keys.space = false; // Evitar disparo continuo
    }

    // Mover balas
    bullets.forEach((bullet, bulletIndex) => {
        bullet.y -= bulletSpeed;

        // Eliminar balas fuera de la pantalla
        if (bullet.y < 0) {
            bullets.splice(bulletIndex, 1);
        }

        // Verificar colisiones bala-obstáculo
        obstacles.forEach((obstacle, obstacleIndex) => {
            if (
                bullet.x < obstacle.x + obstacle.width &&
                bullet.x + bullet.width > obstacle.x &&
                bullet.y < obstacle.y + obstacle.height &&
                bullet.y + bullet.height > obstacle.y
            ) {
                // Eliminar bala y obstáculo
                bullets.splice(bulletIndex, 1);
                obstacles.splice(obstacleIndex, 1);
                score += 2; // Puntos extra por destruir obstáculos
                scoreElement.textContent = score;
            }
        });
    });

    // Mover obstáculos
    obstacles.forEach((obstacle, index) => {
        obstacle.y += gameSpeed;

        // Colisión jugador-obstáculo
        if (
            player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y
        ) {
            gameOver = true;
            restartButton.style.display = 'block';
        }

        // Eliminar obstáculos fuera de la pantalla
        if (obstacle.y > canvas.height) {
            obstacles.splice(index, 1);
            score++;
            scoreElement.textContent = score;
        }
    });

    // Crear nuevos obstáculos
    if (Math.random() < 0.02) {
        createObstacle();
    }

    // Aumentar dificultad
    if (score % 10 === 0 && score > 0) {
        gameSpeed += 0.1;
    }
}

// Dibujar juego
function draw() {
    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar jugador
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Dibujar balas
    bullets.forEach(bullet => {
        ctx.fillStyle = bullet.color;
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });

    // Dibujar obstáculos
    obstacles.forEach(obstacle => {
        ctx.fillStyle = obstacle.color;
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });

    // Dibujar game over
    if (gameOver) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('¡Game Over!', canvas.width / 2, canvas.height / 2 - 50);
        ctx.font = '24px Arial';
        ctx.fillText(`Puntuación: ${score}`, canvas.width / 2, canvas.height / 2);
    }
}

// Bucle del juego
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Iniciar juego
gameLoop(); 
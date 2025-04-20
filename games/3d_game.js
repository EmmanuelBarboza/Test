// Configuración de Three.js
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB); // Color de cielo

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// Ajustar posición de la cámara para una mejor vista
camera.position.y = 3;
camera.position.z = 8;
camera.rotation.x = -0.3;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x87CEEB, 1);
document.querySelector('.game-container').appendChild(renderer.domElement);

// Variables del juego
let score = 0;
const scoreElement = document.querySelector('#score span');
const playerSpeed = 0.1;
const obstacleSpeed = 0.05;
let gameOver = false;

// Iluminación
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Crear pista
const trackGeometry = new THREE.BoxGeometry(10, 0.1, 50);
const trackMaterial = new THREE.MeshPhongMaterial({ 
    color: 0x808080,
    shininess: 30
});
const track = new THREE.Mesh(trackGeometry, trackMaterial);
track.position.z = -20;
scene.add(track);

// Crear jugador (cubo)
const playerGeometry = new THREE.BoxGeometry(1, 1, 1);
const playerMaterial = new THREE.MeshPhongMaterial({ 
    color: 0x00ff00,
    shininess: 100
});
const player = new THREE.Mesh(playerGeometry, playerMaterial);
player.position.y = 0.5;
player.position.z = 0;
scene.add(player);

// Array para obstáculos
const obstacles = [];

// Crear obstáculos
function createObstacle() {
    const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const material = new THREE.MeshPhongMaterial({ 
        color: 0xff0000,
        shininess: 100
    });
    const obstacle = new THREE.Mesh(geometry, material);
    
    // Posición aleatoria en x
    obstacle.position.x = (Math.random() - 0.5) * 8;
    obstacle.position.y = 0.25;
    obstacle.position.z = -40;
    
    obstacles.push(obstacle);
    scene.add(obstacle);
}

// Controles
const keys = {
    left: false,
    right: false
};

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') keys.left = true;
    if (e.key === 'ArrowRight') keys.right = true;
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft') keys.left = false;
    if (e.key === 'ArrowRight') keys.right = false;
});

// Función de actualización del juego
function update() {
    if (gameOver) return;

    // Mover jugador
    if (keys.left && player.position.x > -4) {
        player.position.x -= playerSpeed;
    }
    if (keys.right && player.position.x < 4) {
        player.position.x += playerSpeed;
    }

    // Mover obstáculos
    obstacles.forEach((obstacle, index) => {
        obstacle.position.z += obstacleSpeed;

        // Verificar colisiones
        if (
            Math.abs(player.position.x - obstacle.position.x) < 0.75 &&
            Math.abs(player.position.z - obstacle.position.z) < 0.75
        ) {
            gameOver = true;
            alert('¡Game Over! Puntuación: ' + score);
        }

        // Eliminar obstáculos que pasaron
        if (obstacle.position.z > 5) {
            scene.remove(obstacle);
            obstacles.splice(index, 1);
            score++;
            scoreElement.textContent = score;
        }
    });

    // Crear nuevos obstáculos
    if (Math.random() < 0.02) {
        createObstacle();
    }
}

// Función de animación
function animate() {
    requestAnimationFrame(animate);
    update();
    renderer.render(scene, camera);
}

// Manejar redimensionamiento de ventana
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Iniciar juego
animate(); 
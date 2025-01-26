// Obtener el canvas y su contexto
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Configuración básica
const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;
const ALTURA_CARRIL = CANVAS_HEIGHT / 3; //La altura del carril es el alto del canvas entre 3
let carrilJugador = 1; // Carril inicial (0: arriba, 1: medio, 2: abajo)
let obstaculos = [];
let puntuacion = 0;
let gameOver = false;
let velocidadObstaculos = 5;

// Configuración de la imagen del obstáculo
const obstacleImage = new Image();
obstacleImage.src = "img/obstaculo.png"; // Cambia a la ruta correcta de tu imagen

// Configuración de la imagen del jugador
const playerImage = new Image();
playerImage.src = "img/player2.png";

// Configuración del jugador
const player = {
  x: 50,
  y: ALTURA_CARRIL * carrilJugador + ALTURA_CARRIL / 4,
  width: 120,
  height: 120,
  image: playerImage
};

// Manejar las teclas para mover el jugador
document.addEventListener("keydown", function (e) {

  //Evento al pulsar la flecha arriba
  if (e.code === "ArrowUp" && carrilJugador > 0) {
    carrilJugador--;
  }
  //Evento al pulsar la flexa abajo
  if (e.code === "ArrowDown" && carrilJugador < 2) {
    carrilJugador++;
  }

  //Actualizar la posicion del jugador
  player.y = ALTURA_CARRIL * carrilJugador + ALTURA_CARRIL / 4;

}, false);

// Función para generar obstáculos
function createObstacle() {

  const carril = Math.floor(Math.random() * 3); // Carril aleatorio entre 0 y 2

  let imagenObjeto = Math.floor(Math.random() * 3);

  let imagenObstaculo = new Image();
  if (imagenObjeto == 0) {
    imagenObstaculo.src = "img/obstaculo4.png";
  } else if (imagenObjeto == 1) {
    imagenObstaculo.src = "img/obstacle6.png";
  } else {
    imagenObstaculo.src = "img/obstacle7.png";
  }

  //Añade un obstaculo al array de obstaculos
  obstaculos.push({
    x: CANVAS_WIDTH,
    y: ALTURA_CARRIL * carril + ALTURA_CARRIL / 4,
    width: 100,
    height: 100,
    image: imagenObstaculo // Asigna la imagen al obstáculo
  });
}

// Dibujar el jugador
function drawPlayer() {
  if (player.image) {
    // Dibuja la imagen del obstáculo
    ctx.drawImage(player.image, player.x, player.y, player.width, player.height);
  }
}

// Dibujar los obstáculos
function drawObstaculos() {
  obstaculos.forEach((obs) => {
    if (obs.image) {
      // Dibuja la imagen del obstáculo
      ctx.drawImage(obs.image, obs.x, obs.y, obs.width, obs.height);
    }
  });
}

// Dibujar la puntuación
function drawPuntuacion() {
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText(`Puntuación: ${parseInt(puntuacion / 50)}`, 10, 20);
}

// Actualizar posición de los obstáculos
function updateObstaculos() {
  obstaculos.forEach((obs) => {
    obs.x = obs.x - velocidadObstaculos; // Mover hacia la izquierda
  });

  // Eliminar obstáculos fuera de la pantalla
  //obstaculos = obstaculos.filter((obs) => obs.x + obs.width > 0);
}

// Detectar colisiones
function checkCollisions() {
  obstaculos.forEach((obs) => {
    if (
      player.x < obs.x + obs.width && //Choque por la derecha
      player.x + player.width > obs.x && //Choque por la izquierda
      player.y < obs.y + obs.height && //Choque por arriba
      player.y + player.height > obs.y //Choque por abajo 
    ) {
      gameOver = true;
    }
  });
}

let cantidadObstaculos = 0;
// Bucle principal del juego
function gameLoop() {
  if (gameOver) {
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText("Game Over!", CANVAS_WIDTH / 2 - 80, CANVAS_HEIGHT / 2);
    canvas.style.backgroundImage = "url('img/fondo3.jpg')";
    return;
  }

  // Limpiar el canvas
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Dibujar elementos
  drawPlayer();
  drawObstaculos();
  drawPuntuacion();

  // Actualizar estado del juego
  updateObstaculos();
  checkCollisions();

  // Incrementar puntuación
  puntuacion++;

  // Crear nuevos obstáculos periódicamente
  if (puntuacion % 100 === 0) {

    //Aumentar la velocidad de aparicion de los obstaculos
    if (cantidadObstaculos > 10) {
      velocidadObstaculos = velocidadObstaculos + 2;
      cantidadObstaculos = 0;
    }
    createObstacle();
    cantidadObstaculos++;
  }
}

// Iniciar el juego cuando la pagina se ha cargado correctamente
document.addEventListener('DOMContentLoaded', function() {
  setInterval(gameLoop, 1000 / 120);
}, false);

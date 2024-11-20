let font;
let tSize = 150; // Tamaño del texto
let tposX = 250; // Posición X del texto "designer"
let tposY = 500; // Posición Y del texto "designer"
let tposX2 = 250; // Posición X del texto "luana"
let tposY2 = 700; // Posición Y del texto "luana"
let pointCount = 0.5; // Densidad de puntos

let speed = 5; // Velocidad de las partículas
let comebackSpeed = 100; // A menor valor, menos interacción
let dia = 70; // Diámetro de interacción
let randomPos = true; // Puntos en posición inicial aleatoria
let pointsDirection = "left"; // Dirección de puntos
let interactionDirection = -1; // -1 y 1

let textPointsDesigner = [];
let textPointsLuana = [];
let colorFixed = false; // Variable para determinar si el color debe detenerse

function preload() {
  font = loadFont("AvenirNextLTPro-Demi.otf");
}

function setup() {
  createCanvas(1000, 1000);
  textFont(font);

  // Crear partículas para la palabra "designer"
  let pointsDesigner = font.textToPoints("designer", tposX, tposY, tSize, {
    sampleFactor: pointCount,
  });
  for (let i = 0; i < pointsDesigner.length; i++) {
    let pt = pointsDesigner[i];
    let textPoint = new Interact(
      pt.x,
      pt.y,
      speed,
      dia,
      randomPos,
      comebackSpeed,
      pointsDirection,
      interactionDirection
    );
    textPointsDesigner.push(textPoint);
  }

  // Crear partículas para la palabra "luana"
  let pointsLuana = font.textToPoints("luana", tposX2, tposY2, tSize, {
    sampleFactor: pointCount,
  });
  for (let i = 0; i < pointsLuana.length; i++) {
    let pt = pointsLuana[i];
    let textPoint = new Interact(
      pt.x,
      pt.y,
      speed,
      dia,
      randomPos,
      comebackSpeed,
      pointsDirection,
      interactionDirection
    );
    textPointsLuana.push(textPoint);
  }
}

function draw() {
  background(0);

  let allArrivedDesigner = true; // Variable para "designer"
  let allArrivedLuana = true; // Variable para "luana"

  // Dibujar puntos para "designer"
  for (let i = 0; i < textPointsDesigner.length; i++) {
    let v = textPointsDesigner[i];
    v.update();
    v.show();
    v.behaviors();

    if (!v.atHome()) {
      allArrivedDesigner = false;
    }
  }

  // Dibujar puntos para "luana"
  for (let i = 0; i < textPointsLuana.length; i++) {
    let v = textPointsLuana[i];
    v.update();
    v.show();
    v.behaviors();

    if (!v.atHome()) {
      allArrivedLuana = false;
    }
  }

  // Si ambas palabras han llegado, detener el cambio de color y fijarlo en azul
  if (allArrivedDesigner && allArrivedLuana) {
    colorFixed = true;
  }
}

// Clase Interact modificada
function Interact(x, y, m, d, t, s, di, p) {
  this.home = t ? createVector(random(width), random(height)) : createVector(x, y);
  this.pos = this.home.copy();
  this.target = createVector(x, y);

  if (di === "general") {
    this.vel = createVector();
  } else if (di === "up") {
    this.vel = createVector(0, -y);
  } else if (di === "down") {
    this.vel = createVector(0, y);
  } else if (di === "left") {
    this.vel = createVector(-x, 0);
  } else if (di === "right") {
    this.vel = createVector(x, 0);
  }

  this.acc = createVector();
  this.r = 8;
  this.maxSpeed = m;
  this.maxforce = 1;
  this.dia = d;
  this.come = s;
  this.dir = p;
}

// Método para verificar si el punto ha llegado a su posición final
Interact.prototype.atHome = function () {
  return p5.Vector.dist(this.pos, this.target) < 1;
};

Interact.prototype.behaviors = function () {
  let arrive = this.arrive(this.target);
  let mouse = createVector(mouseX, mouseY);
  let flee = this.flee(mouse);

  this.applyForce(arrive);
  this.applyForce(flee);
};

Interact.prototype.applyForce = function (f) {
  this.acc.add(f);
};

Interact.prototype.arrive = function (target) {
  let desired = p5.Vector.sub(target, this.pos);
  let d = desired.mag();
  let speed = this.maxSpeed;
  if (d < this.come) {
    speed = map(d, 0, this.come, 0, this.maxSpeed);
  }
  desired.setMag(speed);
  let steer = p5.Vector.sub(desired, this.vel);
  return steer;
};

Interact.prototype.flee = function (target) {
  let desired = p5.Vector.sub(target, this.pos);
  let d = desired.mag();

  if (d < this.dia) {
    desired.setMag(this.maxSpeed);
    desired.mult(this.dir);
    let steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxForce);
    return steer;
  } else {
    return createVector(0, 0);
  }
};

Interact.prototype.update = function () {
  this.pos.add(this.vel);
  this.vel.add(this.acc);
  this.acc.mult(0);
};

Interact.prototype.show = function () {
  if (colorFixed) {
    // Color fijo azul cuando los puntos han llegado a su posición final
    stroke(0, 0, 255); // Color azul
  } else {
    // Cambiar colores dinámicamente usando sinusoides y `frameCount`
    let r = map(sin(frameCount * 0.05), -1, 1, 100, 255);
    let g = map(sin(frameCount * 0.03), -1, 1, 100, 255);
    let b = map(sin(frameCount * 0.07), -1, 1, 100, 255);

    stroke(r, g, b);
  }
  strokeWeight(4);
  point(this.pos.x, this.pos.y);
};

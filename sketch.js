let c = [];
let cb = ["#D7C7DE","#7E69E8","#FB8900","#EEE8DB","#C4CFCF","#E8EBEA","#89C1BE","#91CCDB","#3C245B","#D0B3F4","#00337C","#4055A1","#8294D8","#DCEF25"];
let duo = [
  ["#FB8900","#BA0F0F",],
  ["#000000","#F5F5F5",],
  ["#FF80D2","#F4BA00",],
  ["#A4ECFF","#F400B5",],
  ["#EEE8DB","#7E69E8",],
  ["#7E69E8","#B7D676",],
];

let systems = [];
let n, a, b, d, e, f, l, w, bc, st, et;
let cam, turn_count; 

function setup() {
  randomSeed(7725);

  createCanvas(windowWidth,windowHeight, WEBGL);
  frameRate(30);
  pixelDensity(2);
  smooth();

  shaderTexture = createGraphics(512,512, WEBGL);  

  cam = createCamera();
  cam.move(0,0,height);
  turn_count = 0;

  noStroke();
  colors();

  st = millis();
  time_diff = 0;

  n = random() < 0.5 ? 10 : 15;
  a = random() < 0.5 ? 0 : 0.5*PI;
  b = random() < 0.6 ? true : false;  
  if (b) {
    d = random() < 0.5 ? true : false;
    if (d) {
      n = 15;
    }
    e = random() < 0.25 ? true : false;   
  } else {
    d = false;
  }
  f = floor(random()*duo.length);    

  w = a > 0 ? height*1.75 : width*1.75;
  l = a > 0 ? width*1.75 : height*1.75;

  for  (let j = 0; j < 2; j++) {
    systems.push(new ParticleSystem());
    for (let i = 0; i < n; i++) {     
      let z = i/(n/2);
      let x = -(w/2) + (w/n)*i;
      systems[j].addParticle(x,z);
    }
  } 

  bc = color(cb[floor(random()*cb.length)]);
}

function draw() {
  background(bc);
  if (e) {
    background(duo[f][0]);
  }

  orbitControl();
  et = frameCount;

  for (let j = 0; j < systems.length; j++) {
    push();
    rotateZ(a);
    translate(0,0,height*.5 - j*height);
    systems[j].run();
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  w = a > 0 ? height*1.75 : width*1.75;
  l = a > 0 ? width*1.75 : height*1.75;
  turn_count = 0; 
  cam.camera(0, 0, (height/2) / tan(PI/6), 0, 0, 0, 0, 1, 0)
  cam.move(0,0,height);
}


function colors() {
  c = ["#D7C7DE","#02B7C7","#7E69E8","#FB8900","#7E5D8E","#FFC100","#EEE8DB","#C4CFCF","#E8EBEA","#FBA8C6","#89C1BE","#91CCDB","#F2E9AA","#B7D676","#3C245B","#8461C9","#D0B3F4","#FFEA92","#FFEB36","#F4BA00","#00337C","#4055A1","#8294D8","#FFD199","#FF9D00","#EF6100","#047294","#A4ECFF","#BA0F0F","#598200","#DCEF25","#C8E281","#FFCFEF","#FF80D2","#F400B5","#006027","#D4FFE6","#ECACFC","#C671DB","#9B06BF"];
};

let Particle = function(position) {
  this.position = position.copy();
  if (e) {
    this.c1 = duo[f][0];
    this.c2 = duo[f][1];
  } else {
    let cp = floor(random()*cb.length); 
    this.c1 = color(c[cp]);
    c.splice(cp,1);
    this.c2 = color(c[floor(random()*c.length)]);
    colors();
  }
  this.dir = b? random() : 0.4;
  this.b = b? floor(random()*4) + 1 : 1;
  if ((!d)&&(b)) { this.b = floor(random()*2) + 1;}
  this.A = d ? random()*2 + 2 : 1.25;
  this.B = TWO_PI/random(350,2200);
  this.C = random(TWO_PI);
  this.dx = width/n; 

};

Particle.prototype.run = function() {
  this.update();
  this.display();
};

Particle.prototype.update = function(){
  dx = (w/n) * this.A * sin(this.B*et + this.C);
};

Particle.prototype.display = function() {
  push();
    translate(this.position.x,this.position.y,this.position.z);
    beginShape();
    fill(this.c1);
    vertex(-dx/2,l/2)
    vertex(-dx/2,-l/2)
    fill(this.c2);
    vertex(dx/2,-l/2)
    vertex(dx/2,l/2)
    endShape(CLOSE);
  pop();  

};

let ParticleSystem = function() {
  this.particles = [];
};

ParticleSystem.prototype.addParticle = function(x,z) {
  let position = createVector(x, 0, z)
  this.particles.push(new Particle(position));
};

ParticleSystem.prototype.run = function() {
  for (let i = this.particles.length-1; i >= 0; i--) {
    let p = this.particles[i];
    p.run();
  }
};

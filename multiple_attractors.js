let backgroundColor = "#1A232C";
let nDisplayPoints = 200;

let nAttractors = 43;
let attractors = [];
let mainAttractor;
let randomRangeX = [-15, 15];
let randomRangeY = [-18, 18];
let randomRangeZ = [14, 40];
let dt = 0.015;

let syncStrength = 0;
let followMode = false;
let followType;
let nAttractorsPerRow = 7;
let canvas;

function setup() {
  canvas = createCanvas(800, 690);
  initializeAttractors();
  drawSlider();
  drawRadioButtons();
}

function drawSlider() {
  push();
  translate(100, 200);
  syncSlider = createSlider(0, 1, 0.3, 0.01);
  syncSlider.position(20, height - 15);
  pop();
}

function drawRadioButtons() {
  push();
  radio = createRadio();
  radio.option('Follow leading');
  radio.option('Follow chain');
  radio.style('width', '200px');
  radio.style('align', 'top');
  radio.style('color', 'white')
  radio.style('font-size', '12px')
  radio.position(210, height - 16);
  radio.selected('Follow leading');
  radio.changed(updateSyncMode);
  followType = radio.selected().value;
  pop();
}

function updateSyncMode() {
  if (followMode) {
    resetFollowers();
    followMode = !followMode;
  }
  followType = radio.selected().value;

  if (followType == 'Follow leading'){
    syncSlider.value(0.3);
  } else {
    syncSlider.value(0.5);
  }
}


function initializeAttractors() {
  for (let i = 0; i < nAttractors; i++) {
    let randX = random(randomRangeX[0], randomRangeX[1]);
    let randY = random(randomRangeY[0], randomRangeY[1]);
    let randZ = random(randomRangeZ[0], randomRangeZ[1]);

    attractors[i] = new Attractor(randX, randY, randZ, dt, nDisplayPoints);
    attractors[i].primeSystem();
  }
  mainAttractor = attractors[0];
}

function resetFollowers() {
  for (let i = 1; i < attractors.length; i++) {
    attractors[i].addNewRandomPoint();
    // attractors[i].points.length = 1;
  }
}

function mouseClicked() {
  if (mouseY < height - 30) {
    if (followMode) {
      resetFollowers();
    }
    followMode = !followMode;
  }
}

function updateSlider() {
  if ((syncStrength != syncSlider.value()) && followMode) {
    followMode = false;
    resetFollowers();
  }
  syncStrength = syncSlider.value()
  push();
  fill("white");
  let sliderDescX = syncSlider.width / 2 - 22;
  let sliderDescY = syncSlider.y - 13;
  text("Sync strength", sliderDescX, sliderDescY);

  let sliderTextX = syncSlider.width + 25;
  let sliderTextY = syncSlider.y + 6;
  let sliderText = int(100 * syncStrength) + '%';
  text(sliderText, sliderTextX, sliderTextY);
  pop();
}

function drawBackgrounText() {
  push();
  fill(255);
  textAlign(CENTER);
  if (!followMode) {
    txt = "Click anywhere\nto sync";
  } else {
    txt = "Click anywhere\nto reset";
  }
  text(txt, width - 45, 15);
  pop();
}

function drawMainAttractor() {
  push();
  if (followMode) {
    stroke(255);
    strokeWeight(0.6);
  } else {
    stroke(200);
    strokeWeight(0.5);
  }
  noFill();
  scale(2.8);
  mainAttractor.addNewLorenzPoint();
  mainAttractor.drawPoints();
  pop();
}

function drawFollowerAttractor(attractor) {
  let inSync = attractor.checkInSync(mainAttractor);
  push();
  if (inSync) {
    stroke(255);
    strokeWeight(0.6);
  } else {
    stroke(200);
    strokeWeight(0.5);
  }
  noFill();
  scale(2);
  attractor.drawPoints();
  pop();
}

function draw() {
  background(backgroundColor);
  drawBackgrounText();
  updateSlider();

  push();
  translate(width / 2, 0);
  drawMainAttractor();
  pop();

  push();
  translate(100, 130);
  for (let attIndex = 1; attIndex < attractors.length; attIndex++) {
    let attractor = attractors[attIndex];

    push();
    attGridPosX = (attIndex - 1) % nAttractorsPerRow;
    attGridPosY = Math.floor((attIndex - 1) / nAttractorsPerRow);
    translate(100 * attGridPosX, 80 * (attGridPosY));

    attractor.addNewLorenzPoint();
    if (followMode) {
      if (followType == "Follow leading") {
        attractor.points[0].x = syncStrength * mainAttractor.points[0].x + (1 - syncStrength) * attractor.points[0].x;
      } else {
        attractor.points[0].x = syncStrength * attractors[attIndex - 1].points[0].x + (1 - syncStrength) * attractor.points[0].x;
      }
    }
    drawFollowerAttractor(attractor);
    pop();
  }
  pop();
}

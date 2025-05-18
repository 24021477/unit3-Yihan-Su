let leaves = [];
let waterHeight;
let button;
let leafImg, waterImg, backgroundImg;
let draggingLeaf = null;
let backgroundBrightness = 255;  // 背景亮度，初始为最亮
let waterBrightness = 255;  // 水面亮度，初始为最亮
let maxLeaves = 50; // 最大叶子数量，控制性能
let maxFrameRate = 30; // 控制帧率，减少性能负担
let trailLeaves = [];

function preload() {
  leafImg = loadImage('leaf.png');
  waterImg = loadImage('water.png');
  backgroundImg = loadImage('sunset.png'); 
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  waterHeight = height - 200;

  // 设置帧率，优化性能
  frameRate(maxFrameRate);

  button = createButton('Time Loop');
  button.position(20, 20);
  button.mousePressed(clearLeaves);
  button.style('font-size', '18px');
  button.style('padding', '10px 20px');
}

function draw() {
  // **计算背景亮度（随着叶子数量减少亮度）**
  let darkness = map(leaves.length, 0, maxLeaves, 0, 150, true);  // 叶子越多，背景越暗
  backgroundBrightness = 255 - darkness;

  // **计算水面亮度（随着叶子数量增加，水面也变暗）**
  waterBrightness = 255 - darkness;

  // **绘制背景**
  if (backgroundImg) {
    tint(backgroundBrightness, backgroundBrightness * 0.8, backgroundBrightness * 0.6);
    image(backgroundImg, 0, 0, width, waterHeight);
    noTint(); // 关闭 tint 避免影响其他元素
  } else {
    background(200, 220, 255);
  }

  // **绘制水面**
  if (waterImg) {
    tint(waterBrightness);  // 给水面加上透明度调节
    image(waterImg, 0, waterHeight, width, height - waterHeight);
    noTint(); // 关闭 tint 避免影响其他元素
  } else {
    fill(100, 150, 255, 100);
    rect(0, waterHeight, width, height - waterHeight);
  }

  // **叶子掉落**
  if (frameCount % 10 == 0 && leaves.length < maxLeaves) {
    leaves.push(new Leaf(random(width), 0));
  }

  // 只渲染需要显示的叶子，减少性能压力
  for (let i = 0; i < leaves.length; i++) {
    leaves[i].fall();
    leaves[i].display();
  }

  for (let i = 0; i < trailLeaves.length; i++) {
    trailLeaves[i].display();
}
}

// 渲染鼠标拖尾叶子
for (let i = trailLeaves.length - 1; i >= 0; i--) {
  trailLeaves[i].fadeOut();  // 让叶子逐渐透明
  trailLeaves[i].display();

  if (trailLeaves[i].alpha <= 0) {
      trailLeaves.splice(i, 1); // 当叶子完全透明时删除
  }
}


// **叶子类**
class Leaf {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = random(30, 50);
    this.speed = random(2, 4);
    this.swingOffset = random(100);
    this.alpha = 255;  // 透明度，初始为不透明
  }

  fall() {
    if (this.y < waterHeight) {
      this.y += this.speed;
      this.x += sin(frameCount * 0.05 + this.swingOffset) * 1.5;
    }
  }

  fadeOut() {
    this.alpha -= 3;  // 逐渐降低透明度
  }

  display() {
    if (leafImg) {
      tint(255, this.alpha); // 使用透明度
      image(leafImg, this.x, this.y, this.size, this.size);
      noTint();
    }
  }
}


function clearLeaves() {
  leaves = [];
  backgroundBrightness = 255; // 恢复背景亮度
  waterBrightness = 255;  // 恢复水面亮度
}

function mouseMoved() {
  let newLeaf = new Leaf(mouseX, mouseY);
  trailLeaves.push(newLeaf);

  
}


function mousePressed() {
  trailLeaves = [];  // 清除所有鼠标拖尾
}

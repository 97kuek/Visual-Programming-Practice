// パラメータ
let LINE_COUNT = 40;     // 何本重ねるか（大きいほど密）
let STEP_X     = 3;      // x方向の刻み幅（小さいほど滑らか・重くなる）
let AMP_NOISE  = 150;    // ノイズの振幅（上下のゆれ幅）
let AMP_SINE   = 0.25;   // サイン波の振幅係数（画面高さに対する割合）
let SINE_FREQ  = 0.8;    // サイン波の周波数（大きいほど細かく波打つ）
let NOISE_X_K  = 0.01;   // x に対するノイズのスケール（小さいと大局的）
let SEED_SPEED = 0.02;   // フレームごとのシード変化速度（動きの速さ）
let BG_ALPHA   = 255;    // 背景の不透明度（残像を出すなら 10〜40 など）

function setup() {
  createCanvas(windowWidth, windowHeight); // 画面幅対応
  pixelDensity(1);
  strokeWeight(1);
  noFill();
  background(0);
}

function draw() {
  // 背景を毎フレーム塗る（BG_ALPHAを下げると残像が出る）
  background(0, BG_ALPHA);

  // 画面中央を基準線にして上下に波打つ
  const baseY = height / 2;

  for (let j = 0; j < LINE_COUNT; j++) {
    const seed = (j - frameCount) * SEED_SPEED;  // シード値
    // 1本ごとに色を少し変える（Perlinノイズでなめらかに変化）
    // noise() は 0〜1 を返すので 0〜255 に拡大
    const r = noise(seed)       * 255;
    const g = noise(seed + 1.0) * 255;
    const b = noise(seed + 2.0) * 255;
    stroke(r, g, b, 180); // 線分の設定
    // x=0 での初期y（前回点の y）
    // ノイズの中心を0にするため AMP_NOISE/2 を引き、
    // さらにサイン波を重ねてから画面中央へオフセット
    let prevY = (noise(seed) * AMP_NOISE - AMP_NOISE / 2)
              + (height * AMP_SINE * sin(0))
              + baseY;

    // x を左から右に走査して短い線分でつないでいく
    for (let x = 0; x < width; x += STEP_X) {
      // x に比例してノイズの入力を変えると、横方向に地形っぽいゆれになる
      const nx = seed + NOISE_X_K * (x + STEP_X); // 次の点のノイズ入力
      const y  = (noise(nx) * AMP_NOISE - AMP_NOISE / 2)
               + (height * AMP_SINE * sin((TWO_PI / 360) * x * SINE_FREQ))
               + baseY;

      // 前の点 (x, prevY) と 次の点 (x+STEP_X, y) を線で結ぶ
      line(x, prevY, x + STEP_X, y);

      // 次のループに備えて前回点を更新
      prevY = y;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(0);
}

// キー操作
function keyPressed() {
  // 一時停止/再開
  if (key === ' ') {
    if (isLooping()) noLoop(); else loop();
  }

  // 画像保存
  if (key === 'S' || key === 's') {
    saveCanvas('NoiseFlow', 'png');
  }

  // ライン本数（↑/↓）
  if (keyCode === UP_ARROW)    LINE_COUNT = min(LINE_COUNT + 2, 200);
  if (keyCode === DOWN_ARROW)  LINE_COUNT = max(LINE_COUNT - 2, 2);

  // 横ステップ幅（←/→）：小さいほど滑らか・重い
  if (keyCode === LEFT_ARROW)  STEP_X = max(STEP_X - 1, 1);
  if (keyCode === RIGHT_ARROW) STEP_X = min(STEP_X + 1, 20);

  // ノイズ振幅（+/-）
  if (key === '+' || key === '=') AMP_NOISE = min(AMP_NOISE + 10, 600);
  if (key === '-' || key === '_') AMP_NOISE = max(AMP_NOISE - 10, 10);
}

var w = 400;  // キャンパス幅
var h = 400;  // キャンパス高さ
var r = 150;  // 描画する点の最大半径
var l = 50;   // 各線分の長さ
var count = 25000;  // 描画本数

function setup() {
  createCanvas(w, h);
  background(0);
}

function draw() {
  noLoop();  // draw() を1回だけ実行
  // 線の色と透明度を設定（R=106, G=178, B=134, 透明度=10/255）
  stroke(color(106, 178, 134, 10));
  for(i = 0; i < count; i++){
    // -- 始点座標を設定--
    var d = sqrt(random()) * r;  // √(random()) を使うことで「中心に近い点が多くなる」半径分布を生成
    var t = random(TWO_PI);      // ランダムな角度
    // 中心(w/2,h/2)から半径d・角度tの位置に変換
    var x = w/2 + d * cos(t);
    var y = h/2 + d * sin(t);
    // -- 線分の方向設定 --
    var u = random(-1,1);                    // 球面座標に基づいたランダムな向きのベクトルのx成分
    var v = sqrt(1 - u*u) * random([-1,1]);  // y成分を計算（u² + v² = 1 を満たす v の絶対値にランダム符号を掛ける)
    // --- 線分を描画 ---
    // 始点 (x, y) からベクトル (u, v) に長さ l を掛けた終点まで線を引く
    line(x, y, x + u * l, y + v * l);
  }
}

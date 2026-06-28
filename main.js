// main.js
// --- 1. 基本ステータス管理 ---
let ENV = 50;
let ECO = 50;
let POP = 50;
let MONEY = 30;

//1日の差分を一時的に溜めておく変数
let dailyDiff = {env: 0, eco:0, pop:0, money: 0};

const TURNS_PER_DAY = 3; //1日当たりのターン数（現時点では1日3ターン）
const DAYS_LIMIT = 3; //日数（現時点：3日）
let turn = 1;
const MAX_TURN = (TURNS_PER_DAY * DAYS_LIMIT) + 1; //ターン数計算（3ターン×3日　＋　最終政策 = 10ターン）

// 持続効果（バフ）を管理する配列
let activeEffects = [];

// events.js から最終政策を切り離し、通常イベントセットを作る
const finalEvent = events.pop();
let unusedEvents = [...events];

let currentEvent = null;

// --- 2. 進行・計算ロジック ---

// ゲームオーバー判定
function isGameOver() {
  if (ENV <= 0) { alert("環境崩壊エンド"); return true; }
  if (ECO <= 0) { alert("経済破綻エンド"); return true; }
  if (POP <= 0) { alert("市民反乱エンド"); return true; }
  return false;
}

// 重複なしのランダムイベント選択
function getRandomEventNoRepeat() {
  if (unusedEvents.length === 0) return null;
  const index = Math.floor(Math.random() * unusedEvents.length);
  const e = unusedEvents[index];
  unusedEvents.splice(index, 1);
  return e;
}

// 持続効果を追加する関数（events.jsの特殊効果から呼ばれる）
function addActiveEffect(effectObj) {
  activeEffects.push(effectObj);
}

// 選択肢が選ばれたときの処理
function choose(choiceIndex) {
  const before = { ENV, ECO, POP, MONEY };

  // 効果の適用
  MONEY += currentEvent.money[choiceIndex];
  ENV   += currentEvent.env[choiceIndex];
  ECO   += currentEvent.eco[choiceIndex];
  POP   += currentEvent.pop[choiceIndex];

  // イベント固有の特殊効果（アイテム効果など）があれば実行
  if (currentEvent.specialEffects && currentEvent.specialEffects[choiceIndex]) {
    currentEvent.specialEffects[choiceIndex]();
  }

  const after = { ENV, ECO, POP, MONEY };

  if (isGameOver()) return;

  // UIに差分を表示し、次の入力を待つ
  UI.showDiffAndWaitEnter(before, after, () => {
    turn++;
    nextTurn();
  });
}

// 1ターン進める処理
function nextTurn() {
  if (turn > MAX_TURN) {
    const endingData = Story.getEndingText(ENV, ECO, POP, MONEY);
    UI.showEnding(endingData);
    return;
  }

  // ターン開始時：ECOに応じた資金収入
  MONEY += Math.floor(ECO / 5);

  // ターン開始時：持続エフェクト（アイテム効果）の適用と残り寿命の消化
  activeEffects.forEach(fx => fx.effect());
  activeEffects = activeEffects.map(fx => {
    fx.duration--;
    return fx;
  }).filter(fx => fx.duration > 0);

  // ターンのイベントを決定（10ターン目なら最終政策を強制）
  if (turn === MAX_TURN) {
    currentEvent = finalEvent;
  } else {
    currentEvent = getRandomEventNoRepeat();
  }

  //story.jsにターン数と日数のテキスト生成を任す
  const timeInfo = Story.getTurnHeaderText(turn, MAX_TURN, TURNS_PER_DAY);
  UI.updateDayTime(`${timeInfo.day} ➔ ${timeInfo.turn}`);

  // 画面の表示を更新
  UI.updateStatus(ENV, ECO, POP, MONEY);
  UI.renderEvent(currentEvent, (choiceIndex) => {
    choose(choiceIndex);
  });

  const overlayText = Story.getDayOverlayText(turn, MAX_TURN, TURNS_PER_DAY);
  if(overlayText) {
    UI.showDayOverlay(overlayText);
  }
}

// --- 3. ゲーム開始のトリガー ---
window.onload = () => {
  // 初期状態では決定ボタンを隠す
  const decideBtn = document.getElementById("decideBtn");
  if (decideBtn) decideBtn.style.display = "none";

  // スタートボタンが押されたらイントロを消してゲーム開始
  const startBtn = document.getElementById("startBtn");
  if (startBtn) {
    startBtn.onclick = () => {
      document.getElementById("intro").style.display = "none";
      nextTurn();
    };
  }
};
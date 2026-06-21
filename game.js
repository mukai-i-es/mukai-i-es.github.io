let ENV = 50;
let ECO = 50;
let POP = 50;
let MONEY = 30;

let turn = 1;
const MAX_TURN = 10;


// 選択肢の効果を適用（Cのapply_choice）
function applyChoice(e, c) {
  MONEY += e.money[c];
  ENV   += e.env[c];
  ECO   += e.eco[c];
  POP   += e.pop[c];
}


// ステータス表示
function updateStatus() {
  document.getElementById("env").textContent = ENV;
  document.getElementById("eco").textContent = ECO;
  document.getElementById("pop").textContent = POP;
  document.getElementById("money").textContent = MONEY;
}


//差分表示
function showDiff(before, after) {
  const diffENV = after.ENV - before.ENV;
  const diffECO = after.ECO - before.ECO;
  const diffPOP = after.POP - before.POP;
  const diffMONEY = after.MONEY - before.MONEY;

  document.getElementById("diff").innerHTML = `
    <p>ENV: ${before.ENV} → ${after.ENV} (${diffENV >= 0 ? "+" : ""}${diffENV})</p>
    <p>ECO: ${before.ECO} → ${after.ECO} (${diffECO >= 0 ? "+" : ""}${diffECO})</p>
    <p>POP: ${before.POP} → ${after.POP} (${diffPOP >= 0 ? "+" : ""}${diffPOP})</p>
    <p>MONEY: ${before.MONEY} → ${after.MONEY} (${diffMONEY >= 0 ? "+" : ""}${diffMONEY})</p>
  `;
}


// ゲームオーバー判定
function isGameOver() {
  if (ENV <= 0) { alert("環境崩壊エンド"); return true; }
  if (ECO <= 0) { alert("経済破綻エンド"); return true; }
  if (POP <= 0) { alert("市民反乱エンド"); return true; }
  return false;
}


// ランダムイベント選択（重複なし版）
const finalEvent = events.pop();
let unusedEvents = [...events];

function getRandomEventNoRepeat() {
  const index = Math.floor(Math.random() * unusedEvents.length);
  const e = unusedEvents[index];
  unusedEvents.splice(index, 1);  // 使ったイベントを削除
  return e;
}


// 選択肢を押したときの処理
let selectedChoice = null;

function choose(c) {
  selectedChoice = c;

  document.getElementById("choice0").classList.remove("choice-selected");
  document.getElementById("choice1").classList.remove("choice-selected");
  document.getElementById("choice2").classList.remove("choice-selected");

  document.getElementById("choice" + c).classList.add("choice-selected");
}

document.getElementById("decideBtn").onclick = () => {
  if(selectedChoice === null) return;

  document.getElementById("diff").innerHTML = "";

  const e = currentEvent;
  const before = {ENV, ECO, POP, MONEY};

  applyChoice(e, selectedChoice);

  const after = {ENV, ECO, POP, MONEY};

  if(isGameOver()) return ;

  showDiff(before, after);

  selectedChoice = null;
  turn++;
  nextTurn();
}

let currentEvent = null;

// 1ターン進める処理
function nextTurn() {
  if (turn > MAX_TURN) {
    ending();
    return;
  }

  MONEY += Math.floor(ECO / 5);

  let e;
  if(turn === MAX_TURN){
    e = finalEvent;
  }else{
    e = getRandomEventNoRepeat();
  }

  currentEvent = e;
  
  document.getElementById("title").textContent = e.title;
  document.getElementById("event-img").src = e.img;
  document.getElementById("description").textContent = e.description;
  document.getElementById("choice0").textContent = e.choice_text[0];
  document.getElementById("choice1").textContent = e.choice_text[1];
  document.getElementById("choice2").textContent = e.choice_text[2];

  document.getElementById("choice0").onclick = () => choose(0);
  document.getElementById("choice1").onclick = () => choose(1);
  document.getElementById("choice2").onclick = () => choose(2);

  document.getElementById("choice0").disabled = false;
  document.getElementById("choice1").disabled = false;
  document.getElementById("choice2").disabled = false;

  document.getElementById("choice0").classList.remove("choice-selected");
  document.getElementById("choice1").classList.remove("choice-selected");
  document.getElementById("choice2").classList.remove("choice-selected");

  updateStatus();
}


// エンディング
function ending() {
  let result = "";

  if (ENV > 60 && ECO > 60 && POP > 60)
    result = "グリーンシティエンド";
  else if (ECO > 70 && ENV < 40)
    result = "経済優先エンド";
  else if (ENV < 30)
    result = "環境悪化エンド";
  else
    result = "普通の町エンド";

  alert("最終結果: " + result);
}

// ===============================
// ゲーム開始
// ===============================
document.getElementById("startBtn").onclick = () => {
  document.getElementById("intro").style.display = "none";
  nextTurn();
}

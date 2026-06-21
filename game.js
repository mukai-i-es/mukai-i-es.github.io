let ENV = 50;
let ECO = 50;
let POP = 50;
let MONEY = 30;

let turn = 1;
const MAX_TURN = 10;


//イベント一覧の構造体
const events = [
  {
    title: "工場建設の提案",
    img: "",
    description: "新しい工場を建設する計画が持ち上がっています。地域経済の活性化が期待される一方、環境への影響が懸念されています。",
    choice_text: ["許可する", "基準を厳しくして許可", "拒否する"],
    money: [-5, -2, 0],
    env: [-10, -3, +5],
    eco: [+15, +5, -5],
    pop: [+3, -1, 0]
  },
  {
    title: "森林伐採の申請",
    img: "",
    description: "民間企業から森林伐採の許可申請が届きました。資源活用と環境保全のどちらを優先すべきか判断が求められています。",
    choice_text: ["許可する", "部分的に許可", "拒否する"],
    money: [+5, +2, 0],
    env: [-12, -5, +5],
    eco: [+8, +3, -3],
    pop: [-2, -1, +1]
  },
  {
    title: "再エネ補助金の要望",
    img: "",
    description: "市民団体より再生エネルギー導入のための補助金拡大を求める要望書が提出されました。財政とのバランスが課題です。",
    choice_text: ["大規模補助", "小規模補助", "却下する"],
    money: [-20, -10, 0],
    env: [+15, +7, -5],
    eco: [-3, -1, +2],
    pop: [+2, +1, -2]
  },
  {
    title: "浄水施設の老朽化",
    img: "",
    description: "市内の浄水施設が老朽化し、早急な対応が必要とされています。全面改修か部分修理か、判断が迫られています。",
    choice_text: ["全面改修する", "部分修理する", "先送りにする"],
    money: [-20, -10, 0],
    env: [+15, +5, -10],
    eco: [0, 0, 0],
    pop: [+5, 0, -5]
  },
  {
    title: "交通渋滞の悪化",
    img: "",
    description: "市内で交通渋滞が深刻化しています。公共交通の拡充か道路整備か、長期的な視点での政策判断が必要です。",
    choice_text: ["公共交通を拡充", "道路を拡張", "放置する"],
    money: [-15, -10, 0],
    env: [+10, -5, -3],
    eco: [-3, +5, -1],
    pop: [+3, +2, -5]
  },
  {
    title: "ゴミ処理施設の容量不足",
    img: "",
    description: "ゴミ処理施設の処理能力が限界に近づいています。新施設建設かリサイクル強化か、対応策を検討する必要があります。",
    choice_text: ["新施設を建設", "リサイクル強化", "現状維持"],
    money: [-25, -10, 0],
    env: [+10, +5, -8],
    eco: [+3, -1, 0],
    pop: [+2, +1, -3]
  },
  {
    title: "観光地開発の提案",
    img: "",
    description: "観光地の大規模開発計画が提出されました。経済効果が期待される一方、自然環境への影響が懸念されています。",
    choice_text: ["大規模開発", "環境配慮型開発", "開発中止"],
    money: [+10, -5, 0],
    env: [-12, -3, +5],
    eco: [+15, +8, -5],
    pop: [+3, +2, -1]
  },
  {
    title: "気候災害（豪雨・熱波）",
    img: "",
    description: "豪雨や熱波などの気候災害が発生し、市民生活に大きな影響が出ています。緊急対策の実施が求められています。",
    choice_text: ["緊急対策を行う", "最低限の対策", "何もしない"],
    money: [-15, -5, 0],
    env: [+5, 0, -5],
    eco: [-3, -1, -2],
    pop: [+5, +1, -10]
  },
  {
    title: "市民団体からの抗議",
    img: "",
    description: "市政に対する不満を訴える市民団体から抗議文が届きました。対応次第で市民の信頼が大きく変わる可能性があります。",
    choice_text: ["改善策を発表", "部分的に譲歩", "無視する"],
    money: [-5, -2, 0],
    env: [+3, +1, -2],
    eco: [-1, 0, +1],
    pop: [+10, +5, -10]
  },
  {
    title: "最終政策：町の未来ビジョン",
    img: "",
    description: "町の将来像を決定する最終政策案が提出されました。環境・経済・市民生活のバランスをどう取るかが問われています。",
    choice_text: ["環境重視", "経済重視", "バランス型"],
    money: [-10, +10, -5],
    env: [+20, -10, +5],
    eco: [-5, +20, +5],
    pop: [+5, +3, +5]
  }
];


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
    <p>... Press the Enter ...</p>
  `;
}


// ゲームオーバー判定
function isGameOver() {
  if (ENV <= 0) { alert("環境崩壊エンド"); return true; }
  if (ECO <= 0) { alert("経済破綻エンド"); return true; }
  if (POP <= 0) { alert("市民反乱エンド"); return true; }
  return false;
}


const finalEvent = events.pop();
let unusedEvents = [...events];

// ランダムイベント選択（重複なし版）
function getRandomEventNoRepeat() {
  const index = Math.floor(Math.random() * unusedEvents.length);
  const e = unusedEvents[index];
  unusedEvents.splice(index, 1);  // 使ったイベントを削除
  return e;
}


// 選択肢を押したときの処理
function choose(e, c) {
  const before = {
    ENV: ENV,
    ECO: ECO,
    POP: POP,
    MONEY: MONEY
  };

  applyChoice(e, c);

  const after = {
    ENV: ENV,
    ECO: ECO,
    POP: POP,
    MONEY: MONEY
  };

  if (isGameOver()) return;

  showDiff(before, after);

  // 選択肢ボタンを無効化
  document.getElementById("choice0").disabled = true;
  document.getElementById("choice1").disabled = true;
  document.getElementById("choice2").disabled = true;

  // Enterキーで次へ進む
  function handleEnter(event) {
    if (event.key === "Enter") {
      document.removeEventListener("keydown", handleEnter);
    
  turn++;
  nextTurn();
    }
  }
  document.addEventListener("keydown", handleEnter);
}


// 1ターン進める処理
function nextTurn() {
  document.getElementById("diff").innerHTML = "";

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
  
  document.getElementById("title").textContent = e.title;
  document.getElementById("event-img").src = e.img;
  document.getElementById("description").textContent = e.description;
  document.getElementById("choice0").textContent = e.choice_text[0];
  document.getElementById("choice1").textContent = e.choice_text[1];
  document.getElementById("choice2").textContent = e.choice_text[2];

  document.getElementById("choice0").onclick = () => choose(e, 0);
  document.getElementById("choice1").onclick = () => choose(e, 1);
  document.getElementById("choice2").onclick = () => choose(e, 2);

  document.getElementById("choice0").disabled = false;
  document.getElementById("choice1").disabled = false;
  document.getElementById("choice2").disabled = false;

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
nextTurn();

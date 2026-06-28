// ui.js
const UI = {
  // ステータスの表示更新
  updateStatus: (env, eco, pop, money) => {
    document.getElementById("env").textContent = env;
    document.getElementById("eco").textContent = eco;
    document.getElementById("pop").textContent = pop;
    document.getElementById("money").textContent = money;
  },

  // 日付とターンの表示更新
  updateDayTime: (text) => {
    const el = document.getElementById("day-time");
    if (el) el.textContent = text;
  },

  // ★修正箇所：日付の全画面カットイン＆フェードアウト演出
  showDayOverlay: (text) => {
    const overlay = document.getElementById("day-overlay");
    const textEl = document.getElementById("day-overlay-text");
    if (!overlay || !textEl) return;

    textEl.textContent = text;

    overlay.style.display = "flex";
    overlay.classList.remove("fade-out-effect");

    // ブラウザに描画を強制リフレッシュさせる（アニメーション再発火用）
    void overlay.offsetWidth;

    overlay.classList.add("fade-out-effect");

    setTimeout(() => {
      overlay.style.display = "none";
      overlay.classList.remove("fade-out-effect");
    }, 1200);
  }, // ← 次の関数へ続くカンマ

  // イベントと選択肢の描画
  renderEvent: (e, onChoiceClick) => {
    document.getElementById("title").textContent = e.title;
    
    const descEl = document.getElementById("description");
    if (descEl) descEl.textContent = e.description || "";

    // イベント画像があれば表示（なければ隠す）
    const imgEl = document.getElementById("event-img");
    if (imgEl) {
      if (e.img) {
        imgEl.src = e.img;
        imgEl.style.display = "block";
      } else {
        imgEl.style.display = "none";
      }
    }

    for (let i = 0; i < 3; i++) {
      const btn = document.getElementById("choice" + i);
      if (e.choice_text && e.choice_text[i]) {
        btn.textContent = e.choice_text[i];
        btn.style.display = "block";
        btn.disabled = false;
        btn.onclick = () => onChoiceClick(i); 
      } else {
        btn.style.display = "none";
      }
    }

    // 選択肢を選ぶ前は、画面下の決定ボタンを隠しておく
    const decideBtn = document.getElementById("decideBtn");
    if (decideBtn) decideBtn.style.display = "none";
  },

  // 選択後のパラメータ変化（差分）を表示し、決定ボタンのタップまたはEnterを待つ
  showDiffAndWaitEnter: (before, after, onNextPressed) => {
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

    // 選択肢ボタンを一時的に無効化
    document.getElementById("choice0").disabled = true;
    document.getElementById("choice1").disabled = true;
    document.getElementById("choice2").disabled = true;

    // ★スマホ用：決定ボタンを「次へ進む」にして表示する
    const decideBtn = document.getElementById("decideBtn");
    if (decideBtn) {
      decideBtn.textContent = "次へ進む ➔";
      decideBtn.style.display = "block";
      decideBtn.onclick = () => {
        cleanup();
        onNextPressed(); // 次のターンへ
      };
    }

    // ★PC用：Enterキーで進む
    function handleEnter(event) {
      if (event.key === "Enter") {
        cleanup();
        onNextPressed();
      }
    }
    document.addEventListener("keydown", handleEnter);

    // イベントのクリーンアップ（重複防止）
    function cleanup() {
      document.removeEventListener("keydown", handleEnter);
      document.getElementById("diff").innerHTML = "";
      if (decideBtn) decideBtn.style.display = "none";
    }
  },

  // エンディングを画面に表示
  showEnding: (endingData) => {
    alert(`最終結果: ${endingData.title}`);
    
    const paper = document.getElementById("paper");
    if (paper) {
      paper.innerHTML = `
        <h2>ゲームクリア！</h2>
        <h3>${endingData.title}</h3>
        <p>${endingData.desc}</p>
        <button onclick="location.reload()" style="padding:10px 20px; font-size:16px; background-color:#4caf50; color:white; border:none; border-radius:6px; cursor:pointer;">もう一度挑戦する</button>
      `;
    }
  }
};
// story.js
const Story = {
// 画面上部（#day-time）に表示する日付・ターン数のテキストを生成
//独立性を持たせるため、maxTurn, tursPerDayを引数として導入
  getTurnHeaderText: (turn, maxTurn, turnsPerDay) => {
    if (turn === maxTurn) {
      return { day: "最終政策", turn: "" };
    }
    const day = Math.ceil(turn / turnsPerDay); // TURNS_PER_DAYターンごとに1日進む
    const dayTurn = turn % turnsPerDay === 0 ? turnsPerDay : turn % turnsPerDay;
    
// 日数と通算ターン
    return {
    day: `${day}日目`,
    turn: `${dayTurn}ターン目 (${turn} / 10 ターン)`
    };
  },

// 全画面カットイン（#day-overlay）に表示するテキストを判定・生成
// カットインを表示しないターンは null を返す
  getDayOverlayText: (turn, maxTurn, turnsPerDay) => {
    if(turn === maxTurn){
        return "最終政策";
    }
    // 各日の最初のターンであるかを判定する数式
    // (例：1日あたりのターン数が3の場合、turnが 1, 4, 7, ... の時に真になる)
    if ((turn - 1) % turnsPerDay === 0) {
        const day = Math.ceil(turn / turnsPerDay);
        return `${day}日目`;
    }
    return null; // 上記以外のターンはカットインを表示しない
  },

  // ゲームクリア時のステータスに応じて、最適なエンディングテキストを返す関数
  getEndingText: (env, eco, pop, money) => {
    let title = "";
    let desc = "";
    
    if (env > 70 && eco > 70 && pop > 70) {
      title = "【奇跡の超理想郷】";
      desc = "環境・経済・市民のすべてを満たした伝説の市長として、あなたの名前は歴史に刻まれました！";
    } else if (money > 100) {
      title = "【大富豪のメガロポリス】";
      desc = "環境はそこそこですが、圧倒的な財政力で世界有数のマネーシティを築き上げました。";
    } else if (env < 30) {
      title = "【荒廃した工業都市】";
      desc = "経済は発展したものの、空は灰色に淀み、マスクなしでは歩けない街になってしまいました。";
    } else {
      title = "【平穏な普通の町】";
      desc = "良くも悪くも、ごくありふれた平穏な町です。あなたの任期は無難に終了しました。";
    }
    
    return { title, desc };
  }
};
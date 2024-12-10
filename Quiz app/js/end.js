const username = document.getElementById("username");
const saveScoreBtn = document.getElementById("saveScoreBtn");
const finalScore = document.getElementById("finalScore");
const mostRecentScore = localStorage.getItem("mostRecentScore");

const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

const MAX_HIGH_SCORES = 5;

finalScore.innerText = mostRecentScore;

username.addEventListener("keyup", () => {
  saveScoreBtn.disabled = !username.value;
});

saveHighScore = (e) => {
  e.preventDefault();

  const score = {
    score: parseInt(mostRecentScore, 10), // ใช้คะแนนจริงจากเกม
    name: username.value, // ใช้ชื่อที่กรอก
  };

  highScores.push(score);
  highScores.sort((a, b) => b.score - a.score); // เรียงลำดับคะแนนจากมากไปน้อย
  highScores.splice(10); // เก็บคะแนนสูงสุดแค่ 5 อันดับ

  localStorage.setItem("highScores", JSON.stringify(highScores));
  window.location.assign("/"); // กลับไปหน้าแรก
};

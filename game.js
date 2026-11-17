/* =========================================================
   CYBERWISE - game.js
   Features of the PLAY page: the quiz game and the leaderboard.
   Needs data.js and main.js loaded before it.
   ========================================================= */
'use strict';

/* ---------------------------------------------------------
   10. QUIZ GAME
   --------------------------------------------------------- */
const quiz = {
  running: false,
  list: [],          // the 10 chosen questions
  index: 0,          // current question number (0-based)
  score: 0,
  lives: 3,
  streak: 0,
  correct: 0,
  timeLeft: QUESTION_TIME,
  timerId: null,
  locked: false,     // true after the player has answered
  lifelineUsed: false
};

function showQuizPanel(name) {
  ['quizStart', 'quizPlay', 'quizEnd'].forEach((id) => {
    $('#' + id).classList.toggle('hidden', id !== name);
  });
}

function resetQuiz() {
  clearInterval(quiz.timerId);
  quiz.running = false;
  quiz.timerId = null;
  $('#quizPlayer').textContent = playerName || 'Guest';
  showQuizPanel('quizStart');
}

function updateQuizHUD() {
  $('#qNum').textContent = quiz.index + 1;
  $('#qScore').textContent = quiz.score;
  $('#qStreak').textContent = quiz.streak;
  $('#qLives').textContent = '❤️'.repeat(quiz.lives) + '🖤'.repeat(3 - quiz.lives);
}

function startQuiz() {
  if (playerName === '') {
    // no name yet: send the player to the Home page to enter one
    window.location.href = 'index.html?needname=1';
    return;
  }

  // pick random questions and shuffle the answer options of each
  const picked = shuffle(QUESTIONS.slice()).slice(0, QUIZ_LENGTH);
  quiz.list = picked.map((item) => ({
    cat: item.cat,
    q: item.q,
    why: item.why,
    opts: shuffle(item.options.map((text, i) => ({ text: text, correct: i === 0 })))
  }));

  quiz.running = true;
  quiz.index = 0;
  quiz.score = 0;
  quiz.lives = 3;
  quiz.streak = 0;
  quiz.correct = 0;
  quiz.lifelineUsed = false;
  $('#qLifeline').disabled = false;

  showQuizPanel('quizPlay');
  showQuestion();
}

function showQuestion() {
  const item = quiz.list[quiz.index];
  quiz.locked = false;

  $('#qCat').textContent = '[ ' + item.cat + ' ]';
  $('#qText').textContent = item.q;
  $('#qFeedback').classList.add('hidden');
  $('#qNext').classList.add('hidden');

  const box = $('#qOptions');
  box.innerHTML = '';
  item.opts.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'q-opt';
    btn.type = 'button';
    btn.dataset.index = i;
    btn.textContent = (i + 1) + '. ' + opt.text;   // textContent keeps text safe
    box.appendChild(btn);
  });

  updateQuizHUD();
  startTimer();
}

function startTimer() {
  clearInterval(quiz.timerId);
  quiz.timeLeft = QUESTION_TIME;
  drawTimer();

  quiz.timerId = setInterval(() => {
    quiz.timeLeft -= 0.1;
    if (quiz.timeLeft <= 0) {
      quiz.timeLeft = 0;
      drawTimer();
      answer(-1);            // -1 means time ran out
    } else {
      drawTimer();
    }
  }, 100);
}

function drawTimer() {
  const percent = (quiz.timeLeft / QUESTION_TIME) * 100;
  const bar = $('#timerBar');
  bar.style.width = percent + '%';
  bar.style.background = percent > 50 ? '#39ff88' : percent > 25 ? '#ffc857' : '#ff4d6d';
  $('#timerText').textContent = Math.ceil(quiz.timeLeft);
}

// choice = index of clicked option, or -1 for timeout
function answer(choice) {
  if (!quiz.running || quiz.locked) return;
  quiz.locked = true;
  clearInterval(quiz.timerId);

  const item = quiz.list[quiz.index];
  const buttons = $$('#qOptions .q-opt');
  const isCorrect = choice >= 0 && item.opts[choice].correct;

  // lock all buttons and show which one was right
  buttons.forEach((btn, i) => {
    btn.disabled = true;
    if (item.opts[i].correct) btn.classList.add('correct');
  });

  const feedback = $('#qFeedback');
  feedback.classList.remove('hidden', 'good', 'bad');

  if (isCorrect) {
    quiz.streak++;
    quiz.correct++;
    const speedBonus = Math.ceil(quiz.timeLeft);          // faster = more points
    const streakBonus = Math.min(quiz.streak - 1, 5) * 2; // up to +10
    const points = 10 + speedBonus + streakBonus;
    quiz.score += points;
    feedback.classList.add('good');
    feedback.textContent = '✅ Correct! +' + points + ' points. ' + item.why;
    beep(660, 0.12, 'triangle');
  } else {
    quiz.lives--;
    quiz.streak = 0;
    if (choice >= 0) buttons[choice].classList.add('wrong');
    feedback.classList.add('bad');
    feedback.textContent = (choice === -1 ? '⏰ Time is up! ' : '❌ Not quite. ') + item.why;
    beep(180, 0.25, 'sawtooth');
  }

  updateQuizHUD();

  const last = quiz.index === quiz.list.length - 1 || quiz.lives <= 0;
  $('#qNext').textContent = last ? '🏁 See Results' : 'Next ▶';
  $('#qNext').classList.remove('hidden');
}

function nextQuestion() {
  const last = quiz.index === quiz.list.length - 1 || quiz.lives <= 0;
  if (last) {
    endQuiz();
  } else {
    quiz.index++;
    showQuestion();
  }
}

// 50/50 lifeline: hide two wrong options (once per game)
function useLifeline() {
  if (!quiz.running || quiz.locked || quiz.lifelineUsed) return;
  quiz.lifelineUsed = true;
  $('#qLifeline').disabled = true;

  const item = quiz.list[quiz.index];
  const buttons = $$('#qOptions .q-opt');
  const wrongIndexes = [];
  item.opts.forEach((opt, i) => { if (!opt.correct) wrongIndexes.push(i); });

  shuffle(wrongIndexes).slice(0, 2).forEach((i) => {
    buttons[i].classList.add('removed');
    buttons[i].disabled = true;
  });
  beep(520, 0.1, 'square');
}

function rankTitle(correct) {
  if (correct >= 9) return '🥇 Cyber Hero';
  if (correct >= 7) return '🛡️ Cyber Guardian';
  if (correct >= 5) return '🔰 Cyber Defender';
  return '🌱 Cyber Rookie';
}

function endQuiz() {
  quiz.running = false;
  clearInterval(quiz.timerId);

  const position = saveScore();
  updateStats();

  const survived = quiz.lives > 0;
  $('#endTitle').textContent = survived ? 'Quiz Complete!' : 'Game Over';
  $('#endScore').textContent = quiz.score;
  $('#endDetail').textContent = 'Correct answers: ' + quiz.correct + ' of ' + quiz.list.length +
                                ' | Lives left: ' + quiz.lives;
  $('#endRank').textContent = 'Your rank: ' + rankTitle(quiz.correct) + '. ' +
    (position <= 10 ? 'You are #' + position + ' on the leaderboard! 🏆' : 'Keep practicing to reach the Top 10!');
  showQuizPanel('quizEnd');
  beep(880, 0.3, 'sawtooth');
}

$('#quizStartBtn').addEventListener('click', startQuiz);
$('#quizAgain').addEventListener('click', startQuiz);
$('#goBoard').addEventListener('click', () => showTab('ranks'));
$('#qNext').addEventListener('click', nextQuestion);
$('#qLifeline').addEventListener('click', useLifeline);

// Click on an answer button (event delegation)
$('#qOptions').addEventListener('click', (event) => {
  const btn = event.target.closest('.q-opt');
  if (btn && !btn.disabled) answer(parseInt(btn.dataset.index, 10));
});

// Keyboard: 1-4 to answer, Enter or Space to go to the next question
document.addEventListener('keydown', (event) => {
  if (event.target.tagName === 'INPUT') return;
  if (!$('#quiz').classList.contains('active') || !quiz.running) return;

  if (!quiz.locked && ['1', '2', '3', '4'].includes(event.key)) {
    const index = parseInt(event.key, 10) - 1;
    const btn = $$('#qOptions .q-opt')[index];
    if (btn && !btn.disabled) answer(index);
  } else if (quiz.locked && (event.key === 'Enter' || event.key === ' ')) {
    event.preventDefault();
    nextQuestion();
  }
});

/* ---------------------------------------------------------
   11. LEADERBOARD + STATS (saved in localStorage)
   --------------------------------------------------------- */
function saveScore() {
  const scores = loadJSON(KEY_SCORES, []);
  const entry = {
    name: playerName,
    score: quiz.score,
    correct: quiz.correct,
    date: new Date().toLocaleDateString(),
    id: Date.now()
  };
  scores.push(entry);
  scores.sort((a, b) => b.score - a.score); // highest first
  const top = scores.slice(0, 10);
  saveJSON(KEY_SCORES, top);

  const position = top.findIndex((s) => s.id === entry.id);
  return position === -1 ? 99 : position + 1;
}

function updateStats() {
  const stats = loadJSON(KEY_STATS, { games: 0, best: 0, correct: 0 });
  stats.games++;
  stats.correct += quiz.correct;
  if (quiz.score > stats.best) stats.best = quiz.score;
  saveJSON(KEY_STATS, stats);
}

function renderLeaderboard() {
  const scores = loadJSON(KEY_SCORES, []);
  const body = $('#boardBody');
  body.innerHTML = '';

  if (scores.length === 0) {
    body.innerHTML = '<tr><td colspan="5">No scores yet. Play the quiz to be the first!</td></tr>';
    return;
  }

  scores.forEach((s, index) => {
    const row = document.createElement('tr');
    if (s.name === playerName) row.className = 'me';
    const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1;
    row.innerHTML = '<td>' + medal + '</td><td></td><td>' + s.score + '</td><td>' + s.correct + '/10</td><td>' + s.date + '</td>';
    row.children[1].textContent = s.name; // textContent keeps names safe from HTML injection
    body.appendChild(row);
  });
}

$('#resetBoard').addEventListener('click', () => {
  if (confirm('Delete all saved scores and stats?')) {
    localStorage.removeItem(KEY_SCORES);
    localStorage.removeItem(KEY_STATS);
    renderLeaderboard();
  }
});

/* ---------------------------------------------------------
   TABS (Quiz Game / Ranks) + START UP
   --------------------------------------------------------- */
function onTabChange(id) {
  // Leaving the quiz tab cancels the round in progress
  if (id !== 'quiz' && quiz.running) resetQuiz();
  if (id === 'ranks') renderLeaderboard();
}

const showTab = setupTabs(onTabChange);
resetQuiz();
renderLeaderboard();

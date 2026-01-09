let words = [];
let currentWord = null;
let score = 0;
let timeLeft = 15;
let timer = null;

// адреса
function getLessonFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('lesson');
}

window.onload = async () => {
  const scoreEl = document.getElementById('score');
  const timeEl = document.getElementById('time');
  const termEl = document.getElementById('term');
  const translationEl = document.getElementById('translation');
  const resultEl = document.getElementById('result');
  const backBtn = document.querySelector('.back-btn');

  document.getElementById("btn-yes").addEventListener("click", () => answer(true));
  document.getElementById("btn-no").addEventListener("click", () => answer(false));
  document.getElementById("btn-start").addEventListener("click", () => startGame());

  const lessonName = getLessonFromUrl();
  if (!lessonName) {
    alert("Не інформативний URL");
    return;
  }

  let lessons = getLessons();
  let lesson = lessons.find(l => l.name === lessonName);

  if (!lesson) {
    
    try {
      const res = await fetch(`../db/${lessonName}.json`);
      if (!res.ok) throw new Error('Не грузиться JSON слів');

      const data = await res.json();
      lesson = {
        name: lessonName,
        words: data || []
      };
      lessons.push(lesson);
      saveLessons(lessons);

    } catch (err) {
      console.error(err);
      alert('Урок не знайдений в LocalStorage та в JSON');
      return;
    }
  } else if (!lesson.words || lesson.words.length === 0) {
    // Урок есть, но слов нет — подгружаем их из JSON
    try {
      const res = await fetch(`../db/${lessonName}.json`);
      if (!res.ok) throw new Error('Не грузиться JSON слов');
      const data = await res.json();
      lesson.words = data || [];
      saveLessons(lessons);
    } catch (err) {
      console.error(err);
      lesson.words = []; 
    }
  }

  words = lesson.words;
  console.log("WORDS LOADED:", words);

  //назад
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      location.href = `lesson.html?lesson=${lessonName}`;
    });
  }


  function startGame() {
    if (!words.length) {
      alert("Немає слів в уроці");
      return;
    }

    score = 0;
    timeLeft = 15;
    scoreEl.textContent = score;
    timeEl.textContent = timeLeft;
    resultEl.style.display = "none";

    startTimer();
    nextWord();
  }

  function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => {
      timeLeft--;
      timeEl.textContent = timeLeft;

      if (timeLeft <= 0) {
        clearInterval(timer);
        gameOver();
      }
    }, 1000);
  }

  function nextWord() {
    const correct = Math.random() < 0.5;

    const randomIndex = Math.floor(Math.random() * words.length);
    currentWord = words[randomIndex];

    let fakeIndex = Math.floor(Math.random() * words.length);
    if (fakeIndex === randomIndex) fakeIndex = (fakeIndex + 1) % words.length;

    let shownTranslation = correct
      ? currentWord.translation
      : words[fakeIndex].translation;

    termEl.textContent = currentWord.term;
    translationEl.textContent = shownTranslation;

    currentWord.correctShown = correct;
  }

  function answer(isCorrect) {
    if (isCorrect === currentWord.correctShown) score++;

    scoreEl.textContent = score;
    nextWord();
  }

  function gameOver() {
    termEl.textContent = "";
    translationEl.textContent = "";
    resultEl.style.display = "block";
    resultEl.textContent = `Ваш результат: ${score}`;
  }
};

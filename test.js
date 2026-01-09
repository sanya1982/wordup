const questionTerm = document.getElementById('questionTerm');
const answerButtons = document.querySelectorAll('.answer-btn');
const resultBox = document.querySelector('.game__result');
const backBtn = document.querySelector('.back-btn');


function getLessons() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function saveLessons(lessons) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lessons));
}

function getLessonFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('lesson');
}

let lessonName = getLessonFromUrl();
let lessons = getLessons();
let lesson = lessons.find(l => l.name === lessonName);

let words = [];
let used = [];
let currentWord = null;

initGame();

async function initGame() {

  
  if (lesson && lesson.words && lesson.words.length > 0) {
    words = lesson.words;
  } else {
    
    try {
      const res = await fetch(`../db/${lessonName}.json`);
      if (!res.ok) throw new Error("Не грузиться  JSON");

      const data = await res.json();   

      words = data;

      
      if (lesson) {
        lesson.words = data;
      }
      
      else {
        lessons.push({
          name: lessonName,
          course: "unknown",
          count: data.length,
          progress: 0,
          words: data
        });
      }

      saveLessons(lessons);

    } catch (err) {
      alert("Невдача");
      console.error(err);
      return;
    }
  }

  if (!words || words.length < 3) {
    alert("Недостатньо слів для гри (мінімум 3)");
    return;
  }

  nextQuestion();
}


function nextQuestion() {
  resultBox.style.zIndex = '-2';
  if (used.length === words.length) {
    resultBox.innerHTML = "Гру завершено!";
    questionTerm.innerHTML = "Ти супер!";
    answerButtons.forEach(btn => btn.style.display = "none");
    return;
  }

  resultBox.innerHTML = "";

  do {
    currentWord = words[Math.floor(Math.random() * words.length)];
  } while (used.includes(currentWord.id));

  used.push(currentWord.id);

  questionTerm.innerHTML = currentWord.term;

  const options = getOptions(currentWord);
  answerButtons.forEach((btn, i) => {
    btn.style.display = "block";
    btn.innerHTML = options[i];
    btn.onclick = () => checkAnswer(options[i]);
  });
}

function getOptions(correct) {
  let options = [correct.translation];

  while (options.length < 3) {
    const random = words[Math.floor(Math.random() * words.length)];
    if (!options.includes(random.translation)) {
      options.push(random.translation);
    }
  }

  return options.sort(() => Math.random() - 0.5);
}

function checkAnswer(answer) {
  if (answer === currentWord.translation) {
    resultBox.style.zIndex = '3';
    resultBox.innerHTML = `<img src="../img/correct.png" alt="Правильно">`;
  } else {
    resultBox.style.zIndex = '3';
    resultBox.innerHTML = `<img src="../img/incorrect.png" alt="Не правильно">`;
    // resultBox.innerHTML = `<img src="../img/incorrect.png" alt="Не правильно"> Правильно: <b>${currentWord.translation}</b>`;
  }
  setTimeout(nextQuestion, 900);
}

// назад
backBtn.addEventListener('click', () => {
  location.href = `lesson.html?lesson=${lessonName}`;
});

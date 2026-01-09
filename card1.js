
function getLessons() {
  return JSON.parse(localStorage.getItem('lessons')) || [];
}

function saveLessons(lessons) {
  localStorage.setItem('lessons', JSON.stringify(lessons));
}

function getLessonFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('lesson');
}

//карта гри
let words = [];
let currentIndex = 0;
let lessonName = getLessonFromUrl();
let lessons = getLessons();
let lesson = lessons.find(l => l.name === lessonName);

const cardFrontEl = document.getElementById('card-front'); // translation
const cardBackEl = document.getElementById('card-back');   // term
const btnKnow = document.getElementById('btn-know');
const btnDontKnow = document.getElementById('btn-dont-know');
const progressEl = document.getElementById('progress');
const backBtn = document.getElementById('back-btn');

// урок
async function loadLesson() {
  if (!lesson) {
    try {
      const res = await fetch(`../db/${lessonName}.json`);
      if (!res.ok) throw new Error('JSON немає');

      const data = await res.json();

      lesson = {
        name: lessonName,
        words: data,
        progress: 0,
        count: data.length
      };

      lessons.push(lesson);
      saveLessons(lessons);

    } catch (err) {
      console.error(err);
      alert('Не загрузився');
      return;
    }
  }
  else if (!lesson.words || lesson.words.length === 0) {
    try {
      const res = await fetch(`../db/${lessonName}.json`);
      if (!res.ok) throw new Error('JSON не найшов');

      const data = await res.json();
      lesson.words = data;
      lesson.count = data.length;
      saveLessons(lessons);

    } catch (err) {
      console.error(err);
      lesson.words = [];
    }
  }

  words = lesson.words;
  currentIndex = 0;
  renderCard();
  updateProgress();
}


// карта
function renderCard() {
  if (currentIndex >= words.length) {
    cardFrontEl.textContent = 'Вы пройшли всі терміни!';
    cardBackEl.textContent = '';
    btnKnow.disabled = true;
    btnDontKnow.disabled = true;
    return;
  }

  const currentWord = words[currentIndex];
  cardFrontEl.textContent = currentWord.translation;
  cardBackEl.textContent = currentWord.term;
}

// кнопки обработка
function handleAnswer(isKnow) {
  const currentWord = words[currentIndex];
  if (isKnow) currentWord.state = true; //статус

  currentIndex++;
  saveLessons(lessons);
  updateProgress();
  renderCard();
  console.log(lessons);
}

// прогрес
function updateProgress() {
  if (!words.length) {
    lesson.progress = 0;
    return;
  }

  const knownCount = words.filter(w => w.state === true).length;
  const percent = Math.round((knownCount / words.length) * 100);

  lesson.progress = percent;      
  lesson.count = words.length;    

  saveLessons(lessons);

  if (progressEl) {
    progressEl.textContent = `Прогрес: ${percent}%`;
  }
}


  // поновлюємо прогрес
  function handleAnswer(isKnow) {
  const currentWord = words[currentIndex];

  if (isKnow) {
    currentWord.state = true;
  }

  currentIndex++;

  updateProgress();
  renderCard();
}


// перелистування карток
cardFrontEl.addEventListener('click', () => {
    cardFrontEl.classList.add('none');
    cardBackEl.classList.remove('none');
});

cardBackEl.addEventListener('click', () => {
    cardBackEl.classList.add('none');
    cardFrontEl.classList.remove('none');
});


// події кнопок
btnKnow.addEventListener('click', () => handleAnswer(true));
btnDontKnow.addEventListener('click', () => handleAnswer(false));
backBtn.addEventListener('click', () => {
  location.href = `lesson.html?lesson=${lessonName}`;
});


window.onload = loadLesson;

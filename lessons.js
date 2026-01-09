const lessonMain = document.querySelector('.lesson__main');

// урок по адресі
function getLessonFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('lesson');
}

const lessonName = getLessonFromUrl();
const lessons = getLessons();    
const lesson = lessons.find(l => l.name === lessonName);


if (!lesson) {
  lessonMain.innerHTML = `<h2>Урок не знайдено</h2>`;
} 
else {
  lessonMain.innerHTML = `
    <h4 class="addblue">Назва</h4>
    <h3>${lesson.name}</h3>

    <h4 class="addblue">Курс</h4>
    <h3>${lesson.course}</h3>

    <button id="backEdit" class="delete">
				<svg width="43" height="43" viewBox="0 0 43 43" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M21.5 0C23.3968 0 25.2363 0.245826 26.9883 0.707031V7.31055C27.6873 7.54297 28.3636 7.8254 29.0127 8.15234L33.5264 3.67578C36.0016 5.34917 38.1085 7.5253 39.7031 10.0566L35.4209 14.3037C35.9063 15.1793 36.3068 16.1078 36.6094 17.0791H42.5439C42.8422 18.506 43 19.9846 43 21.5C43 23.0158 42.8423 24.4947 42.5439 25.9219H36.6094C36.3567 26.733 36.0349 27.514 35.6533 28.2598L39.958 32.5283C38.4189 35.0988 36.359 37.3211 33.9229 39.0488L29.4521 34.6172C28.6704 35.0438 27.8467 35.404 26.9883 35.6895V42.292C25.2362 42.7532 23.3969 43 21.5 43C20.3322 43 19.1866 42.9048 18.0693 42.7256V35.9004C16.965 35.5907 15.9125 35.1583 14.9268 34.6211L9.89941 39.6055C7.38287 37.9897 5.22683 35.8624 3.57422 33.3721L8.72266 28.2686C8.33928 27.5204 8.0163 26.736 7.7627 25.9219H0.456055C0.157688 24.4947 0 23.0158 0 21.5C0 19.9846 0.157815 18.506 0.456055 17.0791H7.7627C8.06612 16.105 8.46773 15.1738 8.95508 14.2959L3.84473 9.22852C5.55225 6.77646 7.75686 4.69643 10.3135 3.13574L15.3682 8.14746C16.2249 7.71665 17.1282 7.36353 18.0693 7.09961V0.273438C19.1865 0.0942754 20.3323 0 21.5 0ZM21.5 13.3379C16.9534 13.3379 13.2677 16.9924 13.2676 21.5C13.2676 26.0078 16.9533 29.6621 21.5 29.6621C26.0467 29.6621 29.7324 26.0077 29.7324 21.5C29.7323 16.9924 26.0466 13.3379 21.5 13.3379Z" fill="#184A5F" fill-opacity="0.8"/>
				</svg>
		</button>
    <h4 class="addblue">Терміни</h4>
    <h3>${lesson.count}</h3>

    <h4 class="addblue">Прогрес</h4>
    <div class="cards__area">
      <div class="cards__progress" style="width: ${lesson.progress}%;"></div>
    </div>
    <h4>${lesson.progress}%</h4>
  `;
}

// кнопки
const cardsBtn = document.querySelectorAll('.cards__item');

cardsBtn.forEach(btn => {
  btn.addEventListener('click', () => {
    if (!lesson) return;

    if (btn.innerText.includes('Картки')) {
      location.href = `cards.html?lesson=${lesson.name}`;
    }

    if (btn.innerText.includes('Гра')) {
      location.href = `game.html?lesson=${lesson.name}`;
    }

    if (btn.innerText.includes('Тести')) {
      location.href = `test.html?lesson=${lesson.name}`;
    }
  });
});


// Редагування
const backBtn = document.querySelector('#backEdit');

backBtn.addEventListener('click', () => {
  location.href = `lesson_edit.html?lesson=${lessonName}`;
});


// кліки
const cardBtn = document.querySelector('.cards__item:nth-child(1)');
const gameBtn = document.querySelector('.cards__item:nth-child(2)');
const testBtn = document.querySelector('.cards__item:nth-child(3)');

cardBtn.addEventListener('click', () => {
  location.href = `cards.html?lesson=${lessonName}`;
});

gameBtn.addEventListener('click', () => {
  location.href = `game.html?lesson=${lessonName}`;
});

testBtn.addEventListener('click', () => {
  location.href = `test.html?lesson=${lessonName}`;
});

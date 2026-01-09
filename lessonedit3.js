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


async function initLessonEdit() {
    const lessonName = getLessonFromUrl();
    let lessons = getLessons();
    let lesson = lessons.find(l => l.name === lessonName);

    if (!lesson) {
        
    try {
    const res = await fetch(`../db/${lessonName}.json`);
    if (!res.ok) throw new Error('JSON не знайдено');
    const data = await res.json();
    console.log(data);
    lesson.words = data || [];
    console.log(lesson.words);
    saveLessons(lessons);
} catch (err) {
    console.error(err);
        alert('не знайдено в LocalStorage, та в JSON');
        return;
    }
} else if (!lesson.words || lesson.words.length === 0) {
    
    try {
        const res = await fetch(`../db/${lessonName}.json`);
        if (!res.ok) throw new Error('JSON не знайдено');
        const data = await res.json();
        lesson.words = data || [];
        saveLessons(lessons);
    } catch (err) {
        console.error(err);
        lesson.words = [];
    }
    }
console.log(lesson);
    renderLessonInfo(lesson);
    renderWords(lesson);
    setupWordButtons(lesson, lessons);
    setupNavigationButtons(lessonName);
    setupBackToEditButton(lessonName);
}


function renderLessonInfo(lesson) {
    const title = document.getElementById('title');
    const courseTitle = document.getElementById('course');

    title.textContent = lesson.name;
    courseTitle.textContent = lesson.course;

    
    const countEl = document.getElementById('termCount');
    const progressEl = document.getElementById('progressBar');

    if (countEl) countEl.textContent = lesson.count || 0;
    if (progressEl) progressEl.style.width = `${lesson.progress || 0}%`;
}

// слова
function renderWords(lesson) {
    const list = document.getElementById('wordsList');
    list.innerHTML = '';
    lesson.words.forEach((w, index) => {
        const div = document.createElement('div');
        div.classList.add('lessonEdit__item', 'lessonEdit__word');
        div.innerHTML = `
            <h4 class="addblue">Термін</h4>
            <h3>${w.term}</h3>
            <h4 class="addblue">Значення</h4>
            <h3>${w.translation}</h3>
            <button data-index="${index}" class="delete">
            <svg width="38" height="42" viewBox="0 0 38 42" fill="none" xmlns="http://www.w3.org/2000/svg">
// <path d="M7.125 43C5.81875 43 4.70092 42.5326 3.7715 41.5977C2.84208 40.6629 2.37658 39.5377 2.375 38.2222V7.16667H0V2.38889H11.875V0H26.125V2.38889H38V7.16667H35.625V38.2222C35.625 39.5361 35.1603 40.6613 34.2309 41.5977C33.3015 42.5342 32.1828 43.0016 30.875 43H7.125ZM30.875 7.16667H7.125V38.2222H30.875V7.16667ZM11.875 33.4444H16.625V11.9444H11.875V33.4444ZM21.375 33.4444H26.125V11.9444H21.375V33.4444Z" fill="#184A5F" fill-opacity="0.8"/>
// </svg>
            </button>
        `;
        list.appendChild(div);
    });

    // видалення
    document.querySelectorAll('.delete').forEach(btn => {
        btn.addEventListener('click', () => {
            const i = btn.dataset.index;
            lesson.words.splice(i, 1);
            lesson.count = lesson.words.length;
            saveLessons(getLessons());
            renderWords(lesson);
        });
    });
}

// нові слова
function setupWordButtons(lesson, lessons) {
    const addBtn = document.getElementById('addBtn');
    addBtn.addEventListener('click', () => {
        const term = document.getElementById('term').value.trim();
        const translation = document.getElementById('translation').value.trim();

        if (!term || !translation) {
            alert("Внеси дані у всі поля");
            return;
        }

        lesson.words.push({ term, translation });
        lesson.count = lesson.words.length;
        saveLessons(lessons);
        renderWords(lesson);

        document.getElementById('term').value = '';
        document.getElementById('translation').value = '';
    });
}

// const backToLesson = document.querySelector('#backToLesson');

// backToLesson.addEventListener('click', () => {
//   location.href = `lesson.html?lesson=${lessonName}`;
// });

function setupNavigationButtons(lessonName) {
    const cardBtn = document.querySelector('.cards__item:nth-child(1)');
    const gameBtn = document.querySelector('.cards__item:nth-child(2)');
    const testBtn = document.querySelector('.cards__item:nth-child(3)');
    const backToLesson = document.querySelector('#backToLesson');

    if (backToLesson) backToLesson.addEventListener('click', () => {
      console.log('Yes')
        location.href = `lesson.html?lesson=${lessonName}`;
    });

    if (cardBtn) cardBtn.addEventListener('click', () => {
        location.href = `cards.html?lesson=${lessonName}`;
    });

    if (gameBtn) gameBtn.addEventListener('click', () => {
        location.href = `game.html?lesson=${lessonName}`;
    });

    if (testBtn) testBtn.addEventListener('click', () => {
        location.href = `test.html?lesson=${lessonName}`;
    });
}

// редагування
function setupBackToEditButton(lessonName) {
    const backBtnContainer = document.getElementById('backToEditContainer');
    if (!backBtnContainer) return;

    backBtnContainer.innerHTML = `
        <button id="backToEdit" class="btn__small btn__yellow">
            ← Редагувати урок
        </button>
    `;

    const backBtn = document.getElementById('backToEdit');
    backBtn.addEventListener('click', () => {
        location.href = `lesson_edit.html?lesson=${lessonName}`;
    });
}


document.addEventListener('DOMContentLoaded', () => {
    initLessonEdit();
});

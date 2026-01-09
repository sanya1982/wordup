async function initLessons() {
  let lessons = getLessons();

  try {
    const res = await fetch('../db/main.json');
    if (!res.ok) throw new Error('Не удалось загрузить main.json');

    const jsonLessons = await res.json();

    jsonLessons.forEach(jsonLesson => {
      const existingLesson = lessons.find(l => l.name === jsonLesson.name);

      // як що немає в локал
      if (!existingLesson) {
        lessons.push({
          ...jsonLesson,
          words: [] 
        });
      }
    });

    saveLessons(lessons);
  } catch (err) {
    console.error(err);
  }

  return lessons;
}



async function buildPage() {
  const cardsItems = document.querySelector('.cards__items');
  cardsItems.innerHTML = '';

  const myLessons = await initLessons();

  // карточка "створити"
  cardsItems.innerHTML += `
    <a href="new.html">
      <div class="cards__item cards__new">
        <div class="cards__circle"><div class="cards__line"></div></div>
        <h4>Додати</h4>
      </div>
    </a>
  `;

  myLessons.forEach(lesson => {
    const progress = lesson.progress || 0;

    cardsItems.innerHTML += `
      <a href="lesson.html?lesson=${encodeURIComponent(lesson.name)}">
        <div class="cards__item cards__complete">
          <div class="cards__name">
            <h4>${lesson.name}</h4>
            <h5 class="cards__h5">назва</h5>
          </div>

          <div class="cards__course">
            <h4>${lesson.course}</h4>
            <h5 class="cards__h5">курс</h5>
          </div>

          <h5>${lesson.count} терміни</h5>

          <div class="cards__score">
            <h4>Прогрес: ${progress}%</h4>
            <div class="cards__area">
              <div class="cards__progress" style="width:${progress}%;"></div>
            </div>
          </div>
        </div>
      </a>
    `;
  });
}

buildPage();



// отримуємо уроки 
function getLessons() {
  return JSON.parse(localStorage.getItem('lessons')) || [];
}

function saveLessons(lessons) {
  localStorage.setItem('lessons', JSON.stringify(lessons));
}

// отримуємо курси

function getCourses() {
  return JSON.parse(localStorage.getItem(COURSES_KEY)) || [];
}

function saveCourses(courses) {
  localStorage.setItem(COURSES_KEY, JSON.stringify(courses));
}
// курси з main.json
async function initCourses() {
  let courses = getCourses();
  try {
    const res = await fetch('../db/main.json');
    if (!res.ok) throw new Error('Не знайшов main.json');

    const lessons = await res.json();
    lessons.forEach(l => {
      if (!courses.includes(l.course)) courses.push(l.course);
    });

    saveCourses(courses);
  } catch (err) {
    console.error(err);
  }

  return courses;
}

// додавання нового курсу
function addCourse(courseName) {
  let courses = getCourses();
  if (!courses.includes(courseName)) {
    courses.push(courseName);
    saveCourses(courses);
  }
}

//  RENDER 

function renderCourses(containerId, selectId, addBtnId, inputId, lessonsContainerId) {
  const container = document.getElementById(containerId);
  const select = document.getElementById(selectId);
  const addBtn = document.getElementById(addBtnId);
  const input = document.getElementById(inputId);
  const lessonsContainer = document.getElementById(lessonsContainerId);

  async function updateSelect() {
    const courses = await initCourses();
    select.innerHTML = '<option value="all">Всі курси</option>';
    courses.forEach(c => {
      const option = document.createElement('option');
      option.value = c;
      option.textContent = c;
      select.appendChild(option);
    });
  }

  async function updateLessons(course = 'all') {
    let lessons = getLessons();
    lessonsContainer.innerHTML = '';
    try {
      const res = await fetch('../db/main.json');
      if (!res.ok) throw new Error('Не удалось загрузить main.json');
      const jsonLessons = await res.json();
      jsonLessons.forEach(jsonLesson => {
      const existingLesson = lessons.find(l => l.name === jsonLesson.name);

      if (!existingLesson) {
        lessons.push({
          ...jsonLesson,
          words: [] 
        });
      }
    });
      const filtered = course === 'all' ? lessons : lessons.filter(l => l.course === course);

      filtered.forEach(l => {
        const div = document.createElement('div');
        div.className = 'cards__items course__items';
        div.innerHTML = `
        <a href="lesson.html?lesson=${encodeURIComponent(l.name)}"><div class="cards__item cards__complete">
        <div class="cards__name">
						<h4>${l.name}</h4>
						<h5 class="cards__h5">назва</h5>
					</div>
					<div class="cards__course">
						<h4>${l.course}</h4>
						<h5 class="cards__h5">курс</h5>
					</div>
					<h5>${l.count} терміни</h5>
					<div class="cards__score">
						<h4>Прогрес</h4>
						<div class="cards__area">
							<div class="cards__progress" style="width:${l.progress}%;"></div>
						</div>
            </div>
					</div>
          </a>`;
          

        lessonsContainer.appendChild(div);
      });
    } catch (err) {
      console.error(err);
    }
  }

  select.addEventListener('change', () => {
    updateLessons(select.value);
  });

  addBtn.addEventListener('click', () => {
    const name = input.value.trim();
    console.log(!name);
    if (!name) {
      alert('Введіть назву курсу');
    return;
    }
    addCourse(name);
    updateSelect();
    input.value = '';
  });

  
  updateSelect();
  updateLessons();
}
renderCourses('body', 'courseSelect', 'addCourseBtn', 'newCourse', 'lessonsContainer');

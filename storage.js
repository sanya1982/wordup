const STORAGE_KEY = 'lessons';
const COURSES_KEY = 'courses';

function getLessons() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function saveLessons(lessons) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lessons));
}

function addLesson(newLesson) {
  const lessons = getLessons();
  lessons.push(newLesson);
  saveLessons(lessons);
}

function updateLesson(name, updatedData) {
  const lessons = getLessons();
  const index = lessons.findIndex(l => l.name === name);

  if (index !== -1) {
    lessons[index] = { ...lessons[index], ...updatedData };
    saveLessons(lessons);
  }
}

function deleteLesson(name) {
  const lessons = getLessons().filter(l => l.name !== name);
  saveLessons(lessons);
}

function addCourse(courseName) {
  const courses = getCourses();
  if (!courses.includes(courseName)) {
    courses.push(courseName);
    saveCourses(courses);
  }
}

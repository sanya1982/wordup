// document.querySelector('#create').addEventListener('click', () => {
//   const name = document.querySelector('#name').value;
//   const course = document.querySelector('#course').value;

//   addLesson({
//     name,
//     course,
//     count: 0,
//     progress: 0
//   });

//   location.href = `lesson_edit.html?lesson=${encodeURIComponent(name)}`;
// });



const courseSelect = document.querySelector('#course');


async function renderCourseOptions() {
 
  const courses = getCourses(); 
  courseSelect.innerHTML = ''; 

  
  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.textContent = 'Выберите курс';
  courseSelect.appendChild(defaultOption);

  
  courses.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = c;
    courseSelect.appendChild(opt);
  });
}


renderCourseOptions();

document.querySelector('#create').addEventListener('click', () => {
  const name = document.querySelector('#name').value;
  const course = document.querySelector('#course').value;

  addLesson({
    name,
    course,
    count: 0,
    progress: 0
  });

  location.href = `lesson_edit.html?lesson=${encodeURIComponent(name)}`;
});

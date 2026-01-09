document.addEventListener("DOMContentLoaded", () => {
    const welcome = document.querySelector('.hero__welcome');
    const welcomeWhite = document.querySelector('.hero__welcome-white');
    const img = document.querySelector('.hero__img-a');
    
    // Проверяем, была ли уже показана анимация в этой сессии
    if (!sessionStorage.getItem('animationPlayed')) {
        // Если нет — добавляем класс анимации
        img.classList.add('img-animation');
        welcomeWhite.classList.add('background-animation');
        welcome.classList.add('background-animation');
        console.log('1');
        // Ставим метку, что анимация проиграна
        sessionStorage.setItem('animationPlayed', 'true');
    }
});
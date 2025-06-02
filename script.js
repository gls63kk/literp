// Тексты для анимации
const storyTexts = [
    "Привет!",
    "Ты знал что скоро откроется новый сервер в RAGE:MP?",
    "Нет?...",
    "Ну тогда смотри...",
    "Lite — Это проект сделанный на платформе RAGE:MP с любовью и с своими возможностями!",
    "Мы создаем уникальную метавселенную, где будущее встречается с настоящим.",
    "Наши многофункциональные системы и новые технологии открывают безграничные возможности.",
    "В нашем мире вы сможете испытать то, что раньше казалось невозможным.",
    "Lite RP — это не просто игра, это новая реальность с бесконечным потенциалом.",
    "Я походу вижу что тебя заинтересовал наш проект!"
];

const finalTexts = [
    "Прости... Но мы разрабатываем наш Lite сервер...",
    "Но скоро мы откроем двери в удивительный мир будущего!"
];

let currentStoryIndex = 0;
let currentFinalIndex = 0;
let isTyping = false;

// Функция для эффекта печатной машинки
function typeWriter(element, text, speed = 50) {
    return new Promise((resolve) => {
        if (!element) {
            resolve();
            return;
        }
        
        isTyping = true;
        element.innerHTML = '';
        element.style.borderRight = '3px solid #97a7ff';
        
        let i = 0;
        const timer = setInterval(() => {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
            } else {
                clearInterval(timer);
                // Убираем курсор через 1 секунду
                setTimeout(() => {
                    if (element) {
                        element.style.borderRight = 'none';
                    }
                    isTyping = false;
                    resolve();
                }, 1000);
            }
        }, speed);
    });
}

// Функция для удаления текста
function eraseText(element, speed = 30) {
    return new Promise((resolve) => {
        if (!element) {
            resolve();
            return;
        }
        
        const text = element.innerHTML;
        element.style.borderRight = '3px solid #97a7ff';
        
        let i = text.length;
        const timer = setInterval(() => {
            if (i > 0) {
                element.innerHTML = text.substring(0, i - 1);
                i--;
            } else {
                clearInterval(timer);
                if (element) {
                    element.style.borderRight = 'none';
                }
                resolve();
            }
        }, speed);
    });
}

// Анимация орла
function animateEagle() {
    const eagle = document.getElementById('eagle');
    
    // Мигание через 2 секунды
    setTimeout(() => {
        eagle.classList.add('eagle-blink');
        setTimeout(() => {
            eagle.classList.remove('eagle-blink');
        }, 500);
    }, 2000);
    
    // Приближение через 3 секунды
    setTimeout(() => {
        eagle.classList.add('eagle-zoom');
        setTimeout(() => {
            eagle.classList.remove('eagle-zoom');
        }, 2000);
    }, 3000);
}

// Анимация загрузочного текста
function animateLoadingText() {
    const loadingText = document.getElementById('loading-text');
    const loadingDots = document.getElementById('loading-dots');
    
    let dotCount = 0;
    const dotInterval = setInterval(() => {
        dotCount = (dotCount + 1) % 4;
        loadingDots.textContent = '.'.repeat(dotCount);
    }, 500);
    
    // Останавливаем анимацию точек через 6 секунд
    setTimeout(() => {
        clearInterval(dotInterval);
        // Начинаем исчезновение загрузочного экрана
        setTimeout(() => {
            hideLoadingScreen();
        }, 1000);
    }, 6000);
}

// Скрытие загрузочного экрана
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.getElementById('main-content');
    
    loadingScreen.style.opacity = '0';
    
    setTimeout(() => {
        loadingScreen.style.display = 'none';
        mainContent.classList.remove('hidden');
        startStoryAnimation();
    }, 1000);
}

// Анимация истории
async function startStoryAnimation() {
    const storyText = document.getElementById('story-text');
    
    for (let i = 0; i < storyTexts.length; i++) {
        currentStoryIndex = i;
        
        // Печатаем текст
        await typeWriter(storyText, storyTexts[i], 60);
        
        // Ждем 3 секунды
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Стираем текст (кроме последнего)
        if (i < storyTexts.length - 1) {
            await eraseText(storyText, 40);
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }
    
    // Переход к финальной странице
    setTimeout(() => {
        showFinalPage();
    }, 3000);
}

// Показ финальной страницы
function showFinalPage() {
    const starPage = document.getElementById('star-page');
    const finalPage = document.getElementById('final-page');
    
    if (starPage) {
        starPage.classList.remove('active');
    }
    
    setTimeout(() => {
        if (finalPage) {
            finalPage.classList.add('active');
            startFinalAnimation();
        }
    }, 1000);
}

// Анимация финальной страницы
async function startFinalAnimation() {
    const finalText = document.getElementById('final-text');
    
    if (!finalText) {
        console.error('Final text element not found');
        return;
    }
    
    for (let i = 0; i < finalTexts.length; i++) {
        currentFinalIndex = i;
        
        // Печатаем текст
        await typeWriter(finalText, finalTexts[i], 70);
        
        // Ждем 3 секунды
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Стираем текст (кроме последнего)
        if (i < finalTexts.length - 1) {
            await eraseText(finalText, 50);
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }
    
    // Показываем Discord секцию
    setTimeout(() => {
        showDiscordSection();
    }, 1500);
}

// Показ Discord секции
function showDiscordSection() {
    const discordSection = document.getElementById('discord-section');
    
    if (!discordSection) {
        console.error('Discord section not found');
        return;
    }
    
    discordSection.style.display = 'block';
    discordSection.style.opacity = '0';
    discordSection.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
        discordSection.style.opacity = '1';
        discordSection.style.transform = 'translateY(0)';
    }, 100);
}

// Обработчики событий для интерактивности
document.addEventListener('DOMContentLoaded', () => {
    // Запускаем анимацию орла
    animateEagle();
    
    // Запускаем анимацию загрузочного текста
    animateLoadingText();
    
    // Добавляем обработчики для наведения на орла
    const eagle = document.getElementById('eagle');
    eagle.addEventListener('mouseenter', () => {
        if (!eagle.classList.contains('eagle-zoom')) {
            eagle.style.transform = 'scale(1.1) translateZ(10px)';
        }
    });
    
    eagle.addEventListener('mouseleave', () => {
        if (!eagle.classList.contains('eagle-zoom')) {
            eagle.style.transform = 'scale(1) translateZ(0)';
        }
    });
    
    // Добавляем обработчики для звезд
    const stars = document.querySelectorAll('.star-logo');
    stars.forEach(star => {
        star.addEventListener('mouseenter', () => {
            star.style.transform = 'scale(1.2) rotate(10deg)';
        });
        
        star.addEventListener('mouseleave', () => {
            star.style.transform = 'scale(1) rotate(0deg)';
        });
    });
    
    // Обработчик для кнопки Discord
    const discordButton = document.querySelector('.discord-button');
    if (discordButton) {
        discordButton.addEventListener('click', (e) => {
            // Добавляем эффект клика
            discordButton.style.transform = 'translateY(-1px) scale(0.98)';
            setTimeout(() => {
                discordButton.style.transform = 'translateY(-3px) scale(1)';
            }, 150);
        });
    }
});

// Обработчик для пропуска анимаций (клик по экрану)
document.addEventListener('click', (e) => {
    // Пропускаем, если клик по кнопке Discord
    if (e.target.closest('.discord-button')) {
        return;
    }
    
    const loadingScreen = document.getElementById('loading-screen');
    const starPage = document.getElementById('star-page');
    const finalPage = document.getElementById('final-page');
    
    // Если загрузочный экран активен, пропускаем его
    if (loadingScreen.style.display !== 'none' && loadingScreen.style.opacity !== '0') {
        hideLoadingScreen();
        return;
    }
    
    // Если на странице со звездой и не печатаем текст, переходим к следующему тексту
    if (starPage.classList.contains('active') && !isTyping) {
        if (currentStoryIndex < storyTexts.length - 1) {
            currentStoryIndex = storyTexts.length - 1;
            const storyText = document.getElementById('story-text');
            storyText.innerHTML = storyTexts[currentStoryIndex];
            storyText.style.borderRight = 'none';
            
            setTimeout(() => {
                showFinalPage();
            }, 1000);
        }
    }
    
    // Если на финальной странице и не печатаем текст, показываем Discord
    if (finalPage.classList.contains('active') && !isTyping) {
        const discordSection = document.getElementById('discord-section');
        if (discordSection.style.display === 'none') {
            const finalText = document.getElementById('final-text');
            finalText.innerHTML = finalTexts[finalTexts.length - 1];
            finalText.style.borderRight = 'none';
            showDiscordSection();
        }
    }
});

// Обработчик для клавиши Escape (полный пропуск)
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const loadingScreen = document.getElementById('loading-screen');
        const mainContent = document.getElementById('main-content');
        const starPage = document.getElementById('star-page');
        const finalPage = document.getElementById('final-page');
        const finalText = document.getElementById('final-text');
        const discordSection = document.getElementById('discord-section');
        
        // Скрываем загрузочный экран
        loadingScreen.style.display = 'none';
        mainContent.classList.remove('hidden');
        
        // Переходим сразу к финальной странице
        starPage.classList.remove('active');
        finalPage.classList.add('active');
        
        // Показываем финальный текст и Discord
        finalText.innerHTML = finalTexts[finalTexts.length - 1];
        finalText.style.borderRight = 'none';
        showDiscordSection();
    }
});

// Функция для адаптивности
function handleResize() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

window.addEventListener('resize', handleResize);
handleResize();

// Предзагрузка изображений
function preloadImages() {
    const images = ['Group 27.png', 'актив.png', 'meta-bg.webp'];
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Запускаем предзагрузку при загрузке страницы
preloadImages();
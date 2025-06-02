// Интерфейсы для типизации
interface AnimationConfig {
    duration: number;
    easing: string;
    delay?: number;
}

interface TextAnimationOptions {
    speed: number;
    cursor: boolean;
    sound?: boolean;
}

interface EagleAnimationState {
    isBlinking: boolean;
    isZooming: boolean;
    isHovering: boolean;
}

// Класс для управления анимациями орла
class EagleController {
    private element: HTMLElement;
    private state: EagleAnimationState;
    private animationQueue: Array<() => Promise<void>>;

    constructor(elementId: string) {
        this.element = document.getElementById(elementId) as HTMLElement;
        this.state = {
            isBlinking: false,
            isZooming: false,
            isHovering: false
        };
        this.animationQueue = [];
        this.initializeEventListeners();
    }

    private initializeEventListeners(): void {
        this.element.addEventListener('mouseenter', () => this.handleMouseEnter());
        this.element.addEventListener('mouseleave', () => this.handleMouseLeave());
        this.element.addEventListener('click', () => this.handleClick());
    }

    private handleMouseEnter(): void {
        if (!this.state.isZooming) {
            this.state.isHovering = true;
            this.element.style.transform = 'scale(1.1) translateZ(10px)';
            this.element.style.filter = 'drop-shadow(0 0 30px rgba(151, 167, 255, 0.8))';
        }
    }

    private handleMouseLeave(): void {
        if (!this.state.isZooming) {
            this.state.isHovering = false;
            this.element.style.transform = 'scale(1) translateZ(0)';
            this.element.style.filter = 'drop-shadow(0 0 20px rgba(151, 167, 255, 0.5))';
        }
    }

    private handleClick(): void {
        this.performWingFlap();
    }

    public async blink(): Promise<void> {
        if (this.state.isBlinking) return;
        
        this.state.isBlinking = true;
        this.element.classList.add('eagle-blink');
        
        return new Promise((resolve) => {
            setTimeout(() => {
                this.element.classList.remove('eagle-blink');
                this.state.isBlinking = false;
                resolve();
            }, 500);
        });
    }

    public async zoom(): Promise<void> {
        if (this.state.isZooming) return;
        
        this.state.isZooming = true;
        this.element.classList.add('eagle-zoom');
        
        return new Promise((resolve) => {
            setTimeout(() => {
                this.element.classList.remove('eagle-zoom');
                this.state.isZooming = false;
                resolve();
            }, 2000);
        });
    }

    private async performWingFlap(): Promise<void> {
        const originalTransform = this.element.style.transform;
        
        // Анимация взмаха крыла
        this.element.style.transition = 'transform 0.2s ease-out';
        this.element.style.transform = 'scale(1.2) rotate(5deg) translateZ(15px)';
        
        setTimeout(() => {
            this.element.style.transform = 'scale(1.1) rotate(-2deg) translateZ(8px)';
            
            setTimeout(() => {
                this.element.style.transform = originalTransform;
                this.element.style.transition = 'all 0.3s ease';
            }, 200);
        }, 200);
    }

    public async performSequence(): Promise<void> {
        // Последовательность анимаций орла
        await new Promise(resolve => setTimeout(resolve, 2000));
        await this.blink();
        await new Promise(resolve => setTimeout(resolve, 1000));
        await this.zoom();
    }
}

// Класс для управления анимациями звезд
class StarController {
    private stars: NodeListOf<HTMLElement>;
    private animationStates: Map<HTMLElement, boolean>;

    constructor() {
        this.stars = document.querySelectorAll('.star-logo') as NodeListOf<HTMLElement>;
        this.animationStates = new Map();
        this.initializeStars();
    }

    private initializeStars(): void {
        this.stars.forEach((star, index) => {
            this.animationStates.set(star, false);
            
            star.addEventListener('mouseenter', () => this.handleStarHover(star));
            star.addEventListener('mouseleave', () => this.handleStarLeave(star));
            star.addEventListener('click', () => this.handleStarClick(star));
            
            // Запускаем анимацию появления с задержкой
            setTimeout(() => {
                this.animateStarAppearance(star, index);
            }, index * 500);
        });
    }

    private handleStarHover(star: HTMLElement): void {
        if (!this.animationStates.get(star)) {
            star.style.transform = 'scale(1.2) rotate(10deg)';
            star.style.filter = 'drop-shadow(0 0 35px rgba(151, 167, 255, 0.9))';
        }
    }

    private handleStarLeave(star: HTMLElement): void {
        if (!this.animationStates.get(star)) {
            star.style.transform = 'scale(1) rotate(0deg)';
            star.style.filter = 'drop-shadow(0 0 25px rgba(151, 167, 255, 0.7))';
        }
    }

    private handleStarClick(star: HTMLElement): void {
        this.performStarPulse(star);
    }

    private async animateStarAppearance(star: HTMLElement, index: number): Promise<void> {
        this.animationStates.set(star, true);
        
        const animationName = index === 0 ? 'starAppear' : 'starAppear2';
        star.style.animation = `${animationName} 2s ease-out forwards`;
        
        setTimeout(() => {
            this.animationStates.set(star, false);
        }, 2000);
    }

    private async performStarPulse(star: HTMLElement): Promise<void> {
        this.animationStates.set(star, true);
        
        const originalTransform = star.style.transform;
        const pulseKeyframes = [
            { transform: 'scale(1) rotate(0deg)', filter: 'drop-shadow(0 0 25px rgba(151, 167, 255, 0.7))' },
            { transform: 'scale(1.5) rotate(180deg)', filter: 'drop-shadow(0 0 50px rgba(151, 167, 255, 1))' },
            { transform: 'scale(1) rotate(360deg)', filter: 'drop-shadow(0 0 25px rgba(151, 167, 255, 0.7))' }
        ];
        
        const animation = star.animate(pulseKeyframes, {
            duration: 1000,
            easing: 'ease-in-out'
        });
        
        animation.onfinish = () => {
            this.animationStates.set(star, false);
        };
    }
}

// Класс для управления текстовыми анимациями
class TextAnimator {
    private currentElement: HTMLElement | null = null;
    private isAnimating: boolean = false;
    private typewriterSound: HTMLAudioElement | null = null;

    constructor() {
        this.initializeSound();
    }

    private initializeSound(): void {
        // Создаем звук печатной машинки (опционально)
        try {
            this.typewriterSound = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
        } catch (e) {
            console.log('Sound not available');
        }
    }

    public async typeText(element: HTMLElement, text: string, options: TextAnimationOptions = { speed: 50, cursor: true }): Promise<void> {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        this.currentElement = element;
        
        element.innerHTML = '';
        if (options.cursor) {
            element.style.borderRight = '3px solid #97a7ff';
        }
        
        return new Promise((resolve) => {
            let i = 0;
            const timer = setInterval(() => {
                if (i < text.length) {
                    element.innerHTML += text.charAt(i);
                    
                    // Воспроизводим звук (если доступен)
                    if (options.sound && this.typewriterSound) {
                        this.typewriterSound.currentTime = 0;
                        this.typewriterSound.play().catch(() => {});
                    }
                    
                    i++;
                } else {
                    clearInterval(timer);
                    
                    setTimeout(() => {
                        if (options.cursor) {
                            element.style.borderRight = 'none';
                        }
                        this.isAnimating = false;
                        this.currentElement = null;
                        resolve();
                    }, 1000);
                }
            }, options.speed);
        });
    }

    public async eraseText(element: HTMLElement, speed: number = 30): Promise<void> {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        this.currentElement = element;
        
        const text = element.innerHTML;
        element.style.borderRight = '3px solid #97a7ff';
        
        return new Promise((resolve) => {
            let i = text.length;
            const timer = setInterval(() => {
                if (i > 0) {
                    element.innerHTML = text.substring(0, i - 1);
                    i--;
                } else {
                    clearInterval(timer);
                    element.style.borderRight = 'none';
                    this.isAnimating = false;
                    this.currentElement = null;
                    resolve();
                }
            }, speed);
        });
    }

    public isCurrentlyAnimating(): boolean {
        return this.isAnimating;
    }

    public skipCurrentAnimation(): void {
        if (this.currentElement && this.isAnimating) {
            this.isAnimating = false;
            this.currentElement.style.borderRight = 'none';
        }
    }
}

// Класс для управления переходами между страницами
class PageTransitionManager {
    private currentPage: string = 'loading';
    private pages: Map<string, HTMLElement>;
    private transitionDuration: number = 1000;

    constructor() {
        this.pages = new Map();
        this.initializePages();
    }

    private initializePages(): void {
        const pageElements = {
            'loading': document.getElementById('loading-screen'),
            'star': document.getElementById('star-page'),
            'final': document.getElementById('final-page')
        };

        Object.entries(pageElements).forEach(([key, element]) => {
            if (element) {
                this.pages.set(key, element);
            }
        });
    }

    public async transitionTo(pageName: string): Promise<void> {
        const currentPageElement = this.pages.get(this.currentPage);
        const targetPageElement = this.pages.get(pageName);

        if (!targetPageElement) {
            console.error(`Page ${pageName} not found`);
            return;
        }

        // Скрываем текущую страницу
        if (currentPageElement) {
            if (this.currentPage === 'loading') {
                currentPageElement.style.opacity = '0';
                setTimeout(() => {
                    currentPageElement.style.display = 'none';
                }, this.transitionDuration);
            } else {
                currentPageElement.classList.remove('active');
            }
        }

        // Показываем целевую страницу
        setTimeout(() => {
            if (pageName === 'star' || pageName === 'final') {
                const mainContent = document.getElementById('main-content');
                if (mainContent) {
                    mainContent.classList.remove('hidden');
                }
                targetPageElement.classList.add('active');
            }
            
            this.currentPage = pageName;
        }, this.currentPage === 'loading' ? this.transitionDuration : 0);
    }

    public getCurrentPage(): string {
        return this.currentPage;
    }
}

// Главный класс приложения
class LiteRPApp {
    private eagleController: EagleController;
    private starController: StarController;
    private textAnimator: TextAnimator;
    private pageManager: PageTransitionManager;
    private storyTexts: string[];
    private finalTexts: string[];
    private currentStoryIndex: number = 0;

    constructor() {
        this.storyTexts = [
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

        this.finalTexts = [
            "Прости... Но мы разрабатываем наш Lite сервер...",
            "Но скоро мы откроем двери в удивительный мир будущего!"
        ];

        this.initialize();
    }

    private async initialize(): Promise<void> {
        // Инициализируем контроллеры
        this.eagleController = new EagleController('eagle');
        this.starController = new StarController();
        this.textAnimator = new TextAnimator();
        this.pageManager = new PageTransitionManager();

        // Запускаем последовательность загрузки
        await this.startLoadingSequence();
    }

    private async startLoadingSequence(): Promise<void> {
        // Анимация орла
        this.eagleController.performSequence();

        // Анимация загрузочного текста
        this.animateLoadingText();

        // Переход к основному контенту через 7 секунд
        setTimeout(() => {
            this.transitionToStoryPage();
        }, 7000);
    }

    private animateLoadingText(): void {
        const loadingDots = document.getElementById('loading-dots');
        if (!loadingDots) return;

        let dotCount = 0;
        const dotInterval = setInterval(() => {
            dotCount = (dotCount + 1) % 4;
            loadingDots.textContent = '.'.repeat(dotCount);
        }, 500);

        setTimeout(() => {
            clearInterval(dotInterval);
        }, 6000);
    }

    private async transitionToStoryPage(): Promise<void> {
        await this.pageManager.transitionTo('star');
        setTimeout(() => {
            this.startStoryAnimation();
        }, 1000);
    }

    private async startStoryAnimation(): Promise<void> {
        const storyTextElement = document.getElementById('story-text');
        if (!storyTextElement) return;

        for (let i = 0; i < this.storyTexts.length; i++) {
            this.currentStoryIndex = i;

            await this.textAnimator.typeText(storyTextElement, this.storyTexts[i], { speed: 60, cursor: true });
            await new Promise(resolve => setTimeout(resolve, 2000));

            if (i < this.storyTexts.length - 1) {
                await this.textAnimator.eraseText(storyTextElement, 40);
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }

        setTimeout(() => {
            this.transitionToFinalPage();
        }, 2000);
    }

    private async transitionToFinalPage(): Promise<void> {
        await this.pageManager.transitionTo('final');
        setTimeout(() => {
            this.startFinalAnimation();
        }, 1000);
    }

    private async startFinalAnimation(): Promise<void> {
        const finalTextElement = document.getElementById('final-text');
        if (!finalTextElement) return;

        for (let i = 0; i < this.finalTexts.length; i++) {
            await this.textAnimator.typeText(finalTextElement, this.finalTexts[i], { speed: 70, cursor: true });
            await new Promise(resolve => setTimeout(resolve, 2000));

            if (i < this.finalTexts.length - 1) {
                await this.textAnimator.eraseText(finalTextElement, 50);
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }

        setTimeout(() => {
            this.showDiscordSection();
        }, 1500);
    }

    private showDiscordSection(): void {
        const discordSection = document.getElementById('discord-section');
        if (!discordSection) return;

        discordSection.style.display = 'block';
        discordSection.style.opacity = '0';
        discordSection.style.transform = 'translateY(30px)';

        setTimeout(() => {
            discordSection.style.opacity = '1';
            discordSection.style.transform = 'translateY(0)';
        }, 100);
    }

    // Публичные методы для управления приложением
    public skipToEnd(): void {
        this.textAnimator.skipCurrentAnimation();
        this.pageManager.transitionTo('final');
        
        setTimeout(() => {
            const finalTextElement = document.getElementById('final-text');
            if (finalTextElement) {
                finalTextElement.innerHTML = this.finalTexts[this.finalTexts.length - 1];
                finalTextElement.style.borderRight = 'none';
            }
            this.showDiscordSection();
        }, 1000);
    }

    public getCurrentState(): { page: string; storyIndex: number; isAnimating: boolean } {
        return {
            page: this.pageManager.getCurrentPage(),
            storyIndex: this.currentStoryIndex,
            isAnimating: this.textAnimator.isCurrentlyAnimating()
        };
    }
}

// Экспорт для использования в других файлах
export { LiteRPApp, EagleController, StarController, TextAnimator, PageTransitionManager };

// Глобальная инициализация
declare global {
    interface Window {
        LiteRPApp: typeof LiteRPApp;
        liteApp: LiteRPApp;
    }
}

// Автоматический запуск при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    window.liteApp = new LiteRPApp();
    window.LiteRPApp = LiteRPApp;
});
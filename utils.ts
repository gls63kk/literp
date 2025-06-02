// Утилиты для работы с анимациями и эффектами

// Интерфейсы
interface Point {
    x: number;
    y: number;
}

interface AnimationEasing {
    linear: string;
    easeIn: string;
    easeOut: string;
    easeInOut: string;
    bounce: string;
    elastic: string;
}

// Константы для анимаций
export const ANIMATION_EASINGS: AnimationEasing = {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    elastic: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
};

export const ANIMATION_DURATIONS = {
    fast: 200,
    normal: 300,
    slow: 500,
    verySlow: 1000
};

// Класс для работы с DOM элементами
export class DOMUtils {
    static createElement(tag: string, className?: string, textContent?: string): HTMLElement {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (textContent) element.textContent = textContent;
        return element;
    }

    static getElement(selector: string): HTMLElement | null {
        return document.querySelector(selector);
    }

    static getAllElements(selector: string): NodeListOf<HTMLElement> {
        return document.querySelectorAll(selector);
    }

    static addClass(element: HTMLElement, className: string): void {
        element.classList.add(className);
    }

    static removeClass(element: HTMLElement, className: string): void {
        element.classList.remove(className);
    }

    static toggleClass(element: HTMLElement, className: string): void {
        element.classList.toggle(className);
    }

    static hasClass(element: HTMLElement, className: string): boolean {
        return element.classList.contains(className);
    }

    static setStyle(element: HTMLElement, property: string, value: string): void {
        (element.style as any)[property] = value;
    }

    static getStyle(element: HTMLElement, property: string): string {
        return getComputedStyle(element).getPropertyValue(property);
    }
}

// Класс для работы с анимациями
export class AnimationUtils {
    static fadeIn(element: HTMLElement, duration: number = ANIMATION_DURATIONS.normal): Promise<void> {
        return new Promise((resolve) => {
            element.style.opacity = '0';
            element.style.transition = `opacity ${duration}ms ${ANIMATION_EASINGS.easeOut}`;
            
            requestAnimationFrame(() => {
                element.style.opacity = '1';
                setTimeout(resolve, duration);
            });
        });
    }

    static fadeOut(element: HTMLElement, duration: number = ANIMATION_DURATIONS.normal): Promise<void> {
        return new Promise((resolve) => {
            element.style.transition = `opacity ${duration}ms ${ANIMATION_EASINGS.easeIn}`;
            element.style.opacity = '0';
            setTimeout(resolve, duration);
        });
    }

    static slideIn(element: HTMLElement, direction: 'up' | 'down' | 'left' | 'right' = 'up', duration: number = ANIMATION_DURATIONS.normal): Promise<void> {
        return new Promise((resolve) => {
            const transforms = {
                up: 'translateY(100%)',
                down: 'translateY(-100%)',
                left: 'translateX(100%)',
                right: 'translateX(-100%)'
            };

            element.style.transform = transforms[direction];
            element.style.transition = `transform ${duration}ms ${ANIMATION_EASINGS.easeOut}`;
            
            requestAnimationFrame(() => {
                element.style.transform = 'translate(0, 0)';
                setTimeout(resolve, duration);
            });
        });
    }

    static slideOut(element: HTMLElement, direction: 'up' | 'down' | 'left' | 'right' = 'up', duration: number = ANIMATION_DURATIONS.normal): Promise<void> {
        return new Promise((resolve) => {
            const transforms = {
                up: 'translateY(-100%)',
                down: 'translateY(100%)',
                left: 'translateX(-100%)',
                right: 'translateX(100%)'
            };

            element.style.transition = `transform ${duration}ms ${ANIMATION_EASINGS.easeIn}`;
            element.style.transform = transforms[direction];
            setTimeout(resolve, duration);
        });
    }

    static scale(element: HTMLElement, scale: number, duration: number = ANIMATION_DURATIONS.normal): Promise<void> {
        return new Promise((resolve) => {
            element.style.transition = `transform ${duration}ms ${ANIMATION_EASINGS.bounce}`;
            element.style.transform = `scale(${scale})`;
            setTimeout(() => {
                element.style.transform = 'scale(1)';
                setTimeout(resolve, duration);
            }, duration);
        });
    }

    static rotate(element: HTMLElement, degrees: number, duration: number = ANIMATION_DURATIONS.normal): Promise<void> {
        return new Promise((resolve) => {
            element.style.transition = `transform ${duration}ms ${ANIMATION_EASINGS.easeInOut}`;
            element.style.transform = `rotate(${degrees}deg)`;
            setTimeout(resolve, duration);
        });
    }

    static pulse(element: HTMLElement, scale: number = 1.1, duration: number = ANIMATION_DURATIONS.fast): Promise<void> {
        return new Promise((resolve) => {
            const originalTransform = element.style.transform;
            element.style.transition = `transform ${duration}ms ${ANIMATION_EASINGS.easeOut}`;
            element.style.transform = `scale(${scale})`;
            
            setTimeout(() => {
                element.style.transform = originalTransform;
                setTimeout(resolve, duration);
            }, duration);
        });
    }

    static shake(element: HTMLElement, intensity: number = 10, duration: number = ANIMATION_DURATIONS.normal): Promise<void> {
        return new Promise((resolve) => {
            const originalTransform = element.style.transform;
            const keyframes = [];
            const steps = 10;
            
            for (let i = 0; i <= steps; i++) {
                const progress = i / steps;
                const amplitude = intensity * (1 - progress);
                const x = Math.sin(progress * Math.PI * 4) * amplitude;
                keyframes.push({ transform: `translateX(${x}px)` });
            }
            
            const animation = element.animate(keyframes, {
                duration,
                easing: ANIMATION_EASINGS.easeOut
            });
            
            animation.onfinish = () => {
                element.style.transform = originalTransform;
                resolve();
            };
        });
    }
}

// Класс для работы с цветами
export class ColorUtils {
    static hexToRgb(hex: string): { r: number; g: number; b: number } | null {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    static rgbToHex(r: number, g: number, b: number): string {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    static interpolateColor(color1: string, color2: string, factor: number): string {
        const rgb1 = this.hexToRgb(color1);
        const rgb2 = this.hexToRgb(color2);
        
        if (!rgb1 || !rgb2) return color1;
        
        const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * factor);
        const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * factor);
        const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * factor);
        
        return this.rgbToHex(r, g, b);
    }

    static addAlpha(color: string, alpha: number): string {
        const rgb = this.hexToRgb(color);
        if (!rgb) return color;
        
        return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
    }
}

// Класс для работы с математическими функциями
export class MathUtils {
    static lerp(start: number, end: number, factor: number): number {
        return start + (end - start) * factor;
    }

    static clamp(value: number, min: number, max: number): number {
        return Math.min(Math.max(value, min), max);
    }

    static map(value: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
        return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
    }

    static distance(point1: Point, point2: Point): number {
        const dx = point2.x - point1.x;
        const dy = point2.y - point1.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    static randomBetween(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }

    static randomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static easeInOut(t: number): number {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    static easeIn(t: number): number {
        return t * t;
    }

    static easeOut(t: number): number {
        return t * (2 - t);
    }

    static bounce(t: number): number {
        if (t < 1 / 2.75) {
            return 7.5625 * t * t;
        } else if (t < 2 / 2.75) {
            return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
        } else if (t < 2.5 / 2.75) {
            return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
        } else {
            return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
        }
    }
}

// Класс для работы с событиями
export class EventUtils {
    private static listeners: Map<string, Array<{ element: HTMLElement; callback: EventListener }>> = new Map();

    static on(element: HTMLElement, event: string, callback: EventListener, options?: AddEventListenerOptions): void {
        element.addEventListener(event, callback, options);
        
        const key = `${event}_${Date.now()}_${Math.random()}`;
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event)!.push({ element, callback });
    }

    static off(element: HTMLElement, event: string, callback: EventListener): void {
        element.removeEventListener(event, callback);
        
        const eventListeners = this.listeners.get(event);
        if (eventListeners) {
            const index = eventListeners.findIndex(listener => 
                listener.element === element && listener.callback === callback
            );
            if (index !== -1) {
                eventListeners.splice(index, 1);
            }
        }
    }

    static once(element: HTMLElement, event: string, callback: EventListener): void {
        const onceCallback = (e: Event) => {
            callback(e);
            this.off(element, event, onceCallback);
        };
        this.on(element, event, onceCallback);
    }

    static trigger(element: HTMLElement, event: string, detail?: any): void {
        const customEvent = new CustomEvent(event, { detail });
        element.dispatchEvent(customEvent);
    }

    static debounce(func: Function, wait: number): Function {
        let timeout: NodeJS.Timeout;
        return function executedFunction(...args: any[]) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    static throttle(func: Function, limit: number): Function {
        let inThrottle: boolean;
        return function executedFunction(...args: any[]) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Класс для работы с локальным хранилищем
export class StorageUtils {
    static set(key: string, value: any): void {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error('Error saving to localStorage:', e);
        }
    }

    static get(key: string): any {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            console.error('Error reading from localStorage:', e);
            return null;
        }
    }

    static remove(key: string): void {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.error('Error removing from localStorage:', e);
        }
    }

    static clear(): void {
        try {
            localStorage.clear();
        } catch (e) {
            console.error('Error clearing localStorage:', e);
        }
    }

    static has(key: string): boolean {
        return localStorage.getItem(key) !== null;
    }
}

// Класс для работы с устройством
export class DeviceUtils {
    static isMobile(): boolean {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    static isTablet(): boolean {
        return /iPad|Android/i.test(navigator.userAgent) && window.innerWidth >= 768;
    }

    static isDesktop(): boolean {
        return !this.isMobile() && !this.isTablet();
    }

    static getViewportSize(): { width: number; height: number } {
        return {
            width: window.innerWidth,
            height: window.innerHeight
        };
    }

    static getScreenSize(): { width: number; height: number } {
        return {
            width: screen.width,
            height: screen.height
        };
    }

    static supportsTouch(): boolean {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }

    static getOrientation(): 'portrait' | 'landscape' {
        return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
    }
}

// Класс для работы с производительностью
export class PerformanceUtils {
    private static marks: Map<string, number> = new Map();

    static mark(name: string): void {
        this.marks.set(name, performance.now());
    }

    static measure(name: string, startMark: string): number {
        const startTime = this.marks.get(startMark);
        if (startTime === undefined) {
            console.warn(`Start mark "${startMark}" not found`);
            return 0;
        }
        
        const duration = performance.now() - startTime;
        console.log(`${name}: ${duration.toFixed(2)}ms`);
        return duration;
    }

    static requestAnimationFrame(callback: FrameRequestCallback): number {
        return requestAnimationFrame(callback);
    }

    static cancelAnimationFrame(id: number): void {
        cancelAnimationFrame(id);
    }

    static defer(callback: Function): void {
        setTimeout(callback, 0);
    }

    static nextTick(callback: Function): void {
        Promise.resolve().then(() => callback());
    }
}

// Экспорт всех утилит
export {
    DOMUtils,
    AnimationUtils,
    ColorUtils,
    MathUtils,
    EventUtils,
    StorageUtils,
    DeviceUtils,
    PerformanceUtils
};
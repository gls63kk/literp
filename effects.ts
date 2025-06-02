// Эффекты и анимации для сайта Lite RP

import { AnimationUtils, DOMUtils, MathUtils, ColorUtils } from './utils';

// Интерфейсы для эффектов
interface ParticleConfig {
    count: number;
    size: { min: number; max: number };
    speed: { min: number; max: number };
    color: string;
    opacity: { min: number; max: number };
    lifetime: number;
}

interface GlowConfig {
    color: string;
    intensity: number;
    radius: number;
    pulse: boolean;
    pulseSpeed: number;
}

// Класс для создания частиц
export class ParticleSystem {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private particles: Particle[] = [];
    private animationId: number = 0;
    private isRunning: boolean = false;

    constructor(containerId: string) {
        const container = document.getElementById(containerId);
        if (!container) {
            throw new Error(`Container with id "${containerId}" not found`);
        }

        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '1';
        
        container.appendChild(this.canvas);
        
        const context = this.canvas.getContext('2d');
        if (!context) {
            throw new Error('Could not get 2D context');
        }
        this.ctx = context;

        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    private resize(): void {
        const rect = this.canvas.parentElement!.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        this.canvas.style.width = `${rect.width}px`;
        this.canvas.style.height = `${rect.height}px`;
    }

    public start(config: ParticleConfig): void {
        this.stop();
        this.createParticles(config);
        this.isRunning = true;
        this.animate();
    }

    public stop(): void {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        this.particles = [];
    }

    private createParticles(config: ParticleConfig): void {
        for (let i = 0; i < config.count; i++) {
            this.particles.push(new Particle(this.canvas.width, this.canvas.height, config));
        }
    }

    private animate(): void {
        if (!this.isRunning) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach((particle, index) => {
            particle.update();
            particle.draw(this.ctx);

            if (particle.isDead()) {
                this.particles.splice(index, 1);
            }
        });

        this.animationId = requestAnimationFrame(() => this.animate());
    }
}

// Класс частицы
class Particle {
    private x: number;
    private y: number;
    private vx: number;
    private vy: number;
    private size: number;
    private color: string;
    private opacity: number;
    private life: number;
    private maxLife: number;

    constructor(canvasWidth: number, canvasHeight: number, config: ParticleConfig) {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.vx = MathUtils.randomBetween(config.speed.min, config.speed.max) * (Math.random() > 0.5 ? 1 : -1);
        this.vy = MathUtils.randomBetween(config.speed.min, config.speed.max) * (Math.random() > 0.5 ? 1 : -1);
        this.size = MathUtils.randomBetween(config.size.min, config.size.max);
        this.color = config.color;
        this.opacity = MathUtils.randomBetween(config.opacity.min, config.opacity.max);
        this.life = config.lifetime;
        this.maxLife = config.lifetime;
    }

    public update(): void {
        this.x += this.vx;
        this.y += this.vy;
        this.life--;
        this.opacity = (this.life / this.maxLife) * 0.8;
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    public isDead(): boolean {
        return this.life <= 0;
    }
}

// Класс для создания эффекта свечения
export class GlowEffect {
    private element: HTMLElement;
    private originalBoxShadow: string;
    private animationId: number = 0;
    private isAnimating: boolean = false;

    constructor(element: HTMLElement) {
        this.element = element;
        this.originalBoxShadow = getComputedStyle(element).boxShadow;
    }

    public start(config: GlowConfig): void {
        this.stop();
        this.isAnimating = true;

        if (config.pulse) {
            this.animatePulse(config);
        } else {
            this.applyStaticGlow(config);
        }
    }

    public stop(): void {
        this.isAnimating = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        this.element.style.boxShadow = this.originalBoxShadow;
    }

    private applyStaticGlow(config: GlowConfig): void {
        const shadow = `0 0 ${config.radius}px ${config.color}`;
        this.element.style.boxShadow = shadow;
    }

    private animatePulse(config: GlowConfig): void {
        let startTime = 0;

        const animate = (currentTime: number) => {
            if (!this.isAnimating) return;

            if (!startTime) startTime = currentTime;
            const elapsed = currentTime - startTime;
            const progress = (elapsed % config.pulseSpeed) / config.pulseSpeed;
            
            const intensity = (Math.sin(progress * Math.PI * 2) + 1) / 2;
            const currentRadius = config.radius * (0.5 + intensity * 0.5);
            const currentOpacity = config.intensity * (0.3 + intensity * 0.7);
            
            const color = ColorUtils.addAlpha(config.color, currentOpacity);
            const shadow = `0 0 ${currentRadius}px ${color}`;
            this.element.style.boxShadow = shadow;

            this.animationId = requestAnimationFrame(animate);
        };

        this.animationId = requestAnimationFrame(animate);
    }
}

// Класс для создания эффекта печатной машинки с дополнительными возможностями
export class AdvancedTypewriter {
    private element: HTMLElement;
    private isTyping: boolean = false;
    private currentText: string = '';
    private cursorElement: HTMLElement | null = null;

    constructor(element: HTMLElement) {
        this.element = element;
        this.createCursor();
    }

    private createCursor(): void {
        this.cursorElement = document.createElement('span');
        this.cursorElement.className = 'typewriter-cursor';
        this.cursorElement.textContent = '|';
        this.cursorElement.style.animation = 'blink 1s infinite';
        this.cursorElement.style.color = '#97a7ff';
        this.cursorElement.style.fontWeight = 'bold';
    }

    public async type(text: string, options: {
        speed?: number;
        showCursor?: boolean;
        sound?: boolean;
        randomDelay?: boolean;
        highlightWords?: string[];
    } = {}): Promise<void> {
        const {
            speed = 50,
            showCursor = true,
            sound = false,
            randomDelay = false,
            highlightWords = []
        } = options;

        if (this.isTyping) return;

        this.isTyping = true;
        this.currentText = '';
        this.element.innerHTML = '';

        if (showCursor && this.cursorElement) {
            this.element.appendChild(this.cursorElement);
        }

        return new Promise((resolve) => {
            let i = 0;
            const typeChar = () => {
                if (i < text.length && this.isTyping) {
                    const char = text.charAt(i);
                    this.currentText += char;
                    
                    // Проверяем, нужно ли выделить слово
                    let displayText = this.currentText;
                    highlightWords.forEach(word => {
                        const regex = new RegExp(`\\b${word}\\b`, 'gi');
                        displayText = displayText.replace(regex, `<span class="highlight">${word}</span>`);
                    });
                    
                    this.element.innerHTML = displayText;
                    if (showCursor && this.cursorElement) {
                        this.element.appendChild(this.cursorElement);
                    }

                    i++;
                    
                    const delay = randomDelay ? speed + Math.random() * 50 : speed;
                    setTimeout(typeChar, delay);
                } else {
                    this.isTyping = false;
                    if (this.cursorElement) {
                        setTimeout(() => {
                            if (this.cursorElement && this.cursorElement.parentNode) {
                                this.cursorElement.parentNode.removeChild(this.cursorElement);
                            }
                        }, 1000);
                    }
                    resolve();
                }
            };

            typeChar();
        });
    }

    public async erase(speed: number = 30): Promise<void> {
        if (this.isTyping) return;

        this.isTyping = true;

        return new Promise((resolve) => {
            const eraseChar = () => {
                if (this.currentText.length > 0 && this.isTyping) {
                    this.currentText = this.currentText.slice(0, -1);
                    this.element.innerHTML = this.currentText;
                    if (this.cursorElement) {
                        this.element.appendChild(this.cursorElement);
                    }
                    setTimeout(eraseChar, speed);
                } else {
                    this.isTyping = false;
                    resolve();
                }
            };

            eraseChar();
        });
    }

    public stop(): void {
        this.isTyping = false;
    }

    public isCurrentlyTyping(): boolean {
        return this.isTyping;
    }
}

// Класс для создания эффекта матрицы
export class MatrixEffect {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private columns: number = 0;
    private drops: number[] = [];
    private animationId: number = 0;
    private isRunning: boolean = false;

    constructor(containerId: string) {
        const container = document.getElementById(containerId);
        if (!container) {
            throw new Error(`Container with id "${containerId}" not found`);
        }

        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '0';
        this.canvas.style.opacity = '0.1';
        
        container.appendChild(this.canvas);
        
        const context = this.canvas.getContext('2d');
        if (!context) {
            throw new Error('Could not get 2D context');
        }
        this.ctx = context;

        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    private resize(): void {
        const rect = this.canvas.parentElement!.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        
        this.columns = Math.floor(this.canvas.width / 20);
        this.drops = Array(this.columns).fill(1);
    }

    public start(): void {
        this.isRunning = true;
        this.animate();
    }

    public stop(): void {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }

    private animate(): void {
        if (!this.isRunning) return;

        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = '#97a7ff';
        this.ctx.font = '15px monospace';

        for (let i = 0; i < this.drops.length; i++) {
            const text = String.fromCharCode(Math.random() * 128);
            this.ctx.fillText(text, i * 20, this.drops[i] * 20);

            if (this.drops[i] * 20 > this.canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }
            this.drops[i]++;
        }

        this.animationId = requestAnimationFrame(() => this.animate());
    }
}

// Класс для создания эффекта звездного неба
export class StarfieldEffect {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private stars: Star[] = [];
    private animationId: number = 0;
    private isRunning: boolean = false;

    constructor(containerId: string, starCount: number = 100) {
        const container = document.getElementById(containerId);
        if (!container) {
            throw new Error(`Container with id "${containerId}" not found`);
        }

        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '0';
        
        container.appendChild(this.canvas);
        
        const context = this.canvas.getContext('2d');
        if (!context) {
            throw new Error('Could not get 2D context');
        }
        this.ctx = context;

        this.resize();
        this.createStars(starCount);
        window.addEventListener('resize', () => this.resize());
    }

    private resize(): void {
        const rect = this.canvas.parentElement!.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }

    private createStars(count: number): void {
        this.stars = [];
        for (let i = 0; i < count; i++) {
            this.stars.push(new Star(this.canvas.width, this.canvas.height));
        }
    }

    public start(): void {
        this.isRunning = true;
        this.animate();
    }

    public stop(): void {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }

    private animate(): void {
        if (!this.isRunning) return;

        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.stars.forEach(star => {
            star.update();
            star.draw(this.ctx);
        });

        this.animationId = requestAnimationFrame(() => this.animate());
    }
}

// Класс звезды для эффекта звездного неба
class Star {
    private x: number;
    private y: number;
    private size: number;
    private opacity: number;
    private twinkleSpeed: number;
    private twinkleOffset: number;

    constructor(canvasWidth: number, canvasHeight: number) {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.size = Math.random() * 2 + 0.5;
        this.opacity = Math.random() * 0.8 + 0.2;
        this.twinkleSpeed = Math.random() * 0.02 + 0.01;
        this.twinkleOffset = Math.random() * Math.PI * 2;
    }

    public update(): void {
        this.twinkleOffset += this.twinkleSpeed;
        this.opacity = 0.5 + Math.sin(this.twinkleOffset) * 0.3;
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = '#97a7ff';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// Экспорт всех эффектов
export {
    ParticleSystem,
    GlowEffect,
    AdvancedTypewriter,
    MatrixEffect,
    StarfieldEffect
};
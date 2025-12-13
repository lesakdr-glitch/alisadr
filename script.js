// Theme Management
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        this.createThemeToggle();
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        localStorage.setItem('theme', theme);
        this.updateScreenshots();
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme);
    }

    createThemeToggle() {
        const themeToggle = document.createElement('button');
        themeToggle.className = 'theme-toggle';
        themeToggle.innerHTML = `
            <svg class="sun-icon" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2"/>
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="2"/>
            </svg>
            <svg class="moon-icon" viewBox="0 0 24 24" fill="none">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" stroke-width="2"/>
            </svg>
        `;

        themeToggle.addEventListener('click', () => this.toggleTheme());

        const navActions = document.querySelector('.nav-actions');
        navActions.insertBefore(themeToggle, navActions.firstChild);
    }

    updateScreenshots() {
        const screenshots = document.querySelectorAll('.screenshot-item img');
        screenshots.forEach((img, index) => {
            const baseName = `screenshot${index + 1}`;
            const extension = '.png';
            const themeSuffix = this.currentTheme === 'light' ? '-light' : '';
            img.src = `images/${baseName}${themeSuffix}${extension}`;
        });
    }
}

// Download Manager
class DownloadManager {
    constructor() {
        this.downloadUrl = '1';
        this.demoUrl = 'https://www.youtube.com/watch?v=demo_video'; // Замени на реальную ссылку демо
        this.init();
    }

    init() {
        this.setupDownloadButtons();
        this.setupDemoButtons();
    }

    setupDownloadButtons() {
        const downloadButtons = document.querySelectorAll('.btn-download, .btn-download-main');
        downloadButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleDownload();
            });
        });
    }

    setupDemoButtons() {
        const demoButtons = document.querySelectorAll('.btn-secondary');
        demoButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleDemo();
            });
        });
    }

    handleDownload() {
        // Показываем уведомление
        this.showNotification('Начинается загрузка Luno Loader...', 'success');

        // Создаем временную ссылку для загрузки
        const link = document.createElement('a');
        link.href = this.downloadUrl;
        link.download = 'LunoLoader-v2.1.exe';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Обновляем статистику
        this.updateDownloadStats();
    }

    handleDemo() {
        this.showNotification('Открываем демо видео...', 'info');
        window.open(this.demoUrl, '_blank');
    }

    updateDownloadStats() {
        let downloads = parseInt(localStorage.getItem('downloads') || '127');
        downloads++;
        localStorage.setItem('downloads', downloads.toString());
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        document.body.appendChild(notification);

        // Показываем уведомление
        setTimeout(() => notification.classList.add('show'), 100);

        // Автоматически скрываем через 3 секунды
        setTimeout(() => this.hideNotification(notification), 3000);

        // Обработчик закрытия
        notification.querySelector('.notification-close').addEventListener('click', () => {
            this.hideNotification(notification);
        });
    }

    hideNotification(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
}

// Navigation Manager
class NavigationManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupSmoothScrolling();
        this.setupMobileMenu();
        this.setupScrollEffects();
        this.setupActiveLinks();
    }

    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    setupMobileMenu() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navLinks = document.querySelector('.nav-links');

        mobileMenuBtn?.addEventListener('click', () => {
            navLinks?.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });

        // Закрываем меню при клике на ссылку
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks?.classList.remove('active');
                mobileMenuBtn?.classList.remove('active');
            });
        });
    }

    setupScrollEffects() {
        window.addEventListener('scroll', () => {
            const navbar = document.querySelector('.navbar');
            if (window.scrollY > 50) {
                navbar?.classList.add('scrolled');
            } else {
                navbar?.classList.remove('scrolled');
            }
        });
    }

    setupActiveLinks() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (window.scrollY >= sectionTop - 200) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }
}

// Animation Manager
class AnimationManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.createParticles();
        this.setupCounterAnimation();
    }

    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');

                    if (entry.target.classList.contains('hero-stats')) {
                        this.animateCounters();
                    }
                }
            });
        }, observerOptions);

        document.querySelectorAll('.feature-card, .screenshot-item, .hero-stats, .download-card').forEach(el => {
            observer.observe(el);
        });
    }

    setupCounterAnimation() {
        // Обновляем счетчики из localStorage
        const downloads = localStorage.getItem('downloads') || '127';
        const users = '1250';
        const bypass = '95';

        const counters = document.querySelectorAll('.stat-number');
        if (counters[0]) counters[0].setAttribute('data-count', users);
        if (counters[1]) counters[1].setAttribute('data-count', '50');
        if (counters[2]) counters[2].setAttribute('data-count', bypass);
    }

    animateCounters() {
        const counters = document.querySelectorAll('.stat-number');

        counters.forEach(counter => {
            const targetStr = counter.getAttribute('data-count');
            const target = parseInt(targetStr.replace(/,/g, ''));
            const increment = target / 100;
            let current = 0;

            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    const displayValue = Math.ceil(current);
                    counter.textContent = displayValue > 999 ?
                    (displayValue / 1000).toFixed(1) + 'k' :
                    displayValue.toLocaleString();
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target > 999 ?
                    (target / 1000).toFixed(1) + 'k' :
                    target.toLocaleString();
                }
            };

            updateCounter();
        });
    }

    createParticles() {
        const particlesContainer = document.querySelector('.hero-particles');
        if (!particlesContainer) return;

        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 20 + 's';
            particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
            particlesContainer.appendChild(particle);
        }
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
    new DownloadManager();
    new NavigationManager();
    new AnimationManager();
});
// Scroll Effects Component - Handles all scroll-based animations and effects
export class ScrollEffects {
  constructor() {
    this.init();
  }

  init() {
    this.setupParallaxEffects();
    this.setupCounterAnimation();
    this.setupScrollProgress();
    this.setupBackToTop();
    this.setupRevealOnScroll();
  }

  setupParallaxEffects() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');

    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;

      parallaxElements.forEach(element => {
        const speed = element.dataset.parallaxSpeed || 0.5;
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
      });
    });
  }

  setupCounterAnimation() {
    const counters = document.querySelectorAll('[data-counter]');

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const target = parseInt(element.dataset.counter);
          const duration = parseInt(element.dataset.duration) || 2000;
          const startTime = performance.now();

          const animateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(target * easeOutQuart);

            element.textContent = current.toLocaleString();

            if (progress < 1) {
              requestAnimationFrame(animateCounter);
            } else {
              element.textContent = target.toLocaleString();
            }
          };

          requestAnimationFrame(animateCounter);
          counterObserver.unobserve(element);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
  }

  setupScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
      const winScroll = document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;

      progressBar.style.width = scrolled + '%';

      // Change color based on scroll position
      if (scrolled > 80) {
        progressBar.style.background = 'linear-gradient(90deg, #F68A29, #FFB43C)';
      } else if (scrolled > 50) {
        progressBar.style.background = 'linear-gradient(90deg, #0087C6, #00a8e8)';
      } else {
        progressBar.style.background = 'linear-gradient(90deg, #004080, #0087C6)';
      }
    });
  }

  setupBackToTop() {
    const backToTopBtn = document.querySelector('.back-to-top');
    if (!backToTopBtn) return;

    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });

    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  setupRevealOnScroll() {
    const revealElements = document.querySelectorAll('[data-reveal]');

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const delay = element.dataset.revealDelay || 0;
          const direction = element.dataset.revealDirection || 'up';

          setTimeout(() => {
            element.classList.add('revealed');

            // Add direction-specific animation
            switch(direction) {
              case 'left':
                element.style.animation = 'revealFromLeft 0.6s ease forwards';
                break;
              case 'right':
                element.style.animation = 'revealFromRight 0.6s ease forwards';
                break;
              case 'up':
                element.style.animation = 'revealFromUp 0.6s ease forwards';
                break;
              case 'down':
                element.style.animation = 'revealFromDown 0.6s ease forwards';
                break;
              default:
                element.style.animation = 'revealFade 0.6s ease forwards';
            }
          }, delay * 1000);

          revealObserver.unobserve(element);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  // Smooth scroll to anchor links with offset
  smoothScrollTo(target, offset = 80) {
    const element = document.querySelector(target);
    if (!element) return;

    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }

  // Parallax background effect
  parallaxBackground(element, speed = 0.5) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      element.style.backgroundPositionY = `${scrolled * speed}px`;
    });
  }

  // Sticky navigation with hide/show on scroll
  setupStickyNavigation() {
    const nav = document.querySelector('.navbar');
    if (!nav) return;

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;

      if (currentScroll > lastScroll && currentScroll > 100) {
        // Scrolling down - hide nav
        nav.style.transform = 'translateY(-100%)';
      } else {
        // Scrolling up - show nav
        nav.style.transform = 'translateY(0)';
      }

      lastScroll = currentScroll;
    });
  }
}

// Add reveal animations CSS
const revealStyles = document.createElement('style');
revealStyles.textContent = `
  [data-reveal] {
    opacity: 0;
    transition: all 0.6s ease;
  }

  [data-reveal].revealed {
    opacity: 1;
  }

  @keyframes revealFromLeft {
    from {
      opacity: 0;
      transform: translateX(-50px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes revealFromRight {
    from {
      opacity: 0;
      transform: translateX(50px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes revealFromUp {
    from {
      opacity: 0;
      transform: translateY(-50px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes revealFromDown {
    from {
      opacity: 0;
      transform: translateY(50px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes revealFade {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .back-to-top {
    position: fixed;
    bottom: 90px;
    left: 24px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: var(--navy);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 999;
    border: 2px solid var(--gold);
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  }

  .back-to-top.visible {
    opacity: 1;
    visibility: visible;
  }

  .back-to-top:hover {
    transform: translateY(-5px);
    background: var(--blue);
  }

  .scroll-progress {
    position: fixed;
    top: 68px;
    left: 0;
    width: 0%;
    height: 3px;
    background: linear-gradient(90deg, var(--blue), var(--gold));
    z-index: 1000;
    transition: width 0.1s ease;
  }
`;
document.head.appendChild(revealStyles);

// Export utility functions
export const scrollUtils = {
  scrollToTop: () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  },

  scrollToElement: (selector, offset = 80) => {
    const element = document.querySelector(selector);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  },

  disableScroll: () => {
    document.body.style.overflow = 'hidden';
  },

  enableScroll: () => {
    document.body.style.overflow = '';
  },

  getScrollPosition: () => {
    return {
      x: window.pageXOffset,
      y: window.pageYOffset
    };
  },

  isElementInViewport: (element) => {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
};
// Main JavaScript - Module Imports and Initialization
import { Modal } from './components/modal.js';
import { Legal } from './components/legal.js';
import { Navigation } from './components/navigation.js';
import { Forms } from './components/forms.js';
import { ScrollEffects, scrollUtils } from './components/scroll-effects.js';
import { Jobs } from './components/jobs.js';
import { initObservers } from './utils/observers.js';

// Initialize all components when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Initialize global components
  window.modal = new Modal();
  window.legal = new Legal();
  window.navigation = new Navigation();
  window.forms = new Forms();
  window.scrollEffects = new ScrollEffects();
  window.jobs = new Jobs();

  // Initialize intersection observers for reveal animations
  initObservers();

  // Smart download function
  window.downloadApp = () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // iOS detection
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      window.location.href = "https://apps.apple.com/us/app/wazzifni-%D9%88%D8%B8%D9%81%D9%86%D9%8I/id6743117085";
      return;
    }

    // Android detection
    if (/android/i.test(userAgent)) {
      window.location.href = "https://play.google.com/store/apps/details?id=com.wazzifni.iraq";
      return;
    }

    // Fallback for desktop and others
    if (window.modal) {
      window.modal.show();
    }
  };

  // Handle navbar shadow on scroll
  handleNavbarShadow();

  // Handle mobile menu
  setupMobileMenu();

  // Add scroll progress bar
  addScrollProgressBar();

  // Add back to top button
  addBackToTopButton();
});

// Navbar shadow effect
function handleNavbarShadow() {
  const navbar = document.querySelector('.navbar');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      navbar.style.boxShadow = '0 4px 24px rgba(0,0,0,0.35)';
    } else {
      navbar.style.boxShadow = 'none';
    }
  });
}

// Mobile menu setup
function setupMobileMenu() {
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('show');

      // Add animation styles for mobile menu
      if (navLinks.classList.contains('show')) {
        navLinks.style.animation = 'slideDown 0.3s ease';
      } else {
        navLinks.style.animation = 'slideUp 0.3s ease';
      }
    });
  }
}

// Add scroll progress bar
function addScrollProgressBar() {
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  document.body.appendChild(progressBar);
}

// Add back to top button
function addBackToTopButton() {
  const backToTop = document.createElement('div');
  backToTop.className = 'back-to-top';
  backToTop.innerHTML = '↑';
  backToTop.setAttribute('aria-label', 'العودة إلى الأعلى');
  backToTop.title = 'العودة إلى الأعلى';

  backToTop.addEventListener('click', () => {
    scrollUtils.scrollToTop();
  });

  document.body.appendChild(backToTop);
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;

    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      scrollUtils.scrollToElement(href, 80);

      // Close mobile menu if open
      const navLinks = document.querySelector('.nav-links');
      if (navLinks.classList.contains('show')) {
        navLinks.classList.remove('show');
      }
    }
  });
});

// Add mobile menu styles
const mobileStyles = document.createElement('style');
mobileStyles.textContent = `
  @media (max-width: 900px) {
    .nav-links {
      position: fixed;
      top: 68px;
      left: 0;
      right: 0;
      background: var(--navy);
      flex-direction: column;
      align-items: center;
      padding: 2rem;
      gap: 1.5rem;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      display: none;
    }

    .nav-links.show {
      display: flex;
    }

    .nav-links a {
      font-size: 1.1rem;
    }
  }
`;
document.head.appendChild(mobileStyles);

// Prevent body scroll when modal/legal is open
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (window.modal && window.modal.isVisible()) {
      window.modal.hide();
    }
    if (window.legal && window.legal.isVisible()) {
      window.legal.closeAll();
    }
  }
});

// Lazy load images
if ('loading' in HTMLImageElement.prototype) {
  const images = document.querySelectorAll('img[loading="lazy"]');
  images.forEach(img => {
    img.loading = 'lazy';
  });
} else {
  // Fallback for browsers that don't support lazy loading
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
  document.body.appendChild(script);
}

// Add performance monitoring
if (window.performance) {
  window.addEventListener('load', () => {
    const timing = window.performance.timing;
    const loadTime = timing.loadEventEnd - timing.navigationStart;
    console.log(`Page load time: ${loadTime}ms`);
  });
}

// Handle offline/online status
window.addEventListener('online', () => {
  document.body.classList.remove('offline');
  window.forms.showNotification('تم استعادة الاتصال بالإنترنت', 'success');
});

window.addEventListener('offline', () => {
  document.body.classList.add('offline');
  window.forms.showNotification('لا يوجد اتصال بالإنترنت', 'error');
});
// Navigation Component
export class Navigation {
  constructor() {
    this.navbar = document.querySelector('.navbar');
    this.mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    this.navLinks = document.querySelector('.nav-links');

    this.init();
  }

  init() {
    if (this.mobileMenuBtn) {
      this.mobileMenuBtn.addEventListener('click', () => this.toggleMobileMenu());
    }

    // Close mobile menu when clicking on a link
    if (this.navLinks) {
      this.navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => this.closeMobileMenu());
      });
    }
  }

  toggleMobileMenu() {
    this.navLinks.classList.toggle('show');
  }

  closeMobileMenu() {
    this.navLinks.classList.remove('show');
  }
}
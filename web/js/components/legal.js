// Legal Pages Component
export class Legal {
  constructor() {
    this.pages = {
      terms: document.getElementById('terms'),
      privacy: document.getElementById('privacy')
    };
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Close with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isVisible()) {
        this.closeAll();
      }
    });
  }

  open(pageId) {
    if (this.pages[pageId]) {
      this.closeAll();
      this.pages[pageId].classList.add('on');
      document.body.style.overflow = 'hidden';
      window.scrollTo(0, 0);
    }
  }

  close(pageId) {
    if (this.pages[pageId]) {
      this.pages[pageId].classList.remove('on');
      document.body.style.overflow = '';
    }
  }

  closeAll() {
    Object.values(this.pages).forEach(page => {
      page.classList.remove('on');
    });
    document.body.style.overflow = '';
  }

  isVisible() {
    return Object.values(this.pages).some(page => page.classList.contains('on'));
  }
}
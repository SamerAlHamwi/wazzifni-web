// Modal Component
export class Modal {
  constructor() {
    this.modal = document.getElementById('modal');
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Close modal when clicking outside
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.hide();
      }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isVisible()) {
        this.hide();
      }
    });
  }

  show() {
    this.modal.classList.add('on');
    document.body.style.overflow = 'hidden';
  }

  hide() {
    this.modal.classList.remove('on');
    document.body.style.overflow = '';
  }

  isVisible() {
    return this.modal.classList.contains('on');
  }
}
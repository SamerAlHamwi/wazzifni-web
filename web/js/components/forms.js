// Forms Component - Handles all form interactions and validations
export class Forms {
  constructor() {
    this.forms = document.querySelectorAll('form');
    this.init();
  }

  init() {
    this.forms.forEach(form => {
      this.setupFormValidation(form);
      this.setupFormSubmission(form);
    });
  }

  setupFormValidation(form) {
    const inputs = form.querySelectorAll('input, textarea, select');

    inputs.forEach(input => {
      // Real-time validation on blur
      input.addEventListener('blur', () => {
        this.validateField(input);
      });

      // Clear error on input
      input.addEventListener('input', () => {
        this.clearFieldError(input);
      });
    });
  }

  validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    const name = field.name;
    let isValid = true;
    let errorMessage = '';

    // Required field validation
    if (field.hasAttribute('required') && !value) {
      isValid = false;
      errorMessage = 'هذا الحقل مطلوب';
    }

    // Email validation
    if (type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = 'البريد الإلكتروني غير صحيح';
      }
    }

    // Phone validation (Iraqi numbers)
    if (name === 'phone' && value) {
      const phoneRegex = /^(077|078|079|075)\d{8}$/;
      if (!phoneRegex.test(value.replace(/\s/g, ''))) {
        isValid = false;
        errorMessage = 'رقم الهاتف غير صحيح (يجب أن يبدأ بـ 077، 078، 079، 075)';
      }
    }

    // Password validation
    if (type === 'password' && value) {
      if (value.length < 6) {
        isValid = false;
        errorMessage = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
      }
    }

    if (!isValid) {
      this.showFieldError(field, errorMessage);
    }

    return isValid;
  }

  showFieldError(field, message) {
    this.clearFieldError(field);

    field.classList.add('error');

    const errorElement = document.createElement('span');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.color = '#dc3545';
    errorElement.style.fontSize = '0.8rem';
    errorElement.style.marginTop = '0.25rem';
    errorElement.style.display = 'block';

    field.parentNode.appendChild(errorElement);
  }

  clearFieldError(field) {
    field.classList.remove('error');

    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
      existingError.remove();
    }
  }

  setupFormSubmission(form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      if (this.validateForm(form)) {
        this.submitForm(form);
      }
    });
  }

  validateForm(form) {
    const inputs = form.querySelectorAll('input, textarea, select');
    let isFormValid = true;

    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isFormValid = false;
      }
    });

    return isFormValid;
  }

  async submitForm(form) {
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;

    // Show loading state
    submitButton.disabled = true;
    submitButton.textContent = 'جاري الإرسال...';

    try {
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      // Simulate API call (replace with actual API endpoint)
      await this.simulateApiCall(data);

      // Show success message
      this.showNotification('تم الإرسال بنجاح!', 'success');
      form.reset();

    } catch (error) {
      this.showNotification('حدث خطأ. الرجاء المحاولة مرة أخرى.', 'error');
      console.error('Form submission error:', error);

    } finally {
      // Reset button state
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    }
  }

  simulateApiCall(data) {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Form data:', data);
        resolve({ success: true });
      }, 1500);
    });
  }

  showNotification(message, type = 'info') {
    // Remove any existing notification
    const existingNotification = document.querySelector('.form-notification');
    if (existingNotification) {
      existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `form-notification form-notification--${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 80px;
      left: 50%;
      transform: translateX(-50%);
      background: ${type === 'success' ? '#28a745' : '#dc3545'};
      color: white;
      padding: 1rem 2rem;
      border-radius: 50px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 9999;
      font-weight: 600;
      animation: slideDown 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Auto remove after 3 seconds
    setTimeout(() => {
      notification.style.animation = 'slideUp 0.3s ease';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 300);
    }, 3000);
  }
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translate(-50%, -20px);
    }
    to {
      opacity: 1;
      transform: translate(-50%, 0);
    }
  }

  @keyframes slideUp {
    from {
      opacity: 1;
      transform: translate(-50%, 0);
    }
    to {
      opacity: 0;
      transform: translate(-50%, -20px);
    }
  }

  input.error,
  textarea.error,
  select.error {
    border-color: #dc3545 !important;
  }
`;
document.head.appendChild(style);

// Export form validation utilities
export const formValidators = {
  isEmail: (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },

  isIraqiPhone: (phone) => {
    const regex = /^(077|078|079|075)\d{8}$/;
    return regex.test(phone.replace(/\s/g, ''));
  },

  isRequired: (value) => {
    return value.trim().length > 0;
  },

  minLength: (value, min) => {
    return value.length >= min;
  },

  maxLength: (value, max) => {
    return value.length <= max;
  },

  isNumber: (value) => {
    return !isNaN(value) && !isNaN(parseFloat(value));
  }
};
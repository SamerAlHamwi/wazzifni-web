const UtilsService = {
    formatDate(d) {
        if (!d) return '—';
        const date = new Date(d);
        return date.toLocaleDateString('ar-IQ', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    formatDateTime(d) {
        if (!d) return '—';
        const date = new Date(d);
        return date.toLocaleDateString('ar-IQ', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }) + ' ' + date.toLocaleTimeString('ar-IQ', {
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    formatPrice(p) {
        if (!p) return '—';
        return p.toLocaleString('ar-IQ') + ' د.ع';
    },

    generateAvatar(name) {
        const initial = (name || '?').charAt(0);
        const colors = ['#0087C6', '#F68A29', '#00c896', '#00B6E7', '#FFB43C', '#002F58'];
        const color = colors[name?.charCodeAt(0) % colors.length] || '#0087C6';
        return `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><rect width='100' height='100' rx='50' fill='${encodeURIComponent(color)}'/><text x='50' y='62' text-anchor='middle' font-size='40' font-family='Cairo,sans-serif' fill='white'>${encodeURIComponent(initial)}</text></svg>`;
    },

    showToast(msg, type = 'info', container) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = msg;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 3500);
    },

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};
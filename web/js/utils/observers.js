// Intersection Observer for reveal animations
export function initObservers() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('show');
          }, index * 70);
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px'
    }
  );

  document.querySelectorAll('.rv').forEach(el => observer.observe(el));
}
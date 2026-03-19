export class Jobs {
    constructor() {
        this.jobsContainer = document.querySelector('.jobs-grid');
        if (this.jobsContainer) {
            this.init();
        }

        // Enums and mapping objects
        this.workEngagementLabels = {
            0: "دوام كامل",
            1: "دوام جزئي",
            2: "حسب الإتفاق",
            3: "أعمال حرة",
            4: "شراكة استراتيجية",
            5: "تدريب",
            6: "عمل تطوعي",
        };

        this.workPlaceLabels = {
            0: "في مقر العمل",
            1: "هجين (مقر العمل + عن بُعد)",
            2: "عن بعد",
            3: "ساعات عمل مرنة",
            4: "العمل بنظام الورديات",
        };

        this.workLevelLabels = {
            0: "مستوى متدرب",
            1: "مستوى مبتدئ",
            2: "مستوى متوسط",
            3: "مستوى خبير",
            4: "مستوى قائد فريق",
            5: "مستوى مدير",
            6: "مستوى مدير إدارة",
            7: "مستوى نائب الرئيس",
            8: "مستوى مسؤول تنفيذي",
            9: "مستوى مستشار",
            10: "مستوى أخر",
        };
    }

    async init() {
        this.renderShimmers();
        try {
            const jobs = await this.fetchJobs();
            this.renderJobs(jobs);
        } catch (error) {
            console.error('Error fetching jobs:', error);
            this.jobsContainer.innerHTML = '<p style="text-align:center;width:100%;grid-column:1/-1;">تعذر تحميل الوظائف، يرجى المحاولة لاحقاً.</p>';
        }
    }

    renderShimmers() {
        this.jobsContainer.innerHTML = '';
        for (let i = 0; i < 6; i++) {
            const shimmerHTML = `
                <div class="shimmer-card">
                    <div class="shimmer-wrapper">
                        <div class="shimmer-line title"></div>
                        <div class="shimmer-line company"></div>
                        <div class="shimmer-line level"></div>
                        <div style="display:flex; justify-content:space-between; margin-top:10px;">
                            <div class="shimmer-line footer" style="width:25%"></div>
                            <div class="shimmer-line footer" style="width:30%"></div>
                            <div class="shimmer-line footer" style="width:20%"></div>
                        </div>
                    </div>
                </div>
            `;
            this.jobsContainer.insertAdjacentHTML('beforeend', shimmerHTML);
        }
    }

    async fetchJobs() {
        const response = await fetch('https://api.wazzifni.net/api/services/app/JobPost/GetLastJobPosts');
        const data = await response.json();

        if (data && data.success && data.result && data.result.items) {
            return data.result.items;
        }

        throw new Error('Invalid data format');
    }

    getWorkEngagementText(workEngagement) {
        return this.workEngagementLabels[workEngagement] || "دوام كامل";
    }

    getWorkPlaceText(workPlace) {
        return this.workPlaceLabels[workPlace] || "في مقر العمل";
    }

    getWorkLevelText(workLevel) {
        return this.workLevelLabels[workLevel] || "مستوى غير محدد";
    }

    formatSalary(min, max) {
        if (!min && !max) return 'الراتب يحدد في المقابلة';
        if (min && !max) return `${min.toLocaleString()} د.ع`;
        if (!min && max) return `حتى ${max.toLocaleString()} د.ع`;
        if (min === max) return `${min.toLocaleString()} د.ع`;
        return `${min.toLocaleString()} - ${max.toLocaleString()} د.ع`;
    }

    getTimeAgo(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.max(0, Math.floor((now - date) / 1000));

        if (diffInSeconds < 60) return 'الآن';

        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) return `منذ ${diffInMinutes} دقيقة`;

        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `منذ ${diffInHours} ساعة`;

        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays === 1) return 'منذ يوم';
        if (diffInDays === 2) return 'منذ يومين';
        if (diffInDays <= 10) return `منذ ${diffInDays} أيام`;

        return `منذ ${diffInDays} يوم`;
    }

    renderJobs(jobs) {
        this.jobsContainer.innerHTML = '';

        if (jobs.length === 0) {
            this.jobsContainer.innerHTML = '<p style="text-align:center;width:100%;grid-column:1/-1;">لا توجد وظائف متاحة حالياً.</p>';
            return;
        }

        jobs.forEach((job) => {
            const companyName = job.organization?.name || 'شركة غير معلنة';
            const engagement = this.getWorkEngagementText(job.workEngagement);
            const salary = this.formatSalary(job.minSalary, job.maxSalary);
            const timeAgo = this.getTimeAgo(job.creationTime);

            const locationText = `📍 ${this.getWorkPlaceText(job.workPlace)}`;
            const levelText = this.getWorkLevelText(job.workLevel);

            let icon = '🏢';
            if (job.title.includes('طبي') || job.title.includes('عيادة') || job.title.includes('مستشفى') || job.title.includes('صيدلية')) icon = '🏥';
            else if (job.title.includes('كافيه') || job.title.includes('مطعم') || job.title.includes('ويتر')) icon = '☕';
            else if (job.title.includes('مبيعات') || job.title.includes('مروج')) icon = '📊';
            else if (job.title.includes('تعليم') || job.title.includes('مدرسة') || job.title.includes('معلم')) icon = '📚';
            else if (job.title.includes('سيارة') || job.title.includes('سائق')) icon = '🚗';
            else if (job.title.includes('تصميم') || job.title.includes('مبرمج')) icon = '💻';

            const jobCardHTML = `
                <div class="job-card rv" onclick="window.modal.show()">
                    <div class="job-header">
                        <h3 class="job-title">${job.title}</h3>
                        <span class="job-badge">${engagement}</span>
                    </div>
                    <div class="job-company">${icon} ${companyName}</div>
                    <div class="job-level">⭐ ${levelText}</div>
                    <div class="job-footer">
                        <span class="job-location">${locationText}</span>
                        <span class="job-salary">${salary}</span>
                        <span class="job-date">${timeAgo}</span>
                    </div>
                </div>
            `;
            this.jobsContainer.insertAdjacentHTML('beforeend', jobCardHTML);
        });

        // Setup scroll reveal animation for newly added jobs
        const newCards = this.jobsContainer.querySelectorAll('.rv');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, idx) => {
                if (entry.isIntersecting) {
                    setTimeout(() => entry.target.classList.add('show'), idx * 70);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px' });

        newCards.forEach(card => observer.observe(card));
    }
}
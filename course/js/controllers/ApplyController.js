class ApplyController {
    constructor() {
        this.course = null;
        this.isLoading = false;
        this.courseId = null;
    }

    async init() {
        const urlParams = new URLSearchParams(window.location.search);
        this.courseId = urlParams.get('id');

        if (!this.courseId) {
            this.showToast('❌ عذراً، لم يتم تحديد الدورة المطلوبة', 'error');
            setTimeout(() => window.location.href = '/course/', 2000);
            return;
        }

        this.bindEvents();
        await this.loadCourse();
    }

    bindEvents() {
        const confirmBtn = document.getElementById('confirmRegisterBtn');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => this.confirmRegister());
        }
    }

    setLoading(loading) {
        this.isLoading = loading;
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) overlay.style.display = loading ? 'flex' : 'none';
    }

    async loadCourse() {
        this.setLoading(true);
        try {
            this.course = await CourseService.getCourse(this.courseId);
            this.renderCourseInfo();
        } catch (error) {
            this.showToast('❌ فشل تحميل بيانات الدورة: ' + error.message, 'error');
            setTimeout(() => window.location.href = '/course/', 2000);
        } finally {
            this.setLoading(false);
        }
    }

    renderCourseInfo() {
        const infoEl = document.getElementById('courseInfo');
        if (!infoEl || !this.course) return;

        infoEl.innerHTML = `
            <h2>${this.course.name}</h2>
            <div class="meta">
                <span>👨‍🏫 ${this.course.teacherName}</span>
                <span>📅 ${UtilsService.formatDate(this.course.startDate)}</span>
                <span>🪑 ${this.course.seatsLeft} مقعد متبقي</span>
                <span style="color:${this.course.type === 'free' ? 'var(--success)' : 'var(--orange)'}; font-weight: 700;">
                    ${this.course.type === 'free' ? '🆓 مجانية' : UtilsService.formatPrice(this.course.price)}
                </span>
            </div>
        `;
    }

    async confirmRegister() {
        const data = this.getRegisterData();
        if (!data.studentName || !data.studentPhone || !data.gender || !data.governorate || !data.educationLevel || !data.studyDescription || !data.currentJob) {
            this.showToast('⚠️ يرجى ملء جميع الحقول المطلوبة', 'error');
            return;
        }

        this.setLoading(true);
        try {
            await CourseService.registerToCourse(this.courseId, data);
            this.showToast('✅ تم التسجيل بنجاح سيتم التواصل معك قريباً', 'success');

            // Redirect after success
            setTimeout(() => {
                window.location.href = '/course/';
            }, 3000);
        } catch (error) {
            this.showToast('❌ فشل التسجيل: ' + error.message, 'error');
        } finally {
            this.setLoading(false);
        }
    }

    getRegisterData() {
        return {
            studentName: document.getElementById('regName')?.value.trim() || '',
            studentPhone: document.getElementById('regPhone')?.value.trim() || '',
            gender: document.getElementById('regGender')?.value || '',
            studentEmail: document.getElementById('regEmail')?.value || '',
            governorate: document.getElementById('regGovernorate')?.value || '',
            educationLevel: document.getElementById('regEducationLevel')?.value || '',
            studyDescription: document.getElementById('regStudyDescription')?.value.trim() || '',
            currentJob: document.getElementById('regCurrentJob')?.value || ''
        };
    }

    showToast(msg, type = 'info') {
        UtilsService.showToast(msg, type, document.getElementById('toastContainer'));
    }
}

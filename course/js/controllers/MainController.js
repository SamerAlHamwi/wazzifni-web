class MainController {
    constructor() {
        this.courses = [];
        this.pagination = {
            page: 1,
            limit: 10,
            total: 0,
            pages: 0
        };
        this.currentView = 'user';
        this.registeringCourseId = null;
        this.isLoading = false;
        this.filters = {
            search: '',
            category: '',
            level: '',
            type: '',
            sort: '-createdAt'
        };
    }

    async init() {
        // Initialize views
        UserView.init(this);
        ModalView.init(this);

        // Bind global events
        this.bindEvents();

        // Initial load
        await this.loadCourses();
        this.renderStats();
    }

    bindEvents() {
        // Global click handler for action buttons
        document.addEventListener('click', (e) => {
            const target = e.target.closest('[data-action]');
            if (!target) return;

            const action = target.dataset.action;
            const courseId = target.dataset.courseId;

            switch(action) {
                case 'detail':
                    this.openCourseDetail(courseId);
                    break;
                case 'register':
                    this.openRegister(courseId);
                    break;
                case 'register-from-detail':
                    ModalView.closeCourseDetail();
                    this.openRegister(courseId);
                    break;
            }
        });
    }

    setLoading(loading) {
        this.isLoading = loading;
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) overlay.style.display = loading ? 'flex' : 'none';
    }

    async loadCourses() {
        this.setLoading(true);
        try {
            const params = {
                page: this.pagination.page,
                limit: this.pagination.limit,
                search: this.filters.search,
                type: this.filters.type !== 'all' ? this.filters.type : '',
                sort: this.filters.sort
            };

            const result = await CourseService.getAllCourses(params);
            this.courses = result.courses.map(c => new Course(c));
            this.pagination = result.pagination;

            this.renderAll();
        } catch (error) {
            this.showToast('❌ فشل تحميل الدورات: ' + error.message, 'error');
        } finally {
            this.setLoading(false);
        }
    }

    async goToPage(page) {
        this.pagination.page = page;
        await this.loadCourses();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    renderAll() {
        UserView.renderCourses(this.courses);
        UserView.renderPagination(this.pagination);
    }

    renderStats() {
        const stats = {
            total: this.pagination.total || this.courses.length,
            open: this.courses.filter(c => c.seatsLeft > 0).length,
            full: this.courses.filter(c => c.seatsLeft === 0).length,
            free: this.courses.filter(c => c.type === 'free').length
        };

        UserView.renderStats(stats);
    }

    async filterCourses() {
        this.filters.search = UserView.getSearchTerm();
        this.filters.type = UserView.getCurrentFilter();
        this.pagination.page = 1; // Reset to page 1 on search/filter
        await this.loadCourses();
    }

    openCourseDetail(id) {
        const course = this.courses.find(c => c.id === id);
        if (!course) return;
        ModalView.openCourseDetail(course, false);
    }

    openRegister(courseId) {
        const course = this.courses.find(c => c.id === courseId);
        if (!course || course.seatsLeft === 0) return;
        this.registeringCourseId = courseId;
        ModalView.openRegisterModal(course);
    }

    async confirmRegister() {
        const data = ModalView.getRegisterData();
        if (!data.studentName || !data.studentPhone || !data.governorate || !data.educationLevel || !data.currentJob) {
            this.showToast('⚠️ يرجى ملء جميع الحقول المطلوبة', 'error');
            return;
        }

        this.setLoading(true);
        try {
            await CourseService.registerToCourse(this.registeringCourseId, data);

            ModalView.closeRegisterModal();
            this.showToast('✅ تم التسجيل بنجاح سيتم التواصل معك قريباً', 'success');
            await this.loadCourses();
        } catch (error) {
            this.showToast('❌ فشل التسجيل: ' + error.message, 'error');
        } finally {
            this.setLoading(false);
        }
    }

    showToast(msg, type = 'info') {
        UtilsService.showToast(msg, type, document.getElementById('toastContainer'));
    }
}

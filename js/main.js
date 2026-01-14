// 모바일 메뉴 토글 기능
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            
            // 메뉴 토글 아이콘 변경
            if (mainNav.classList.contains('active')) {
                menuToggle.textContent = '✕';
            } else {
                menuToggle.textContent = '☰';
            }
        });
    }
    
    // 윈도우 리사이즈 시 모바일 메뉴 닫기
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            mainNav.classList.remove('active');
            if (menuToggle) {
                menuToggle.textContent = '☰';
            }
        }
    });
    
    // 스크롤 시 헤더 스타일 변경
    const header = document.querySelector('.main-header');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
    
    // 부드러운 스크롤 효과 (앵커 링크용)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // 이미지 지연 로딩
    const images = document.querySelectorAll('img[data-src]');
    const imageOptions = {
        threshold: 0,
        rootMargin: '0px 0px 300px 0px'
    };
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.getAttribute('data-src');
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        }, imageOptions);
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        images.forEach(img => {
            img.src = img.getAttribute('data-src');
            img.removeAttribute('data-src');
        });
    }
    
    // 페이지 로드 시 애니메이션
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    const animateOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    if ('IntersectionObserver' in window && animateElements.length > 0) {
        const animateObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, animateOptions);
        
        animateElements.forEach(el => animateObserver.observe(el));
    }

    // 경량 CTA 추적: data-cta가 있는 요소 클릭 시 sendBeacon/console 로깅
    const trackCta = (event, target) => {
        const payload = {
            cta: target.getAttribute('data-cta') || 'unknown',
            origin: target.getAttribute('data-cta-origin') || 'unknown',
            projectId: target.getAttribute('data-project-id') || null,
            href: target.getAttribute('href') || null,
            text: (target.textContent || '').trim().slice(0, 120),
            lang: document.documentElement.lang || 'ko',
            ts: Date.now(),
            path: location.pathname
        };
        const body = JSON.stringify(payload);

        if (navigator.sendBeacon) {
            navigator.sendBeacon('/analytics', body);
        } else {
            // Fallback: 콘솔 로깅
            console.debug('[cta]', payload);
        }
    };

    document.addEventListener('click', function(e) {
        const target = e.target.closest('[data-cta]');
        if (!target) return;
        trackCta(e, target);
    });

    // 상세 페이지 헤더 지표 표시 (visits, likeRatio)
    const renderHeaderMetrics = () => {
        if (!(window.ProjectManager && ProjectManager.loadProjectsData)) return;
        const metricsBox = document.querySelector('.project-metrics-header');
        const projectId = document.body.getAttribute('data-project-id');
        if (!metricsBox || !projectId) return;

        const visitEl = metricsBox.querySelector('[data-metric="visits"]');
        const likeEl = metricsBox.querySelector('[data-metric="likeRatio"]');

        ProjectManager.loadProjectsData().then(() => {
            const all = (ProjectManager.getAll && ProjectManager.getAll()) || [];
            const project = all.find(p => p.id === projectId);
            if (!project || !project.metrics) return;
            const { visits, likeRatio } = project.metrics;
            if (typeof visits === 'number' && visitEl) {
                visitEl.textContent = `Visits ${visits.toLocaleString()}`;
                visitEl.style.display = 'inline-flex';
            }
            if (typeof likeRatio === 'number' && likeEl) {
                const pct = Math.round(likeRatio * 1000) / 10; // one decimal
                likeEl.textContent = `Like ${pct}%`;
                likeEl.style.display = 'inline-flex';
            }
        }).catch(() => {});
    };

    renderHeaderMetrics();
});
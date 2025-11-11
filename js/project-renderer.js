// 프로젝트 렌더링 관련 함수들
const ProjectRenderer = {
    // 현재 언어 가져오기 (localStorage와 동기화)
    getCurrentLanguage: function() {
        return localStorage.getItem('language') || document.documentElement.lang || 'ko';
    },
    // 메인 페이지 프로젝트 카드 렌더링
    renderFeaturedProjects: function(containerId = 'project-grid') {
        const container = document.querySelector(`.${containerId}`) || document.querySelector(`#${containerId}`);
        if (!container) {
            console.error(`Container ${containerId} not found`);
            return;
        }

        const currentLang = this.getCurrentLanguage();
        const projects = ProjectManager.getFeaturedProjects();
        
        container.innerHTML = '';
        
        projects.forEach(project => {
            const projectCard = this.createProjectCard(project, currentLang);
            container.appendChild(projectCard);
        });
    },

    // 개별 프로젝트 카드 생성
    createProjectCard: function(project, lang = 'ko') {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.setAttribute('data-project-id', project.id);

        // 플랫폼 정보 추가 (category 또는 platform 필드에서 가져오기)
        const platformData = this.getPlatformInfo(project);
        card.setAttribute('data-platform', platformData.key);

        const title = project.title[lang] || project.title.ko;
        const description = project.description[lang] || project.description.ko;

        card.innerHTML = `
            <div class="platform-badge platform-${platformData.key}">${platformData.label}</div>
            <img src="${project.image}" alt="${title}">
            <div class="project-info">
                <h3>${title}</h3>
                <p>${description}</p>
                <a href="${project.detailPage}" class="learn-more" data-key="learn_more">자세히 보기 →</a>
            </div>
        `;

        return card;
    },

    // 프로젝트 페이지 전체 목록 렌더링
    renderAllProjects: function(containerId = 'all-projects-grid') {
        const container = document.querySelector(`.${containerId}`) || document.querySelector(`#${containerId}`);
        if (!container) {
            console.error(`Container ${containerId} not found`);
            return;
        }

        const currentLang = this.getCurrentLanguage();
        const projects = projectsData.all;
        
        container.innerHTML = '';
        
        projects.forEach(project => {
            const projectCard = this.createDetailedProjectCard(project, currentLang);
            container.appendChild(projectCard);
        });
    },

    // 상세 정보가 포함된 프로젝트 카드 생성
    createDetailedProjectCard: function(project, lang = 'ko') {
        const card = document.createElement('div');
        card.className = 'project-card detailed';
        card.setAttribute('data-project-id', project.id);
        card.setAttribute('data-category', project.category);
        card.setAttribute('data-status', project.status);

        // 플랫폼 정보 추가
        const platformData = this.getPlatformInfo(project);
        card.setAttribute('data-platform', platformData.key);

        const title = project.title[lang] || project.title.ko;
        const description = project.description[lang] || project.description.ko;

        const statusBadge = this.getStatusBadge(project.status, lang);
        const categoryBadge = this.getCategoryBadge(project.category);

        card.innerHTML = `
            <div class="platform-badge platform-${platformData.key}">${platformData.label}</div>
            <div class="project-badges">
                ${statusBadge}
                ${categoryBadge}
            </div>
            <img src="${project.image}" alt="${title}">
            <div class="project-info">
                <h3>${title}</h3>
                <p>${description}</p>
                <div class="project-meta">
                    <span class="platform">${project.platform}</span>
                    <span class="launch-date">${project.launchDate}</span>
                </div>
                <a href="${project.detailPage}" class="learn-more" data-key="learn_more">자세히 보기 →</a>
            </div>
        `;

        return card;
    },

    // 상태 배지 생성
    getStatusBadge: function(status, lang = 'ko') {
        const statusLabels = {
            active: { ko: '진행중', en: 'Active', ja: '進行中' },
            development: { ko: '개발중', en: 'In Development', ja: '開発中' },
            completed: { ko: '완료', en: 'Completed', ja: '完了' },
            paused: { ko: '일시중단', en: 'Paused', ja: '一時停止' }
        };
        
        const label = statusLabels[status] ? statusLabels[status][lang] || statusLabels[status].ko : status;
        return `<span class="status-badge status-${status}">${label}</span>`;
    },

    // 카테고리 배지 생성
    getCategoryBadge: function(category) {
        const categoryLabels = {
            zepeto: 'ZEPETO',
            roblox: 'ROBLOX',
            unity: 'Unity',
            other: 'Other'
        };

        const label = categoryLabels[category] || category.toUpperCase();
        return `<span class="category-badge category-${category}">${label}</span>`;
    },

    // 플랫폼 정보 가져오기
    getPlatformInfo: function(project) {
        // category 필드를 기본으로 사용
        const category = (project.category || '').toLowerCase();

        // 플랫폼 매핑
        const platformMap = {
            'zepeto': { key: 'zepeto', label: 'ZEPETO' },
            'roblox': { key: 'roblox', label: 'ROBLOX' },
            'other': { key: 'other', label: 'OTHER' },
            'tbd': { key: 'tbd', label: 'TBD' },
            'tba': { key: 'tba', label: 'TBA' }
        };

        // category가 있으면 사용, 없으면 platform 필드 확인
        if (platformMap[category]) {
            return platformMap[category];
        }

        // platform 필드 확인
        const platform = (project.platform || '').toLowerCase();
        if (platformMap[platform]) {
            return platformMap[platform];
        }

        // 기본값
        return { key: 'other', label: 'OTHER' };
    },

    // 카테고리별 필터링
    filterByCategory: function(category, containerId = 'all-projects-grid') {
        const container = document.querySelector(`.${containerId}`) || document.querySelector(`#${containerId}`);
        if (!container) return;
        
        const cards = container.querySelectorAll('.project-card');
        
        cards.forEach(card => {
            if (category === 'all' || card.getAttribute('data-category') === category) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    },

    // 상태별 필터링
    filterByStatus: function(status, containerId = 'all-projects-grid') {
        const container = document.querySelector(`.${containerId}`) || document.querySelector(`#${containerId}`);
        if (!container) return;
        
        const cards = container.querySelectorAll('.project-card');
        
        cards.forEach(card => {
            if (status === 'all' || card.getAttribute('data-status') === status) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    },

    // 언어 변경 시 프로젝트 업데이트
    updateLanguage: function(lang) {
        // 메인 페이지 프로젝트 카드가 없으면 렌더링
        const mainProjectContainer = document.querySelector('.project-preview .project-grid');
        if (mainProjectContainer && mainProjectContainer.children.length === 0) {
            this.renderFeaturedProjects('project-grid');
            return;
        }
        
        // 메인 페이지 프로젝트 카드 업데이트
        const mainProjectCards = document.querySelectorAll('.project-preview .project-card');
        mainProjectCards.forEach(card => {
            const projectId = card.getAttribute('data-project-id');
            const project = projectsData.all.find(p => p.id === projectId);
            if (project) {
                const title = card.querySelector('h3');
                const description = card.querySelector('p');
                
                if (title) title.textContent = project.title[lang] || project.title.ko;
                if (description) description.textContent = project.description[lang] || project.description.ko;
            }
        });

        // 전체 프로젝트 페이지 카드 업데이트
        const allProjectCards = document.querySelectorAll('#all-projects-grid .project-card');
        allProjectCards.forEach(card => {
            const projectId = card.getAttribute('data-project-id');
            const project = projectsData.all.find(p => p.id === projectId);
            if (project) {
                const title = card.querySelector('h3');
                const description = card.querySelector('p');
                
                if (title) title.textContent = project.title[lang] || project.title.ko;
                if (description) description.textContent = project.description[lang] || project.description.ko;
                
                // 상태 배지 업데이트
                const statusBadge = card.querySelector('.status-badge');
                if (statusBadge) {
                    const status = card.getAttribute('data-status');
                    statusBadge.innerHTML = this.getStatusBadge(status, lang);
                }
            }
        });
    }
};

// DOM이 로드되면 프로젝트 렌더링
document.addEventListener('DOMContentLoaded', function() {
    // 언어 설정이 완료된 후 렌더링하도록 약간의 지연
    setTimeout(function() {
        // 메인 페이지인 경우
        if (document.querySelector('.project-preview')) {
            ProjectRenderer.renderFeaturedProjects('project-grid');
        }
        
        // 프로젝트 페이지인 경우
        if (document.querySelector('#all-projects-grid')) {
            ProjectRenderer.renderAllProjects('all-projects-grid');
        }
    }, 50);
});

// 언어 변경 이벤트 리스너
document.addEventListener('languageChanged', function(event) {
    ProjectRenderer.updateLanguage(event.detail.language);
});

// 전역에서 사용할 수 있도록 노출
window.ProjectRenderer = ProjectRenderer;
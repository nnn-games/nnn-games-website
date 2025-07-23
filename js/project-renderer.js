// 프로젝트 렌더링 관련 함수들
const ProjectRenderer = {
    // 메인 페이지 프로젝트 카드 렌더링
    renderFeaturedProjects: function(containerId = 'project-grid') {
        const container = document.querySelector(`.${containerId}`) || document.querySelector(`#${containerId}`);
        if (!container) {
            console.error(`Container ${containerId} not found`);
            return;
        }

        const currentLang = document.documentElement.lang || 'ko';
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
        
        const title = project.title[lang] || project.title.ko;
        const description = project.description[lang] || project.description.ko;
        
        card.innerHTML = `
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

        const currentLang = document.documentElement.lang || 'ko';
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
        
        const title = project.title[lang] || project.title.ko;
        const description = project.description[lang] || project.description.ko;
        
        const statusBadge = this.getStatusBadge(project.status, lang);
        const categoryBadge = this.getCategoryBadge(project.category);
        
        card.innerHTML = `
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
        // 메인 페이지 프로젝트 카드 업데이트
        const mainProjectCards = document.querySelectorAll('.project-preview .project-card');
        mainProjectCards.forEach(card => {
            const projectId = card.getAttribute('data-project-id');
            const project = ProjectManager.getProject(projectId);
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
            const project = ProjectManager.getProject(projectId);
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
    // 메인 페이지인 경우
    if (document.querySelector('.project-preview')) {
        ProjectRenderer.renderFeaturedProjects('project-grid');
    }
    
    // 프로젝트 페이지인 경우
    if (document.querySelector('#all-projects-grid')) {
        ProjectRenderer.renderAllProjects('all-projects-grid');
    }
});

// 언어 변경 이벤트 리스너
document.addEventListener('languageChanged', function(event) {
    ProjectRenderer.updateLanguage(event.detail.language);
});

// 전역에서 사용할 수 있도록 노출
window.ProjectRenderer = ProjectRenderer;
// 프로젝트 렌더링 관련 함수들
const ProjectRenderer = {
    filtersBound: false,
    _kwTimer: null,
    projectDisplayOrder: [
        'fruit-battles',
        'tower-flood-race',
        'korean-spa',
        'legendary-dj-gear'
    ],

    // 현재 언어 가져오기 (localStorage와 동기화)
    getCurrentLanguage: function () {
        return localStorage.getItem('language') || document.documentElement.lang || 'ko';
    },

    t: function (lang, key, fallback = '') {
        try {
            const source = (typeof window !== 'undefined' && window.translations) || translations || {};
            return (source[lang] && source[lang][key]) || fallback || key;
        } catch (_error) {
            return fallback || key;
        }
    },

    formatMetricBadge: function (type, value, lang = 'ko') {
        const labels = {
            visits: 'metric_visits',
            playing: 'metric_playing',
            favorites: 'metric_favorites'
        };
        const classes = {
            visits: 'play',
            playing: 'media',
            favorites: 'ugc'
        };

        const label = this.t(lang, labels[type], type);
        return `<span class="badge-metric ${classes[type]}">${label} ${value.toLocaleString()}</span>`;
    },

    formatMetricValue: function (value, lang = 'ko') {
        if (typeof value !== 'number') return '--';

        try {
            return new Intl.NumberFormat(lang, {
                notation: 'compact',
                maximumFractionDigits: 1
            }).format(value);
        } catch (_error) {
            return value.toLocaleString(lang);
        }
    },

    createMetricPanelItem: function (type, value, lang = 'ko') {
        const labels = {
            visits: 'metric_visits',
            playing: 'metric_playing',
            favorites: 'metric_favorites'
        };
        const label = this.t(lang, labels[type], type);
        const displayValue = this.formatMetricValue(value, lang);

        return `
            <div class="project-kpi" data-project-kpi="${type}">
                <span class="project-kpi-label">${label}</span>
                <strong class="project-kpi-value" data-project-kpi-value="${type}">${displayValue}</strong>
            </div>
        `;
    },

    formatUpdatedAt: function (value, lang = 'ko') {
        if (!value) return null;

        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return null;

        try {
            return new Intl.DateTimeFormat(lang, {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            }).format(date);
        } catch (_error) {
            return date.toISOString().slice(0, 10);
        }
    },

    sortProjectsForDisplay: function (projects = []) {
        const orderMap = new Map(this.projectDisplayOrder.map((id, index) => [id, index]));
        return projects
            .map((project, index) => ({ project, index }))
            .sort((a, b) => {
                const aOrder = orderMap.has(a.project.id) ? orderMap.get(a.project.id) : Number.MAX_SAFE_INTEGER;
                const bOrder = orderMap.has(b.project.id) ? orderMap.get(b.project.id) : Number.MAX_SAFE_INTEGER;

                if (aOrder !== bOrder) {
                    return aOrder - bOrder;
                }

                return a.index - b.index;
            })
            .map(({ project }) => project);
    },

    // 메인 페이지 프로젝트 카드 렌더링
    renderFeaturedProjects: function (containerId = 'project-grid') {
        const container = document.querySelector(`.${containerId}`) || document.querySelector(`#${containerId}`);
        if (!container) {
            console.error(`Container ${containerId} not found`);
            return;
        }

        const currentLang = this.getCurrentLanguage();
        const projects = ((ProjectManager.getFeatured && ProjectManager.getFeatured()) || (ProjectManager.getFeaturedProjects && ProjectManager.getFeaturedProjects()) || projectsData.featured || [])
            .filter((project) => {
                const reporting = project && typeof project.reporting === 'object' && project.reporting ? project.reporting : {};
                const includeInHomePreview = typeof reporting.includeInHomePreview === 'boolean'
                    ? reporting.includeInHomePreview
                    : typeof reporting.includeInHeroProjectCount === 'boolean'
                        ? reporting.includeInHeroProjectCount
                    : true;
                return project && includeInHomePreview;
            });
        const sortedProjects = this.sortProjectsForDisplay(projects);

        container.innerHTML = '';
        sortedProjects.forEach(project => {
            const projectCard = this.createProjectCard(project, currentLang);
            container.appendChild(projectCard);
        });
        this.syncFeaturedProjectCards(containerId, currentLang);
    },

    // 개별 프로젝트 카드 생성
    createProjectCard: function (project, lang = 'ko') {
        const card = document.createElement('div');
        card.className = 'project-card home-project-card';
        card.setAttribute('data-project-id', project.id);

        const platformData = this.getPlatformInfo(project);
        card.setAttribute('data-platform', platformData.key);

        const title = project.title[lang] || project.title.ko;
        const description = project.description[lang] || project.description.ko;
        const learnMore = this.t(lang, 'learn_more', 'Learn More →');
        const metrics = project.metrics || {};
        const statusBadge = this.getStatusBadge(project.status, lang);
        const metaItems = [project.platform, project.launchDate].filter(Boolean)
            .map((value) => `<span>${value}</span>`)
            .join('');
        const updatedAt = this.formatUpdatedAt(metrics.updatedAt, lang);
        const updatedLabel = this.t(lang, 'project_updated_label', 'Updated');

        card.innerHTML = `
            <div class="project-image-wrapper">
                <div class="platform-badge platform-${platformData.key}">${platformData.label}</div>
                <div class="project-badges">
                    ${statusBadge}
                </div>
                <img src="${project.image}" alt="${title}">
            </div>
            <div class="project-info">
                <h3>${title}</h3>
                <p class="project-summary">${description}</p>
                ${metaItems ? `<div class="project-meta">${metaItems}</div>` : ''}
                <div class="project-kpi-grid">
                    ${this.createMetricPanelItem('visits', metrics.visits, lang)}
                    ${this.createMetricPanelItem('playing', metrics.playing, lang)}
                    ${this.createMetricPanelItem('favorites', metrics.favorites, lang)}
                </div>
                <p class="project-updated" data-project-updated>${updatedLabel} ${updatedAt || '--'}</p>
                <a href="${project.detailPage}" class="learn-more" data-key="learn_more" data-cta="project-card-featured" data-project-id="${project.id}" data-cta-origin="home-featured">${learnMore}</a>
            </div>
        `;

        return card;
    },

    syncHomeProjectCardMetrics: function (card, project, lang = 'ko') {
        if (!card || !project) return;

        const metrics = project.metrics || {};
        ['visits', 'playing', 'favorites'].forEach((type) => {
            const valueEl = card.querySelector(`[data-project-kpi-value="${type}"]`);
            if (valueEl) {
                valueEl.textContent = this.formatMetricValue(metrics[type], lang);
            }
        });

        const updatedEl = card.querySelector('[data-project-updated]');
        if (updatedEl) {
            const updatedLabel = this.t(lang, 'project_updated_label', 'Updated');
            const updatedAt = this.formatUpdatedAt(metrics.updatedAt, lang) || '--';
            updatedEl.textContent = `${updatedLabel} ${updatedAt}`;
        }
    },

    syncFeaturedProjectCards: function (containerId = 'project-grid', lang = 'ko') {
        const container = document.querySelector(`.${containerId}`) || document.querySelector(`#${containerId}`);
        if (!container || !(window.ProjectManager && ProjectManager.getProject)) return;

        container.querySelectorAll('.home-project-card[data-project-id]').forEach((card) => {
            const projectId = card.getAttribute('data-project-id');
            const project = ProjectManager.getProject(projectId);
            this.syncHomeProjectCardMetrics(card, project, lang);
        });
    },

    // 프로젝트 페이지 전체 목록 렌더링
    renderAllProjects: function (containerId = 'all-projects-grid') {
        const container = document.querySelector(`.${containerId}`) || document.querySelector(`#${containerId}`);
        if (!container) {
            console.error(`Container ${containerId} not found`);
            return;
        }

        const specialContainer = document.getElementById('special-projects-grid');
        const specialSection = document.getElementById('specialProjectSection');

        const currentLang = this.getCurrentLanguage();
        const projects = (ProjectManager.getAll && ProjectManager.getAll()) || projectsData.all || [];
        const isVisibleInProjectsList = (project) => (
            !project || typeof project.showInProjectsList !== 'boolean' || project.showInProjectsList
        );
        const primaryProjects = this.sortProjectsForDisplay(
            projects.filter(project => project.id !== 'nnn-ugc' && isVisibleInProjectsList(project))
        );
        const specialProjects = projects.filter(project => project.id === 'nnn-ugc' && isVisibleInProjectsList(project));

        container.innerHTML = '';
        primaryProjects.forEach(project => {
            const projectCard = this.createDetailedProjectCard(project, currentLang);
            container.appendChild(projectCard);
        });

        if (specialContainer) {
            specialContainer.innerHTML = '';
            specialProjects.forEach(project => {
                const projectCard = this.createDetailedProjectCard(project, currentLang);
                specialContainer.appendChild(projectCard);
            });
        }

        if (specialSection) {
            specialSection.classList.toggle('hidden', specialProjects.length === 0);
        }
    },

    // 상세 정보가 포함된 프로젝트 카드 생성
    createDetailedProjectCard: function (project, lang = 'ko') {
        const card = document.createElement('div');
        card.className = 'project-card detailed';
        card.setAttribute('data-project-id', project.id);
        card.setAttribute('data-category', project.category);
        card.setAttribute('data-status', project.status);

        const platformData = this.getPlatformInfo(project);
        card.setAttribute('data-platform', platformData.key);

        const title = project.title[lang] || project.title.ko;
        const description = project.description[lang] || project.description.ko;
        const metrics = project.metrics || {};
        const statusBadge = this.getStatusBadge(project.status, lang);
        const categoryBadge = this.getCategoryBadge(project.category);
        const learnMore = this.t(lang, 'learn_more', 'Learn More →');
        const detailLink = project.showDetailLinkInProjects === false ? '' : project.detailPage;

        const metricBadges = [
            typeof metrics.visits === 'number' ? this.formatMetricBadge('visits', metrics.visits, lang) : '',
            typeof metrics.playing === 'number' ? this.formatMetricBadge('playing', metrics.playing, lang) : '',
            typeof metrics.favorites === 'number' ? this.formatMetricBadge('favorites', metrics.favorites, lang) : ''
        ].filter(Boolean).join('');

        card.innerHTML = `
            <div class="project-image-wrapper">
                <div class="platform-badge platform-${platformData.key}">${platformData.label}</div>
                <div class="project-badges">
                    ${statusBadge}
                    ${categoryBadge}
                </div>
                <img src="${project.image}" alt="${title}">
            </div>
            <div class="project-info">
                <h3>${title}</h3>
                <p>${description}</p>
                <div class="project-meta">
                    <span class="platform">${project.platform}</span>
                    <span class="launch-date">${project.launchDate}</span>
                </div>
                ${metricBadges ? `<div class="project-metrics">${metricBadges}</div>` : ''}
                ${detailLink ? `<a href="${detailLink}" class="learn-more" data-key="learn_more" data-cta="project-card-list" data-project-id="${project.id}" data-cta-origin="projects-list">${learnMore}</a>` : ''}
            </div>
        `;

        return card;
    },

    // 상태 배지 생성
    getStatusBadge: function (status, lang = 'ko') {
        const statusLabels = {
            active: { ko: '운영 중', en: 'Live', ja: '運営中' },
            development: { ko: '개발 중', en: 'In Development', ja: '開発中' },
            completed: { ko: '완료', en: 'Completed', ja: '完了' },
            paused: { ko: '일시중단', en: 'Paused', ja: '一時停止' }
        };

        const label = statusLabels[status] ? statusLabels[status][lang] || statusLabels[status].ko : status;
        return `<span class="status-badge status-${status}">${label}</span>`;
    },

    // 카테고리 배지 생성
    getCategoryBadge: function (category) {
        const categoryLabels = {
            roblox: 'ROBLOX'
        };

        const label = categoryLabels[category] || category.toUpperCase();
        return `<span class="category-badge category-${category}">${label}</span>`;
    },

    // 플랫폼 정보 가져오기
    getPlatformInfo: function (project) {
        const category = (project.category || '').toLowerCase();
        const platformMap = {
            roblox: { key: 'roblox', label: 'ROBLOX' }
        };

        if (platformMap[category]) return platformMap[category];
        const platform = (project.platform || '').toLowerCase();
        if (platformMap[platform]) return platformMap[platform];
        return platformMap.roblox;
    },

    getCurrentFilterState: function () {
        const categoryEl = document.getElementById('categoryFilter');
        const statusEl = document.getElementById('statusFilter');
        const keywordEl = document.getElementById('keywordFilter');

        return {
            category: categoryEl ? categoryEl.value : 'all',
            status: statusEl ? statusEl.value : 'all',
            keyword: keywordEl ? keywordEl.value : ''
        };
    },

    getProjectCardsForFiltering: function (containerId = 'all-projects-grid') {
        const containers = [];
        const primaryContainer = document.querySelector(`.${containerId}`) || document.querySelector(`#${containerId}`);
        if (primaryContainer) containers.push(primaryContainer);

        if (containerId === 'all-projects-grid') {
            const specialContainer = document.getElementById('special-projects-grid');
            if (specialContainer) containers.push(specialContainer);
        }

        return containers.flatMap(container => Array.from(container.querySelectorAll('.project-card')));
    },

    updateFilterFeedback: function (visibleCount, totalCount, lang = 'ko') {
        const resultsEl = document.getElementById('projectResultsText');
        const emptyEl = document.getElementById('projectEmptyState');

        if (resultsEl) {
            if (visibleCount === 0) {
                resultsEl.textContent = this.t(lang, 'projects_filter_results_none', 'No projects match the current filters.');
            } else if (visibleCount === totalCount) {
                resultsEl.textContent = this.t(lang, 'projects_filter_results_default', 'Showing all projects.');
            } else {
                const template = this.t(lang, 'projects_filter_results', '{{visible}} / {{total}}');
                resultsEl.textContent = template
                    .replace('{{visible}}', String(visibleCount))
                    .replace('{{total}}', String(totalCount));
            }
        }

        if (emptyEl) {
            emptyEl.classList.toggle('hidden', visibleCount !== 0);
        }
    },

    // 통합 필터 적용
    applyFilters: function ({ category = 'all', status = 'all', keyword = '' } = {}, containerId = 'all-projects-grid') {
        const cards = this.getProjectCardsForFiltering(containerId);
        if (cards.length === 0) return;
        const kw = (keyword || '').toLowerCase();
        let visibleCount = 0;

        cards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            const cardStatus = card.getAttribute('data-status');
            const title = (card.querySelector('h3')?.textContent || '').toLowerCase();
            const desc = (card.querySelector('p')?.textContent || '').toLowerCase();

            const matchCategory = category === 'all' || cardCategory === category;
            const matchStatus = status === 'all' || cardStatus === status;
            const matchKeyword = !kw || title.includes(kw) || desc.includes(kw);
            const visible = matchCategory && matchStatus && matchKeyword;

            card.style.display = visible ? '' : 'none';
            if (visible) {
                visibleCount += 1;
            }
        });

        const specialSection = document.getElementById('specialProjectSection');
        if (specialSection) {
            const specialCards = Array.from(specialSection.querySelectorAll('.project-card'));
            const hasVisibleSpecialCards = specialCards.some(card => card.style.display !== 'none');
            specialSection.classList.toggle('hidden', !hasVisibleSpecialCards);
        }

        this.updateFilterFeedback(visibleCount, cards.length, this.getCurrentLanguage());
    },

    applyCurrentFilters: function () {
        this.applyFilters(this.getCurrentFilterState());
    },

    // 필터 UI 바인딩
    bindFilters: function () {
        if (this.filtersBound) return;

        const categoryEl = document.getElementById('categoryFilter');
        const statusEl = document.getElementById('statusFilter');
        const keywordEl = document.getElementById('keywordFilter');
        const resetEl = document.getElementById('resetFilters');
        if (!categoryEl && !statusEl && !keywordEl && !resetEl) return;

        const apply = () => {
            this.applyCurrentFilters();
        };

        if (categoryEl) categoryEl.addEventListener('change', apply);
        if (statusEl) statusEl.addEventListener('change', apply);
        if (keywordEl) {
            keywordEl.addEventListener('input', () => {
                window.clearTimeout(this._kwTimer);
                this._kwTimer = window.setTimeout(apply, 150);
            });
        }
        if (resetEl) {
            resetEl.addEventListener('click', () => {
                if (categoryEl) categoryEl.value = 'all';
                if (statusEl) statusEl.value = 'all';
                if (keywordEl) keywordEl.value = '';
                apply();
            });
        }

        this.filtersBound = true;
    },

    // 언어 변경 시 프로젝트 업데이트
    updateLanguage: function (_lang) {
        const featuredContainer = document.querySelector('.project-preview .project-grid:not(#all-projects-grid)');
        if (featuredContainer) {
            this.renderFeaturedProjects('project-grid');
        }

        const allProjectsContainer = document.querySelector('#all-projects-grid');
        if (allProjectsContainer) {
            this.renderAllProjects('all-projects-grid');
            this.applyCurrentFilters();
        }
    }
};

// DOM이 로드되면 프로젝트 렌더링
document.addEventListener('DOMContentLoaded', function () {
    const renderAfterLoad = function () {
        if (document.querySelector('.project-preview .project-grid:not(#all-projects-grid)')) {
            ProjectRenderer.renderFeaturedProjects('project-grid');
        }
        if (document.querySelector('#all-projects-grid')) {
            ProjectRenderer.renderAllProjects('all-projects-grid');
            ProjectRenderer.bindFilters();
            ProjectRenderer.applyCurrentFilters();
        }
    };

    const loader = window.ProjectManager && ProjectManager.loadProjectsData ? ProjectManager.loadProjectsData() : Promise.resolve();
    loader.then(renderAfterLoad).catch(renderAfterLoad);
});

// 언어 변경 이벤트 리스너
document.addEventListener('languageChanged', function (event) {
    ProjectRenderer.updateLanguage(event.detail.language);
});

// 전역에서 사용할 수 있도록 노출
window.ProjectRenderer = ProjectRenderer;

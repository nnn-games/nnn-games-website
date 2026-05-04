// 프로젝트 카드 렌더링
const ProjectRenderer = {
    filtersBound: false,
    _kwTimer: null,
    projectDisplayOrder: [
        'tower-flood-race',
        'star-reach',
        'hacker-vs-security',
        'fruit-battles',
        'korean-spa',
        'legendary-dj-gear',
        'great-tower-reset'
    ],

    _u: function () {
        return window.NNNUtils;
    },

    formatMetricBadge: function (type, value, lang = 'ko') {
        const U = this._u();
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
        const label = U.escapeHtml(U.t(lang, labels[type], type));
        const safeValue = U.escapeHtml(value.toLocaleString());
        const cls = U.escapeHtml(classes[type] || '');
        return `<span class="badge-metric ${cls}">${label} ${safeValue}</span>`;
    },

    createMetricPanelItem: function (type, value, lang = 'ko') {
        const U = this._u();
        const labels = {
            visits: 'metric_visits',
            playing: 'metric_playing',
            favorites: 'metric_favorites'
        };
        const label = U.escapeHtml(U.t(lang, labels[type], type));
        const displayValue = U.escapeHtml(U.formatMetricValue(value, lang));
        const safeType = U.escapeHtml(type);
        return `
            <div class="project-kpi" data-project-kpi="${safeType}">
                <span class="project-kpi-label">${label}</span>
                <strong class="project-kpi-value" data-project-kpi-value="${safeType}">${displayValue}</strong>
            </div>
        `;
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
        if (!container) return;

        const currentLang = this._u().getCurrentLanguage();
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

    // 개별 프로젝트 카드 생성 (홈)
    createProjectCard: function (project, lang = 'ko') {
        const U = this._u();
        const card = document.createElement('div');
        card.className = 'project-card home-project-card';
        card.setAttribute('data-project-id', project.id);

        const platformData = this.getPlatformInfo(project);
        card.setAttribute('data-platform', platformData.key);

        const title = U.escapeHtml(U.pickLocalized(project.title, lang));
        const description = U.escapeHtml(U.pickLocalized(project.description, lang));
        const learnMore = U.escapeHtml(U.t(lang, 'learn_more', 'Learn More →'));
        const metrics = project.metrics || {};
        const statusBadge = this.getStatusBadge(project.status, lang);
        const metaItems = [project.platform, project.launchDate].filter(Boolean)
            .map((value) => `<span>${U.escapeHtml(value)}</span>`)
            .join('');
        const updatedAt = U.formatUpdatedAt(metrics.updatedAt, lang);
        const updatedLabel = U.escapeHtml(U.t(lang, 'project_updated_label', 'Updated'));
        const safeUpdated = U.escapeHtml(updatedAt || '--');
        const safeImage = U.escapeHtml(project.image || '');
        const safeId = U.escapeHtml(project.id);
        const safeDetailPage = U.escapeHtml(project.detailPage || '#');
        const platformLabel = U.escapeHtml(platformData.label);
        const platformKey = U.escapeHtml(platformData.key);

        card.innerHTML = `
            <div class="project-image-wrapper">
                <div class="platform-badge platform-${platformKey}">${platformLabel}</div>
                <div class="project-badges">
                    ${statusBadge}
                </div>
                <img src="${safeImage}" alt="${title}" loading="lazy">
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
                <p class="project-updated" data-project-updated>${updatedLabel} ${safeUpdated}</p>
                <a href="${safeDetailPage}" class="learn-more" data-key="learn_more" data-cta="project-card-featured" data-project-id="${safeId}" data-cta-origin="home-featured">${learnMore}</a>
            </div>
        `;
        return card;
    },

    syncHomeProjectCardMetrics: function (card, project, lang = 'ko') {
        if (!card || !project) return;
        const U = this._u();
        const metrics = project.metrics || {};
        ['visits', 'playing', 'favorites'].forEach((type) => {
            const valueEl = card.querySelector(`[data-project-kpi-value="${type}"]`);
            if (valueEl) {
                valueEl.textContent = U.formatMetricValue(metrics[type], lang);
            }
        });

        const updatedEl = card.querySelector('[data-project-updated]');
        if (updatedEl) {
            const updatedLabel = U.t(lang, 'project_updated_label', 'Updated');
            const updatedAt = U.formatUpdatedAt(metrics.updatedAt, lang) || '--';
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
        if (!container) return;

        const specialContainer = document.getElementById('special-projects-grid');
        const specialSection = document.getElementById('specialProjectSection');

        const currentLang = this._u().getCurrentLanguage();
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

    // 상세 정보가 포함된 프로젝트 카드 (프로젝트 목록)
    createDetailedProjectCard: function (project, lang = 'ko') {
        const U = this._u();
        const card = document.createElement('div');
        card.className = 'project-card detailed';
        card.setAttribute('data-project-id', project.id);
        card.setAttribute('data-category', project.category);
        card.setAttribute('data-status', project.status);

        const platformData = this.getPlatformInfo(project);
        card.setAttribute('data-platform', platformData.key);

        const title = U.escapeHtml(U.pickLocalized(project.title, lang));
        const description = U.escapeHtml(U.pickLocalized(project.description, lang));
        const metrics = project.metrics || {};
        const statusBadge = this.getStatusBadge(project.status, lang);
        const categoryBadge = this.getCategoryBadge(project.category);
        const learnMore = U.escapeHtml(U.t(lang, 'learn_more', 'Learn More →'));
        const detailLink = project.showDetailLinkInProjects === false ? '' : project.detailPage;
        const safeImage = U.escapeHtml(project.image || '');
        const safeId = U.escapeHtml(project.id);
        const safeDetailLink = U.escapeHtml(detailLink || '');
        const platformLabel = U.escapeHtml(platformData.label);
        const platformKey = U.escapeHtml(platformData.key);
        const safePlatform = U.escapeHtml(project.platform || '');
        const safeLaunch = U.escapeHtml(project.launchDate || '');

        const metricBadges = [
            typeof metrics.visits === 'number' ? this.formatMetricBadge('visits', metrics.visits, lang) : '',
            typeof metrics.playing === 'number' ? this.formatMetricBadge('playing', metrics.playing, lang) : '',
            typeof metrics.favorites === 'number' ? this.formatMetricBadge('favorites', metrics.favorites, lang) : ''
        ].filter(Boolean).join('');

        card.innerHTML = `
            <div class="project-image-wrapper">
                <div class="platform-badge platform-${platformKey}">${platformLabel}</div>
                <div class="project-badges">
                    ${statusBadge}
                    ${categoryBadge}
                </div>
                <img src="${safeImage}" alt="${title}" loading="lazy">
            </div>
            <div class="project-info">
                <h3>${title}</h3>
                <p>${description}</p>
                <div class="project-meta">
                    <span class="platform">${safePlatform}</span>
                    <span class="launch-date">${safeLaunch}</span>
                </div>
                ${metricBadges ? `<div class="project-metrics">${metricBadges}</div>` : ''}
                ${detailLink ? `<a href="${safeDetailLink}" class="learn-more" data-key="learn_more" data-cta="project-card-list" data-project-id="${safeId}" data-cta-origin="projects-list">${learnMore}</a>` : ''}
            </div>
        `;
        return card;
    },

    getStatusBadge: function (status, lang = 'ko') {
        const U = this._u();
        const label = U.escapeHtml(U.getStatusLabel(status, lang));
        const safeStatus = U.escapeHtml(status || '');
        return `<span class="status-badge status-${safeStatus}">${label}</span>`;
    },

    getCategoryBadge: function (category) {
        const U = this._u();
        const categoryLabels = { roblox: 'ROBLOX' };
        const rawLabel = categoryLabels[category] || (category || '').toUpperCase();
        const label = U.escapeHtml(rawLabel);
        const safeCategory = U.escapeHtml(category || '');
        return `<span class="category-badge category-${safeCategory}">${label}</span>`;
    },

    getPlatformInfo: function (project) {
        const platformMap = { roblox: { key: 'roblox', label: 'ROBLOX' } };
        const category = (project.category || '').toLowerCase();
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
        const U = this._u();
        const resultsEl = document.getElementById('projectResultsText');
        const emptyEl = document.getElementById('projectEmptyState');

        if (resultsEl) {
            if (visibleCount === 0) {
                resultsEl.textContent = U.t(lang, 'projects_filter_results_none', 'No projects match the current filters.');
            } else if (visibleCount === totalCount) {
                resultsEl.textContent = U.t(lang, 'projects_filter_results_default', 'Showing all projects.');
            } else {
                const template = U.t(lang, 'projects_filter_results', '{{visible}} / {{total}}');
                resultsEl.textContent = U.interpolate(template, { visible: visibleCount, total: totalCount });
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
            if (visible) visibleCount += 1;
        });

        const specialSection = document.getElementById('specialProjectSection');
        if (specialSection) {
            const specialCards = Array.from(specialSection.querySelectorAll('.project-card'));
            const hasVisibleSpecialCards = specialCards.some(card => card.style.display !== 'none');
            specialSection.classList.toggle('hidden', !hasVisibleSpecialCards);
        }

        this.updateFilterFeedback(visibleCount, cards.length, this._u().getCurrentLanguage());
    },

    applyCurrentFilters: function () {
        this.applyFilters(this.getCurrentFilterState());
    },

    bindFilters: function () {
        if (this.filtersBound) return;

        const categoryEl = document.getElementById('categoryFilter');
        const statusEl = document.getElementById('statusFilter');
        const keywordEl = document.getElementById('keywordFilter');
        const resetEl = document.getElementById('resetFilters');
        if (!categoryEl && !statusEl && !keywordEl && !resetEl) return;

        const apply = () => this.applyCurrentFilters();

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

    updateLanguage: function () {
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

document.addEventListener('languageChanged', function (event) {
    ProjectRenderer.updateLanguage(event.detail.language);
});

window.ProjectRenderer = ProjectRenderer;

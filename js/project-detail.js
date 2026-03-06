(function () {
    window.ProjectDetailConfigs = window.ProjectDetailConfigs || {};

    const STATUS_LABELS = {
        active: { ko: '운영 중', en: 'Live', ja: '運営中' },
        development: { ko: '개발 중', en: 'In Development', ja: '開発中' },
        completed: { ko: '완료', en: 'Completed', ja: '完了' },
        paused: { ko: '일시중단', en: 'Paused', ja: '一時停止' }
    };

    const LINK_TYPE_LABELS = {
        play: { ko: 'Play', en: 'Play', ja: 'Play' },
        trailer: { ko: 'Trailer', en: 'Trailer', ja: 'Trailer' },
        article: { ko: 'Article', en: 'Article', ja: 'Article' },
        group: { ko: 'Group', en: 'Group', ja: 'Group' },
        showcase: { ko: 'Showcase', en: 'Showcase', ja: 'Showcase' }
    };

    const getCurrentLanguage = function () {
        return localStorage.getItem('language') || document.documentElement.lang || 'ko';
    };

    const getTranslations = function () {
        try {
            return (typeof window !== 'undefined' && window.translations) || translations || {};
        } catch (_error) {
            return {};
        }
    };

    const t = function (lang, key, fallback = '') {
        const source = getTranslations();
        return (source[lang] && source[lang][key]) || fallback || key;
    };

    const pickLocalized = function (value, lang) {
        if (value == null) return '';
        if (typeof value === 'string' || typeof value === 'number') return String(value);
        if (Array.isArray(value)) return value.map((item) => pickLocalized(item, lang)).join(', ');
        if (typeof value === 'object') {
            return value[lang] || value.ko || value.en || value.ja || '';
        }
        return '';
    };

    const escapeHtml = function (value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    };

    const renderText = function (value, lang) {
        return escapeHtml(pickLocalized(value, lang)).replace(/\n/g, '<br>');
    };

    const getStatusLabel = function (status, lang) {
        const labels = STATUS_LABELS[status];
        return labels ? labels[lang] || labels.ko : status || '--';
    };

    const getLinkLabel = function (type, lang) {
        const labels = LINK_TYPE_LABELS[type];
        return labels ? labels[lang] || labels.ko : type;
    };

    const ensureMeta = function (selector, attribute, value) {
        if (!value) return;
        let node = document.head.querySelector(selector);
        if (!node) {
            node = document.createElement('meta');
            node.setAttribute(attribute, selector.includes('property=')
                ? selector.match(/property="([^"]+)"/)[1]
                : selector.match(/name="([^"]+)"/)[1]);
            document.head.appendChild(node);
        }
        node.setAttribute('content', value);
    };

    const updateSeo = function (config, lang) {
        const title = pickLocalized(config.seo && config.seo.title, lang)
            || `${pickLocalized(config.hero && config.hero.title, lang)} - NNN GAMES`;
        const description = pickLocalized(config.seo && config.seo.description, lang)
            || pickLocalized(config.hero && config.hero.tagline, lang);
        const keywords = pickLocalized(config.seo && config.seo.keywords, lang);
        const ogTitle = pickLocalized(config.seo && config.seo.ogTitle, lang) || title;
        const ogDescription = pickLocalized(config.seo && config.seo.ogDescription, lang) || description;
        const ogImage = (config.seo && config.seo.ogImage) || 'images/nnn-logo.png';

        document.title = title;
        ensureMeta('meta[name="description"]', 'name', description);
        ensureMeta('meta[name="keywords"]', 'name', keywords);
        ensureMeta('meta[property="og:title"]', 'property', ogTitle);
        ensureMeta('meta[property="og:description"]', 'property', ogDescription);
        ensureMeta('meta[property="og:image"]', 'property', ogImage);
        ensureMeta('meta[name="twitter:title"]', 'name', ogTitle);
        ensureMeta('meta[name="twitter:description"]', 'name', ogDescription);
        ensureMeta('meta[name="twitter:image"]', 'name', ogImage);
    };

    const buildMedia = function (media, lang, title) {
        if (!media) return '';

        if (media.type === 'youtube') {
            const embedUrl = escapeHtml(media.src || '');
            const iframeTitle = escapeHtml(pickLocalized(media.title, lang) || title);
            return `
                <div class="detail-media-shell detail-media-frame">
                    <iframe src="${embedUrl}" title="${iframeTitle}" frameborder="0"
                        class="absolute inset-0 h-full w-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                </div>
            `;
        }

        const src = escapeHtml(media.src || '');
        const alt = escapeHtml(pickLocalized(media.alt, lang) || title);
        return `
            <div class="detail-media-shell">
                <img src="${src}" alt="${alt}" class="detail-media-image">
            </div>
        `;
    };

    const buildHeroActions = function (buttons, project, lang) {
        const items = (buttons || [])
            .map((button) => {
                const url = button.url || (project && project.links ? project.links[button.type] : '');
                if (!url) return '';
                const styleClass = button.style === 'ghost'
                    ? 'btn-ghost'
                    : button.style === 'secondary'
                        ? 'btn-secondary'
                        : 'btn-primary';
                const label = renderText(button.text, lang);
                return `
                    <a href="${escapeHtml(url)}" class="${styleClass}" target="_blank" rel="noreferrer"
                        data-cta="${escapeHtml(button.type || 'external')}" data-project-id="${escapeHtml(project ? project.id : '')}"
                        data-cta-origin="detail-header">${label}</a>
                `;
            })
            .filter(Boolean)
            .join('');

        return `
            <div class="detail-hero-actions">
                ${items}
                <a href="projects.html" class="btn-ghost" data-cta="detail-back" data-project-id="${escapeHtml(project ? project.id : '')}" data-cta-origin="detail-header">
                    ${escapeHtml(t(lang, 'project_detail_back_to_projects', 'Back to Projects'))}
                </a>
            </div>
        `;
    };

    const buildHighlights = function (highlights, lang) {
        const items = (highlights || [])
            .map((item) => `
                <article class="detail-highlight-card">
                    <p class="detail-highlight-eyebrow">${renderText(item.eyebrow, lang)}</p>
                    <h3>${renderText(item.title, lang)}</h3>
                    <p>${renderText(item.description, lang)}</p>
                </article>
            `)
            .join('');

        if (!items) return '';

        return `
            <section class="detail-section">
                <div class="section-header section-header-left detail-section-header">
                    <p class="section-kicker">${escapeHtml(t(lang, 'project_detail_highlights_eyebrow', 'Highlights'))}</p>
                    <h2>${escapeHtml(t(lang, 'project_detail_highlights_title', 'Key Points'))}</h2>
                </div>
                <div class="detail-highlight-grid">
                    ${items}
                </div>
            </section>
        `;
    };

    const buildLinks = function (links, project, lang) {
        const items = (links || [])
            .map((item) => {
                const url = item.url || (project && project.links ? project.links[item.type] : '');
                if (!url) return '';
                return `
                    <a href="${escapeHtml(url)}" class="detail-link-card" target="_blank" rel="noreferrer"
                        data-cta="${escapeHtml(item.type || 'external')}" data-project-id="${escapeHtml(project ? project.id : '')}"
                        data-cta-origin="detail-links">
                        <span class="detail-link-meta">${escapeHtml(getLinkLabel(item.type, lang))}</span>
                        <strong>${renderText(item.text, lang)}</strong>
                    </a>
                `;
            })
            .filter(Boolean)
            .join('');

        const content = items || `
            <div class="detail-link-card detail-link-card-muted">
                <span class="detail-link-meta">${escapeHtml(t(lang, 'project_detail_links_title', 'Resources'))}</span>
                <strong>${escapeHtml(t(lang, 'project_detail_links_pending', 'Additional links are being prepared.'))}</strong>
            </div>
        `;

        return `
            <section class="detail-section">
                <div class="section-header section-header-left detail-section-header">
                    <p class="section-kicker">${escapeHtml(t(lang, 'project_detail_links_eyebrow', 'Resources'))}</p>
                    <h2>${escapeHtml(t(lang, 'project_detail_links_title', 'Related Links'))}</h2>
                </div>
                <div class="detail-link-grid">
                    ${content}
                </div>
            </section>
        `;
    };

    const buildSnapshot = function (config, project, lang) {
        const snapshot = config.snapshot || {};
        const stackFallback = project && Array.isArray(project.technologies) ? project.technologies.join(' / ') : '--';
        const items = [
            {
                label: t(lang, 'project_detail_snapshot_launch', 'Launch'),
                value: pickLocalized(snapshot.launch, lang) || (project && project.launchDate) || '--'
            },
            {
                label: t(lang, 'project_detail_snapshot_status', 'Status'),
                value: pickLocalized(snapshot.status, lang) || getStatusLabel(project && project.status, lang)
            },
            {
                label: t(lang, 'project_detail_snapshot_platform', 'Platform'),
                value: pickLocalized(snapshot.platform, lang) || (project && project.platform) || 'Roblox'
            },
            {
                label: t(lang, 'project_detail_snapshot_client', 'Client'),
                value: pickLocalized(snapshot.client, lang) || (project && project.client) || '--'
            },
            {
                label: t(lang, 'project_detail_snapshot_stack', 'Stack'),
                value: pickLocalized(snapshot.stack, lang) || stackFallback
            }
        ];

        return `
            <section class="detail-sidebar-card">
                <h3>${escapeHtml(t(lang, 'project_detail_snapshot_title', 'Project Snapshot'))}</h3>
                <dl class="detail-snapshot-list">
                    ${items.map((item) => `
                        <div>
                            <dt>${escapeHtml(item.label)}</dt>
                            <dd>${escapeHtml(item.value)}</dd>
                        </div>
                    `).join('')}
                </dl>
            </section>
        `;
    };

    const buildFeatures = function (features, lang) {
        const items = (features || [])
            .map((item) => `
                <li class="detail-feature-item">
                    <strong>${renderText(item.title, lang)}</strong>
                    <span>${renderText(item.description, lang)}</span>
                </li>
            `)
            .join('');

        return `
            <section class="detail-sidebar-card">
                <h3>${escapeHtml(t(lang, 'project_detail_features_title', 'Features'))}</h3>
                <ul class="detail-feature-list">
                    ${items}
                </ul>
            </section>
        `;
    };

    const buildGallery = function (gallery, lang) {
        const items = (gallery || [])
            .map((item) => `
                <figure class="detail-gallery-card">
                    <img src="${escapeHtml(item.src)}" alt="${escapeHtml(pickLocalized(item.alt, lang))}">
                </figure>
            `)
            .join('');

        if (!items) return '';

        return `
            <section class="gallery-section detail-gallery-section">
                <div class="section-header">
                    <p class="section-kicker">${escapeHtml(t(lang, 'project_detail_gallery_eyebrow', 'Gallery'))}</p>
                    <h2>${escapeHtml(t(lang, 'gallery_title', 'Gallery'))}</h2>
                </div>
                <div class="image-gallery detail-gallery-grid">
                    ${items}
                </div>
            </section>
        `;
    };

    const buildPage = function (config, project, lang) {
        const title = pickLocalized(config.hero && config.hero.title, lang)
            || (project && pickLocalized(project.title, lang))
            || 'Project';
        const tagline = pickLocalized(config.hero && config.hero.tagline, lang);
        const overview = (config.overview || [])
            .map((paragraph) => `<p>${renderText(paragraph, lang)}</p>`)
            .join('');
        const media = buildMedia(config.media, lang, title);
        const highlights = buildHighlights(config.highlights, lang);
        const links = buildLinks(config.links, project, lang);
        const gallery = buildGallery(config.gallery, lang);
        const heroPlatform = pickLocalized(config.hero && config.hero.platform, lang)
            || ((project && project.platform) ? `Platform: ${project.platform}` : 'Platform: Roblox');

        return `
            <section class="project-header">
                <div class="container detail-hero-shell">
                    <p class="section-kicker detail-project-kicker">${escapeHtml(t(lang, 'project_detail_kicker', 'Project Detail'))}</p>
                    <h1>${escapeHtml(title)}</h1>
                    <p class="detail-hero-summary">${escapeHtml(tagline)}</p>
                    <div class="project-meta-info detail-hero-badges">
                        <span class="badge-metric play">${renderText(config.hero && config.hero.status, lang)}</span>
                        <span class="badge-metric ugc">${renderText(config.hero && config.hero.genre, lang)}</span>
                        <span class="badge-metric media">${escapeHtml(heroPlatform)}</span>
                    </div>
                    <div class="project-metrics-header detail-metrics-row">
                        <span class="badge-metric play hidden" data-metric="visits">Visits --</span>
                        <span class="badge-metric media hidden" data-metric="likeRatio">Like --%</span>
                    </div>
                    ${buildHeroActions(config.ctaButtons, project, lang)}
                </div>
            </section>

            <section class="project-main detail-project-main">
                ${media}
                <div class="detail-project-grid">
                    <div class="detail-project-content">
                        <section class="detail-section">
                            <div class="section-header section-header-left detail-section-header">
                                <p class="section-kicker">${escapeHtml(t(lang, 'project_detail_overview_eyebrow', 'Overview'))}</p>
                                <h2>${escapeHtml(t(lang, 'project_detail_overview_title', 'Project Overview'))}</h2>
                            </div>
                            <div class="detail-copy">
                                ${overview}
                            </div>
                        </section>
                        ${highlights}
                        ${links}
                    </div>
                    <aside class="detail-sidebar">
                        ${buildSnapshot(config, project, lang)}
                        ${buildFeatures(config.features, lang)}
                    </aside>
                </div>
                ${gallery}
            </section>
        `;
    };

    const getProjectConfig = function (projectId) {
        return window.ProjectDetailConfigs && window.ProjectDetailConfigs[projectId]
            ? window.ProjectDetailConfigs[projectId]
            : null;
    };

    const getProjectData = async function (projectId) {
        if (!(window.ProjectManager && ProjectManager.loadProjectsData)) return null;
        try {
            await ProjectManager.loadProjectsData();
            if (ProjectManager.getProject) {
                return ProjectManager.getProject(projectId);
            }
        } catch (_error) {
            return null;
        }
        return null;
    };

    const renderError = function (root, lang) {
        root.innerHTML = `
            <section class="project-main">
                <p class="project-detail-error">${escapeHtml(t(lang, 'project_detail_error', 'Project detail could not be loaded.'))}</p>
            </section>
        `;
    };

    const renderProjectDetail = async function () {
        const projectId = document.body.getAttribute('data-project-id');
        const root = document.getElementById('project-detail-root');
        if (!projectId || !root) return;

        const lang = getCurrentLanguage();
        const config = getProjectConfig(projectId);
        if (!config) {
            renderError(root, lang);
            return;
        }

        const project = await getProjectData(projectId);
        root.innerHTML = buildPage(config, project || { id: projectId, links: {} }, lang);
        updateSeo(config, lang);
        document.dispatchEvent(new CustomEvent('projectDetailRendered', {
            detail: { projectId }
        }));
    };

    document.addEventListener('DOMContentLoaded', function () {
        renderProjectDetail().catch(function () {
            const root = document.getElementById('project-detail-root');
            if (!root) return;
            renderError(root, getCurrentLanguage());
        });
    });

    document.addEventListener('languageChanged', function () {
        renderProjectDetail().catch(function () {
            const root = document.getElementById('project-detail-root');
            if (!root) return;
            renderError(root, getCurrentLanguage());
        });
    });
})();

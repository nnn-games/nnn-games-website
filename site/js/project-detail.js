// 프로젝트 상세 페이지 렌더러 (운영 중 + 개발 중 통합)
// - 데이터 소스: js/project-details/<slug>.js (config) + data/projects.json (project)
// - 모드: project.detailRenderer > config.mode > status (development 이면 간소화 레이아웃, 그 외 표준 레이아웃)
//   standard    : 히어로 / 미디어 / 개요 / 핵심 포인트 / 링크 / 스냅샷 / 특징 / 갤러리
//   development : 히어로(제목·한 줄 소개·장르·플랫폼·출시 예정) / 프리뷰 이미지 / 안내문
(function () {
    window.ProjectDetailConfigs = window.ProjectDetailConfigs || {};

    const FALLBACK_IMAGE = 'images/nnn-logo.png';

    const U = function () { return window.NNNUtils; };

    const renderText = function (value, lang) {
        return U().escapeHtml(U().pickLocalized(value, lang)).replace(/\n/g, '<br>');
    };

    const resolveMode = function (config, project) {
        if (project && (project.detailRenderer === 'standard' || project.detailRenderer === 'development')) return project.detailRenderer;
        if (config && (config.mode === 'standard' || config.mode === 'development')) return config.mode;
        return project && project.status === 'development' ? 'development' : 'standard';
    };

    const ensureMeta = function (selector, attribute, value) {
        if (!value) return;
        let node = document.head.querySelector(selector);
        if (!node) {
            node = document.createElement('meta');
            const matchProperty = selector.match(/property="([^"]+)"/);
            const matchName = selector.match(/name="([^"]+)"/);
            const attrValue = matchProperty ? matchProperty[1] : (matchName ? matchName[1] : null);
            if (!attrValue) return;
            node.setAttribute(attribute, attrValue);
            document.head.appendChild(node);
        }
        node.setAttribute('content', value);
    };

    const updateSeo = function (config, project, lang) {
        const u = U();
        const heroTitle = u.pickLocalized(config.hero && config.hero.title, lang)
            || (project && u.pickLocalized(project.title, lang))
            || 'Project';
        const title = u.pickLocalized(config.seo && config.seo.title, lang) || `${heroTitle} - NNN GAMES`;
        const description = u.pickLocalized(config.seo && config.seo.description, lang)
            || u.pickLocalized(config.hero && config.hero.tagline, lang)
            || (project && u.pickLocalized(project.description, lang))
            || '';
        const keywords = u.pickLocalized(config.seo && config.seo.keywords, lang);
        const ogTitle = u.pickLocalized(config.seo && config.seo.ogTitle, lang) || title;
        const ogDescription = u.pickLocalized(config.seo && config.seo.ogDescription, lang) || description;
        const ogImage = (config.seo && config.seo.ogImage)
            || (config.media && config.media.type !== 'youtube' && config.media.src)
            || (project && project.image)
            || FALLBACK_IMAGE;

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
        const u = U();

        if (media.type === 'youtube') {
            const embedUrl = u.escapeHtml(media.src || '');
            const iframeTitle = u.escapeHtml(u.pickLocalized(media.title, lang) || title);
            return `
                <div class="detail-media-shell detail-media-frame">
                    <iframe src="${embedUrl}" title="${iframeTitle}" frameborder="0"
                        class="absolute inset-0 h-full w-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                </div>
            `;
        }

        const src = u.escapeHtml(media.src || '');
        const alt = u.escapeHtml(u.pickLocalized(media.alt, lang) || title);
        return `
            <div class="detail-media-shell">
                <img src="${src}" alt="${alt}" class="detail-media-image" loading="lazy">
            </div>
        `;
    };

    const buildCtaButtons = function (buttons, project, lang) {
        const u = U();
        const projectId = project ? project.id : '';
        return (buttons || [])
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
                    <a href="${u.escapeHtml(url)}" class="${styleClass}" target="_blank" rel="noreferrer"
                        data-cta="${u.escapeHtml(button.type || 'external')}" data-project-id="${u.escapeHtml(projectId)}"
                        data-cta-origin="detail-header">${label}</a>
                `;
            })
            .filter(Boolean)
            .join('');
    };

    const buildHeroActions = function (buttons, project, lang) {
        const u = U();
        const projectId = project ? project.id : '';
        const backUrl = project && project.category === 'mobile' ? 'projects-mobile.html' : 'projects-roblox.html';
        return `
            <div class="detail-hero-actions">
                ${buildCtaButtons(buttons, project, lang)}
                <a href="${backUrl}" class="btn-ghost" data-cta="detail-back" data-project-id="${u.escapeHtml(projectId)}" data-cta-origin="detail-header">
                    ${u.escapeHtml(u.t(lang, 'project_detail_back_to_projects', 'Back to Projects'))}
                </a>
            </div>
        `;
    };

    const buildHighlights = function (highlights, lang) {
        const u = U();
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
                    <p class="section-kicker">${u.escapeHtml(u.t(lang, 'project_detail_highlights_eyebrow', 'Highlights'))}</p>
                    <h2>${u.escapeHtml(u.t(lang, 'project_detail_highlights_title', 'Key Points'))}</h2>
                </div>
                <div class="detail-highlight-grid">
                    ${items}
                </div>
            </section>
        `;
    };

    const buildLinks = function (links, project, lang) {
        const u = U();
        const projectId = project ? project.id : '';
        const items = (links || [])
            .map((item) => {
                const url = item.url || (project && project.links ? project.links[item.type] : '');
                if (!url) return '';
                return `
                    <a href="${u.escapeHtml(url)}" class="detail-link-card" target="_blank" rel="noreferrer"
                        data-cta="${u.escapeHtml(item.type || 'external')}" data-project-id="${u.escapeHtml(projectId)}"
                        data-cta-origin="detail-links">
                        <span class="detail-link-meta">${u.escapeHtml(u.getLinkLabel(item.type, lang))}</span>
                        <strong>${renderText(item.text, lang)}</strong>
                    </a>
                `;
            })
            .filter(Boolean)
            .join('');

        const content = items || `
            <div class="detail-link-card detail-link-card-muted">
                <span class="detail-link-meta">${u.escapeHtml(u.t(lang, 'project_detail_links_title', 'Resources'))}</span>
                <strong>${u.escapeHtml(u.t(lang, 'project_detail_links_pending', 'Additional links are being prepared.'))}</strong>
            </div>
        `;

        return `
            <section class="detail-section">
                <div class="section-header section-header-left detail-section-header">
                    <p class="section-kicker">${u.escapeHtml(u.t(lang, 'project_detail_links_eyebrow', 'Resources'))}</p>
                    <h2>${u.escapeHtml(u.t(lang, 'project_detail_links_title', 'Related Links'))}</h2>
                </div>
                <div class="detail-link-grid">
                    ${content}
                </div>
            </section>
        `;
    };

    const buildSnapshot = function (config, project, lang) {
        const u = U();
        const snapshot = config.snapshot || {};
        const stackFallback = project && Array.isArray(project.technologies) ? project.technologies.join(' / ') : '--';
        const items = [
            {
                label: u.t(lang, 'project_detail_snapshot_launch', 'Launch'),
                value: u.pickLocalized(snapshot.launch, lang) || (project && project.launchDate) || '--'
            },
            {
                label: u.t(lang, 'project_detail_snapshot_status', 'Status'),
                value: u.pickLocalized(snapshot.status, lang) || u.getStatusLabel(project && project.status, lang)
            },
            {
                label: u.t(lang, 'project_detail_snapshot_platform', 'Platform'),
                value: u.pickLocalized(snapshot.platform, lang) || (project && project.platform) || 'Roblox'
            },
            {
                label: u.t(lang, 'project_detail_snapshot_client', 'Client'),
                value: u.pickLocalized(snapshot.client, lang) || (project && project.client) || '--'
            },
            {
                label: u.t(lang, 'project_detail_snapshot_stack', 'Stack'),
                value: u.pickLocalized(snapshot.stack, lang) || stackFallback
            }
        ];

        return `
            <section class="detail-sidebar-card">
                <h3>${u.escapeHtml(u.t(lang, 'project_detail_snapshot_title', 'Project Snapshot'))}</h3>
                <dl class="detail-snapshot-list">
                    ${items.map((item) => `
                        <div>
                            <dt>${u.escapeHtml(item.label)}</dt>
                            <dd>${u.escapeHtml(item.value)}</dd>
                        </div>
                    `).join('')}
                </dl>
            </section>
        `;
    };

    const buildFeatures = function (features, lang) {
        const u = U();
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
                <h3>${u.escapeHtml(u.t(lang, 'project_detail_features_title', 'Features'))}</h3>
                <ul class="detail-feature-list">
                    ${items}
                </ul>
            </section>
        `;
    };

    const buildGallery = function (gallery, lang) {
        const u = U();
        const items = (gallery || [])
            .map((item) => `
                <figure class="detail-gallery-card">
                    <img src="${u.escapeHtml(item.src)}" alt="${u.escapeHtml(u.pickLocalized(item.alt, lang))}" loading="lazy">
                </figure>
            `)
            .join('');

        if (!items) return '';

        return `
            <section class="gallery-section detail-gallery-section">
                <div class="section-header">
                    <p class="section-kicker">${u.escapeHtml(u.t(lang, 'project_detail_gallery_eyebrow', 'Gallery'))}</p>
                    <h2>${u.escapeHtml(u.t(lang, 'gallery_title', 'Gallery'))}</h2>
                </div>
                <div class="image-gallery detail-gallery-grid">
                    ${items}
                </div>
            </section>
        `;
    };

    // 운영 중(표준) 레이아웃
    const buildStandardPage = function (config, project, lang) {
        const u = U();
        const title = u.pickLocalized(config.hero && config.hero.title, lang)
            || (project && u.pickLocalized(project.title, lang))
            || 'Project';
        const tagline = u.pickLocalized(config.hero && config.hero.tagline, lang);
        const overview = (config.overview || [])
            .map((paragraph) => `<p>${renderText(paragraph, lang)}</p>`)
            .join('');
        const media = buildMedia(config.media, lang, title);
        const highlights = buildHighlights(config.highlights, lang);
        const links = buildLinks(config.links, project, lang);
        const gallery = buildGallery(config.gallery, lang);
        const heroPlatform = u.pickLocalized(config.hero && config.hero.platform, lang)
            || ((project && project.platform) ? `Platform: ${project.platform}` : 'Platform: Roblox');

        return `
            <section class="project-header">
                <div class="container detail-hero-shell">
                    <p class="section-kicker detail-project-kicker">${u.escapeHtml(u.t(lang, 'project_detail_kicker', 'Project Detail'))}</p>
                    <h1>${u.escapeHtml(title)}</h1>
                    <p class="detail-hero-summary">${u.escapeHtml(tagline)}</p>
                    <div class="project-meta-info detail-hero-badges">
                        <span class="badge-metric play">${renderText(config.hero && config.hero.status, lang)}</span>
                        <span class="badge-metric ugc">${renderText(config.hero && config.hero.genre, lang)}</span>
                        <span class="badge-metric media">${u.escapeHtml(heroPlatform)}</span>
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
                                <p class="section-kicker">${u.escapeHtml(u.t(lang, 'project_detail_overview_eyebrow', 'Overview'))}</p>
                                <h2>${u.escapeHtml(u.t(lang, 'project_detail_overview_title', 'Project Overview'))}</h2>
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

    // 개발 중 레이아웃: 제목 / 한 줄 소개 / 상태·장르·플랫폼·출시 예정 / 프리뷰 이미지 / 안내문
    const buildDevelopmentPage = function (config, project, lang) {
        const u = U();
        const title = u.pickLocalized(config.hero && config.hero.title, lang)
            || (project && u.pickLocalized(project.title, lang))
            || 'Project';
        const tagline = u.pickLocalized(config.hero && config.hero.tagline, lang)
            || (project && u.pickLocalized(project.description, lang))
            || '';
        const previewSrc = (config.media && config.media.type !== 'youtube' && config.media.src)
            || (project && project.image)
            || FALLBACK_IMAGE;
        const previewAlt = u.pickLocalized(config.media && config.media.alt, lang) || title;
        const genre = u.pickLocalized(config.hero && config.hero.genre, lang) || '';
        const platform = u.pickLocalized(config.hero && config.hero.platform, lang)
            || ((project && project.platform) ? `Platform: ${project.platform}` : 'Platform: Roblox');
        const launch = u.pickLocalized(config.snapshot && config.snapshot.launch, lang)
            || (project && project.launchDate)
            || u.t(lang, 'project_detail_launch_tba', 'Launch: TBA');
        const statusLabel = u.pickLocalized(config.hero && config.hero.status, lang)
            || u.getStatusLabel('development', lang);

        return `
            <section class="project-header">
                <div class="container detail-hero-shell">
                    <p class="section-kicker detail-project-kicker">${u.escapeHtml(u.t(lang, 'project_detail_dev_kicker', 'In Development'))}</p>
                    <h1>${u.escapeHtml(title)}</h1>
                    <p class="detail-hero-summary">${u.escapeHtml(tagline)}</p>
                    <div class="project-meta-info detail-hero-badges">
                        <span class="badge-metric play">${u.escapeHtml(statusLabel)}</span>
                        <span class="badge-metric ugc">${u.escapeHtml(genre)}</span>
                        <span class="badge-metric media">${u.escapeHtml(platform)}</span>
                        <span class="badge-metric play">${u.escapeHtml(launch)}</span>
                    </div>
                    ${buildHeroActions(config.ctaButtons, project, lang)}
                </div>
            </section>

            <section class="project-main detail-project-main">
                <div class="detail-media-shell">
                    <img src="${u.escapeHtml(previewSrc)}" alt="${u.escapeHtml(previewAlt)}" class="detail-media-image" loading="lazy">
                </div>
                <p class="detail-dev-note">${u.escapeHtml(u.t(lang, 'project_detail_dev_note', 'Detailed information will be revealed as we approach launch.'))}</p>
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
        const u = U();
        root.innerHTML = `
            <section class="project-main">
                <p class="project-detail-error">${u.escapeHtml(u.t(lang, 'project_detail_error', 'Project detail could not be loaded.'))}</p>
            </section>
        `;
    };

    const renderProjectDetail = async function () {
        const projectId = document.body.getAttribute('data-project-id');
        const root = document.getElementById('project-detail-root');
        if (!projectId || !root) return;

        if (window.ProjectDetailReady && typeof window.ProjectDetailReady.then === 'function') {
            try {
                await window.ProjectDetailReady;
            } catch (_error) {
                // Loader 실패 시 아래에서 config === null로 처리되어 renderError로 폴백
            }
        }

        const lang = U().getCurrentLanguage();
        const project = await getProjectData(projectId);
        let config = getProjectConfig(projectId);
        const mode = resolveMode(config, project);

        // 개발 중 모드는 config 없이도 projects.json 만으로 렌더할 수 있다.
        if (!config) {
            if (mode !== 'development') {
                renderError(root, lang);
                return;
            }
            config = {};
        }

        const projectOrStub = project || { id: projectId, links: {} };
        root.innerHTML = mode === 'development'
            ? buildDevelopmentPage(config, projectOrStub, lang)
            : buildStandardPage(config, projectOrStub, lang);
        updateSeo(config, project, lang);
        document.dispatchEvent(new CustomEvent('projectDetailRendered', {
            detail: { projectId, mode }
        }));
    };

    document.addEventListener('DOMContentLoaded', function () {
        renderProjectDetail().catch(function () {
            const root = document.getElementById('project-detail-root');
            if (!root) return;
            renderError(root, U().getCurrentLanguage());
        });
    });

    document.addEventListener('languageChanged', function () {
        renderProjectDetail().catch(function () {
            const root = document.getElementById('project-detail-root');
            if (!root) return;
            renderError(root, U().getCurrentLanguage());
        });
    });
})();

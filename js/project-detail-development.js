// 개발 중인 프로젝트의 간소화된 상세 페이지 렌더러
// - 표시 항목: 제목 / 한 줄 소개 / 장르 / 플랫폼 / 출시 예정일 / 프리뷰 이미지
// - 데이터 소스: js/project-details/<slug>.js (config) + data/projects.json (project)
// - 기존 `js/project-detail.js` 대신 본 파일을 로드해 사용 (HTML 의 script 태그를 교체)
(function () {
    window.ProjectDetailConfigs = window.ProjectDetailConfigs || {};

    const FALLBACK_IMAGE = 'images/nnn-logo.png';
    const STYLE_ID = 'detail-dev-style';

    const STYLE_CSS = `
.detail-dev-note {
    margin-top: 1.75rem;
    padding: 1.25rem 1.5rem;
    border-radius: 1rem;
    border: 1px dashed #cbd5e1;
    background: #f8fafc;
    color: #475569;
    text-align: center;
    font-size: 0.95rem;
    line-height: 1.55;
}
`;

    const I18N = {
        ko: {
            kicker: '개발 중인 프로젝트',
            backToProjects: '프로젝트 목록으로',
            note: '자세한 정보는 출시에 맞춰 공개될 예정입니다.',
            launchTba: '출시일 미정',
            statusInDev: '개발 중'
        },
        en: {
            kicker: 'In Development',
            backToProjects: 'Back to Projects',
            note: 'Detailed information will be revealed as we approach launch.',
            launchTba: 'Launch: TBA',
            statusInDev: 'In Development'
        },
        ja: {
            kicker: '開発中プロジェクト',
            backToProjects: 'プロジェクト一覧へ',
            note: '詳細情報はリリースに合わせて公開予定です。',
            launchTba: 'リリース日未定',
            statusInDev: '開発中'
        }
    };

    const U = function () { return window.NNNUtils; };

    const t = function (lang, key) {
        return (I18N[lang] || I18N.ko)[key] || I18N.ko[key] || key;
    };

    const renderText = function (value, lang) {
        return U().escapeHtml(U().pickLocalized(value, lang)).replace(/\n/g, '<br>');
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

    const ensureStyle = function () {
        if (document.getElementById(STYLE_ID)) return;
        const style = document.createElement('style');
        style.id = STYLE_ID;
        style.textContent = STYLE_CSS;
        document.head.appendChild(style);
    };

    const updateSeo = function (config, project, lang) {
        const u = U();
        const heroTitle = u.pickLocalized(config.hero && config.hero.title, lang)
            || (project && u.pickLocalized(project.title, lang))
            || 'Project';
        const titleMeta = u.pickLocalized(config.seo && config.seo.title, lang)
            || `${heroTitle} - NNN GAMES`;
        const description = u.pickLocalized(config.seo && config.seo.description, lang)
            || u.pickLocalized(config.hero && config.hero.tagline, lang)
            || (project && u.pickLocalized(project.description, lang))
            || '';
        const ogImage = (config.seo && config.seo.ogImage)
            || (config.media && config.media.src)
            || (project && project.image)
            || FALLBACK_IMAGE;

        document.title = titleMeta;
        ensureMeta('meta[name="description"]', 'name', description);
        ensureMeta('meta[property="og:title"]', 'property', titleMeta);
        ensureMeta('meta[property="og:description"]', 'property', description);
        ensureMeta('meta[property="og:image"]', 'property', ogImage);
        ensureMeta('meta[name="twitter:title"]', 'name', titleMeta);
        ensureMeta('meta[name="twitter:description"]', 'name', description);
        ensureMeta('meta[name="twitter:image"]', 'name', ogImage);
    };

    const buildPage = function (config, project, lang) {
        const u = U();
        const title = u.pickLocalized(config.hero && config.hero.title, lang)
            || (project && u.pickLocalized(project.title, lang))
            || 'Project';
        const tagline = u.pickLocalized(config.hero && config.hero.tagline, lang)
            || (project && u.pickLocalized(project.description, lang))
            || '';
        const previewSrc = (config.media && config.media.src)
            || (project && project.image)
            || FALLBACK_IMAGE;
        const previewAlt = u.pickLocalized(config.media && config.media.alt, lang) || title;
        const genre = u.pickLocalized(config.hero && config.hero.genre, lang) || '';
        const platform = u.pickLocalized(config.hero && config.hero.platform, lang)
            || ((project && project.platform) ? `Platform: ${project.platform}` : 'Platform: Roblox');
        const launch = u.pickLocalized(config.snapshot && config.snapshot.launch, lang)
            || (project && project.launchDate)
            || t(lang, 'launchTba');
        const statusLabel = u.pickLocalized(config.hero && config.hero.status, lang)
            || t(lang, 'statusInDev');

        const ctaItems = (config.ctaButtons || [])
            .map((button) => {
                const url = button.url || (project && project.links ? project.links[button.type] : '');
                if (!url) return '';
                const styleClass = button.style === 'ghost'
                    ? 'btn-ghost'
                    : button.style === 'secondary'
                        ? 'btn-secondary'
                        : 'btn-primary';
                const label = renderText(button.text, lang);
                return `<a href="${u.escapeHtml(url)}" class="${styleClass}" target="_blank" rel="noreferrer"
                    data-cta="${u.escapeHtml(button.type || 'external')}" data-cta-origin="detail-header">${label}</a>`;
            })
            .filter(Boolean)
            .join('');

        const backUrl = project && project.category === 'mobile' ? 'projects-mobile.html' : 'projects-roblox.html';

        return `
            <section class="project-header">
                <div class="container detail-hero-shell">
                    <p class="section-kicker detail-project-kicker">${u.escapeHtml(t(lang, 'kicker'))}</p>
                    <h1>${u.escapeHtml(title)}</h1>
                    <p class="detail-hero-summary">${u.escapeHtml(tagline)}</p>
                    <div class="project-meta-info detail-hero-badges">
                        <span class="badge-metric play">${u.escapeHtml(statusLabel)}</span>
                        <span class="badge-metric ugc">${u.escapeHtml(genre)}</span>
                        <span class="badge-metric media">${u.escapeHtml(platform)}</span>
                        <span class="badge-metric play">${u.escapeHtml(launch)}</span>
                    </div>
                    <div class="detail-hero-actions">
                        ${ctaItems}
                        <a href="${backUrl}" class="btn-ghost" data-cta="detail-back" data-cta-origin="detail-header">
                            ${u.escapeHtml(t(lang, 'backToProjects'))}
                        </a>
                    </div>
                </div>
            </section>

            <section class="project-main detail-project-main">
                <div class="detail-media-shell">
                    <img src="${u.escapeHtml(previewSrc)}" alt="${u.escapeHtml(previewAlt)}" class="detail-media-image" loading="lazy">
                </div>
                <p class="detail-dev-note">${u.escapeHtml(t(lang, 'note'))}</p>
            </section>
        `;
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

        const lang = U().getCurrentLanguage();
        const config = window.ProjectDetailConfigs[projectId] || {};

        let project = null;
        if (window.ProjectManager && ProjectManager.loadProjectsData) {
            try {
                await ProjectManager.loadProjectsData();
                if (ProjectManager.getProject) project = ProjectManager.getProject(projectId);
            } catch (_e) { /* ignore */ }
        }

        ensureStyle();
        root.innerHTML = buildPage(config, project, lang);
        updateSeo(config, project, lang);
        document.dispatchEvent(new CustomEvent('projectDetailRendered', {
            detail: { projectId }
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

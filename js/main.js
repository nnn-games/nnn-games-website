// 모바일 메뉴 토글 기능
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const header = document.querySelector('.main-header');
    const getCurrentLang = () => document.documentElement.lang || 'ko';
    const getTranslationValue = (key, fallback) => {
        try {
            const source = (typeof window !== 'undefined' && window.translations) || translations || {};
            return (source[getCurrentLang()] && source[getCurrentLang()][key]) || fallback;
        } catch (_error) {
            return fallback;
        }
    };
    const formatCompactNumber = (value, lang) => {
        if (typeof value !== 'number') return '--';
        try {
            return new Intl.NumberFormat(lang, {
                notation: 'compact',
                maximumFractionDigits: 1
            }).format(value);
        } catch (_error) {
            return value.toLocaleString();
        }
    };
    const updateMenuToggleLabel = () => {
        if (!menuToggle || !mainNav) return;
        const isOpen = mainNav.classList.contains('active');
        const key = isOpen ? 'nav_menu_close' : 'nav_menu_open';
        const fallback = isOpen ? 'Close menu' : 'Open menu';
        menuToggle.setAttribute('data-key-aria-label', key);
        menuToggle.setAttribute('aria-label', getTranslationValue(key, fallback));
    };
    const setMenuState = (isOpen) => {
        if (!menuToggle || !mainNav) return;
        mainNav.classList.toggle('active', isOpen);
        menuToggle.textContent = isOpen ? '✕' : '☰';
        menuToggle.setAttribute('aria-expanded', String(isOpen));
        updateMenuToggleLabel();
    };
    const closeMenu = () => setMenuState(false);

    if (menuToggle && mainNav) {
        setMenuState(false);

        menuToggle.addEventListener('click', function() {
            setMenuState(!mainNav.classList.contains('active'));
        });

        mainNav.addEventListener('click', function(event) {
            if (window.matchMedia('(max-width: 767px)').matches && event.target.closest('a')) {
                closeMenu();
            }
        });

        document.addEventListener('click', function(event) {
            if (!mainNav.classList.contains('active')) return;
            if (mainNav.contains(event.target) || menuToggle.contains(event.target)) return;
            closeMenu();
        });

        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                closeMenu();
            }
        });

        window.addEventListener('resize', function() {
            if (window.matchMedia('(min-width: 768px)').matches) {
                closeMenu();
            }
        });
    }

    // 스크롤 시 헤더 스타일 변경
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
        const href = anchor.getAttribute('href');
        if (!href || href === '#') return;

        anchor.addEventListener('click', function(e) {
            let target = null;
            try {
                target = document.querySelector(this.getAttribute('href'));
            } catch (_error) {
                target = null;
            }
            if (target) {
                e.preventDefault();
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

    // CTA 추적 설정 및 스키마 (메타태그/전역 설정으로 엔드포인트 오버라이드 가능)
    const CTA_DEFAULT_ENDPOINT = '/analytics/cta';
    const CTA_DEFAULT_SCHEMA = 'v1';
    const CTA_CONFIG = (() => {
        const metaEndpoint = document.querySelector('meta[name="cta-endpoint"]');
        const metaSchema = document.querySelector('meta[name="cta-schema-version"]');
        const global = (typeof window !== 'undefined' && window.CTA_CONFIG) ? window.CTA_CONFIG : {};
        return {
            endpoint: (global.endpoint || (metaEndpoint && metaEndpoint.content) || CTA_DEFAULT_ENDPOINT),
            schemaVersion: (global.schemaVersion || (metaSchema && metaSchema.content) || CTA_DEFAULT_SCHEMA)
        };
    })();

    // CTA 추적: data-cta가 있는 요소 클릭 시 sendBeacon 우선, 실패 시 fetch
    const trackCta = (_event, target) => {
        const payload = {
            v: CTA_CONFIG.schemaVersion,
            type: 'cta_click',
            ts: Date.now(),
            tzOffsetMinutes: new Date().getTimezoneOffset(),
            lang: document.documentElement.lang || 'ko',
            path: location.pathname,
            referrer: document.referrer || null,
            cta: target.getAttribute('data-cta') || 'unknown',
            origin: target.getAttribute('data-cta-origin') || 'unknown',
            projectId: target.getAttribute('data-project-id') || null,
            href: target.getAttribute('href') || null,
            text: (target.textContent || '').trim().slice(0, 120),
            viewport: { w: window.innerWidth, h: window.innerHeight }
        };

        const body = JSON.stringify(payload);

        const sendWithBeacon = () => {
            if (!navigator.sendBeacon) return false;
            try {
                const blob = new Blob([body], { type: 'application/json' });
                return navigator.sendBeacon(CTA_CONFIG.endpoint, blob);
            } catch (_e) {
                return false;
            }
        };

        if (!sendWithBeacon()) {
            fetch(CTA_CONFIG.endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body,
                keepalive: true
            }).catch(() => {
                // 네트워크 실패 시 콘솔에만 남김 (정적 페이지 특성상 재시도 없음)
                console.debug('[cta-failed]', payload);
            });
        }
    };

    document.addEventListener('click', function(e) {
        const target = e.target.closest('[data-cta]');
        if (!target) return;
        trackCta(e, target);
    });

    const isActiveCommunity = (group) => group && group.status === 'active';
    const shouldShowCommunityOnHomepage = (group) => {
        const show = typeof group?.showOnHomepage === 'boolean' ? group.showOnHomepage : true;
        return isActiveCommunity(group) && show;
    };
    const shouldIncludeCommunityInHeroTotal = (group) => {
        const include = typeof group?.includeInHeroSubscriberTotal === 'boolean'
            ? group.includeInHeroSubscriberTotal
            : true;
        return isActiveCommunity(group) && include;
    };
    const getCommunityDisplayName = (group, lang) => {
        const names = group && group.names ? group.names : null;
        if (names && (names[lang] || names.ko || names.en || names.ja)) {
            return names[lang] || names.ko || names.en || names.ja;
        }
        return group && group.name ? group.name : 'Community';
    };
    const COMMUNITY_FALLBACK_ICON = 'images/nnn-logo.png';

    const fetchCommunityThumbnails = async (ids) => {
        const url = `https://thumbnails.roblox.com/v1/groups/icons?groupIds=${ids.join(',')}&size=150x150&format=Png&isCircular=false`;
        const res = await fetch(url, { headers: { accept: 'application/json' } });
        if (!res.ok) throw new Error(`thumb ${res.status}`);
        const json = await res.json();
        const map = new Map();
        (json.data || []).forEach(item => {
            if (item && item.targetId) {
                map.set(String(item.targetId), item.imageUrl);
            }
        });
        return map;
    };

    const fetchCommunityInfos = async (ids) => {
        const results = await Promise.all(ids.map(id =>
            fetch(`https://groups.roblox.com/v1/groups/${id}`, { headers: { accept: 'application/json' } })
                .then(res => res.ok ? res.json() : null)
                .catch(() => null)
        ));
        const map = new Map();
        results.forEach(info => {
            if (info && info.id) map.set(String(info.id), info);
        });
        return map;
    };

    const formatMemberCount = (count, lang) => {
        if (typeof count !== 'number') return lang === 'ja' ? '加入者情報なし' : lang === 'en' ? 'Subscribers n/a' : '가입자 정보 없음';
        const label = lang === 'ja' ? '加入者' : (lang === 'en' ? 'subscribers' : '명 가입자');
        return `${count.toLocaleString()} ${label}`;
    };

    const getCommunityVisitLabel = (lang) => {
        const fallback = lang === 'ja' ? 'コミュニ티へ' : (lang === 'en' ? 'Visit community' : '커뮤니티 방문');
        try {
            const t = window.translations || translations;
            return (t && t[lang] && t[lang].community_visit_cta) || fallback;
        } catch (_e) {
            return fallback;
        }
    };

    const updateHeroCommunityMetric = (total, lang) => {
        const metricEl = document.querySelector('[data-hero-community-count]');
        if (!metricEl || typeof total !== 'number') return;
        metricEl.textContent = formatCompactNumber(total, lang);
    };

    const setCommunityTotal = (total, lang) => {
        const subtitleEl = document.querySelector('[data-key="community_subtitle"]');
        updateHeroCommunityMetric(total, lang);
        if (!subtitleEl) return;
        if (typeof total !== 'number') return;
        const label = lang === 'ja' ? '加入者' : (lang === 'en' ? 'subscribers' : '명 가입자');
        subtitleEl.textContent = `${total.toLocaleString()} ${label}`;
    };

    const renderHeroStats = () => {
        const projectCountEl = document.querySelector('[data-hero-project-count]');
        const totalVisitsEl = document.querySelector('[data-hero-total-visits]');
        if ((!projectCountEl && !totalVisitsEl) || !(window.ProjectManager && ProjectManager.loadProjectsData)) return;

        ProjectManager.loadProjectsData()
            .then(() => {
                const lang = getCurrentLang();
                const heroSummary = (ProjectManager.getHeroSummary && ProjectManager.getHeroSummary()) || {};
                const projectCount = typeof heroSummary.projectCount === 'number' ? heroSummary.projectCount : 0;
                const totalVisits = typeof heroSummary.totalVisits === 'number' ? heroSummary.totalVisits : 0;

                if (projectCountEl) {
                    projectCountEl.textContent = projectCount.toLocaleString(lang);
                }
                if (totalVisitsEl) {
                    totalVisitsEl.textContent = formatCompactNumber(totalVisits, lang);
                }
            })
            .catch(() => {});
    };

    const loadCommunityData = async () => {
        const res = await fetch('data/communities.json', { cache: 'no-store' });
        if (!res.ok) throw new Error(`community data ${res.status}`);
        return res.json();
    };
    const loadCommunityConfig = async () => {
        const res = await fetch('data/community-groups.json', { cache: 'no-store' });
        if (!res.ok) throw new Error(`community config ${res.status}`);
        return res.json();
    };
    const appendCommunityCard = (grid, group, lang) => {
        const name = getCommunityDisplayName(group, lang);
        const memberCount = typeof group.memberCount === 'number' ? group.memberCount : null;
        const icon = group.icon || COMMUNITY_FALLBACK_ICON;
        const url = group.url || '#';
        const visitLabel = getCommunityVisitLabel(lang);

        const card = document.createElement('div');
        card.className = 'community-card';
        card.innerHTML = `
            <img class="community-thumb" src="${icon}" alt="${name}">
            <div class="community-body">
                <h3>${name}</h3>
                <p class="community-members">${formatMemberCount(memberCount, lang)}</p>
                <a class="btn-ghost community-link" href="${url}" target="_blank" rel="noreferrer" data-cta="community" data-cta-origin="home-community" data-project-id="${group.id}">
                    ${visitLabel}
                </a>
            </div>
        `;
        grid.appendChild(card);
    };

    const renderCommunities = async () => {
        const grid = document.getElementById('community-grid');
        if (!grid) return;

        const lang = document.documentElement.lang || 'ko';
        grid.innerHTML = '';
        try {
            // 1) 정적 JSON (npm run update:metrics 결과) 우선 시도
            let communityData = null;
            try {
                communityData = await loadCommunityData();
            } catch (_e) {
                communityData = null;
            }

            if (communityData && Array.isArray(communityData.groups) && communityData.groups.length > 0) {
                const groups = communityData.groups.filter(shouldShowCommunityOnHomepage);
                const heroSubscriberCount = communityData.totals && typeof communityData.totals.heroSubscriberCount === 'number'
                    ? communityData.totals.heroSubscriberCount
                    : communityData.groups.reduce((sum, group) => {
                        if (!shouldIncludeCommunityInHeroTotal(group)) return sum;
                        return sum + (typeof group.memberCount === 'number' ? group.memberCount : 0);
                    }, 0);
                setCommunityTotal(heroSubscriberCount, lang);

                groups.forEach(group => appendCommunityCard(grid, group, lang));
                return;
            }

            // 2) 폴백: 실시간 Roblox 공개 API
            const config = await loadCommunityConfig();
            const configuredGroups = Array.isArray(config.groups) ? config.groups : [];
            const activeGroups = configuredGroups.filter(isActiveCommunity);
            const homepageGroups = activeGroups.filter(shouldShowCommunityOnHomepage);
            const ids = activeGroups.map(group => group.id);
            if (ids.length === 0) {
                setCommunityTotal(0, lang);
                return;
            }

            const [infoMap, thumbMap] = await Promise.all([
                fetchCommunityInfos(ids),
                fetchCommunityThumbnails(ids).catch(() => new Map())
            ]);

            const mergedGroups = activeGroups.map(group => {
                const info = infoMap.get(group.id) || {};
                return {
                    ...group,
                    name: info.name || getCommunityDisplayName(group, lang),
                    memberCount: typeof info.memberCount === 'number' ? info.memberCount : null,
                    icon: thumbMap.get(group.id) || COMMUNITY_FALLBACK_ICON
                };
            });
            const heroSubscriberCount = mergedGroups.reduce((sum, group) => {
                if (!shouldIncludeCommunityInHeroTotal(group)) return sum;
                return sum + (typeof group.memberCount === 'number' ? group.memberCount : 0);
            }, 0);
            setCommunityTotal(heroSubscriberCount, lang);

            homepageGroups.forEach(group => {
                const merged = mergedGroups.find(item => item.id === group.id) || group;
                appendCommunityCard(grid, merged, lang);
            });
        } catch (err) {
            console.debug('community render failed', err);
            grid.innerHTML = `<p class="community-error">커뮤니티 정보를 불러오지 못했습니다.</p>`;
        }
    };

    // 언어 변경 시 커뮤니티 섹션도 재렌더
    document.addEventListener('languageChanged', function () {
        updateMenuToggleLabel();
        renderHeroStats();
        renderCommunities();
        renderHeaderMetrics();
        syncHomeUgcSpotlight();
    });

    document.addEventListener('projectDetailRendered', function () {
        renderHeaderMetrics();
        applyProjectLinks();
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
            if (visitEl) {
                if (typeof visits === 'number') {
                    const visitLabel = getTranslationValue('metric_visits', 'Visits');
                    visitEl.textContent = `${visitLabel} ${visits.toLocaleString()}`;
                    visitEl.classList.remove('hidden');
                } else {
                    visitEl.classList.add('hidden');
                }
            }
            if (likeEl) {
                if (typeof likeRatio === 'number') {
                    const pct = Math.round(likeRatio * 1000) / 10; // one decimal
                    const likeLabel = getTranslationValue('metric_like', 'Like');
                    likeEl.textContent = `${likeLabel} ${pct}%`;
                    likeEl.classList.remove('hidden');
                } else {
                    likeEl.classList.add('hidden');
                }
            }
        }).catch(() => {});
    };

    const syncProjectLinksForScope = (projectId, scope = document) => {
        if (!(window.ProjectManager && ProjectManager.loadProjectsData) || !projectId || !scope) return;
        ProjectManager.loadProjectsData()
            .then(() => {
                const all = (ProjectManager.getAll && ProjectManager.getAll()) || [];
                const project = (ProjectManager.getProject && ProjectManager.getProject(projectId)) || all.find(p => p.id === projectId);
                if (!project || !project.links) return;

                const linkKeyMap = {
                    play: 'play',
                    trailer: 'trailer',
                    article: 'article',
                    group: 'group',
                    showcase: 'showcase'
                };

                scope.querySelectorAll(`[data-project-id="${projectId}"][data-cta]`).forEach(el => {
                    const key = linkKeyMap[el.getAttribute('data-cta')] || null;
                    if (!key) return;

                    const url = project.links[key] || null;
                    const container = el.closest('li') || el;

                    if (url) {
                        el.setAttribute('href', url);
                        el.style.display = '';
                        if (container) container.style.display = '';
                    } else if (container) {
                        container.style.display = 'none';
                    }
                });
            })
            .catch(() => {});
    };

    const syncHomeUgcSpotlight = () => {
        const spotlight = document.getElementById('home-ugc-spotlight');
        if (!spotlight || !(window.ProjectManager && ProjectManager.loadProjectsData)) return;

        syncProjectLinksForScope('nnn-ugc', spotlight);

        ProjectManager.loadProjectsData()
            .then(() => {
                const project = (ProjectManager.getProject && ProjectManager.getProject('nnn-ugc')) || null;
                if (!project) {
                    const section = spotlight.closest('.ugc-spotlight-section');
                    if (section) section.classList.add('hidden');
                    return;
                }

                const lang = getCurrentLang();
                const title = (project.title && (project.title[lang] || project.title.ko || project.title.en || project.title.ja)) || 'NNN UGC';
                const imageEl = spotlight.querySelector('[data-home-ugc-image]');
                const detailLink = spotlight.querySelector('[data-home-ugc-detail]');

                if (imageEl && project.image) {
                    imageEl.setAttribute('src', project.image);
                    imageEl.setAttribute('alt', title);
                }

                if (detailLink && project.detailPage) {
                    detailLink.setAttribute('href', project.detailPage);
                }
            })
            .catch(() => {});
    };

    // 상세 페이지 CTA 링크를 프로젝트 데이터 기준으로 설정
    const applyProjectLinks = () => {
        const projectId = document.body.getAttribute('data-project-id');
        if (!projectId) return;
        syncProjectLinksForScope(projectId, document);
    };

    renderHeaderMetrics();
    applyProjectLinks();
    renderHeroStats();
    renderCommunities();
    syncHomeUgcSpotlight();
});

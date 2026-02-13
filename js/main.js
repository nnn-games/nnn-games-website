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

    // 커뮤니티 섹션: 그룹 아이콘과 멤버 수를 Roblox 공개 API로 가져오기
    const COMMUNITY_GROUPS = [
        {
            id: '294985728',
            url: 'https://www.roblox.com/communities/294985728/NNN-PLAY#!/about',
            names: { ko: 'NNN PLAY', en: 'NNN PLAY', ja: 'NNN PLAY' }
        },
                {
            id: '937186626',
            url: 'https://www.roblox.com/ko/communities/937186626/NNN-FUN#!/about',
            names: { ko: 'NNN FUN', en: 'NNN FUN', ja: 'NNN FUN' }
        },
        {
            id: '34453707',
            url: 'https://www.roblox.com/share/g/34453707',
            names: { ko: 'NNN UGC', en: 'NNN UGC', ja: 'NNN UGC' }
        },
        {
            id: '916094546',
            url: 'https://www.roblox.com/communities/916094546/NNN-Weapon-Master#!/about',
            names: { ko: 'NNN Weapon Master', en: 'NNN Weapon Master', ja: 'NNN Weapon Master' }
        }
    ];

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

    const setCommunityTotal = (total, lang) => {
        const subtitleEl = document.querySelector('[data-key="community_subtitle"]');
        if (!subtitleEl) return;
        if (typeof total !== 'number') return;
        const label = lang === 'ja' ? '加入者' : (lang === 'en' ? 'subscribers' : '명 가입자');
        subtitleEl.textContent = `${total.toLocaleString()} ${label}`;
    };

    const loadCommunityData = async () => {
        const res = await fetch('data/communities.json', { cache: 'no-store' });
        if (!res.ok) throw new Error(`community data ${res.status}`);
        return res.json();
    };

    const renderCommunities = async () => {
        const grid = document.getElementById('community-grid');
        if (!grid) return;

        const lang = document.documentElement.lang || 'ko';
        grid.innerHTML = '';

        const ids = COMMUNITY_GROUPS.map(g => g.id);
        try {
            const cfgById = new Map(COMMUNITY_GROUPS.map(c => [c.id, c]));

            // 1) 정적 JSON (npm run update:metrics 결과) 우선 시도
            let communityData = null;
            try {
                communityData = await loadCommunityData();
            } catch (_e) {
                communityData = null;
            }

            if (communityData && Array.isArray(communityData.groups) && communityData.groups.length > 0) {
                const groups = communityData.groups;
                const totalMembers = typeof communityData.totalMembers === 'number'
                    ? communityData.totalMembers
                    : groups.reduce((sum, g) => sum + (typeof g.memberCount === 'number' ? g.memberCount : 0), 0);
                setCommunityTotal(totalMembers, lang);

                groups.forEach(g => {
                    const cfg = cfgById.get(String(g.id)) || {};
                    const name = g.name || (cfg.names && (cfg.names[lang] || cfg.names.ko)) || cfg.nameFallback || 'Community';
                    const memberCount = typeof g.memberCount === 'number' ? g.memberCount : null;
                    const icon = g.icon || COMMUNITY_FALLBACK_ICON;
                    const url = g.url || cfg.url || '#';
                    const visitLabel = getCommunityVisitLabel(lang);

                    const card = document.createElement('div');
                    card.className = 'community-card';
                    card.innerHTML = `
                        <img class="community-thumb" src="${icon}" alt="${name}">
                        <div class="community-body">
                            <h3>${name}</h3>
                            <p class="community-members">${formatMemberCount(memberCount, lang)}</p>
                            <a class="btn-ghost community-link" href="${url}" target="_blank" rel="noreferrer" data-cta="community" data-cta-origin="home-community" data-project-id="${g.id}">
                                ${visitLabel}
                            </a>
                        </div>
                    `;
                    grid.appendChild(card);
                });
                return;
            }

            // 2) 폴백: 실시간 Roblox 공개 API
            const [infoMap, thumbMap] = await Promise.all([
                fetchCommunityInfos(ids),
                fetchCommunityThumbnails(ids).catch(() => new Map())
            ]);

            const totalMembers = Array.from(infoMap.values())
                .map(info => info && typeof info.memberCount === 'number' ? info.memberCount : 0)
                .reduce((a, b) => a + b, 0);
            setCommunityTotal(totalMembers, lang);

            COMMUNITY_GROUPS.forEach(cfg => {
                const info = infoMap.get(cfg.id) || {};
                const name = info.name || cfg.names[lang] || cfg.names.ko;
                const memberCount = typeof info.memberCount === 'number' ? info.memberCount : null;
                const icon = thumbMap.get(cfg.id) || COMMUNITY_FALLBACK_ICON;
                const visitLabel = getCommunityVisitLabel(lang);

                const card = document.createElement('div');
                card.className = 'community-card';
                card.innerHTML = `
                    <img class="community-thumb" src="${icon}" alt="${name}">
                    <div class="community-body">
                        <h3>${name}</h3>
                        <p class="community-members">${formatMemberCount(memberCount, lang)}</p>
                        <a class="btn-ghost community-link" href="${cfg.url}" target="_blank" rel="noreferrer" data-cta="community" data-cta-origin="home-community" data-project-id="${cfg.id}">
                            ${visitLabel}
                        </a>
                    </div>
                `;
                grid.appendChild(card);
            });
        } catch (err) {
            console.debug('community render failed', err);
            grid.innerHTML = `<p class="community-error">커뮤니티 정보를 불러오지 못했습니다.</p>`;
        }
    };

    // 언어 변경 시 커뮤니티 섹션도 재렌더
    document.addEventListener('languageChanged', function (event) {
        renderCommunities();
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
                    visitEl.textContent = `Visits ${visits.toLocaleString()}`;
                    visitEl.classList.remove('hidden');
                } else {
                    visitEl.classList.add('hidden');
                }
            }
            if (likeEl) {
                if (typeof likeRatio === 'number') {
                    const pct = Math.round(likeRatio * 1000) / 10; // one decimal
                    likeEl.textContent = `Like ${pct}%`;
                    likeEl.classList.remove('hidden');
                } else {
                    likeEl.classList.add('hidden');
                }
            }
        }).catch(() => {});
    };

    // 상세 페이지 CTA 링크를 프로젝트 데이터 기준으로 설정
    const applyProjectLinks = () => {
        if (!(window.ProjectManager && ProjectManager.loadProjectsData)) return;
        const projectId = document.body.getAttribute('data-project-id');
        if (!projectId) return;

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

                document.querySelectorAll(`[data-project-id="${projectId}"][data-cta]`).forEach(el => {
                    const key = linkKeyMap[el.getAttribute('data-cta')] || null;
                    const url = key ? project.links[key] : null;
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

    renderHeaderMetrics();
    applyProjectLinks();
    renderCommunities();
});

// Tower Flood Race - 커뮤니티 영상 섹션 렌더러
// assets/towerfloodrace/videos.txt 의 URL 목록을 읽어 런타임에 파싱·렌더한다.
//   - URL 만으로 platform / videoId / format / embedUrl / thumbnail(YouTube) 산출
//   - 제목·작성자·썸네일(TikTok) 은 oEmbed 로 진보적 보강 (CORS 실패 시 기본값 유지)
(function () {
    const TARGET_PROJECT_ID = 'tower-flood-race';
    const VIDEOS_URL = 'assets/towerfloodrace/videos.txt';
    const STYLE_ID = 'tfr-videos-style';
    const SECTION_ID = 'tfr-videos-section';
    const CACHE_PREFIX = 'tfr-meta:';
    const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7d

    const I18N = {
        ko: {
            kicker: 'Community Highlights',
            title: '크리에이터들의 플레이 영상',
            subtitle: '유저들이 직접 올린 Tower Flood Race 영상을 한 곳에서 감상해 보세요.',
            tabLong: '롱폼',
            tabShort: '숏폼',
            empty: '아직 등록된 영상이 없습니다.',
            openOriginal: '원본 보기',
            close: '닫기',
            untitled: '(제목 없음)'
        },
        en: {
            kicker: 'Community Highlights',
            title: 'Play videos from creators',
            subtitle: 'Watch Tower Flood Race videos uploaded by the community in one place.',
            tabLong: 'Long-form',
            tabShort: 'Short-form',
            empty: 'No videos yet.',
            openOriginal: 'View original',
            close: 'Close',
            untitled: '(untitled)'
        },
        ja: {
            kicker: 'Community Highlights',
            title: 'クリエイターのプレイ動画',
            subtitle: 'ユーザーが投稿した Tower Flood Race の動画をここでまとめて楽しめます。',
            tabLong: 'ロング',
            tabShort: 'ショート',
            empty: '登録された動画はまだありません。',
            openOriginal: '元動画を見る',
            close: '閉じる',
            untitled: '(無題)'
        }
    };

    const STYLE_CSS = `
.tfr-videos-section { margin-top: 2.5rem; }
.tfr-videos-header { margin-bottom: 1.25rem; }
.tfr-videos-header .kicker {
    display: inline-block; font-size: 11px; font-weight: 600;
    color: #2563EB; letter-spacing: 0.18em; text-transform: uppercase; margin-bottom: 0.5rem;
}
.tfr-videos-header h2 { font-size: 1.5rem; font-weight: 700; color: #111827; margin: 0; }
.tfr-videos-header p { margin: 0.5rem 0 0; color: #6b7280; font-size: 0.875rem; }
.tfr-tabs { display: flex; gap: 0.5rem; border-bottom: 1px solid #e5e7eb; margin-bottom: 1.25rem; }
.tfr-tab-btn {
    padding: 0.5rem 1rem; margin-bottom: -1px;
    border: 0; border-bottom: 2px solid transparent;
    background: transparent; font-size: 0.875rem; font-weight: 600;
    color: #64748b; cursor: pointer;
}
.tfr-tab-btn[aria-selected="true"] { border-bottom-color: #2563EB; color: #2563EB; }
.tfr-tab-count { margin-left: 0.25rem; font-size: 0.75rem; color: #94a3b8; font-weight: 500; }
.tfr-grid { display: grid; gap: 1rem; }
.tfr-grid-long { grid-template-columns: 1fr; }
@media (min-width: 640px)  { .tfr-grid-long { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1024px) { .tfr-grid-long { grid-template-columns: repeat(3, 1fr); } }
@media (min-width: 1280px) { .tfr-grid-long { grid-template-columns: repeat(4, 1fr); } }
.tfr-grid-short { grid-template-columns: repeat(2, 1fr); gap: 0.75rem; }
@media (min-width: 640px) { .tfr-grid-short { grid-template-columns: repeat(3, 1fr); } }
@media (min-width: 768px) { .tfr-grid-short { grid-template-columns: repeat(4, 1fr); } }
@media (min-width: 1024px){ .tfr-grid-short { grid-template-columns: repeat(6, 1fr); } }
.tfr-card {
    position: relative; display: block; width: 100%; text-align: left;
    background: #fff; border: 1px solid #e2e8f0; border-radius: 1rem;
    overflow: hidden; cursor: pointer; padding: 0;
    transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
}
.tfr-card:hover { transform: translateY(-2px); box-shadow: 0 12px 24px rgba(15,23,42,0.08); border-color: #cbd5e1; }
.tfr-card:focus-visible { outline: 2px solid #2563EB; outline-offset: 2px; }
.tfr-card-thumb { position: relative; background: #f1f5f9; overflow: hidden; }
.tfr-card-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
.tfr-card-thumb-long  { aspect-ratio: 16 / 9; }
.tfr-card-thumb-short { aspect-ratio: 9 / 16; }
.tfr-card-thumb-fallback {
    width: 100%; height: 100%;
    display: flex; align-items: center; justify-content: center;
    color: #94a3b8; font-size: 1.5rem;
}
.tfr-badge { position: absolute; padding: 2px 8px; border-radius: 9999px; font-size: 10px; font-weight: 600; line-height: 1.4; }
.tfr-badge-platform { left: 8px; top: 8px; }
.tfr-badge-yt { background: #dc2626; color: #fff; }
.tfr-badge-tt { background: #000;    color: #fff; }
.tfr-card-overlay {
    position: absolute; inset: 0;
    display: flex; align-items: center; justify-content: center;
    background: rgba(0,0,0,0); transition: background 0.15s ease;
}
.tfr-card:hover .tfr-card-overlay { background: rgba(0,0,0,0.25); }
.tfr-card-play {
    opacity: 0; background: rgba(0,0,0,0.65); color: #fff;
    padding: 0.4rem 0.85rem; border-radius: 9999px;
    font-size: 0.85rem; font-weight: 600;
    transition: opacity 0.15s ease;
}
.tfr-card:hover .tfr-card-play { opacity: 1; }
.tfr-card-info { padding: 0.75rem 0.85rem 0.95rem; }
.tfr-card-title {
    margin: 0 0 0.2rem;
    font-size: 0.875rem; font-weight: 600; color: #111827; line-height: 1.35;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}
.tfr-card-creator { margin: 0; font-size: 0.75rem; color: #6b7280; }
.tfr-empty {
    grid-column: 1 / -1;
    border: 1px dashed #cbd5e1; background: #f8fafc; border-radius: 1rem;
    padding: 2.5rem 1rem; text-align: center; font-size: 0.875rem; color: #6b7280;
}
.tfr-modal {
    position: fixed; inset: 0; z-index: 100;
    display: flex; align-items: center; justify-content: center;
    background: rgba(0,0,0,0.85); padding: 1rem;
}
.tfr-modal-body { width: 100%; max-width: 56rem; position: relative; }
.tfr-modal-frame { margin: 0 auto; border-radius: 1rem; overflow: hidden; background: #000; box-shadow: 0 25px 60px rgba(0,0,0,0.5); }
.tfr-modal-frame-long  { aspect-ratio: 16 / 9; width: 100%; }
.tfr-modal-frame-short { aspect-ratio: 9 / 16; max-width: 24rem; }
.tfr-modal-frame iframe { width: 100%; height: 100%; border: 0; display: block; }
.tfr-modal-meta {
    margin-top: 1rem;
    display: flex; flex-wrap: wrap; gap: 0.75rem;
    align-items: center; justify-content: space-between;
    color: #fff;
}
.tfr-modal-meta .meta-text p { margin: 0; }
.tfr-modal-meta .meta-text .title { font-weight: 600; font-size: 0.95rem; }
.tfr-modal-meta .meta-text .creator { font-size: 0.8rem; color: rgba(255,255,255,0.7); margin-top: 2px; }
.tfr-modal-meta a {
    background: rgba(255,255,255,0.15);
    padding: 0.45rem 0.95rem; border-radius: 9999px;
    font-size: 0.85rem; font-weight: 600; color: #fff;
    text-decoration: none; transition: background 0.15s ease;
}
.tfr-modal-meta a:hover { background: rgba(255,255,255,0.28); }
.tfr-modal-close {
    position: absolute; top: -2.5rem; right: 0;
    width: 2.5rem; height: 2.5rem;
    background: rgba(255,255,255,0.15); color: #fff; border: 0;
    border-radius: 9999px; font-size: 1.4rem; cursor: pointer; line-height: 1;
}
.tfr-modal-close:hover { background: rgba(255,255,255,0.28); }
@media (max-width: 640px) {
    .tfr-modal-close { top: 0.5rem; right: 0.5rem; }
    .tfr-modal-body { padding-top: 3rem; }
}
`;

    let modalEl = null;
    let recordsCache = null;

    function getLang() {
        if (window.NNNUtils && typeof window.NNNUtils.getCurrentLanguage === 'function') {
            return window.NNNUtils.getCurrentLanguage();
        }
        return (document.documentElement.lang || 'ko').toLowerCase();
    }

    function t(lang, key) {
        return (I18N[lang] || I18N.ko)[key] || I18N.ko[key] || key;
    }

    function escapeHtml(value) {
        return String(value == null ? '' : value)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    function ensureStyle() {
        if (document.getElementById(STYLE_ID)) return;
        const style = document.createElement('style');
        style.id = STYLE_ID;
        style.textContent = STYLE_CSS;
        document.head.appendChild(style);
    }

    // 텍스트 파일을 읽어 [long]/[short] 섹션 마커를 적용한 항목 목록으로 변환한다.
    // 마커가 한 번도 나오지 않은 영역의 URL은 formatOverride 가 null → URL 패턴 자동 분류.
    function parseList(text) {
        const items = [];
        let currentFormat = null; // null | 'long' | 'short'
        for (const rawLine of text.split(/\r?\n/)) {
            const line = rawLine.trim();
            if (!line || line.startsWith('#')) continue;
            const marker = line.match(/^\[(long|short)\]\s*$/i);
            if (marker) {
                currentFormat = marker[1].toLowerCase();
                continue;
            }
            const commentIdx = line.indexOf('#');
            const cleaned = commentIdx > 0 ? line.slice(0, commentIdx).trim() : line;
            const token = cleaned.split(/\s+/)[0];
            if (!token) continue;
            items.push({ url: token, formatOverride: currentFormat });
        }
        return items;
    }

    function urlToRecord(item) {
        const url = item && item.url ? item.url : item;
        const formatOverride = item && item.formatOverride ? item.formatOverride : null;
        let u;
        try { u = new URL(url); } catch (_e) { return null; }
        const host = u.hostname.toLowerCase().replace(/^www\./, '').replace(/^m\./, '');

        let platform = null;
        let videoId = null;
        let format = 'long';
        let creatorHandle = '';

        if (host === 'youtube.com' || host === 'youtu.be') {
            platform = 'youtube';
            const shortsMatch = u.pathname.match(/^\/shorts\/([\w-]+)/);
            if (shortsMatch) {
                videoId = shortsMatch[1];
                format = 'short';
            } else if (host === 'youtu.be') {
                videoId = u.pathname.replace(/^\//, '').split('/')[0];
            } else if (u.pathname === '/watch') {
                videoId = u.searchParams.get('v');
            } else if (u.pathname.startsWith('/embed/')) {
                videoId = u.pathname.split('/')[2];
            }
        } else if (host.endsWith('tiktok.com')) {
            platform = 'tiktok';
            format = 'short';
            const m = u.pathname.match(/\/video\/(\d+)/);
            if (m) videoId = m[1];
            const handleMatch = u.pathname.match(/\/@([^\/]+)/);
            if (handleMatch) creatorHandle = '@' + handleMatch[1];
        }

        if (!platform || !videoId) return null;

        // 섹션 마커가 있으면 URL 패턴보다 우선
        if (formatOverride === 'short' || formatOverride === 'long') {
            format = formatOverride;
        }

        const id = `${platform}:${videoId}`;
        const embedUrl = platform === 'youtube'
            ? `https://www.youtube.com/embed/${videoId}`
            : `https://www.tiktok.com/embed/v2/${videoId}`;
        const thumbnail = platform === 'youtube'
            ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
            : null;

        return {
            id, platform, format, videoId, url, embedUrl, thumbnail,
            title: '',
            creator: { name: creatorHandle, url: '' }
        };
    }

    function getCached(id) {
        try {
            const raw = localStorage.getItem(CACHE_PREFIX + id);
            if (!raw) return null;
            const meta = JSON.parse(raw);
            if (!meta || (Date.now() - (meta._t || 0)) > CACHE_TTL_MS) return null;
            return meta;
        } catch (_e) { return null; }
    }

    function setCached(id, meta) {
        try {
            const safe = {
                title: meta.title || '',
                author_name: meta.author_name || '',
                author_url: meta.author_url || '',
                thumbnail_url: meta.thumbnail_url || '',
                _t: Date.now()
            };
            localStorage.setItem(CACHE_PREFIX + id, JSON.stringify(safe));
        } catch (_e) { /* ignore */ }
    }

    async function fetchOembed(record) {
        const cached = getCached(record.id);
        if (cached) return cached;
        const apiUrl = record.platform === 'youtube'
            ? `https://www.youtube.com/oembed?url=${encodeURIComponent(record.url)}&format=json`
            : `https://www.tiktok.com/oembed?url=${encodeURIComponent(record.url)}`;
        try {
            const res = await fetch(apiUrl);
            if (!res.ok) throw new Error('oembed ' + res.status);
            const meta = await res.json();
            setCached(record.id, meta);
            return meta;
        } catch (_e) {
            return null;
        }
    }

    function applyMetaToRecord(record, meta) {
        if (!meta) return record;
        return {
            ...record,
            title: meta.title || record.title,
            creator: {
                name: meta.author_name || record.creator.name,
                url: meta.author_url || record.creator.url
            },
            thumbnail: meta.thumbnail_url || record.thumbnail
        };
    }

    function updateCardDom(record) {
        const card = document.querySelector(`.tfr-card[data-video-id="${CSS.escape(record.id)}"]`);
        if (!card) return;
        const titleEl = card.querySelector('.tfr-card-title');
        const creatorEl = card.querySelector('.tfr-card-creator');
        const thumbEl = card.querySelector('.tfr-card-thumb img');
        const lang = getLang();
        if (titleEl) titleEl.textContent = record.title || t(lang, 'untitled');
        if (creatorEl) creatorEl.textContent = (record.creator && record.creator.name) || '';
        if (thumbEl && record.thumbnail) thumbEl.src = record.thumbnail;
    }

    function renderCard(record, lang) {
        const isYouTube = record.platform === 'youtube';
        const platformLabel = isYouTube ? 'YouTube' : 'TikTok';
        const platformClass = isYouTube ? 'tfr-badge-yt' : 'tfr-badge-tt';
        const thumbAspectClass = record.format === 'short' ? 'tfr-card-thumb-short' : 'tfr-card-thumb-long';

        const thumb = record.thumbnail
            ? `<img src="${escapeHtml(record.thumbnail)}" alt="${escapeHtml(record.title || platformLabel)}" loading="lazy">`
            : `<div class="tfr-card-thumb-fallback">▶</div>`;

        const title = record.title || t(lang, 'untitled');
        const creator = (record.creator && record.creator.name) || '';

        return `
            <button type="button" class="tfr-card" data-video-id="${escapeHtml(record.id)}" aria-label="${escapeHtml(title)}">
                <div class="tfr-card-thumb ${thumbAspectClass}">
                    ${thumb}
                    <span class="tfr-badge tfr-badge-platform ${platformClass}">${platformLabel}</span>
                    <span class="tfr-card-overlay"><span class="tfr-card-play">▶ Play</span></span>
                </div>
                <div class="tfr-card-info">
                    <h3 class="tfr-card-title">${escapeHtml(title)}</h3>
                    <p class="tfr-card-creator">${escapeHtml(creator)}</p>
                </div>
            </button>
        `;
    }

    function renderGrid(records, format, lang) {
        if (!records.length) {
            return `<div class="tfr-grid tfr-grid-${format}"><div class="tfr-empty">${escapeHtml(t(lang, 'empty'))}</div></div>`;
        }
        return `<div class="tfr-grid tfr-grid-${format}">${records.map((r) => renderCard(r, lang)).join('')}</div>`;
    }

    function renderSection(records, lang) {
        const longs = records.filter((r) => r.format !== 'short');
        const shorts = records.filter((r) => r.format === 'short');

        return `
            <section class="tfr-videos-section detail-section" id="${SECTION_ID}">
                <div class="tfr-videos-header">
                    <span class="kicker">${escapeHtml(t(lang, 'kicker'))}</span>
                    <h2>${escapeHtml(t(lang, 'title'))}</h2>
                    <p>${escapeHtml(t(lang, 'subtitle'))}</p>
                </div>
                <div class="tfr-tabs" role="tablist">
                    <button type="button" class="tfr-tab-btn" role="tab" data-tab="long" aria-selected="true">
                        ${escapeHtml(t(lang, 'tabLong'))}<span class="tfr-tab-count">(${longs.length})</span>
                    </button>
                    <button type="button" class="tfr-tab-btn" role="tab" data-tab="short" aria-selected="false">
                        ${escapeHtml(t(lang, 'tabShort'))}<span class="tfr-tab-count">(${shorts.length})</span>
                    </button>
                </div>
                <div data-pane="long">${renderGrid(longs, 'long', lang)}</div>
                <div data-pane="short" hidden>${renderGrid(shorts, 'short', lang)}</div>
            </section>
        `;
    }

    function attachTabs(section) {
        const tabs = section.querySelectorAll('.tfr-tab-btn');
        const panes = section.querySelectorAll('[data-pane]');
        tabs.forEach((tab) => {
            tab.addEventListener('click', () => {
                const target = tab.getAttribute('data-tab');
                tabs.forEach((tt) => tt.setAttribute('aria-selected', tt === tab ? 'true' : 'false'));
                panes.forEach((p) => {
                    if (p.getAttribute('data-pane') === target) p.removeAttribute('hidden');
                    else p.setAttribute('hidden', '');
                });
            });
        });
    }

    function buildEmbedUrl(record) {
        if (record.platform === 'youtube') {
            const base = record.embedUrl || `https://www.youtube.com/embed/${record.videoId}`;
            const sep = base.includes('?') ? '&' : '?';
            return base + sep + 'autoplay=1&rel=0&modestbranding=1&playsinline=1';
        }
        return record.embedUrl || `https://www.tiktok.com/embed/v2/${record.videoId}`;
    }

    function openModal(record) {
        closeModal();
        const lang = getLang();
        const aspectClass = record.format === 'short' ? 'tfr-modal-frame-short' : 'tfr-modal-frame-long';
        const wrapper = document.createElement('div');
        wrapper.innerHTML = `
            <div class="tfr-modal" role="dialog" aria-modal="true">
                <div class="tfr-modal-body">
                    <button type="button" class="tfr-modal-close" aria-label="${escapeHtml(t(lang, 'close'))}">×</button>
                    <div class="tfr-modal-frame ${aspectClass}">
                        <iframe src="${escapeHtml(buildEmbedUrl(record))}"
                            title="${escapeHtml(record.title || '')}"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerpolicy="strict-origin-when-cross-origin"
                            allowfullscreen></iframe>
                    </div>
                    <div class="tfr-modal-meta">
                        <div class="meta-text">
                            <p class="title">${escapeHtml(record.title || t(lang, 'untitled'))}</p>
                            <p class="creator">${escapeHtml((record.creator && record.creator.name) || '')}</p>
                        </div>
                        <a href="${escapeHtml(record.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(t(lang, 'openOriginal'))} ↗</a>
                    </div>
                </div>
            </div>
        `;
        modalEl = wrapper.firstElementChild;
        document.body.appendChild(modalEl);
        document.body.style.overflow = 'hidden';

        modalEl.addEventListener('click', (e) => { if (e.target === modalEl) closeModal(); });
        modalEl.querySelector('.tfr-modal-close').addEventListener('click', closeModal);
        document.addEventListener('keydown', onEscapeKey);
    }

    function closeModal() {
        if (!modalEl) return;
        modalEl.remove();
        modalEl = null;
        document.body.style.overflow = '';
        document.removeEventListener('keydown', onEscapeKey);
    }

    function onEscapeKey(e) {
        if (e.key === 'Escape') closeModal();
    }

    async function loadRecords() {
        if (recordsCache) return recordsCache;
        try {
            const res = await fetch(VIDEOS_URL, { cache: 'no-cache' });
            if (!res.ok) throw new Error('HTTP ' + res.status);
            const text = await res.text();
            const items = parseList(text);
            const seen = new Set();
            const records = [];
            for (const item of items) {
                const rec = urlToRecord(item);
                if (!rec) {
                    console.warn('[tower-flood-race-videos] unsupported URL skipped:', item.url);
                    continue;
                }
                if (seen.has(rec.id)) continue;
                seen.add(rec.id);
                records.push(rec);
            }
            recordsCache = records;
        } catch (err) {
            console.warn('[tower-flood-race-videos] load failed', err);
            recordsCache = [];
        }
        return recordsCache;
    }

    function enrichInBackground(records) {
        const recordMap = new Map(records.map((r) => [r.id, r]));
        records.forEach((rec) => {
            fetchOembed(rec).then((meta) => {
                if (!meta) return;
                const enriched = applyMetaToRecord(rec, meta);
                recordMap.set(rec.id, enriched);
                updateCardDom(enriched);
            });
        });
        // Expose enriched lookup for openModal to use
        return recordMap;
    }

    async function render() {
        if (document.body.getAttribute('data-project-id') !== TARGET_PROJECT_ID) return;
        const root = document.getElementById('project-detail-root');
        if (!root) return;

        ensureStyle();
        const existing = document.getElementById(SECTION_ID);
        if (existing) existing.remove();

        const records = await loadRecords();
        const lang = getLang();

        const wrapper = document.createElement('div');
        wrapper.innerHTML = renderSection(records, lang);
        const section = wrapper.firstElementChild;
        root.appendChild(section);

        attachTabs(section);

        // Mutable lookup so modal opens with enriched data when available
        const lookup = enrichInBackground(records);
        section.querySelectorAll('.tfr-card').forEach((card) => {
            card.addEventListener('click', () => {
                const id = card.getAttribute('data-video-id');
                const rec = lookup.get(id);
                if (rec) openModal(rec);
            });
        });
    }

    document.addEventListener('projectDetailRendered', (e) => {
        if (e && e.detail && e.detail.projectId === TARGET_PROJECT_ID) {
            render();
        }
    });

    document.addEventListener('languageChanged', () => {
        if (document.body.getAttribute('data-project-id') === TARGET_PROJECT_ID) {
            setTimeout(render, 0);
        }
    });
})();

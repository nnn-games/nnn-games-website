/*
 * NNN GAMES 회사 소개 덱 컨트롤러
 * 기획서: plan/company/company-intro-site.md
 *
 * 기존 js/i18n.js 는 로드하지 않는다(헤더/푸터 DOM 을 전제로 한 훅과 사이트 전용 키뿐).
 * 다만 저장 키 'language' 는 그대로 공유해, 기존 사이트에서 고른 언어가 여기서도 이어지도록 한다.
 */
(function () {
    'use strict';

    var LANGS = ['ko', 'en', 'ja'];
    var STORE_KEY = 'language';
    var SWIPE_MIN = 60;
    var IDLE_MS = 2600;   // 전체화면에서 컨트롤을 감추기까지의 무입력 시간

    var slidesData = window.DECK_SLIDES || [];
    var i18n = window.DECK_I18N || {};

    var stage = document.getElementById('deckStage');
    var viewport = document.getElementById('deckViewport');
    var prevBtn = document.getElementById('deckPrev');
    var nextBtn = document.getElementById('deckNext');
    var dotsBox = document.getElementById('deckDots');
    var railFill = document.getElementById('deckRail');
    var curEl = document.getElementById('deckCurrent');
    var sepEl = document.getElementById('deckSep');
    var totalEl = document.getElementById('deckTotal');
    var nextLabel = document.getElementById('deckNextLabel');
    var announcer = document.getElementById('deckAnnounce');
    var fullBtn = document.getElementById('deckFull');
    var root = document.documentElement;

    var params = new URLSearchParams(window.location.search);
    var showAll = params.get('preview') === 'all';

    var lang = resolveLang();
    var slides = [];      // { data, el }
    var dots = [];
    var updaters = [];    // 스크립트로 생성한 노드의 다국어 갱신자
    var index = 0;
    var mainTotal = 0;      // 본편 장수 (부록 제외)
    var appendixTotal = 0;  // 부록 장수
    var faux = false;     // 전체화면 요청이 거부됐을 때의 대체 모드
    var canFull = supportsFull();
    var idleTimer = null;

    /* ------------------------------------------------------------------ 언어 */

    function readStore() {
        try {
            return window.localStorage.getItem(STORE_KEY);
        } catch (e) {
            return null;
        }
    }

    function writeStore(value) {
        try {
            window.localStorage.setItem(STORE_KEY, value);
        } catch (e) {
            /* 프라이빗 모드 등에서 저장이 막혀도 화면 동작에는 영향이 없다 */
        }
    }

    function resolveLang() {
        var q = params.get('lang');
        if (LANGS.indexOf(q) !== -1) return q;

        var saved = readStore();
        if (LANGS.indexOf(saved) !== -1) return saved;

        var nav = (navigator.language || 'ko').toLowerCase();
        if (nav.indexOf('ko') === 0) return 'ko';
        if (nav.indexOf('ja') === 0) return 'ja';
        return 'en';
    }

    function t(key, vars) {
        var dict = i18n[lang] || {};
        var text = dict[key];
        if (text === undefined) text = (i18n.ko && i18n.ko[key]) || '';
        if (vars) {
            Object.keys(vars).forEach(function (name) {
                text = text.split('{{' + name + '}}').join(vars[name]);
            });
        }
        return text;
    }

    function pick(value) {
        // { ko:'…', en:'…', ja:'…' } 형태의 데이터에서 현재 언어를 고른다.
        if (!value) return '';
        if (typeof value === 'string') return value;
        return value[lang] || value.ko || value.en || value.ja || '';
    }

    function applyLang() {
        document.documentElement.lang = lang;

        document.querySelectorAll('[data-deck-key]').forEach(function (el) {
            el.textContent = t(el.getAttribute('data-deck-key'));
        });
        document.querySelectorAll('[data-deck-key-alt]').forEach(function (el) {
            el.setAttribute('alt', t(el.getAttribute('data-deck-key-alt')));
        });
        document.querySelectorAll('[data-deck-key-aria-label]').forEach(function (el) {
            el.setAttribute('aria-label', t(el.getAttribute('data-deck-key-aria-label')));
        });

        updaters.forEach(function (fn) { fn(); });

        document.querySelectorAll('.deck-lang').forEach(function (btn) {
            btn.classList.toggle('is-active', btn.getAttribute('data-lang') === lang);
            btn.setAttribute('aria-pressed', String(btn.getAttribute('data-lang') === lang));
        });

        labelFull();
        labelNav();
        labelSlides();
    }

    function setLang(next) {
        if (LANGS.indexOf(next) === -1 || next === lang) return;
        lang = next;
        writeStore(next);
        applyLang();
    }

    /* ------------------------------------------------ 슬라이드 구성 / 렌더 */

    function buildSlides() {
        slidesData.forEach(function (data) {
            var el = stage.querySelector('[data-slide="' + data.id + '"]');
            if (!el) return;

            if (data.enabled === false && !showAll) {
                el.remove();
                return;
            }
            slides.push({ data: data, el: el, appendix: data.appendix === true });
        });

        // 본편과 부록은 번호를 따로 센다 — 카운터/진행 바/라벨이 모두 이 번호를 쓴다.
        slides.forEach(function (slide) {
            slide.num = slide.appendix ? ++appendixTotal : ++mainTotal;
            if (slide.appendix) slide.el.setAttribute('data-appendix', '');
        });

        slides.forEach(function (slide) {
            var target = slide.el.querySelector('[data-deck-render="avatars"]');
            if (target) renderAvatars(target, slide.data.avatars || [], slide.data.backdropMarks || []);

            target = slide.el.querySelector('[data-deck-render="eras"]');
            if (target) renderEras(target, slide.data.eras || []);

            target = slide.el.querySelector('[data-deck-render="awards"]');
            if (target) renderAwards(target, slide.data.awards || []);

            target = slide.el.querySelector('[data-deck-render="ugcworks"]');
            if (target) renderUgcWorks(target, slide.data.works || []);
        });
    }

    function el(tag, className, text) {
        var node = document.createElement(tag);
        if (className) node.className = className;
        if (text !== undefined && text !== null) node.textContent = text;
        return node;
    }

    function placeholder(className, label) {
        var box = el('div', className);
        box.setAttribute('data-placeholder', '');
        box.appendChild(el('span', null, label));
        return box;
    }

    function renderAvatars(root, avatars, backdropMarks) {
        root.textContent = '';

        backdropMarks.forEach(function (mark) {
            if (!mark.image) return;

            var image = new Image();
            image.className = 'people-emblem people-emblem-' + (mark.side || 'left');
            image.src = 'assets/' + mark.image;
            image.alt = '';
            image.loading = 'lazy';
            image.setAttribute('aria-hidden', 'true');
            root.appendChild(image);
        });

        avatars.forEach(function (person) {
            var card = el('figure', 'avatar-card');
            if (person.featured) card.classList.add('avatar-card-featured');
            var frame;

            if (person.image) {
                frame = el('div', 'avatar-frame');
                var img = new Image();
                img.src = 'assets/' + person.image;
                img.loading = 'lazy';
                img.alt = t('people_avatar_alt', { name: person.name || '' });
                updaters.push(function () {
                    img.alt = t('people_avatar_alt', { name: person.name || '' });
                });
                frame.appendChild(img);
            } else {
                // 아바타 렌더 미확보 — 더미 이미지 파일 없이 CSS 플레이스홀더로 표시한다.
                frame = placeholder('avatar-frame', 'NNN');
            }
            card.appendChild(frame);

            var caption = el('figcaption');
            caption.appendChild(el('b', 'avatar-name', person.name || ''));

            if (person.roleKey) {
                var role = el('span', 'avatar-role', t(person.roleKey));
                updaters.push(function () { role.textContent = t(person.roleKey); });
                caption.appendChild(role);
            }
            card.appendChild(caption);
            root.appendChild(card);
        });
    }

    function renderEras(root, eras) {
        root.textContent = '';

        // 한 시대라도 이미지 슬롯을 가지면, 나머지 시대에도 같은 높이의 자리를 둬야
        // 4개 노드가 같은 축 위에 정렬된다.
        var anyWorks = eras.some(function (era) {
            return Array.isArray(era.works) && era.works.length > 0;
        });

        eras.forEach(function (era) {
            var group = el('div', 'era');
            if (era.current) group.setAttribute('data-current', '');

            var works = Array.isArray(era.works) ? era.works : [];
            if (anyWorks) {
                var box = el('div', 'era-works');
                box.setAttribute('data-count', String(works.length));

                works.forEach(function (work) {
                    var file = typeof work === 'string' ? work : (work && work.file);
                    if (!file) {
                        // 파일 미확보 슬롯 — 플랫폼 워드마크만 옅게 둔다.
                        box.appendChild(placeholder('era-work', era.platform));
                        return;
                    }
                    var cell = el('div', 'era-work');
                    var img = new Image();
                    img.src = 'assets/' + file;
                    img.loading = 'lazy';
                    if (work && work.alt) {
                        img.alt = pick(work.alt);
                        updaters.push(function () { img.alt = pick(work.alt); });
                    } else {
                        // 작품명이 확정되기 전에는 장식 이미지로 둬 스크린리더가 읽지 않게 한다.
                        img.alt = '';
                        img.setAttribute('role', 'presentation');
                    }
                    cell.appendChild(img);
                    box.appendChild(cell);
                });
                group.appendChild(box);
            }

            var node = el('div', 'era-node');
            node.setAttribute('aria-hidden', 'true');
            node.appendChild(el('span', 'era-dot'));
            group.appendChild(node);

            var text = el('div', 'era-text');
            text.appendChild(el('p', 'era-platform', era.platform));

            var period = el('p', 'era-period', era.periodKey ? t(era.periodKey) : (era.period || ''));
            if (era.periodKey) {
                updaters.push(function () { period.textContent = t(era.periodKey); });
            }
            text.appendChild(period);

            if (era.descKey) {
                var desc = el('p', 'era-desc', t(era.descKey));
                updaters.push(function () { desc.textContent = t(era.descKey); });
                text.appendChild(desc);
            }
            group.appendChild(text);
            root.appendChild(group);
        });
    }

    function renderAwards(root, awards) {
        root.textContent = '';

        // 수상 경력이 차지하는 높이만큼 위쪽 이미지 블록을 낮춰야 한다(deck.css).
        var slide = root.closest('.slide');
        if (slide) slide.toggleAttribute('data-has-awards', awards.length > 0);

        // 수상 정보가 없으면 영역 자체를 렌더하지 않는다(빈 항목을 노출하지 않는다).
        if (!awards.length) {
            root.hidden = true;
            return;
        }
        root.hidden = false;

        var label = el('p', 'awards-label', t('history_awards_label'));
        updaters.push(function () { label.textContent = t('history_awards_label'); });
        root.appendChild(label);

        var list = el('ul', 'awards-list');
        awards.forEach(function (award) {
            var item = el('li', 'award');
            item.appendChild(el('span', 'award-year', award.year || ''));

            var name = el('p', 'award-name', pick(award.name));
            updaters.push(function () { name.textContent = pick(award.name); });
            item.appendChild(name);

            if (award.org) {
                var org = el('p', 'award-org', pick(award.org));
                updaters.push(function () { org.textContent = pick(award.org); });
                item.appendChild(org);
            }
            list.appendChild(item);
        });
        root.appendChild(list);
    }

    /* S6 — UGC 썸네일 그리드. 파일명만 데이터로 두고 대체 텍스트는 번호로 붙인다. */
    function renderUgcWorks(root, works) {
        root.textContent = '';

        works.forEach(function (file, i) {
            if (!file) {
                root.appendChild(placeholder('ugc-cell', 'UGC'));
                return;
            }
            var cell = el('div', 'ugc-cell');
            var img = new Image();
            img.src = 'assets/' + file;
            img.loading = 'lazy';
            img.alt = t('alt_ugcworks', { n: i + 1 });
            updaters.push(function () { img.alt = t('alt_ugcworks', { n: i + 1 }); });
            cell.appendChild(img);
            root.appendChild(cell);
        });
    }

    function buildDots() {
        dotsBox.textContent = '';
        dots = slides.map(function (slide, i) {
            var dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'deck-dot';
            // 부록 도트는 속을 비우고 앞에 간격을 둬 본편과의 경계를 보이게 한다(deck.css).
            if (slide.appendix) dot.classList.add('deck-dot-appendix');
            dot.addEventListener('click', function () { go(i); });
            dotsBox.appendChild(dot);
            return dot;
        });
    }

    /* ------------------------------------------------------------ 상태 반영 */

    function pad(n) {
        return n < 10 ? '0' + n : String(n);
    }

    /* 위치 문구는 본편/부록을 따로 센다. 예: '3 / 9 슬라이드' vs '부록 1 / 1' */
    function position(slide) {
        return t(slide.appendix ? 'ui_appendix_position' : 'ui_slide_position', {
            current: slide.num,
            total: slide.appendix ? appendixTotal : mainTotal
        });
    }

    function labelSlides() {
        slides.forEach(function (slide) {
            slide.el.setAttribute('aria-label', position(slide));
        });
        dots.forEach(function (dot, i) {
            var slide = slides[i];
            dot.setAttribute('aria-label', t(slide.appendix ? 'ui_dot_appendix' : 'ui_dot', { n: slide.num }));
        });
    }

    /* 본편 마지막에서는 다음 버튼이 부록으로 넘어간다는 것을 미리 알려 준다. */
    function labelNav() {
        var next = slides[index + 1];
        var toAppendix = !!next && next.appendix && !slides[index].appendix;
        nextLabel.textContent = t(toAppendix ? 'ui_appendix' : 'ui_next');
    }

    function go(next, options) {
        var opts = options || {};
        index = Math.max(0, Math.min(next, slides.length - 1));

        slides.forEach(function (slide, i) {
            var active = i === index;
            slide.el.classList.toggle('is-active', active);
            if (active) {
                slide.el.removeAttribute('inert');
            } else {
                slide.el.setAttribute('inert', '');
                slide.el.scrollTop = 0;
            }
        });

        dots.forEach(function (dot, i) {
            dot.classList.toggle('is-active', i === index);
            dot.setAttribute('aria-current', i === index ? 'true' : 'false');
        });

        var slide = slides[index];

        prevBtn.disabled = index === 0;
        nextBtn.disabled = index === slides.length - 1;
        labelNav();

        // 부록에서는 '01 / 09' 대신 라벨만 남긴다(2장 이상이면 '부록 1 / 2').
        curEl.textContent = slide.appendix
            ? (appendixTotal > 1 ? position(slide) : t('ui_appendix'))
            : pad(slide.num);
        sepEl.hidden = slide.appendix;
        totalEl.hidden = slide.appendix;

        // 진행 바는 본편 기준이다 — 클로징에서 100% 가 되고 부록에서도 그대로 둔다.
        railFill.style.width = (slide.appendix ? 100 : slide.num / (mainTotal || 1) * 100) + '%';

        if (!opts.silent) {
            var heading = slide.el.querySelector('h1, h2, .sec-label');
            announcer.textContent = position(slide) + (heading ? ' — ' + heading.textContent : '');
        }

        // 첫 진입(1번 슬라이드, 해시 없음)에서는 URL 을 건드리지 않는다.
        var hash = '#/' + (index + 1);
        var current = window.location.hash;
        if (current !== hash && !(index === 0 && !current)) {
            history.replaceState(null, '', window.location.pathname + window.location.search + hash);
        }
    }

    function fromHash() {
        var match = /^#\/(\d+)$/.exec(window.location.hash || '');
        if (!match) return 0;
        var n = parseInt(match[1], 10) - 1;
        return isNaN(n) ? 0 : Math.max(0, Math.min(n, slides.length - 1));
    }

    /* -------------------------------------------------------------- 전체화면 */

    function fullEl() {
        return document.fullscreenElement || document.webkitFullscreenElement || null;
    }

    function isFull() {
        return !!fullEl() || faux;
    }

    /* iPhone Safari 처럼 요소 전체화면이 아예 없는 환경, iframe 삽입처럼 정책으로 막힌
     * 환경에서는 버튼을 노출하지 않는다(눌러도 아무 일도 일어나지 않기 때문). */
    function supportsFull() {
        if (!(document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen)) {
            return false;
        }
        var allowed = document.fullscreenEnabled;
        if (allowed === undefined) allowed = document.webkitFullscreenEnabled;
        return allowed !== false;
    }

    function labelFull() {
        var text = t(isFull() ? 'ui_fullscreen_exit' : 'ui_fullscreen');
        fullBtn.setAttribute('aria-label', text);
        fullBtn.setAttribute('title', text);
        fullBtn.setAttribute('aria-pressed', String(isFull()));
    }

    function syncFull() {
        // CSS 가 이 클래스를 보고 컨트롤을 띄우고 캔버스 상한을 푼다(deck.css).
        root.classList.toggle('is-fullscreen', isFull());
        labelFull();
        wake();
    }

    function enterFaux() {
        // 요청이 거부된 경우 — 컨트롤만 접어 창 안에서 최대한 넓게 쓴다.
        faux = true;
        syncFull();
    }

    function toggleFull() {
        if (!canFull) return;

        if (isFull()) {
            var exit = document.exitFullscreen || document.webkitExitFullscreen;
            if (fullEl() && exit) exit.call(document);
            // 대체 모드는 알려 줄 이벤트가 없으므로 여기서 직접 되돌린다.
            if (faux) {
                faux = false;
                syncFull();
            }
            return;
        }

        var request = root.requestFullscreen || root.webkitRequestFullscreen;
        var pending;
        try {
            pending = request.call(root);
        } catch (e) {
            enterFaux();
            return;
        }
        // 성공하면 fullscreenchange 가 상태를 반영한다. 거부되면 대체 모드로 넘어간다.
        if (pending && typeof pending.catch === 'function') pending.catch(enterFaux);
    }

    function onFullChange() {
        if (fullEl()) faux = false;
        syncFull();
    }

    /* 무입력이 이어지면 컨트롤과 커서를 감춘다. 아무 입력이 들어오면 곧바로 되돌린다. */
    function wake() {
        if (idleTimer) {
            window.clearTimeout(idleTimer);
            idleTimer = null;
        }
        root.classList.remove('is-idle');
        if (!isFull()) return;

        idleTimer = window.setTimeout(function () {
            idleTimer = null;
            root.classList.add('is-idle');
        }, IDLE_MS);
    }

    /* ------------------------------------------------------------------ 조작 */

    function bind() {
        prevBtn.addEventListener('click', function () { go(index - 1); });
        nextBtn.addEventListener('click', function () { go(index + 1); });
        fullBtn.addEventListener('click', function () {
            toggleFull();
            // 초점이 남아 있으면 Space 가 슬라이드 넘김 대신 전체화면 토글로 먹힌다.
            fullBtn.blur();
        });

        document.addEventListener('fullscreenchange', onFullChange);
        document.addEventListener('webkitfullscreenchange', onFullChange);

        ['pointermove', 'pointerdown', 'keydown', 'touchstart', 'wheel'].forEach(function (type) {
            document.addEventListener(type, function () {
                if (isFull()) wake();
            }, { passive: true });
        });

        document.querySelectorAll('.deck-lang').forEach(function (btn) {
            btn.addEventListener('click', function () {
                setLang(btn.getAttribute('data-lang'));
            });
        });

        document.addEventListener('keydown', function (e) {
            if (e.metaKey || e.ctrlKey || e.altKey) return;

            var onButton = document.activeElement && document.activeElement.tagName === 'BUTTON';
            if (onButton && (e.key === ' ' || e.key === 'Enter')) return;

            switch (e.key) {
                case 'ArrowRight':
                case 'PageDown':
                case ' ':
                    e.preventDefault();
                    go(index + 1);
                    break;
                case 'ArrowLeft':
                case 'PageUp':
                    e.preventDefault();
                    go(index - 1);
                    break;
                case 'Home':
                    e.preventDefault();
                    go(0);
                    break;
                case 'End':
                    e.preventDefault();
                    go(slides.length - 1);
                    break;
                case 'f':
                case 'F':
                    e.preventDefault();
                    toggleFull();
                    break;
                case 'Escape':
                    // 네이티브 전체화면은 브라우저가 닫아 준다. 대체 모드만 직접 처리한다.
                    if (faux) {
                        e.preventDefault();
                        toggleFull();
                    }
                    break;
            }
        });

        var startX = 0;
        var startY = 0;
        var tracking = false;

        viewport.addEventListener('touchstart', function (e) {
            if (e.touches.length !== 1) { tracking = false; return; }
            tracking = true;
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });

        viewport.addEventListener('touchend', function (e) {
            if (!tracking) return;
            tracking = false;

            var touch = e.changedTouches[0];
            var dx = touch.clientX - startX;
            var dy = touch.clientY - startY;

            // 세로 스크롤과 겹치지 않도록 수평 이동이 더 클 때만 슬라이드를 넘긴다.
            if (Math.abs(dx) < SWIPE_MIN || Math.abs(dx) <= Math.abs(dy)) return;
            go(dx < 0 ? index + 1 : index - 1);
        }, { passive: true });

        window.addEventListener('hashchange', function () {
            var target = fromHash();
            if (target !== index) go(target);
        });
    }

    /* ------------------------------------------------------------------ 시작 */

    buildSlides();
    if (!slides.length) return;

    buildDots();
    bind();
    fullBtn.hidden = !canFull;
    totalEl.textContent = pad(mainTotal);
    applyLang();
    go(fromHash(), { silent: true });
})();

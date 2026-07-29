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

    var slidesData = window.DECK_SLIDES || [];
    var i18n = window.DECK_I18N || {};

    var stage = document.getElementById('deckStage');
    var viewport = document.getElementById('deckViewport');
    var prevBtn = document.getElementById('deckPrev');
    var nextBtn = document.getElementById('deckNext');
    var dotsBox = document.getElementById('deckDots');
    var railFill = document.getElementById('deckRail');
    var curEl = document.getElementById('deckCurrent');
    var totalEl = document.getElementById('deckTotal');
    var announcer = document.getElementById('deckAnnounce');

    var params = new URLSearchParams(window.location.search);
    var showAll = params.get('preview') === 'all';

    var lang = resolveLang();
    var slides = [];      // { data, el }
    var dots = [];
    var updaters = [];    // 스크립트로 생성한 노드의 다국어 갱신자
    var index = 0;

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
            slides.push({ data: data, el: el });
        });

        slides.forEach(function (slide) {
            var target = slide.el.querySelector('[data-deck-render="avatars"]');
            if (target) renderAvatars(target, slide.data.avatars || []);

            target = slide.el.querySelector('[data-deck-render="eras"]');
            if (target) renderEras(target, slide.data.eras || []);

            target = slide.el.querySelector('[data-deck-render="awards"]');
            if (target) renderAwards(target, slide.data.awards || []);
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

    function renderAvatars(root, avatars) {
        root.textContent = '';

        avatars.forEach(function (person) {
            var card = el('figure', 'avatar-card');
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

    function buildDots() {
        dotsBox.textContent = '';
        dots = slides.map(function (slide, i) {
            var dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'deck-dot';
            dot.addEventListener('click', function () { go(i); });
            dotsBox.appendChild(dot);
            return dot;
        });
    }

    /* ------------------------------------------------------------ 상태 반영 */

    function pad(n) {
        return n < 10 ? '0' + n : String(n);
    }

    function labelSlides() {
        slides.forEach(function (slide, i) {
            slide.el.setAttribute('aria-label', t('ui_slide_position', {
                current: i + 1,
                total: slides.length
            }));
        });
        dots.forEach(function (dot, i) {
            dot.setAttribute('aria-label', t('ui_dot', { n: i + 1 }));
        });
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

        prevBtn.disabled = index === 0;
        nextBtn.disabled = index === slides.length - 1;
        curEl.textContent = pad(index + 1);
        railFill.style.width = ((index + 1) / slides.length * 100) + '%';

        if (!opts.silent) {
            var heading = slides[index].el.querySelector('h1, h2, .sec-label');
            announcer.textContent = t('ui_slide_position', {
                current: index + 1,
                total: slides.length
            }) + (heading ? ' — ' + heading.textContent : '');
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

    /* ------------------------------------------------------------------ 조작 */

    function bind() {
        prevBtn.addEventListener('click', function () { go(index - 1); });
        nextBtn.addEventListener('click', function () { go(index + 1); });

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
    totalEl.textContent = String(slides.length);
    applyLang();
    go(fromHash(), { silent: true });
})();

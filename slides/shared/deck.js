/*
 * Shared slide-deck controller.
 * Based on the interaction model used by /nnn: language persistence, hash
 * deep links, keyboard and swipe navigation, fullscreen, a11y state, and
 * presenter-friendly idle controls. Individual decks define DECK_SLIDES and
 * DECK_I18N before this file is loaded.
 */
(function () {
    'use strict';

    var LANGS = ['ko', 'en', 'ja'];
    var STORE_KEY = 'language';
    var SWIPE_MIN = 60;
    var IDLE_MS = 2600;
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

    if (!stage || !viewport || !prevBtn || !nextBtn || !dotsBox || !railFill || !curEl || !sepEl || !totalEl || !nextLabel || !announcer || !fullBtn) return;

    var params = new URLSearchParams(window.location.search);
    var showAll = params.get('preview') === 'all';
    var lang = resolveLang();
    var slides = [];
    var dots = [];
    var index = 0;
    var mainTotal = 0;
    var appendixTotal = 0;
    var fauxFullscreen = false;
    var canFullscreen = supportsFullscreen();
    var idleTimer = null;

    function readStore() {
        try { return window.localStorage.getItem(STORE_KEY); } catch (e) { return null; }
    }

    function writeStore(value) {
        try { window.localStorage.setItem(STORE_KEY, value); } catch (e) { /* storage can be unavailable */ }
    }

    function resolveLang() {
        var query = params.get('lang');
        if (LANGS.indexOf(query) !== -1) return query;

        var saved = readStore();
        if (LANGS.indexOf(saved) !== -1) return saved;

        var browser = (navigator.language || 'ko').toLowerCase();
        if (browser.indexOf('ko') === 0) return 'ko';
        if (browser.indexOf('ja') === 0) return 'ja';
        return 'en';
    }

    function t(key, vars) {
        var dict = i18n[lang] || {};
        var value = dict[key];
        if (value === undefined) value = (i18n.ko && i18n.ko[key]) || '';
        if (vars) {
            Object.keys(vars).forEach(function (name) {
                value = value.split('{{' + name + '}}').join(vars[name]);
            });
        }
        return value;
    }

    function applyLanguage() {
        root.lang = lang;
        document.querySelectorAll('[data-deck-key]').forEach(function (node) {
            node.textContent = t(node.getAttribute('data-deck-key'));
        });
        document.querySelectorAll('[data-deck-key-alt]').forEach(function (node) {
            node.setAttribute('alt', t(node.getAttribute('data-deck-key-alt')));
        });
        document.querySelectorAll('[data-deck-key-aria-label]').forEach(function (node) {
            node.setAttribute('aria-label', t(node.getAttribute('data-deck-key-aria-label')));
        });
        document.querySelectorAll('.deck-lang').forEach(function (button) {
            var active = button.getAttribute('data-lang') === lang;
            button.classList.toggle('is-active', active);
            button.setAttribute('aria-pressed', String(active));
        });
        labelSlides();
        labelNavigation();
        labelFullscreen();
    }

    function setLanguage(next) {
        if (LANGS.indexOf(next) === -1 || next === lang) return;
        lang = next;
        writeStore(next);
        applyLanguage();
    }

    function buildSlides() {
        slidesData.forEach(function (data) {
            var element = stage.querySelector('[data-slide="' + data.id + '"]');
            if (!element) return;
            if (data.enabled === false && !showAll) {
                element.remove();
                return;
            }
            slides.push({ data: data, element: element, appendix: data.appendix === true });
        });

        slides.forEach(function (slide) {
            slide.num = slide.appendix ? ++appendixTotal : ++mainTotal;
            if (slide.appendix) slide.element.setAttribute('data-appendix', '');
        });
    }

    function buildDots() {
        dotsBox.textContent = '';
        dots = slides.map(function (slide, slideIndex) {
            var dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'deck-dot';
            if (slide.appendix) dot.classList.add('deck-dot-appendix');
            dot.addEventListener('click', function () { go(slideIndex); });
            dotsBox.appendChild(dot);
            return dot;
        });
    }

    function pad(number) {
        return number < 10 ? '0' + number : String(number);
    }

    function position(slide) {
        return t(slide.appendix ? 'ui_appendix_position' : 'ui_slide_position', {
            current: slide.num,
            total: slide.appendix ? appendixTotal : mainTotal
        });
    }

    function labelSlides() {
        slides.forEach(function (slide) {
            slide.element.setAttribute('aria-label', position(slide));
        });
        dots.forEach(function (dot, dotIndex) {
            var slide = slides[dotIndex];
            dot.setAttribute('aria-label', t(slide.appendix ? 'ui_dot_appendix' : 'ui_dot', { n: slide.num }));
        });
    }

    function labelNavigation() {
        var next = slides[index + 1];
        nextLabel.textContent = t(next && next.appendix && !slides[index].appendix ? 'ui_appendix' : 'ui_next');
    }

    function go(next, options) {
        var opts = options || {};
        index = Math.max(0, Math.min(next, slides.length - 1));

        slides.forEach(function (slide, slideIndex) {
            var active = slideIndex === index;
            slide.element.classList.toggle('is-active', active);
            if (active) {
                slide.element.removeAttribute('inert');
            } else {
                slide.element.setAttribute('inert', '');
                slide.element.scrollTop = 0;
            }
        });

        dots.forEach(function (dot, dotIndex) {
            var active = dotIndex === index;
            dot.classList.toggle('is-active', active);
            dot.setAttribute('aria-current', active ? 'true' : 'false');
        });

        var slide = slides[index];
        prevBtn.disabled = index === 0;
        nextBtn.disabled = index === slides.length - 1;
        labelNavigation();

        curEl.textContent = slide.appendix
            ? (appendixTotal > 1 ? position(slide) : t('ui_appendix'))
            : pad(slide.num);
        sepEl.hidden = slide.appendix;
        totalEl.hidden = slide.appendix;
        railFill.style.width = (slide.appendix ? 100 : slide.num / (mainTotal || 1) * 100) + '%';

        if (!opts.silent) {
            var heading = slide.element.querySelector('h1, h2, .slide-kicker');
            announcer.textContent = position(slide) + (heading ? ' — ' + heading.textContent : '');
        }

        var hash = '#/' + (index + 1);
        if (window.location.hash !== hash && !(index === 0 && !window.location.hash)) {
            history.replaceState(null, '', window.location.pathname + window.location.search + hash);
        }
    }

    function fromHash() {
        var match = /^#\/(\d+)$/.exec(window.location.hash || '');
        if (!match) return 0;
        var target = parseInt(match[1], 10) - 1;
        return isNaN(target) ? 0 : Math.max(0, Math.min(target, slides.length - 1));
    }

    function fullscreenElement() {
        return document.fullscreenElement || document.webkitFullscreenElement || null;
    }

    function isFullscreen() {
        return !!fullscreenElement() || fauxFullscreen;
    }

    function supportsFullscreen() {
        if (!(document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen)) return false;
        var allowed = document.fullscreenEnabled;
        if (allowed === undefined) allowed = document.webkitFullscreenEnabled;
        return allowed !== false;
    }

    function labelFullscreen() {
        var label = t(isFullscreen() ? 'ui_fullscreen_exit' : 'ui_fullscreen');
        fullBtn.setAttribute('aria-label', label);
        fullBtn.setAttribute('title', label);
        fullBtn.setAttribute('aria-pressed', String(isFullscreen()));
    }

    function wake() {
        if (idleTimer) window.clearTimeout(idleTimer);
        idleTimer = null;
        root.classList.remove('is-idle');
        if (!isFullscreen()) return;
        idleTimer = window.setTimeout(function () {
            idleTimer = null;
            root.classList.add('is-idle');
        }, IDLE_MS);
    }

    function syncFullscreen() {
        root.classList.toggle('is-fullscreen', isFullscreen());
        labelFullscreen();
        wake();
    }

    function fallbackFullscreen() {
        fauxFullscreen = true;
        syncFullscreen();
    }

    function toggleFullscreen() {
        if (!canFullscreen) return;
        if (isFullscreen()) {
            var exit = document.exitFullscreen || document.webkitExitFullscreen;
            if (fullscreenElement() && exit) exit.call(document);
            if (fauxFullscreen) {
                fauxFullscreen = false;
                syncFullscreen();
            }
            return;
        }

        var request = root.requestFullscreen || root.webkitRequestFullscreen;
        try {
            var pending = request.call(root);
            if (pending && typeof pending.catch === 'function') pending.catch(fallbackFullscreen);
        } catch (e) {
            fallbackFullscreen();
        }
    }

    function onFullscreenChange() {
        if (fullscreenElement()) fauxFullscreen = false;
        syncFullscreen();
    }

    function bind() {
        prevBtn.addEventListener('click', function () { go(index - 1); });
        nextBtn.addEventListener('click', function () { go(index + 1); });
        fullBtn.addEventListener('click', function () {
            toggleFullscreen();
            fullBtn.blur();
        });
        document.addEventListener('fullscreenchange', onFullscreenChange);
        document.addEventListener('webkitfullscreenchange', onFullscreenChange);

        ['pointermove', 'pointerdown', 'keydown', 'touchstart', 'wheel'].forEach(function (type) {
            document.addEventListener(type, function () { if (isFullscreen()) wake(); }, { passive: true });
        });

        document.querySelectorAll('.deck-lang').forEach(function (button) {
            button.addEventListener('click', function () { setLanguage(button.getAttribute('data-lang')); });
        });

        document.addEventListener('keydown', function (event) {
            if (event.metaKey || event.ctrlKey || event.altKey) return;
            var onButton = document.activeElement && document.activeElement.tagName === 'BUTTON';
            if (onButton && (event.key === ' ' || event.key === 'Enter')) return;

            switch (event.key) {
                case 'ArrowRight':
                case 'PageDown':
                case ' ':
                    event.preventDefault();
                    go(index + 1);
                    break;
                case 'ArrowLeft':
                case 'PageUp':
                    event.preventDefault();
                    go(index - 1);
                    break;
                case 'Home':
                    event.preventDefault();
                    go(0);
                    break;
                case 'End':
                    event.preventDefault();
                    go(slides.length - 1);
                    break;
                case 'f':
                case 'F':
                    event.preventDefault();
                    toggleFullscreen();
                    break;
                case 'Escape':
                    if (fauxFullscreen) {
                        event.preventDefault();
                        toggleFullscreen();
                    }
                    break;
            }
        });

        var startX = 0;
        var startY = 0;
        var tracking = false;
        viewport.addEventListener('touchstart', function (event) {
            if (event.touches.length !== 1) { tracking = false; return; }
            tracking = true;
            startX = event.touches[0].clientX;
            startY = event.touches[0].clientY;
        }, { passive: true });
        viewport.addEventListener('touchend', function (event) {
            if (!tracking) return;
            tracking = false;
            var touch = event.changedTouches[0];
            var dx = touch.clientX - startX;
            var dy = touch.clientY - startY;
            if (Math.abs(dx) < SWIPE_MIN || Math.abs(dx) <= Math.abs(dy)) return;
            go(dx < 0 ? index + 1 : index - 1);
        }, { passive: true });

        window.addEventListener('hashchange', function () {
            var target = fromHash();
            if (target !== index) go(target);
        });
    }

    buildSlides();
    if (!slides.length) return;
    buildDots();
    bind();
    fullBtn.hidden = !canFullscreen;
    totalEl.textContent = pad(mainTotal);
    applyLanguage();
    go(fromHash(), { silent: true });
})();

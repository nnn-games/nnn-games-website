/*
 * 회사 소개 덱(company, nnn) 전용 슬라이드 렌더러.
 * 공용 런타임(deck.js)이 `[data-deck-render="<name>"]` 요소를 만나면
 * window.DECK_RENDERERS[name](target, slideData, ctx) 를 호출한다.
 *   ctx.t(key, vars)      현재 언어 문구
 *   ctx.pick(value)       { ko, en, ja } 객체에서 현재 언어 선택
 *   ctx.el(tag, cls, txt) 요소 생성
 *   ctx.placeholder(cls, label)
 *   ctx.onLanguage(fn)    언어가 바뀔 때 다시 실행할 갱신자 등록
 * slides.js 뒤, deck.js 앞에 로드한다.
 */
(function () {
    'use strict';

    function renderAvatars(root, data, ctx) {
        var avatars = data.avatars || [];
        var backdropMarks = data.backdropMarks || [];
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
            var card = ctx.el('figure', 'avatar-card');
            if (person.featured) card.classList.add('avatar-card-featured');
            var frame;

            if (person.image) {
                frame = ctx.el('div', 'avatar-frame');
                var img = new Image();
                img.src = 'assets/' + person.image;
                img.loading = 'lazy';
                img.alt = ctx.t('people_avatar_alt', { name: person.name || '' });
                ctx.onLanguage(function () {
                    img.alt = ctx.t('people_avatar_alt', { name: person.name || '' });
                });
                frame.appendChild(img);
            } else {
                // 아바타 렌더 미확보 — 더미 이미지 파일 없이 CSS 플레이스홀더로 표시한다.
                frame = ctx.placeholder('avatar-frame', 'NNN');
            }
            card.appendChild(frame);

            var caption = ctx.el('figcaption');
            caption.appendChild(ctx.el('b', 'avatar-name', person.name || ''));

            if (person.roleKey) {
                var role = ctx.el('span', 'avatar-role', ctx.t(person.roleKey));
                ctx.onLanguage(function () { role.textContent = ctx.t(person.roleKey); });
                caption.appendChild(role);
            }
            card.appendChild(caption);
            root.appendChild(card);
        });
    }

    function renderEras(root, data, ctx) {
        var eras = data.eras || [];
        root.textContent = '';

        // 한 시대라도 이미지 슬롯을 가지면, 나머지 시대에도 같은 높이의 자리를 둬야
        // 4개 노드가 같은 축 위에 정렬된다.
        var anyWorks = eras.some(function (era) {
            return Array.isArray(era.works) && era.works.length > 0;
        });

        eras.forEach(function (era) {
            var group = ctx.el('div', 'era');
            if (era.current) group.setAttribute('data-current', '');

            var works = Array.isArray(era.works) ? era.works : [];
            if (anyWorks) {
                var box = ctx.el('div', 'era-works');
                box.setAttribute('data-count', String(works.length));

                works.forEach(function (work) {
                    var file = typeof work === 'string' ? work : (work && work.file);
                    if (!file) {
                        // 파일 미확보 슬롯 — 플랫폼 워드마크만 옅게 둔다.
                        box.appendChild(ctx.placeholder('era-work', era.platform));
                        return;
                    }
                    var cell = ctx.el('div', 'era-work');
                    var img = new Image();
                    img.src = 'assets/' + file;
                    img.loading = 'lazy';
                    if (work && work.alt) {
                        img.alt = ctx.pick(work.alt);
                        ctx.onLanguage(function () { img.alt = ctx.pick(work.alt); });
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

            var node = ctx.el('div', 'era-node');
            node.setAttribute('aria-hidden', 'true');
            node.appendChild(ctx.el('span', 'era-dot'));
            group.appendChild(node);

            var text = ctx.el('div', 'era-text');
            text.appendChild(ctx.el('p', 'era-platform', era.platform));

            var period = ctx.el('p', 'era-period', era.periodKey ? ctx.t(era.periodKey) : (era.period || ''));
            if (era.periodKey) {
                ctx.onLanguage(function () { period.textContent = ctx.t(era.periodKey); });
            }
            text.appendChild(period);

            if (era.descKey) {
                var desc = ctx.el('p', 'era-desc', ctx.t(era.descKey));
                ctx.onLanguage(function () { desc.textContent = ctx.t(era.descKey); });
                text.appendChild(desc);
            }
            group.appendChild(text);
            root.appendChild(group);
        });
    }

    function renderAwards(root, data, ctx) {
        var awards = data.awards || [];
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

        var label = ctx.el('p', 'awards-label', ctx.t('history_awards_label'));
        ctx.onLanguage(function () { label.textContent = ctx.t('history_awards_label'); });
        root.appendChild(label);

        var list = ctx.el('ul', 'awards-list');
        awards.forEach(function (award) {
            var item = ctx.el('li', 'award');
            item.appendChild(ctx.el('span', 'award-year', award.year || ''));

            var name = ctx.el('p', 'award-name', ctx.pick(award.name));
            ctx.onLanguage(function () { name.textContent = ctx.pick(award.name); });
            item.appendChild(name);

            if (award.org) {
                var org = ctx.el('p', 'award-org', ctx.pick(award.org));
                ctx.onLanguage(function () { org.textContent = ctx.pick(award.org); });
                item.appendChild(org);
            }
            list.appendChild(item);
        });
        root.appendChild(list);
    }

    /* UGC 썸네일 그리드. 파일명만 데이터로 두고 대체 텍스트는 번호로 붙인다. */
    function renderUgcWorks(root, data, ctx) {
        var works = data.works || [];
        root.textContent = '';

        works.forEach(function (file, i) {
            if (!file) {
                root.appendChild(ctx.placeholder('ugc-cell', 'UGC'));
                return;
            }
            var cell = ctx.el('div', 'ugc-cell');
            var img = new Image();
            img.src = 'assets/' + file;
            img.loading = 'lazy';
            img.alt = ctx.t('alt_ugcworks', { n: i + 1 });
            ctx.onLanguage(function () { img.alt = ctx.t('alt_ugcworks', { n: i + 1 }); });
            cell.appendChild(img);
            root.appendChild(cell);
        });
    }

    window.DECK_RENDERERS = Object.assign(window.DECK_RENDERERS || {}, {
        avatars: renderAvatars,
        eras: renderEras,
        awards: renderAwards,
        ugcworks: renderUgcWorks
    });
})();

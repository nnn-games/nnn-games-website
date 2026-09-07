// 공통 유틸리티 (i18n, 포맷, 이스케이프)
(function () {
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
        if (typeof localStorage !== 'undefined') {
            const stored = localStorage.getItem('language');
            if (stored) return stored;
        }
        return (typeof document !== 'undefined' && document.documentElement.lang) || 'ko';
    };

    const getTranslations = function () {
        try {
            return (typeof window !== 'undefined' && window.translations) || {};
        } catch (_error) {
            return {};
        }
    };

    const t = function (lang, key, fallback = '') {
        const source = getTranslations();
        return (source[lang] && source[lang][key]) || fallback || key;
    };

    const interpolate = function (template, params) {
        if (!template) return '';
        return Object.keys(params || {}).reduce(function (acc, key) {
            return acc.replace(new RegExp('\\{\\{' + key + '\\}\\}', 'g'), String(params[key]));
        }, template);
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
        return String(value == null ? '' : value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    };

    const formatCompactNumber = function (value, lang) {
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

    const formatMetricValue = function (value, lang = 'ko') {
        if (typeof value !== 'number') return '--';
        try {
            return new Intl.NumberFormat(lang, {
                notation: 'compact',
                maximumFractionDigits: 1
            }).format(value);
        } catch (_error) {
            return value.toLocaleString(lang);
        }
    };

    const formatUpdatedAt = function (value, lang = 'ko') {
        if (!value) return null;
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return null;
        try {
            return new Intl.DateTimeFormat(lang, {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            }).format(date);
        } catch (_error) {
            return date.toISOString().slice(0, 10);
        }
    };

    const getStatusLabel = function (status, lang) {
        const labels = STATUS_LABELS[status];
        return labels ? labels[lang] || labels.ko : status || '--';
    };

    const getLinkLabel = function (type, lang) {
        const labels = LINK_TYPE_LABELS[type];
        return labels ? labels[lang] || labels.ko : type;
    };

    window.NNNUtils = {
        STATUS_LABELS,
        LINK_TYPE_LABELS,
        getCurrentLanguage,
        getTranslations,
        t,
        interpolate,
        pickLocalized,
        escapeHtml,
        formatCompactNumber,
        formatMetricValue,
        formatUpdatedAt,
        getStatusLabel,
        getLinkLabel
    };
})();

/*
 * Company deck: plan/company/company_intro.pdf의 원본 8장 순서.
 * ../nnn/slides.js가 동일한 KO/EN/JA 본문·대체 텍스트를 먼저 제공하며,
 * 여기서는 페이지 고유의 순서와 PDF 원문에 맞춘 제목만 덮어쓴다.
 */
window.DECK_SLIDES = [
    { id: 'cover', theme: 'orange' },
    { id: 'about', theme: 'paper' },
    { id: 'titles', theme: 'paper' },
    { id: 'case', theme: 'paper' },
    { id: 'ugc', theme: 'paper' },
    { id: 'liveops', theme: 'paper' },
    { id: 'global', theme: 'paper' },
    { id: 'closing', theme: 'orange' }
];

Object.assign(window.DECK_I18N.ko, {
    ui_page_title: 'NNN GAMES 회사 소개',
    ui_deck_label: 'NNN GAMES 회사 소개 슬라이드',
    case_title: '자체 개발·운영 게임'
});

Object.assign(window.DECK_I18N.en, {
    ui_page_title: 'NNN GAMES | Company',
    ui_deck_label: 'NNN GAMES company introduction slides',
    case_title: 'Games We Build and Operate'
});

Object.assign(window.DECK_I18N.ja, {
    ui_page_title: 'NNN GAMES | 会社紹介',
    ui_deck_label: 'NNN GAMES 会社紹介スライド',
    case_title: '自社開発・運営ゲーム'
});

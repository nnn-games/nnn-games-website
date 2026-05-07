// 다국어 번역 (KO/EN/JA)
const translations = {
    ko: {
        // 공통 페이지 타이틀
        page_title: "NNN Games | Professional Roblox Game & UGC Studio",
        projects_page_title: "프로젝트 - NNN GAMES",
        contact_page_title: "문의 - NNN GAMES",

        // 네비게이션
        nav_home: "홈",
        nav_projects: "프로젝트",
        nav_projects_roblox: "Roblox",
        nav_projects_mobile: "모바일",
        nav_contact: "문의",
        nav_menu_open: "메뉴 열기",
        nav_menu_close: "메뉴 닫기",

        // 히어로
        hero_eyebrow: "Roblox 전문 개발 스튜디오",
        hero_title: "더 나은 Roblox 게임을 만듭니다.",
        hero_subtitle: "새로운 재미를 설계하고, 돋보이는 완성도를 구현하며, 민첩하게 실행합니다.",
        hero_cta: "프로젝트 보기",
        hero_stat_projects: "운영 프로젝트",
        hero_stat_visits: "누적 방문 수",
        hero_stat_communities: "커뮤니티 구독자",

        // 커뮤니티
        community_title: "NNN 커뮤니티",
        community_subtitle: "가입자 수 집계 중...",
        community_visit_cta: "커뮤니티 방문",
        community_members_label: "명 가입자",
        community_members_unknown: "가입자 정보 없음",
        community_load_error: "커뮤니티 정보를 불러오지 못했습니다.",

        // 프로젝트 카드/목록
        project_preview_title: "진행 중인 프로젝트",
        learn_more: "자세히 보기 →",
        project_updated_label: "최근 갱신",

        // 프로젝트 페이지/필터
        projects_page_header: "프로젝트",
        projects_roblox_page_title: "Roblox 프로젝트 - NNN GAMES",
        projects_roblox_page_header: "Roblox 프로젝트",
        projects_mobile_page_title: "모바일 프로젝트 - NNN GAMES",
        projects_mobile_page_header: "모바일 프로젝트",
        projects_mobile_filter_ios: "iOS",
        projects_mobile_filter_android: "Android",
        projects_mobile_empty_state: "조건에 맞는 모바일 프로젝트가 없습니다.",
        projects_filter_kicker: "Portfolio Explorer",
        projects_filter_title: "필터로 맞는 프로젝트를 빠르게 찾기",
        projects_filter_desc: "카테고리, 진행 상태, 키워드로 포트폴리오를 바로 좁힐 수 있습니다.",
        projects_filter_reset: "필터 초기화",
        projects_filter_category_label: "카테고리",
        projects_filter_status_label: "상태",
        projects_filter_keyword_label: "검색",
        projects_filter_keyword_placeholder: "프로젝트 이름이나 설명 검색",
        projects_filter_option_all: "전체",
        projects_filter_option_roblox: "Roblox",
        projects_filter_option_active: "운영 중",
        projects_filter_option_development: "개발 중",
        projects_filter_option_completed: "완료",
        projects_filter_option_paused: "일시중단",
        projects_filter_results_default: "전체 프로젝트를 표시하고 있습니다.",
        projects_filter_results: "{{visible}} / {{total}}개 프로젝트 표시 중",
        projects_filter_results_none: "조건에 맞는 프로젝트가 없습니다.",
        projects_empty_state: "조건에 맞는 프로젝트가 없습니다. 필터를 조정해 주세요.",

        // 문의 페이지
        contact_page_header: "문의하기",
        contact_page_subtitle: "저희에게 연락해 주세요. 프로젝트, 서비스 또는 기타 문의사항이 있으시면 언제든 답변드리겠습니다.",
        contact_info_title: "연락처 정보",
        office_location_title: "사무실 위치",

        // 상세 페이지 공통
        gallery_title: "갤러리",
        project_detail_kicker: "Project Detail",
        project_detail_overview_eyebrow: "Overview",
        project_detail_overview_title: "프로젝트 개요",
        project_detail_highlights_eyebrow: "Highlights",
        project_detail_highlights_title: "핵심 포인트",
        project_detail_links_eyebrow: "Resources",
        project_detail_links_title: "관련 링크",
        project_detail_links_pending: "추가 링크를 준비 중입니다.",
        project_detail_gallery_eyebrow: "Gallery",
        project_detail_snapshot_title: "프로젝트 스냅샷",
        project_detail_snapshot_launch: "출시",
        project_detail_snapshot_status: "상태",
        project_detail_snapshot_platform: "플랫폼",
        project_detail_snapshot_client: "클라이언트",
        project_detail_snapshot_stack: "기술 스택",
        project_detail_features_title: "주요 특징",
        project_detail_back_to_projects: "프로젝트 목록으로",
        project_detail_error: "프로젝트 상세 정보를 불러오지 못했습니다.",

        // CTA 공통
        cta_visit_group: "그룹 방문",

        // 지표
        metric_visits: "방문",
        metric_playing: "플레이 중",
        metric_favorites: "즐겨찾기",
        metric_like: "좋아요",

        // 홈 UGC 스포트라이트 (index.html 정적 섹션에서 사용)
        project_nnn_ugc_title: "NNN UGC",
        project_nnn_ugc_status: "제작 중",
        project_nnn_ugc_genre: "장르: UGC 아이템 제작",
        project_nnn_ugc_platform: "플랫폼: ROBLOX",
        project_nnn_ugc_summary_p1: "NNN UGC는 Roblox 이용자를 위한 트렌디하고 창의적인 아바타 아이템을 제작·판매하는 수익형 콘텐츠 프로젝트입니다.",
        project_nnn_ugc_summary_p2: "Z세대 감각에 맞춘 디자인, 시즌 테마, SNS 연동 요소로 꾸미기·소장 욕구를 자극하는 패션 중심 UGC 브랜드를 구축합니다.",

        // 푸터
        footer_about_title: "NNN GAMES",
        footer_about_text: "NNN GAMES는 Roblox 기반의 UGC와 게임 콘텐츠로 전 세계 유저에게 재미와 가치를 전달하는 프리미엄 스튜디오입니다.",
        footer_links_title: "바로가기",
        footer_contact_title: "연락처",
        footer_address: "주소 : (13449) 경기도 성남시 수정구 창업로 54, 판교 제2테크노밸리 LH기업성장센터, 804B호",
        footer_business_number: "사업자등록번호: 629-87-01849",
        footer_copyright: "© 2026 Triple N Games Inc. All Rights Reserved."
    },

    en: {
        page_title: "NNN Games | Professional Roblox Game & UGC Studio",
        projects_page_title: "Projects - NNN GAMES",
        contact_page_title: "Contact - NNN GAMES",

        nav_home: "Home",
        nav_projects: "Projects",
        nav_projects_roblox: "Roblox",
        nav_projects_mobile: "Mobile",
        nav_contact: "Contact",
        nav_menu_open: "Open menu",
        nav_menu_close: "Close menu",

        hero_eyebrow: "Roblox development studio",
        hero_title: "We build better Roblox games.",
        hero_subtitle: "We design new fun, deliver standout quality, and move quickly in execution.",
        hero_cta: "View projects",
        hero_stat_projects: "live projects",
        hero_stat_visits: "total visits",
        hero_stat_communities: "community subscribers",

        community_title: "NNN communities",
        community_subtitle: "Counting subscribers...",
        community_visit_cta: "Visit community",
        community_members_label: "subscribers",
        community_members_unknown: "Subscribers n/a",
        community_load_error: "Failed to load community information.",

        project_preview_title: "Ongoing Projects",
        learn_more: "Learn More →",
        project_updated_label: "Updated",

        projects_page_header: "Projects",
        projects_roblox_page_title: "Roblox Projects - NNN GAMES",
        projects_roblox_page_header: "Roblox Projects",
        projects_mobile_page_title: "Mobile Projects - NNN GAMES",
        projects_mobile_page_header: "Mobile Projects",
        projects_mobile_filter_ios: "iOS",
        projects_mobile_filter_android: "Android",
        projects_mobile_empty_state: "No mobile projects match the current filters.",
        projects_filter_kicker: "Portfolio Explorer",
        projects_filter_title: "Find the right project faster",
        projects_filter_desc: "Narrow the portfolio immediately by category, status, and keyword.",
        projects_filter_reset: "Reset filters",
        projects_filter_category_label: "Category",
        projects_filter_status_label: "Status",
        projects_filter_keyword_label: "Search",
        projects_filter_keyword_placeholder: "Search by project name or description",
        projects_filter_option_all: "All",
        projects_filter_option_roblox: "Roblox",
        projects_filter_option_active: "Live",
        projects_filter_option_development: "In Development",
        projects_filter_option_completed: "Completed",
        projects_filter_option_paused: "Paused",
        projects_filter_results_default: "Showing all projects.",
        projects_filter_results: "{{visible}} of {{total}} projects shown",
        projects_filter_results_none: "No projects match the current filters.",
        projects_empty_state: "No projects match the current filters. Adjust the filters and try again.",

        contact_page_header: "Get in Touch",
        contact_page_subtitle: "We'd love to hear from you. Whether you have a question about our projects, services, or anything else, our team is ready to answer all your questions.",
        contact_info_title: "Contact Information",
        office_location_title: "Office Location",

        gallery_title: "Gallery",
        project_detail_kicker: "Project Detail",
        project_detail_overview_eyebrow: "Overview",
        project_detail_overview_title: "Project Overview",
        project_detail_highlights_eyebrow: "Highlights",
        project_detail_highlights_title: "Key Points",
        project_detail_links_eyebrow: "Resources",
        project_detail_links_title: "Related Links",
        project_detail_links_pending: "Additional links are being prepared.",
        project_detail_gallery_eyebrow: "Gallery",
        project_detail_snapshot_title: "Project Snapshot",
        project_detail_snapshot_launch: "Launch",
        project_detail_snapshot_status: "Status",
        project_detail_snapshot_platform: "Platform",
        project_detail_snapshot_client: "Client",
        project_detail_snapshot_stack: "Stack",
        project_detail_features_title: "Features",
        project_detail_back_to_projects: "Back to Projects",
        project_detail_error: "Project detail could not be loaded.",

        cta_visit_group: "Visit Roblox Group",

        metric_visits: "Visits",
        metric_playing: "Playing",
        metric_favorites: "Favorites",
        metric_like: "Like",

        project_nnn_ugc_title: "NNN UGC",
        project_nnn_ugc_status: "In Production",
        project_nnn_ugc_genre: "Genre: UGC Item Creation",
        project_nnn_ugc_platform: "Platform: ROBLOX",
        project_nnn_ugc_summary_p1: "NNN UGC is a revenue-driven Roblox content project that designs and sells trendy, creative avatar items.",
        project_nnn_ugc_summary_p2: "We build a fashion-led UGC brand that taps Gen Z taste, seasonal themes, and SNS-friendly looks to drive customization and collection demand.",

        footer_about_title: "NNN GAMES",
        footer_about_text: "NNN GAMES is a premium studio delivering fun and value to global players through Roblox-native games and UGC.",
        footer_links_title: "Quick Links",
        footer_contact_title: "Contact",
        footer_address: "Address: 804B, LH Global Game Hub Center, 54 Changeop-ro, Sujeong-gu, Seongnam-si, Gyeonggi-do, Republic of Korea",
        footer_business_number: "Business Registration No: 629-87-01849",
        footer_copyright: "© 2026 Triple N Games Inc. All Rights Reserved."
    },

    ja: {
        page_title: "NNN Games | Professional Roblox Game & UGC Studio",
        projects_page_title: "プロジェクト - NNN GAMES",
        contact_page_title: "お問い合わせ - NNN GAMES",

        nav_home: "ホーム",
        nav_projects: "プロジェクト",
        nav_projects_roblox: "Roblox",
        nav_projects_mobile: "モバイル",
        nav_contact: "お問い合わせ",
        nav_menu_open: "メニューを開く",
        nav_menu_close: "メニューを閉じる",

        hero_eyebrow: "Roblox専門開発スタジオ",
        hero_title: "より良いRobloxゲームを作っています。",
        hero_subtitle: "新しい楽しさを設計し、際立つ完成度を実装し、素早く実行します。",
        hero_cta: "プロジェクトを見る",
        hero_stat_projects: "運営プロジェクト",
        hero_stat_visits: "累計訪問数",
        hero_stat_communities: "コミュニティ加入者",

        community_title: "NNN コミュニティ",
        community_subtitle: "加入者数を集計中...",
        community_visit_cta: "コミュニティへ",
        community_members_label: "加入者",
        community_members_unknown: "加入者情報なし",
        community_load_error: "コミュニティ情報を読み込めませんでした。",

        project_preview_title: "進行中のプロジェクト",
        learn_more: "詳細を見る →",
        project_updated_label: "更新日",

        projects_page_header: "プロジェクト",
        projects_roblox_page_title: "Robloxプロジェクト - NNN GAMES",
        projects_roblox_page_header: "Robloxプロジェクト",
        projects_mobile_page_title: "モバイルプロジェクト - NNN GAMES",
        projects_mobile_page_header: "モバイルプロジェクト",
        projects_mobile_filter_ios: "iOS",
        projects_mobile_filter_android: "Android",
        projects_mobile_empty_state: "条件に合うモバイルプロジェクトはありません。",
        projects_filter_kicker: "Portfolio Explorer",
        projects_filter_title: "条件に合うプロジェクトを素早く探す",
        projects_filter_desc: "カテゴリ、進行状況、キーワードでポートフォリオをすぐ絞り込めます。",
        projects_filter_reset: "フィルターをリセット",
        projects_filter_category_label: "カテゴリ",
        projects_filter_status_label: "ステータス",
        projects_filter_keyword_label: "検索",
        projects_filter_keyword_placeholder: "プロジェクト名または説明で検索",
        projects_filter_option_all: "すべて",
        projects_filter_option_roblox: "Roblox",
        projects_filter_option_active: "運営中",
        projects_filter_option_development: "開発中",
        projects_filter_option_completed: "完了",
        projects_filter_option_paused: "一時停止",
        projects_filter_results_default: "すべてのプロジェクトを表示しています。",
        projects_filter_results: "{{total}}件中{{visible}}件を表示",
        projects_filter_results_none: "条件に一致するプロジェクトがありません。",
        projects_empty_state: "条件に一致するプロジェクトがありません。フィルターを調整してください。",

        contact_page_header: "お問い合わせ",
        contact_page_subtitle: "ご連絡お待ちしております。プロジェクト、サービス、その他ご質問がございましたら、いつでもお答えいたします。",
        contact_info_title: "連絡先情報",
        office_location_title: "オフィス所在地",

        gallery_title: "ギャラリー",
        project_detail_kicker: "Project Detail",
        project_detail_overview_eyebrow: "Overview",
        project_detail_overview_title: "プロジェクト概要",
        project_detail_highlights_eyebrow: "Highlights",
        project_detail_highlights_title: "注目ポイント",
        project_detail_links_eyebrow: "Resources",
        project_detail_links_title: "関連リンク",
        project_detail_links_pending: "追加リンクを準備中です。",
        project_detail_gallery_eyebrow: "Gallery",
        project_detail_snapshot_title: "プロジェクトスナップショット",
        project_detail_snapshot_launch: "公開",
        project_detail_snapshot_status: "ステータス",
        project_detail_snapshot_platform: "プラットフォーム",
        project_detail_snapshot_client: "クライアント",
        project_detail_snapshot_stack: "技術スタック",
        project_detail_features_title: "主な特徴",
        project_detail_back_to_projects: "プロジェクト一覧へ",
        project_detail_error: "プロジェクト詳細を読み込めませんでした。",

        cta_visit_group: "グループを訪問",

        metric_visits: "訪問",
        metric_playing: "プレイ中",
        metric_favorites: "お気に入り",
        metric_like: "いいね",

        project_nnn_ugc_title: "NNN UGC",
        project_nnn_ugc_status: "制作中",
        project_nnn_ugc_genre: "ジャンル：UGCアイテム制作",
        project_nnn_ugc_platform: "プラットフォーム：ROBLOX",
        project_nnn_ugc_summary_p1: "NNN UGCは、Robloxユーザー向けにトレンド感のあるアバターアイテムを制作・販売する収益型コンテンツプロジェクトです。",
        project_nnn_ugc_summary_p2: "Z世代の感覚に合わせたデザイン、シーズンテーマ、SNS連動要素により、着せ替えとコレクション欲求を刺激するファッション中心のUGCブランドを構築します。",

        footer_about_title: "NNN GAMES",
        footer_about_text: "NNN GAMESは、RobloxネイティブのUGCとゲームコンテンツで、世界中のユーザーに楽しさと価値を届けるプレミアムスタジオです。",
        footer_links_title: "クイックリンク",
        footer_contact_title: "連絡先",
        footer_address: "住所：〒13449 韓国 京畿道 城南市 修正区 スタートアップ路54 LH企業成長センター 804B号室",
        footer_business_number: "事業者登録番号: 629-87-01849",
        footer_copyright: "© 2026 Triple N Games Inc. All Rights Reserved."
    }
};

const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';
if (isBrowser) {
    window.translations = translations;
}

let currentLanguage = isBrowser && localStorage.getItem('language') || 'ko';

function changeLanguage(lang) {
    currentLanguage = lang;
    if (isBrowser) {
        localStorage.setItem('language', lang);
        document.documentElement.lang = lang;
        updateTranslations();
        updateLanguageButtons();
        document.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
    }
}

function updateTranslations() {
    const locale = translations[currentLanguage] || {};

    document.querySelectorAll('[data-key]').forEach(element => {
        const key = element.getAttribute('data-key');
        if (locale[key]) {
            element.textContent = locale[key];
        }
    });

    document.querySelectorAll('[data-key-placeholder]').forEach(element => {
        const key = element.getAttribute('data-key-placeholder');
        if (locale[key]) {
            element.setAttribute('placeholder', locale[key]);
        }
    });

    document.querySelectorAll('[data-key-aria-label]').forEach(element => {
        const key = element.getAttribute('data-key-aria-label');
        if (locale[key]) {
            element.setAttribute('aria-label', locale[key]);
        }
    });
}

function updateLanguageButtons() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
        if (btn.getAttribute('data-lang') === currentLanguage) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

if (isBrowser) {
    document.addEventListener('DOMContentLoaded', function () {
        document.documentElement.lang = currentLanguage;
        updateTranslations();
        updateLanguageButtons();

        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                const lang = this.getAttribute('data-lang');
                changeLanguage(lang);
            });
        });
    });
}

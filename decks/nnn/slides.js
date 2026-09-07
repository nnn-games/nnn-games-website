/*
 * NNN GAMES 회사 소개 덱 — 슬라이드 데이터 + 다국어 문자열
 * 기획서: plan/company/company-intro-site.md
 *
 * 규칙
 *  - 수치(9.4M, 2.2K 등), 아바타 네임, 플랫폼명은 번역 대상이 아니므로 i18n 키를 만들지 않는다.
 *  - 번역 텍스트는 DECK_I18N 에만 두고, 마크업에는 data-deck-key 로 연결한다.
 *
 * 지표 갱신 (마지막 반영: 2026-07-30, 데이터 기준일 2026-07-29 23:55 UTC)
 *  출처: `npm run update:metrics` 가 갱신하는 data/projects.json, data/communities.json
 *   - S2 누적 방문   ← projects.json  summary.hero.totalVisits
 *   - S2 커뮤니티 멤버 ← communities.json totalMembers
 *   - S2 운영 프로젝트 ← projects.json  summary.hero.projectCount
 *   - S5 게임별 Total visits ← all[].metrics.visits
 *   - S5 Rating            ← all[].metrics.likeRatio
 *  위 값은 index.html 에 그대로 적혀 있다(번역 대상이 아니므로 i18n 키 없음).
 *  과대 표기를 피하려고 항상 내림해서 쓴다. 예: 11,228,586 → 11.2M+
 *
 *  데이터로 채울 수 없는 값 — 갱신 시 그대로 두거나 별도로 확인해야 한다.
 *   - S5 Peak CCU (2.2K / 164): Roblox API 는 현재 접속자(playing)만 주고 최고 기록은 없다.
 *   - 부록 Get Train (2.5M / 600K WAU): 종료된 ZEPETO 프로젝트라 확정값이다.
 */

const DECK_SLIDES = [
    { id: 'cover', theme: 'orange' },
    { id: 'about', theme: 'paper' },

    /* ---------------------------------------------------------------------
     * S3 PEOPLE
     * 아바타 스크린샷 3장을 가로로 놓고 각 이미지 하단에 아바타 네임을 표시한다.
     *
     * 항목 형태: { image: 'people-oneshot.webp', name: 'ONESHOT' }
     *   - image: nnn/assets/ 기준 파일명. null 이면 플레이스홀더 프레임.
     *   - name : 로블록스 유저네임 원문. 3개 언어 공통이라 번역하지 않는다.
     *
     * 아바타를 교체할 때는 3장 모두 같은 크롭 박스로 다시 내보내야 한다.
     * 캔버스가 같아야 object-fit:contain 이 세 장을 동일 배율로 그리고 발 위치가 맞는다
     * (현재 캔버스 1200x1145 → deck.css 의 .avatar-frame aspect-ratio 와 짝을 이룬다).
     *
     * 네임 아래 역할 라벨은 표시하지 않기로 확정했다(2026-07-30).
     * 되살릴 일이 생기면 항목에 roleKey 를 넣고 DECK_I18N 3개 언어에 같은 키를 추가한다
     * (deck.js 의 렌더 분기와 .avatar-role 스타일은 그대로 남겨 두었다).
     * ------------------------------------------------------------------- */
    {
        id: 'people',
        theme: 'paper',
        backdropMarks: [
            { image: 'claude-icon.png', side: 'left' },
            { image: 'chatgpt-icon.png', side: 'right' }
        ],
        avatars: [
            { image: 'people-oneshot.webp', name: 'ONESHOT' },
            { image: 'people-jeff.webp', name: 'JEFF', featured: true },
            { image: 'people-papaslime.webp', name: 'PAPASLIME' }
        ]
    },

    /* ---------------------------------------------------------------------
     * S4 HISTORY
     * works: 시대별 대표작 이미지 슬롯 (0~3개)
     *   - 'era-zepeto-1.jpg' 처럼 파일명을 넣으면 nnn/assets/ 에서 불러온다.
     *   - null 이면 플레이스홀더 프레임 (더미 이미지 파일을 두지 않는다).
     *   - 빈 배열([]) 이면 그 시대의 이미지 영역 자체를 렌더하지 않는다.
     *
     * awards: 수상 경력. 빈 배열이면 하단 영역 전체를 렌더하지 않는다.
     *   확보되면 아래 형태로 2건을 채운다.
     *   { year: '2025',
     *     name: { ko: '…', en: '…', ja: '…' },
     *     org:  { ko: '…', en: '…', ja: '…' } }
     * ------------------------------------------------------------------- */
    {
        id: 'history',
        theme: 'paper',
        eras: [
            { platform: 'MOBILE', period: '~ 2021', descKey: 'history_era_mobile', works: ['mobile-sc1.webp', 'mobile-sc2.webp'] },
            { platform: 'IFLAND', period: '2022', descKey: 'history_era_ifland', works: ['ifland-sc1.webp', 'ifland-sc2.webp'] },
            { platform: 'ZEPETO', period: '2023 ~ 2025', descKey: 'history_era_zepeto', works: ['zepeto-sc1.webp', 'zepeto-sc2.webp'] },
            // 제공받은 roblox-sc1~4 는 S1/S5/S7 에서 쓰는 파일과 바이트 단위로 동일했다.
            // 사본을 늘리지 않고 기존 에셋을 그대로 참조한다(추가 다운로드 0KB).
            { platform: 'ROBLOX', periodKey: 'history_period_roblox', descKey: 'history_era_roblox', works: ['game-tfr.jpg', 'game-tomato.jpg', 'ugc-afk.jpg', 'ugc-rng.jpg', 'roblox-korean-spa.jpg', 'roblox-fruit-battles.jpg'], current: true }
        ],
        awards: []
    },

    { id: 'titles', theme: 'paper' },

    /* ---------------------------------------------------------------------
     * S6 UGC 제작
     * works: UGC 제작물 썸네일 12장 (3열 x 4행).
     *   원본이 150x150 카탈로그 썸네일이라 셀을 그보다 크게 잡지 않는다(확대 시 흐려진다).
     *   배경이 투명한 PNG 라 흰 카드 위에 contain 으로 얹는다(deck.css).
     *   순서는 이 배열 그대로 왼쪽→오른쪽, 위→아래로 놓인다.
     * ------------------------------------------------------------------- */
    {
        id: 'ugcworks',
        theme: 'paper',
        works: [
            'ugc-1.png', 'ugc-2.png', 'ugc-3.png',
            'ugc-4.png', 'ugc-5.png', 'ugc-6.png',
            'ugc-7.png', 'ugc-8.png', 'ugc-9.png',
            'ugc-10.png', 'ugc-11.png', 'ugc-12.png'
        ]
    },

    { id: 'case', theme: 'paper' },
    { id: 'ugc', theme: 'paper' },
    { id: 'liveops', theme: 'paper' },
    { id: 'development', theme: 'paper' },
    { id: 'planning', theme: 'paper' },
    { id: 'closing', theme: 'orange' },

    /* ---------------------------------------------------------------------
     * 부록 — appendix: true
     * 질문이 들어올 때만 펼치는 자료라 본편 흐름에서 빼고 클로징 뒤에 둔다.
     * 카운터/진행 바는 본편 장수(12장)만 세고, 도트는 경계를 띄워 구분한다(deck.js).
     * 부록을 늘릴 때는 아래에 같은 플래그로 추가하면 번호가 자동으로 이어진다.
     * ------------------------------------------------------------------- */
    { id: 'global', theme: 'paper', appendix: true }
];

const DECK_I18N = {
    ko: {
        ui_page_title: 'NNN GAMES 회사 소개',
        ui_prev: '이전',
        ui_next: '다음',
        ui_lang_group: '언어 선택',
        ui_fullscreen: '전체화면',
        ui_fullscreen_exit: '전체화면 종료',
        ui_deck_label: 'NNN GAMES 회사 소개 슬라이드',
        ui_dot: '{{n}}번 슬라이드로 이동',
        ui_dot_appendix: '부록 {{n}}번 슬라이드로 이동',
        ui_slide_position: '{{current}} / {{total}} 슬라이드',
        ui_appendix: '부록',
        ui_appendix_position: '부록 {{current}} / {{total}}',

        // S1 표지
        cover_subtitle: 'ROBLOX Game & UGC Development Studio',
        cover_ceo: '대표 : 오현석, nnnceo@triplengames.com',
        cover_address: '경기도 화성시 동탄구 동탄순환대로 878 (영천동), 311호',

        // S2 ABOUT
        about_headline: 'ROBLOX 전문 게임 개발 스튜디오',
        about_lead: '트리플엔게임즈는 자체 게임 개발과 라이브 운영을 중심으로, 브랜드·IP 게임과 UGC 콘텐츠를 제작하는 ROBLOX 전문 게임 스튜디오입니다.',
        about_period: '2026.01 ~ 현재',
        about_stat_projects: '운영 프로젝트',
        about_stat_visits: '누적 방문',
        about_stat_members: '커뮤니티 멤버',
        about_cap_title: '핵심 역량',
        about_cap_lead: 'ROBLOX 게임 개발부터 출시 이후 운영과 UGC 보상 설계까지 하나의 흐름으로 연결합니다.',
        about_cap1_desc: '자체 ROBLOX 게임 및 브랜드/IP 기반 게임 기획 및 개발',
        about_cap2_desc: '출시 이후 업데이트/이벤트/퀘스트/랭킹 지속 운영',
        about_cap3_desc: 'Free/Limited UGC를 게임 플레이와 보상 루프에 연결',
        about_pipeline_caption: '기획 및 개발 → 출시 → 라이브 운영 → 데이터 기반 개선',

        // S3 PEOPLE
        people_title: 'NNN Team',
        people_lead: '작은 조직이 빠르게 결정하고, 곧바로 실행합니다.',
        people_badge: '기획 → 개발 → 아트 → 운영, 한 팀에서',
        people_avatar_alt: 'NNN GAMES 팀원 로블록스 아바타 — {{name}}',

        // S4 HISTORY
        history_title: '여러 플랫폼에서 쌓은 경험, 이제 Roblox로',
        history_period_roblox: '2026 ~ 현재',
        history_era_mobile: 'iOS와 Android 게임을 출시했습니다.',
        history_era_ifland: '참여형 공간과 이벤트를 만들었습니다.',
        history_era_zepeto: 'Get Train 등 브랜드 월드를 만들고 운영했습니다.',
        history_era_roblox: '6개 프로젝트를 운영하며 누적 방문 1,120만 회를 넘겼습니다.',
        history_awards_label: '수상 경력',

        // S5 주요 ROBLOX 게임
        titles_title: '주요 ROBLOX 게임',
        titles_genre_tfr: '오비 & 플랫포머 / 타워 오비',
        titles_genre_afk: '파티 & 캐주얼 / 미니게임',
        titles_genre_tomato: '시뮬레이션 / 인크리멘탈 시뮬레이터',
        titles_genre_rng: '시뮬레이션 / 인크리멘탈 시뮬레이터',

        // S6 UGC 제작
        ugcworks_title: '고퀄리티 UGC 직접 제작',
        ugcworks_p1: '제작 난이도가 높은 고품질 UGC 제작',
        ugcworks_p2: '다양한 부위와 소재, 애니메이션까지 제작',
        ugcworks_p3: '게임과 연동한 UGC 판매 프로세스 구축',

        // S7 CASE STUDIES
        case_title: '다양한 장르의 게임을 개발·운영하며, 로블록스 플레이어의 취향과 경험을 연구 중',
        case_tfr_sub: '멀티플레이 경쟁 · 라이브 운영',
        case_tfr_1: '상승하는 물을 피해 타워를 오르는 멀티플레이 레이스',
        case_tfr_2: '순위 경쟁과 Slap·아이템을 활용한 플레이어 간 견제',
        case_tfr_3: '보상과 퀘스트를 통한 성장·반복 플레이 구조',
        case_tfr_4: '시즌·랭킹·이벤트 기반 지속적인 라이브 운영',
        case_tomato_sub: '타격감과 지속 성장을 결합한 액션 중심 시뮬레이션',
        case_tomato_1: '쫄깃한 타격감',
        case_tomato_2: '자원과 오브젝트 기반 지속 성장',
        case_tomato_3: '성장 변화를 직접 체감하는 액션 플레이',
        case_tomato_4: '간단한 조작과 반복 강화를 결합한 플레이 구조',

        // S8 UGC x GAMEPLAY
        ugc_title: '무료 UGC를 게임 루프의 일부로 설계',
        ugc_afk_sub: '클래식 미니게임과 UGC 수집을 결합한 캐주얼 아케이드',
        ugc_afk_1: '클래식 미니게임 플레이',
        ugc_afk_2: '마을 탐험과 코인 수집',
        ugc_afk_3: 'AFK 기반 자동 코인 획득',
        ugc_afk_4: '코인을 활용한 Free UGC 교환',
        ugc_rng_sub: 'RNG 수집과 UGC 보상을 결합한 컬렉션 시뮬레이션',
        ugc_rng_1: '무료 Roll 기반 RNG 수집',
        ugc_rng_2: 'Merge 중심 성장 구조',
        ugc_rng_3: 'Coin으로 Limited UGC 획득',
        ugc_rng_4: '이벤트 기반 희귀 보상 수집',

        // S9 라이브 운영
        liveops_label: '실제 라이브 운영 사례',
        liveops_title: '출시 이후 운영',
        liveops_lead: '출시 이후의 운영까지 게임 개발의 일부로 봅니다.',
        liveops_seasonal_desc: '기간 한정 경쟁 콘텐츠',

        // S10 개발 중인 게임
        development_title: '개발 중인 게임',
        development_town_1: '거대한 타워 빌딩이 있는 마을 탐험',
        development_town_2: 'AFK·타워 OBBY·FINDING으로 코인 수집 및 UGC 교환',
        development_tower_1: '로블록스 정통 R6 타워 OBBY',
        development_tower_2: '타워를 오르고 포인트를 모아 UGC로 교환',
        development_ducky_1: '주사위를 굴려 오리를 수집하고, 함께 점프해 장애물 돌파',
        development_ducky_2: '착용 오리 수에 따라 스피드·점프 횟수 증가',
        development_weapon_1: '몬스터 처치 후 코인으로 무기와 주문서 구매',
        development_weapon_2: '+10 강화 성공 시 실제 UGC 무기로 교환',

        // S11 기획 단계 게임
        planning_title: '기획 중인 게임',
        planning_hvs_1: '해커·시큐리티 두 진영의 경쟁',
        planning_hvs_2: '상대 진영의 보안 시스템 해킹',
        planning_star_1: '성공과 실패를 반복하는 로켓 발사 도전',
        planning_star_2: '화성 도달 후 인류의 새 정착지 개척',
        planning_tomato_1: 'TOMATO SPLATTER SIMULATOR의 확장판',
        planning_tomato_2: '디아블로식 액션 RPG와 다양한 옵션 장비 성장',

        // S12 클로징
        closing_body: '트리플엔게임즈는 자체 게임 개발과 라이브 운영 경험을 바탕으로, 파트너와 함께 지속적으로 성장하는 ROBLOX 게임을 만들어갑니다.',

        // 부록 A1 글로벌 프로젝트
        global_desc1: 'JR동일본, 네이버제트와 함께 진행한 도쿄 야마노테선을 배경으로 제작된 게임형 체험 프로젝트',
        global_desc2: 'JRE WALLET(블록체인 기반 전자지갑) 연동 이벤트 시스템 개발 및 운영',

        // 이미지 대체 텍스트
        alt_game_tfr: 'TOWER FLOOD RACE 게임 썸네일',
        alt_game_tomato: 'TOMATO SPLATTER SIMULATOR 게임 썸네일',
        alt_game_afk: '[FREE UGC] AFK or ARCADE GAME 게임 썸네일',
        alt_game_rng: 'FREE UGC RNG 게임 썸네일',
        alt_case_tfr: 'TOWER FLOOD RACE 인게임 플레이 화면',
        alt_case_tomato: 'TOMATO SPLATTER SIMULATOR 인게임 플레이 화면',
        alt_ugc_afk: '[FREE UGC] AFK or ARCADE GAME 아케이드 마을 화면',
        alt_ugc_rng: 'FREE UGC RNG 수집 플레이 화면',
        alt_event_top100: '2-Week Top 100 Challenge 이벤트 배너',
        alt_event_ducky: 'Golden Ducky Drop 이벤트 배너',
        alt_development_town: 'FREE UGC TOWN 게임 아트',
        alt_development_tower: 'FREE UGC TOWER 게임 아트',
        alt_development_ducky: 'DUCKY RNG 게임 아트',
        alt_development_weapon: 'ENCHANTED WEAPON 게임 아트',
        alt_planning_hvs: 'HACKER VS SECURITY 게임 아트',
        alt_planning_star: 'STAR REACH 게임 아트',
        alt_planning_tomato: 'TOMATO SPLATTER 2 게임 아트',
        alt_global_1: 'Get Train 월드 플레이 화면',
        alt_global_2: 'Get Train × JRE WALLET 앱 연동 캠페인 배너',
        alt_global_3: 'Get Train × JRE WALLET 연동 5ZEM 증정 캠페인 배너',
        alt_global_4: 'Get Train 무료 위시 아이템 배너',
        alt_ugcworks: 'NNN GAMES 제작 UGC 아이템 {{n}}'
    },

    en: {
        ui_page_title: 'NNN GAMES Company Introduction',
        ui_prev: 'Prev',
        ui_next: 'Next',
        ui_lang_group: 'Select language',
        ui_fullscreen: 'Fullscreen',
        ui_fullscreen_exit: 'Exit fullscreen',
        ui_deck_label: 'NNN GAMES company introduction slides',
        ui_dot: 'Go to slide {{n}}',
        ui_dot_appendix: 'Go to appendix slide {{n}}',
        ui_slide_position: 'Slide {{current}} of {{total}}',
        ui_appendix: 'Appendix',
        ui_appendix_position: 'Appendix {{current}} of {{total}}',

        cover_subtitle: 'ROBLOX Game & UGC Development Studio',
        cover_ceo: 'CEO: Hyunseok Oh, nnnceo@triplengames.com',
        cover_address: '311, 878 Dongtansunhwan-daero, Dongtan-gu, Hwaseong-si, Gyeonggi-do, Republic of Korea',

        about_headline: 'A ROBLOX-Native Game Development Studio',
        about_lead: 'Triple N Games is a ROBLOX-focused studio built around in-house game development and live operations, producing brand/IP titles and UGC content.',
        about_period: '2026.01 – Present',
        about_stat_projects: 'Live Projects',
        about_stat_visits: 'Total Visits',
        about_stat_members: 'Community Members',
        about_cap_title: 'Core Capabilities',
        about_cap_lead: 'From ROBLOX game development to post-launch operations and UGC reward design — connected as one pipeline.',
        about_cap1_desc: 'Planning and development of in-house ROBLOX titles and brand/IP-based games',
        about_cap2_desc: 'Ongoing updates, events, quests, and rankings after launch',
        about_cap3_desc: 'Connecting Free/Limited UGC to gameplay and reward loops',
        about_pipeline_caption: 'Plan & Build → Launch → Live Ops → Data-driven Improvement',

        people_title: 'NNN Team',
        people_lead: 'A lean team makes decisions quickly and puts them into action right away.',
        people_badge: 'Design → Build → Art → Operate, in one team',
        people_avatar_alt: 'NNN GAMES team member Roblox avatar — {{name}}',

        history_title: 'Proven Across Platforms. Now Building on Roblox.',
        history_period_roblox: '2026 – Present',
        history_era_mobile: 'Shipped games on iOS and Android.',
        history_era_ifland: 'Created interactive spaces and events.',
        history_era_zepeto: 'Built and operated branded worlds, including Get Train.',
        history_era_roblox: '6 live experiences. 11.2M+ visits.',
        history_awards_label: 'Awards',

        titles_title: 'Key ROBLOX Titles',
        titles_genre_tfr: 'Obby & Platformer / Tower Obby',
        titles_genre_afk: 'Party & Casual / Minigame',
        titles_genre_tomato: 'Simulation / Incremental Simulator',
        titles_genre_rng: 'Simulation / Incremental Simulator',

        ugcworks_title: 'High-Quality UGC, Made In-House',
        ugcworks_p1: 'High-difficulty, high-quality UGC production',
        ugcworks_p2: 'Every body slot and material — animation included',
        ugcworks_p3: 'A UGC sales pipeline wired into our games',

        case_title: 'We develop and operate games across genres to study Roblox players’ preferences and experiences.',
        case_tfr_sub: 'Multiplayer competition · Live operations',
        case_tfr_1: 'A multiplayer race up a tower while escaping rising water',
        case_tfr_2: 'Rank competition with Slap and item-based player interference',
        case_tfr_3: 'Progression and replay loops driven by rewards and quests',
        case_tfr_4: 'Continuous live ops built on seasons, rankings, and events',
        case_tomato_sub: 'Action-driven simulation combining punchy feedback with steady progression',
        case_tomato_1: 'Satisfying hit feedback',
        case_tomato_2: 'Continuous growth through resources and objects',
        case_tomato_3: 'Action play where progression is immediately felt',
        case_tomato_4: 'Simple controls paired with repeatable upgrade loops',

        ugc_title: 'Designing Free UGC as Part of the Game Loop',
        ugc_afk_sub: 'A casual arcade blending classic minigames with UGC collection',
        ugc_afk_1: 'Classic minigame play',
        ugc_afk_2: 'Town exploration and coin collection',
        ugc_afk_3: 'AFK-based idle coin earning',
        ugc_afk_4: 'Exchanging coins for Free UGC',
        ugc_rng_sub: 'A collection sim merging RNG rolls with UGC rewards',
        ugc_rng_1: 'Free-roll–driven RNG collection',
        ugc_rng_2: 'Merge-centered progression',
        ugc_rng_3: 'Acquiring Limited UGC with coins',
        ugc_rng_4: 'Event-driven rare reward collection',

        liveops_label: 'Live Operations in Practice',
        liveops_title: 'Post-Launch Operations',
        liveops_lead: 'We treat post-launch operations as part of game development.',
        liveops_seasonal_desc: 'Limited-time competitive content',

        development_title: 'Games in Development',
        development_town_1: 'Explore a town built around a giant tower',
        development_town_2: 'Earn coins through AFK, tower obby, and finding play to trade for UGC',
        development_tower_1: 'A classic Roblox R6 tower obby',
        development_tower_2: 'Climb towers, earn points, and trade them for UGC',
        development_ducky_1: 'Roll dice to collect Duckies, then jump with them to clear obstacles',
        development_ducky_2: 'More equipped Duckies boost speed and jump count',
        development_weapon_1: 'Defeat monsters to earn coins for weapons and spellbooks',
        development_weapon_2: 'Successful +10 upgrades trade for actual UGC weapons',

        planning_title: 'Games in Planning',
        planning_hvs_1: 'Compete as Hackers or Security',
        planning_hvs_2: 'Hack the opposing side’s security systems',
        planning_star_1: 'Repeat rocket launches through success and failure',
        planning_star_2: 'Reach Mars and establish humanity’s next settlement',
        planning_tomato_1: 'An expansion of TOMATO SPLATTER SIMULATOR',
        planning_tomato_2: 'Diablo-style action RPG play with growth through gear options',

        closing_body: 'Backed by in-house development and live operations experience, Triple N Games builds ROBLOX games that keep growing alongside our partners.',

        global_desc1: "A game-style experience project set on Tokyo's Yamanote Line, produced with JR East and NAVER Z",
        global_desc2: 'Development and operation of an event system integrated with JRE WALLET (a blockchain-based wallet)',

        alt_game_tfr: 'TOWER FLOOD RACE game thumbnail',
        alt_game_tomato: 'TOMATO SPLATTER SIMULATOR game thumbnail',
        alt_game_afk: '[FREE UGC] AFK or ARCADE GAME game thumbnail',
        alt_game_rng: 'FREE UGC RNG game thumbnail',
        alt_case_tfr: 'TOWER FLOOD RACE in-game screenshot',
        alt_case_tomato: 'TOMATO SPLATTER SIMULATOR in-game screenshot',
        alt_ugc_afk: '[FREE UGC] AFK or ARCADE GAME arcade town screenshot',
        alt_ugc_rng: 'FREE UGC RNG collection gameplay screenshot',
        alt_event_top100: '2-Week Top 100 Challenge event banner',
        alt_event_ducky: 'Golden Ducky Drop event banner',
        alt_development_town: 'FREE UGC TOWN game art',
        alt_development_tower: 'FREE UGC TOWER game art',
        alt_development_ducky: 'DUCKY RNG game art',
        alt_development_weapon: 'ENCHANTED WEAPON game art',
        alt_planning_hvs: 'HACKER VS SECURITY game art',
        alt_planning_star: 'STAR REACH game art',
        alt_planning_tomato: 'TOMATO SPLATTER 2 game art',
        alt_global_1: 'Get Train world gameplay screenshot',
        alt_global_2: 'Get Train × JRE WALLET app-linking campaign banner',
        alt_global_3: 'Get Train × JRE WALLET 5ZEM giveaway campaign banner',
        alt_global_4: 'Get Train free wish item banner',
        alt_ugcworks: 'UGC item {{n}} produced by NNN GAMES'
    },

    ja: {
        ui_page_title: 'NNN GAMES 会社紹介',
        ui_prev: '前へ',
        ui_next: '次へ',
        ui_lang_group: '言語を選択',
        ui_fullscreen: '全画面表示',
        ui_fullscreen_exit: '全画面表示を終了',
        ui_deck_label: 'NNN GAMES 会社紹介スライド',
        ui_dot: 'スライド{{n}}へ移動',
        ui_dot_appendix: '付録スライド{{n}}へ移動',
        ui_slide_position: '{{total}}枚中{{current}}枚目',
        ui_appendix: '付録',
        ui_appendix_position: '付録 {{current}} / {{total}}',

        cover_subtitle: 'ROBLOX Game & UGC Development Studio',
        cover_ceo: '代表 : オ・ヒョンソク, nnnceo@triplengames.com',
        cover_address: '〒18469 韓国 京畿道 華城市 東灘区 東灘循環大路878 東灘ITタワー 311号室',

        about_headline: 'ROBLOX専門ゲーム開発スタジオ',
        about_lead: 'トリプルエヌゲームズは、自社ゲーム開発とライブ運営を軸に、ブランド・IPゲームとUGCコンテンツを制作するROBLOX専門ゲームスタジオです。',
        about_period: '2026.01 ~ 現在',
        about_stat_projects: '運営プロジェクト',
        about_stat_visits: '累計訪問数',
        about_stat_members: 'コミュニティメンバー',
        about_cap_title: 'コア能力',
        about_cap_lead: 'ROBLOXゲーム開発から、リリース後の運営とUGC報酬設計までを一つの流れでつなぎます。',
        about_cap1_desc: '自社ROBLOXゲームおよびブランド/IPベースゲームの企画・開発',
        about_cap2_desc: 'リリース後のアップデート/イベント/クエスト/ランキングの継続運営',
        about_cap3_desc: 'Free/Limited UGCをゲームプレイと報酬ループに接続',
        about_pipeline_caption: '企画・開発 → リリース → ライブ運営 → データに基づく改善',

        people_title: 'NNN Team',
        people_lead: '少人数のチームだからこそ、素早く意思決定し、すぐに実行に移します。',
        people_badge: '企画 → 開発 → アート → 運営、ワンチームで',
        people_avatar_alt: 'NNN GAMESチームメンバーのRobloxアバター — {{name}}',

        history_title: '複数のプラットフォームで培った経験を、Robloxへ。',
        history_period_roblox: '2026 ~ 現在',
        history_era_mobile: 'iOS・Android向けゲームをリリース。',
        history_era_ifland: '参加型スペースとイベントを制作。',
        history_era_zepeto: 'Get Trainを含むブランドワールドを開発・運営。',
        history_era_roblox: '6つのプロジェクトを運営。累計1,120万回以上の訪問。',
        history_awards_label: '受賞歴',

        titles_title: '主要ROBLOXゲーム',
        titles_genre_tfr: 'オビー＆プラットフォーマー / タワーオビー',
        titles_genre_afk: 'パーティー＆カジュアル / ミニゲーム',
        titles_genre_tomato: 'シミュレーション / インクリメンタルシミュレーター',
        titles_genre_rng: 'シミュレーション / インクリメンタルシミュレーター',

        ugcworks_title: 'ハイクオリティUGCを自社制作',
        ugcworks_p1: '制作難易度の高い高品質UGCを制作',
        ugcworks_p2: '多様な部位と素材、アニメーションまで制作',
        ugcworks_p3: 'ゲームと連動したUGC販売プロセスを構築',

        case_title: '多彩なジャンルのゲームを開発・運営しながら、Robloxプレイヤーの好みとゲーム体験を研究しています。',
        case_tfr_sub: 'マルチプレイ競争・ライブ運営',
        case_tfr_1: '上昇する水を避けてタワーを登るマルチプレイレース',
        case_tfr_2: '順位競争とSlap・アイテムを活用したプレイヤー間の牽制',
        case_tfr_3: '報酬とクエストによる成長・反復プレイ構造',
        case_tfr_4: 'シーズン・ランキング・イベントに基づく継続的なライブ運営',
        case_tomato_sub: '打撃感と持続的成長を組み合わせたアクション中心シミュレーション',
        case_tomato_1: '小気味よい打撃感',
        case_tomato_2: 'リソースとオブジェクトに基づく持続的成長',
        case_tomato_3: '成長の変化を直接体感するアクションプレイ',
        case_tomato_4: '簡単な操作と反復強化を組み合わせたプレイ構造',

        ugc_title: '無料UGCをゲームループの一部として設計',
        ugc_afk_sub: 'クラシックミニゲームとUGC収集を組み合わせたカジュアルアーケード',
        ugc_afk_1: 'クラシックミニゲームプレイ',
        ugc_afk_2: '街の探索とコイン収集',
        ugc_afk_3: 'AFKベースの自動コイン獲得',
        ugc_afk_4: 'コインを活用したFree UGC交換',
        ugc_rng_sub: 'RNG収集とUGC報酬を組み合わせたコレクションシミュレーション',
        ugc_rng_1: '無料Rollベースのランダム収集',
        ugc_rng_2: 'Merge中心の成長構造',
        ugc_rng_3: 'コインでLimited UGCを獲得',
        ugc_rng_4: 'イベントベースのレア報酬収集',

        liveops_label: '実際のライブ運営事例',
        liveops_title: 'リリース後の運営',
        liveops_lead: 'リリース後の運営までをゲーム開発の一部と捉えています。',
        liveops_seasonal_desc: '期間限定の競争コンテンツ',

        development_title: '開発中のゲーム',
        development_town_1: '巨大なタワービルがそびえる街を探索',
        development_town_2: 'AFK・タワーObby・探索でコインを集め、UGCと交換',
        development_tower_1: 'Roblox定番のR6タワーObby',
        development_tower_2: 'タワーを登ってポイントを集め、UGCと交換',
        development_ducky_1: 'サイコロを振ってダッキーを集め、一緒にジャンプして障害物を突破',
        development_ducky_2: '装備するダッキーの数に応じて速度とジャンプ回数が増加',
        development_weapon_1: 'モンスターを倒してコインを獲得し、武器とスペルブックを購入',
        development_weapon_2: '+10強化の成功で実際のUGC武器と交換',

        planning_title: '企画中のゲーム',
        planning_hvs_1: 'ハッカーとセキュリティ、二つの陣営で競う',
        planning_hvs_2: '敵陣営のセキュリティシステムをハッキング',
        planning_star_1: '成功と失敗を繰り返すロケット打ち上げへの挑戦',
        planning_star_2: '火星に到達し、人類の新たな定住地を開拓',
        planning_tomato_1: 'TOMATO SPLATTER SIMULATORの拡張版',
        planning_tomato_2: 'ディアブロ風アクションRPGと多彩なオプション装備による成長',

        closing_body: 'トリプルエヌゲームズは、自社ゲーム開発とライブ運営の経験をもとに、パートナーと共に成長し続けるROBLOXゲームを作っていきます。',

        global_desc1: 'JR東日本、NAVER Zと共に進めた、東京・山手線を舞台にしたゲーム型体験プロジェクト',
        global_desc2: 'JRE WALLET（ブロックチェーン基盤の電子ウォレット）連携イベントシステムの開発・運営',

        alt_game_tfr: 'TOWER FLOOD RACE ゲームサムネイル',
        alt_game_tomato: 'TOMATO SPLATTER SIMULATOR ゲームサムネイル',
        alt_game_afk: '[FREE UGC] AFK or ARCADE GAME ゲームサムネイル',
        alt_game_rng: 'FREE UGC RNG ゲームサムネイル',
        alt_case_tfr: 'TOWER FLOOD RACE のゲーム画面',
        alt_case_tomato: 'TOMATO SPLATTER SIMULATOR のゲーム画面',
        alt_ugc_afk: '[FREE UGC] AFK or ARCADE GAME のアーケード街の画面',
        alt_ugc_rng: 'FREE UGC RNG の収集プレイ画面',
        alt_event_top100: '2-Week Top 100 Challenge イベントバナー',
        alt_event_ducky: 'Golden Ducky Drop イベントバナー',
        alt_development_town: 'FREE UGC TOWN ゲームアート',
        alt_development_tower: 'FREE UGC TOWER ゲームアート',
        alt_development_ducky: 'DUCKY RNG ゲームアート',
        alt_development_weapon: 'ENCHANTED WEAPON ゲームアート',
        alt_planning_hvs: 'HACKER VS SECURITY ゲームアート',
        alt_planning_star: 'STAR REACH ゲームアート',
        alt_planning_tomato: 'TOMATO SPLATTER 2 ゲームアート',
        alt_global_1: 'Get Train ワールドのプレイ画面',
        alt_global_2: 'Get Train × JRE WALLET アプリ連携キャンペーンバナー',
        alt_global_3: 'Get Train × JRE WALLET 連携 5ZEM プレゼントキャンペーンバナー',
        alt_global_4: 'Get Train 無料ウィッシュアイテムバナー',
        alt_ugcworks: 'NNN GAMES制作のUGCアイテム{{n}}'
    }
};

window.DECK_SLIDES = DECK_SLIDES;
window.DECK_I18N = DECK_I18N;

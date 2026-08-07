/*
 * NNN GAMES 회사 소개 덱 — 슬라이드 데이터 + 다국어 문자열
 * 기획서: plan/company/company-intro-site.md
 *
 * 규칙
 *  - 수치(9.8M, 2.2K 등), 아바타 네임, 플랫폼명은 번역 대상이 아니므로 i18n 키를 만들지 않는다.
 *  - 번역 텍스트는 DECK_I18N 에만 두고, 마크업에는 data-deck-key 로 연결한다.
 *
 * 지표 갱신 (마지막 반영: 2026-08-07, 데이터 기준일 2026-08-06 23:43 UTC)
 *  출처: `npm run update:metrics` 가 갱신하는 data/projects.json, data/communities.json
 *   - S2 누적 방문   ← projects.json  summary.hero.totalVisits
 *   - S2 커뮤니티 멤버 ← communities.json totalMembers
 *   - S2 운영 프로젝트 ← projects.json  summary.hero.projectCount
 *   - S6 게임별 Total visits ← all[].metrics.visits
 *   - S6 Rating            ← all[].metrics.likeRatio (반올림. 예: 0.9694 → 97%)
 *   - S11 NNN UGC 멤버 수  ← communities.json groups[id=34453707].memberCount
 *  위 값은 index.html 에 그대로 적혀 있다(번역 대상이 아니므로 i18n 키 없음).
 *  방문/멤버 수는 과대 표기를 피하려고 항상 내림해서 쓴다. 예: 11,826,975 → 11.8M+
 *
 *  데이터로 채울 수 없는 값 — 갱신 시 그대로 두거나 별도로 확인해야 한다.
 *   - S6 Peak CCU (2.2K / 164): Roblox API 는 현재 접속자(playing)만 주고 최고 기록은 없다.
 *   - S5 Get Train (2.5M / 600K WAU): 종료된 ZEPETO 프로젝트라 확정값이다.
 *   - S10 ICONIX & FREEGROUND (7,566): 타사 그룹이라 update:metrics 대상이 아니다.
 *     groups.roblox.com/v1/groups/547372251 의 memberCount 를 직접 확인해 적는다.
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
            // 제공받은 roblox-sc1~4 는 S1/S6/S8 에서 쓰는 파일과 바이트 단위로 동일했다.
            // 사본을 늘리지 않고 기존 에셋을 그대로 참조한다(추가 다운로드 0KB).
            { platform: 'ROBLOX', periodKey: 'history_period_roblox', descKey: 'history_era_roblox', works: ['game-tfr.jpg', 'game-tomato.jpg', 'ugc-afk.jpg', 'ugc-rng.jpg', 'roblox-korean-spa.jpg', 'roblox-fruit-battles.jpg'], current: true }
        ],
        awards: []
    },

    { id: 'global', theme: 'paper' },
    { id: 'titles', theme: 'paper' },

    /* ---------------------------------------------------------------------
     * S7 UGC 제작
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
    { id: 'kungya-entry', theme: 'paper' },
    { id: 'kungya-community', theme: 'paper' },
    { id: 'kungya-expansion', theme: 'paper' },
    { id: 'tech', theme: 'paper' },
    { id: 'closing', theme: 'orange' }
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
        cover_subtitle: 'ROBLOX Game, IP Experience & UGC Studio',
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
        people_badge: '기획 → 개발 → 아트 → 운영, 한 팀에서',
        people_avatar_alt: 'NNN GAMES 팀원 로블록스 아바타 — {{name}}',
        people_bio_jeff_1: '現 (주)트리플엔게임즈 대표',
        people_bio_jeff_2: '現 아주대학교 디지털미디어학과 겸임교수',
        people_bio_jeff_3: '(주)원밀리언 CTO',
        people_bio_jeff_4: '(주)우아한형제들 시니어 Unity 엔지니어',
        people_bio_jeff_5: '스노우(주) 시니어 그래픽스 엔지니어',
        people_bio_papaslime_1: '(주)트리플엔게임즈 공동창업',
        people_bio_papaslime_2: '(주)우아한형제들 신사업본부 팀장',
        people_bio_papaslime_3: 'NHN(주) 아트센터 팀장',
        alt_people_portfolio_jeff: 'JEFF 포트폴리오',
        alt_people_portfolio_papaslime: 'PAPASLIME 포트폴리오',

        // S4 HISTORY
        history_title: '여러 플랫폼에서 쌓은 경험, 이제 Roblox로',
        history_period_roblox: '2026 ~ 현재',
        history_era_mobile: 'iOS와 Android 게임을 출시했습니다.',
        history_era_ifland: '참여형 공간과 이벤트를 만들었습니다.',
        history_era_zepeto: 'Get Train 등 브랜드 월드를 만들고 운영했습니다.',
        history_era_roblox: '6개 프로젝트를 운영하며 누적 방문 1,180만 회를 넘겼습니다.',
        history_awards_label: '수상 경력',

        // S6 주요 ROBLOX 게임
        titles_title: '주요 ROBLOX 게임',
        titles_genre_tfr: '오비 & 플랫포머 / 타워 오비',
        titles_genre_afk: '파티 & 캐주얼 / 미니게임',
        titles_genre_tomato: '시뮬레이션 / 인크리멘탈 시뮬레이터',
        titles_genre_rng: '시뮬레이션 / 인크리멘탈 시뮬레이터',

        // S7 UGC 제작
        ugcworks_title: '고퀄리티 UGC 직접 제작',
        ugcworks_p1: '제작 난이도가 높은 고품질 UGC 제작',
        ugcworks_p2: '다양한 부위와 소재, 애니메이션까지 제작',
        ugcworks_p3: '게임과 연동한 UGC 판매 프로세스 구축',

        // S8 CASE STUDIES
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

        // S9 UGC x GAMEPLAY
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

        // S10 쿵야 진입 전략
        kungya_entry_title: '커뮤니티 구축과 타깃 데이터 확보 먼저',
        kungya_entry_step_1_title: '캐릭터와 세계관 전달이 먼저',
        kungya_entry_step_1_desc: 'Roblox 이용자에게 소개된 적 없는 IP는 캐릭터와 세계관이 먼저 전달돼야 IP의 효과가 발생합니다.',
        kungya_entry_step_2_title: '관심 수요층과 행동 데이터 확보',
        kungya_entry_step_2_desc: '어떤 캐릭터와 세계관 요소에 반응하는지 확인하고, 관심을 보이는 이용자 데이터를 축적합니다.',
        kungya_entry_step_3_title: '커뮤니티를 먼저 성장',
        kungya_entry_step_3_desc: '확인된 수요층을 커뮤니티로 모아 이후 Roblox 프로젝트의 기획·홍보·운영 기반으로 만듭니다.',

        // S11 커뮤니티 구축
        kungya_community_title: '커뮤니티 구축 플랜',
        kungya_community_lead: '로블록스 유저들에게 UGC를 나누어 주며 브랜드와 IP를 자연스럽게 소개 → 커뮤니티 가입 유도 및 플레이어 데이터 수집.',
        kungya_community_step_1_title: '친숙한 장르로 게임 출시',
        kungya_community_step_1_desc: 'OBBY, FINDING, RNG 등 Roblox 이용자에게 친숙한 장르로 게임을 출시합니다.',
        kungya_community_step_2_title: '게임 내 커뮤니티 가입 유도',
        kungya_community_step_2_desc: '게임 내 커뮤니티 가입 유도 장치를 통해 이용자의 지속적인 커뮤니티 가입을 이끌어냅니다.',
        kungya_community_step_3_title: '퀘스트·이벤트로 UGC 지급',
        kungya_community_step_3_desc: '퀘스트, 정기 이벤트, 어드민 지급 등을 통해 브랜드와 IP를 소재로 한 UGC를 지급합니다.',
        kungya_community_step_4_title: '브랜드·IP 비즈니스로 확장',
        kungya_community_step_4_desc: '커뮤니티를 지속적으로 확장하며 브랜드와 IP의 목적에 맞는 비즈니스로 나아갑니다.',
        kungya_community_proof_title: '커뮤니티 멤버 구축',
        kungya_community_proof_desc: '자사 RNG 게임 출시 후 1개월 동안 약 5만 명의 커뮤니티를 구축한 사례가 있습니다.',

        // S12 KPI별 확장
        kungya_expansion_title: '커뮤니티와 데이터를 기반으로 브랜드와 IP의 목적에 맞게 활용.',
        kungya_expansion_brand_title: '브랜드·IP 홍보',
        kungya_expansion_brand_desc: '구축된 커뮤니티를 기반으로 브랜드와 IP의 목적에 따라 홍보와 마케팅에 활용',
        kungya_expansion_content_title: '수익형 게임 콘텐츠 제작',
        kungya_expansion_content_desc: '확보한 커뮤니티와 수요 데이터를 기반으로 수익화를 위한 게임이나 UGC를 제작 판매',
        kungya_expansion_events_title: '온오프라인 이벤트 연동',
        kungya_expansion_events_desc: '커뮤니티를 온라인·오프라인 이벤트와 연계해 브랜드와 IP의 목적에 맞는 로블록스 유저들의 행위 유도',

        // S13 보유 기술
        tech_title: 'NNN 보유 기술',
        tech_lead: '운영 업무를 자동화, 빠르고 안정적인 라이브 서비스',
        tech_ugc_title: 'UGC 자동 지급 및 관리 시스템',
        tech_ugc_desc: '퀘스트·포인트·랭킹·이벤트 등을 통해 다수의 유저들에게 UGC를 자동으로 지급해주는 운영 및 보안 시스템 구축.',
        tech_event_title: '자동 이벤트 운영 시스템',
        tech_event_desc: '설정한 주기와 기간에 따라 이벤트가 자동으로 열리고 종료되어 운영인력 없이도 상시 라이브 이벤트 개최 가능',
        tech_promo_title: '크로스 프로모션 시스템',
        tech_promo_desc: '커뮤니티 또는 운영중인 체험간 연계를 통해 플레이어 유입 관리',
        alt_tech_ugc: 'UGC 자동 지급 관리자 대시보드 화면',
        alt_tech_event_1: '라이브 이벤트 진행 화면',
        alt_tech_event_2: '정기 랭킹 이벤트 배너',
        alt_tech_promo: '게임 내 크로스 프로모션 팝업 화면',

        // S14 클로징
        closing_body: '트리플엔게임즈는 자체 게임 개발, 외부 서비스 연동, 라이브 운영 경험을 바탕으로 파트너의 IP를 ROBLOX 이용자가 즐기는 게임형 체험으로 확장합니다.',

        // S5 대기업 협업 프로젝트
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
        alt_kungya_case_tayo: 'Tayo Bus Simulator Roblox 게임 썸네일',
        alt_kungya_case_pororo: 'Pororo Village Tycoon Roblox 게임 썸네일',
        alt_kungya_runaway_duffy: 'Runaway: Duffy 게임 아트',
        alt_kungya_ugc_group: 'NNN UGC 커뮤니티 아이콘',
        alt_kungya_iconix_group: 'Iconix & Freeground 커뮤니티 아이콘',
        alt_kungya_expansion_content: '수익화 게임 콘텐츠 예시 화면',
        alt_kungya_expansion_brand: '브랜드·IP 홍보 소재 예시 화면',
        alt_kungya_expansion_events: '온오프라인 연계 이벤트 예시 화면',
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

        cover_subtitle: 'ROBLOX Game, IP Experience & UGC Studio',
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
        people_badge: 'Design → Build → Art → Operate, in one team',
        people_avatar_alt: 'NNN GAMES team member Roblox avatar — {{name}}',
        people_bio_jeff_1: 'Current — CEO, Triple N Games',
        people_bio_jeff_2: 'Current — Adjunct Professor, Ajou University',
        people_bio_jeff_3: 'CTO, 1MILLION',
        people_bio_jeff_4: 'Senior Unity Engineer, Woowa Brothers',
        people_bio_jeff_5: 'Senior Graphics Engineer, SNOW',
        people_bio_papaslime_1: 'Co-founder, Triple N Games',
        people_bio_papaslime_2: 'Team Lead, New Business Div., Woowa Brothers',
        people_bio_papaslime_3: 'Team Lead, NHN Corp. Art Center',
        alt_people_portfolio_jeff: 'JEFF portfolio',
        alt_people_portfolio_papaslime: 'PAPASLIME portfolio',

        history_title: 'Proven Across Platforms. Now Building on Roblox.',
        history_period_roblox: '2026 – Present',
        history_era_mobile: 'Shipped games on iOS and Android.',
        history_era_ifland: 'Created interactive spaces and events.',
        history_era_zepeto: 'Built and operated branded worlds, including Get Train.',
        history_era_roblox: '6 live experiences. 11.8M+ visits.',
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

        kungya_entry_title: 'Build the community and secure target data first',
        kungya_entry_step_1_title: 'Delivering the characters and world comes first',
        kungya_entry_step_1_desc: 'An IP not yet introduced on Roblox only creates real impact once its characters and world are delivered to players first.',
        kungya_entry_step_2_title: 'Secure audience-demand and behavior data',
        kungya_entry_step_2_desc: 'Identify which characters and world elements attract attention and accumulate data on interested users.',
        kungya_entry_step_3_title: 'Grow the community first',
        kungya_entry_step_3_desc: 'Bring the validated audience into a community that becomes the foundation for planning, promotion, and operation of later Roblox projects.',

        kungya_community_title: 'Community Building Plan',
        kungya_community_lead: 'Give away UGC to Roblox users to naturally introduce the brand and IP → drive community sign-ups and collect player data.',
        kungya_community_step_1_title: 'Launch a game in a familiar genre',
        kungya_community_step_1_desc: 'Launch a game in a genre Roblox users already know well — OBBY, Finding, RNG, and the like.',
        kungya_community_step_2_title: 'Drive community sign-ups in-game',
        kungya_community_step_2_desc: 'In-game mechanisms continuously prompt players to join the community.',
        kungya_community_step_3_title: 'Reward UGC through quests & events',
        kungya_community_step_3_desc: 'Quests, regular events, and admin-granted drops distribute UGC themed around the brand and IP.',
        kungya_community_step_4_title: 'Expand into brand & IP business',
        kungya_community_step_4_desc: 'As the community keeps growing, it expands into business initiatives that match the brand\'s and IP\'s goals.',
        kungya_community_proof_title: 'Community members built',
        kungya_community_proof_desc: 'One of our RNG game launches built a community of approximately 50,000 members within its first month.',

        kungya_expansion_title: "Use community and data to serve the brand's and IP's goals.",
        kungya_expansion_brand_title: 'Brand & IP promotion',
        kungya_expansion_brand_desc: "Use the community that's already been built for promotion and marketing aligned with the brand's and IP's goals.",
        kungya_expansion_content_title: 'Build monetizable game content',
        kungya_expansion_content_desc: 'Based on the community and demand data secured, produce and sell games or UGC for monetization.',
        kungya_expansion_events_title: 'Connect online & offline events',
        kungya_expansion_events_desc: "Link the community to online and offline events to drive Roblox user actions aligned with the brand's and IP's goals.",

        tech_title: 'NNN Core Technology',
        tech_lead: 'Automated operations. Fast, reliable live service.',
        tech_ugc_title: 'Automated UGC grant & management system',
        tech_ugc_desc: 'An operations and security system that automatically grants UGC to large numbers of users through quests, points, rankings, events, and more.',
        tech_event_title: 'Automated event operations system',
        tech_event_desc: 'Events open and close automatically on a set schedule and duration, enabling always-on live events without dedicated operations staff.',
        tech_promo_title: 'Cross-promotion system',
        tech_promo_desc: 'Manages player acquisition by linking the community or live experiences with one another.',
        alt_tech_ugc: 'UGC auto-grant admin dashboard screen',
        alt_tech_event_1: 'Live event in progress',
        alt_tech_event_2: 'Recurring ranking event banner',
        alt_tech_promo: 'In-game cross-promotion popup screen',

        closing_body: 'Backed by in-house development, external service integration, and live operations, Triple N Games turns partner IP into engaging ROBLOX experiences.',

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
        alt_kungya_case_tayo: 'Tayo Bus Simulator Roblox game thumbnail',
        alt_kungya_case_pororo: 'Pororo Village Tycoon Roblox game thumbnail',
        alt_kungya_runaway_duffy: 'Runaway: Duffy game art',
        alt_kungya_ugc_group: 'NNN UGC community icon',
        alt_kungya_iconix_group: 'Iconix & Freeground community icon',
        alt_kungya_expansion_content: 'Example monetized game content screenshot',
        alt_kungya_expansion_brand: 'Example brand & IP promotional material',
        alt_kungya_expansion_events: 'Example online-offline linked event screen',
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

        cover_subtitle: 'ROBLOX Game, IP Experience & UGC Studio',
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
        people_badge: '企画 → 開発 → アート → 運営、ワンチームで',
        people_avatar_alt: 'NNN GAMESチームメンバーのRobloxアバター — {{name}}',
        people_bio_jeff_1: '現 トリプルエヌゲームズ(株) 代表',
        people_bio_jeff_2: '現 亜洲大学校 デジタルメディア学科 兼任教授',
        people_bio_jeff_3: '1MILLION(株) CTO',
        people_bio_jeff_4: 'Woowa Brothers(株) シニアUnityエンジニア',
        people_bio_jeff_5: 'SNOW(株) シニアグラフィックスエンジニア',
        people_bio_papaslime_1: 'トリプルエヌゲームズ(株) 共同創業',
        people_bio_papaslime_2: 'Woowa Brothers(株) 新事業本部 チーム長',
        people_bio_papaslime_3: 'NHN(株) アートセンター チーム長',
        alt_people_portfolio_jeff: 'JEFFのポートフォリオ',
        alt_people_portfolio_papaslime: 'PAPASLIMEのポートフォリオ',

        history_title: '複数のプラットフォームで培った経験を、Robloxへ。',
        history_period_roblox: '2026 ~ 現在',
        history_era_mobile: 'iOS・Android向けゲームをリリース。',
        history_era_ifland: '参加型スペースとイベントを制作。',
        history_era_zepeto: 'Get Trainを含むブランドワールドを開発・運営。',
        history_era_roblox: '6つのプロジェクトを運営。累計1,180万回以上の訪問。',
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

        kungya_entry_title: 'コミュニティ構築とターゲットデータ確保が先',
        kungya_entry_step_1_title: 'キャラクターと世界観の伝達が先',
        kungya_entry_step_1_desc: 'Robloxでまだ紹介されていないIPは、キャラクターと世界観を先に伝えてこそ効果が生まれます。',
        kungya_entry_step_2_title: '関心層と行動データを確保',
        kungya_entry_step_2_desc: 'どのキャラクターや世界観要素に反応するかを確認し、関心を示すユーザーデータを蓄積します。',
        kungya_entry_step_3_title: 'まずコミュニティを成長',
        kungya_entry_step_3_desc: '確認された需要層をコミュニティに集め、今後のRobloxプロジェクトの企画・広報・運営基盤にします。',

        kungya_community_title: 'コミュニティ構築プラン',
        kungya_community_lead: 'RobloxユーザーにUGCを配布し、ブランドとIPを自然に紹介 → コミュニティ加入を促進し、プレイヤーデータを収集。',
        kungya_community_step_1_title: '親しみやすいジャンルでゲームをリリース',
        kungya_community_step_1_desc: 'OBBY、Finding、RNGなど、Robloxユーザーに馴染みのあるジャンルでゲームをリリースします。',
        kungya_community_step_2_title: 'ゲーム内でコミュニティ加入を誘導',
        kungya_community_step_2_desc: 'ゲーム内のコミュニティ加入誘導の仕組みで、継続的な加入を促します。',
        kungya_community_step_3_title: 'クエスト・イベントでUGCを支給',
        kungya_community_step_3_desc: 'クエスト、定期イベント、アドミン支給などを通じて、ブランドとIPを題材にしたUGCを支給します。',
        kungya_community_step_4_title: 'ブランド・IPビジネスへ拡張',
        kungya_community_step_4_desc: 'コミュニティを継続的に拡大しながら、ブランドとIPの目的に合ったビジネスへ発展させます。',
        kungya_community_proof_title: 'コミュニティメンバーを構築',
        kungya_community_proof_desc: '自社RNGゲームのリリース後、1か月で約5万人のコミュニティを構築した事例があります。',

        kungya_expansion_title: 'コミュニティとデータを基盤に、ブランドとIPの目的に合わせて活用。',
        kungya_expansion_brand_title: 'ブランド・IPプロモーション',
        kungya_expansion_brand_desc: '構築されたコミュニティを基盤に、ブランドとIPの目的に応じてプロモーションとマーケティングに活用。',
        kungya_expansion_content_title: '収益型ゲームコンテンツ制作',
        kungya_expansion_content_desc: '確保したコミュニティと需要データを基に、収益化のためのゲームやUGCを制作・販売。',
        kungya_expansion_events_title: 'オン・オフラインイベント連携',
        kungya_expansion_events_desc: 'コミュニティをオンライン・オフラインイベントと連携させ、ブランドとIPの目的に合ったRobloxユーザーの行動を誘導。',

        tech_title: 'NNN保有技術',
        tech_lead: '運営業務を自動化、速く安定したライブサービス',
        tech_ugc_title: 'UGC自動支給・管理システム',
        tech_ugc_desc: 'クエスト・ポイント・ランキング・イベントなどを通じて多数のユーザーにUGCを自動支給する運営・セキュリティシステムを構築。',
        tech_event_title: '自動イベント運営システム',
        tech_event_desc: '設定した周期と期間に従ってイベントが自動で開始・終了し、運営人員なしでも常時ライブイベント開催が可能',
        tech_promo_title: 'クロスプロモーションシステム',
        tech_promo_desc: 'コミュニティまたは運営中の体験間の連携を通じてプレイヤー流入を管理',
        alt_tech_ugc: 'UGC自動支給管理者ダッシュボード画面',
        alt_tech_event_1: 'ライブイベント進行画面',
        alt_tech_event_2: '定期ランキングイベントバナー',
        alt_tech_promo: 'ゲーム内クロスプロモーションポップアップ画面',

        closing_body: 'トリプルエヌゲームズは、自社開発・外部サービス連携・ライブ運営の経験をもとに、パートナーのIPをROBLOXで楽しめるゲーム型体験へと拡張します。',

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
        alt_kungya_case_tayo: 'Tayo Bus Simulator の Robloxゲームサムネイル',
        alt_kungya_case_pororo: 'Pororo Village Tycoon の Robloxゲームサムネイル',
        alt_kungya_runaway_duffy: 'Runaway: Duffy のゲームアート',
        alt_kungya_ugc_group: 'NNN UGC コミュニティアイコン',
        alt_kungya_iconix_group: 'Iconix & Freeground コミュニティアイコン',
        alt_kungya_expansion_content: '収益化ゲームコンテンツの例示画面',
        alt_kungya_expansion_brand: 'ブランド・IPプロモーション素材の例示画面',
        alt_kungya_expansion_events: 'オン・オフライン連携イベントの例示画面',
        alt_global_1: 'Get Train ワールドのプレイ画面',
        alt_global_2: 'Get Train × JRE WALLET アプリ連携キャンペーンバナー',
        alt_global_3: 'Get Train × JRE WALLET 連携 5ZEM プレゼントキャンペーンバナー',
        alt_global_4: 'Get Train 無料ウィッシュアイテムバナー',
        alt_ugcworks: 'NNN GAMES制作のUGCアイテム{{n}}'
    }
};

window.DECK_SLIDES = DECK_SLIDES;
window.DECK_I18N = DECK_I18N;

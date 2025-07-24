// 다국어 번역 데이터
const translations = {
    ko: {
        // 페이지 제목
        page_title: "NNN GAMES - 브랜드를 게임처럼, 재미로 널리 알립니다.",
        project_alpha_page_title: "겟 트레인(JR 동일본)",
        
        // 네비게이션
        nav_home: "홈",
        nav_about: "소개",
        nav_projects: "프로젝트",
        nav_contact: "문의",
        
        // 언어 선택
        lang_ko: "한국어",
        lang_en: "English",
        lang_ja: "日本語",
        
        // 히어로 섹션
        hero_title: "브랜드를 게임처럼, 재미로 널리 알립니다",
        hero_subtitle: "ZEPETO와 Roblox를 기반으로, 기업과 브랜드를 위한 몰입형 게임 콘텐츠를 제작합니다.\n" +
            "즐기는 순간, 브랜드는 자연스럽게 퍼집니다.",
        hero_cta: "프로젝트 자세히 보기",
        
        // 특징 섹션
        features_title: "NNN Games의 강점",
        feature_1_title: "브랜드를 위한 맞춤형 게임 설계",
        feature_1_desc: "ZEPETO와 Roblox에 최적화된 콘텐츠 구조로, 브랜드 메시지를 자연스럽게 전달하는 플레이 경험을 만듭니다.",
        feature_2_title: "콘텐츠와 수익을 연결하는 시스템",
        feature_2_desc: "광고, 가챠, 퀘스트 등 유저 몰입과 수익화를 동시에 고려한 시스템을 직접 설계하고 운영합니다.",
        feature_3_title: "검증된 글로벌 운영 경험",
        feature_3_desc: "누적 1백만 방문을 달성한 월드를 포함해, 국내외 기업들과 함께 대규모 프로젝트를 성공적으로 운영하고 있습니다.",
        
        // 프로젝트 섹션
        project_preview_title: "진행 중인 프로젝트",
        project_alpha_title: "겟 트레인(JR 동일본)",
        project_alpha_desc: "게임의 재미를 통해 JR 동일본의 브랜드를 전 세계 사용자에게 자연스럽게 알리는 ZEPETO 월드입니다.",
        project_beta_title: "Legendary DJ Gear",
        project_beta_desc: "음악과 코스튬을 수집하며 나만의 플레이리스트를 완성하는 로블록스 수집형 게임",
        project_gamma_title: "NNN UGC",
        project_gamma_desc: "트렌디한 아이템을 제작해 로블록스 유저에게 선보이는 UGC 제작 프로젝트.",
        learn_more: "자세히 보기 →",
        
        // 프로젝트 페이지
        projects_page_title: "프로젝트 - NNN GAMES",
        projects_page_header: "프로젝트",
        
        // About 페이지
        about_page_title: "소개 - NNN GAMES",
        about_page_header: "NOVELTY NOTABLE NIMBLE",
        about_mission_title: "우리의 미션",
        about_mission_desc: "NNN GAMES는 ZEPETO와 Roblox 플랫폼을 기반으로, 브랜드의 메시지를 창의적이고 재미있는 방식으로 전달하는 인터랙티브 콘텐츠를 제작합니다. 우리는 전 세계 사용자들이 게임을 즐기는 순간, 자연스럽게 브랜드와 연결될 수 있도록 설계합니다.",
        about_mission_desc2: "수집, 광고, 가챠, 퀘스트 등 다양한 게임 시스템을 통해 유저의 몰입을 유도하고, 콘텐츠의 재미와 브랜드 마케팅 효과를 동시에 실현하는 수익화 모델을 구축해 나가고 있습니다.",

// 회사 연혁
        company_history_title: "회사 연혁",
        history_2020_title: "2020",
        history_2020_desc: "트리플엔게임즈 설립, 모바일 게임 'MineSweeper: The Dungeon' 출시",
        history_2023_title: "2023",
        history_2023_desc: "ZEPETO 'K-Dance Studio' 출시, ZEPETO World Jam Fall 2023 우승",
        history_2024_title: "2024",
        history_2024_desc: "ZEPETO 월드 제작 MOU 체결 및 사업 수주, 판교 글로벌게임허브센터 입주, JR 동일본 프로젝트 개발 시작",
        history_2025_title: "2025",
        history_2025_desc: "ZEPETO 'Get Train(JR 동일본)' 월드 정식 출시, 신규 플랫폼 및 프로젝트 확대 계획",
        
        // 수상 경력
        awards_title: "수상 경력 및 성과",
        award_1_title: "제1회 한국 문화체험 메타버스 콘텐츠 공모전 ",
        award_1_desc: "대상(문화체육관광부장관상)",
        award_2_title: "ZEPETO World Jam Fall 2023",
        award_2_desc: "1위",
        award_3_title: "Get Train(JR 동일본)",
        award_3_desc: "누적 방문 100만 명 달성",
        
        // Contact 페이지
        contact_page_title: "문의 - NNN GAMES",
        contact_page_header: "문의하기",
        contact_page_subtitle: "저희에게 연락해 주세요. 프로젝트, 서비스 또는 기타 문의사항이 있으시면 언제든 답변드리겠습니다.",
        contact_info_title: "연락처 정보",
        office_location_title: "사무실 위치",
        
        // 프로젝트 알파 페이지
        project_page_header: "겟 트레인(JR 동일본)",
        project_status: "정식 운영 중",
        project_genre: "장르: 소셜 어드벤처 & 수집형 콘텐츠",
        project_platform: "플랫폼: ZEPETO",
        project_summary_title: "프로젝트 개요",
        project_summary_p1: "Get Train은 JR 동일본과 NAVER Z와 함께한 ZEPETO 브랜드 게임 프로젝트로, 실제 도쿄 야마노테선을 모티브로 한 가상 세계를 탐험하며 아우라를 수집하고 다양한 미션을 수행하는 소셜 게임입니다.",
        project_summary_p2: "현실과 가상을 연결하는 공간 디자인, 수집과 성장의 재미, 유저 간의 상호작용 요소를 결합하여, 브랜드 세계관을 체험하고 공유할 수 있는 독창적인 경험을 제공합니다.",
        project_features_title: "주요 특징",
        project_feature_1: "야마노테선 주요 역을 재현한 몰입형 월드",
        project_feature_2: "가챠와 퀘스트 기반의 수집형 콘텐츠 구조",
        project_feature_3: "아우라, 가챠, 협동 버프 등 차별화된 성장 시스템",
        project_feature_4: "브랜드와 연결된 시즌별 이벤트 및 광고 시스템",
        
        // 프로젝트 관련 링크
        project_related_links: "관련 링크",
        project_world_link: "월드 링크:",
        project_world_link_text: "Get Train 월드 방문하기",
        project_related_article: "관련 기사:",
        project_related_article_text: "PR Times 기사 보기",
        project_related_event: "관련 이벤트:",
        project_related_event_text: "JRE Wallet 캠페인",
        
        // 공통 레이블
        gallery_title: "갤러리",
        
        // 프로젝트 베타 페이지
        project_beta_page_header: "Legendary DJ Gear",
        project_beta_status: "정식 운영 중",
        project_beta_genre: "장르: 음악 수집 게임",
        project_beta_platform: "플랫폼: ROBLOX",
        project_beta_summary_title: "프로젝트 개요",
        project_beta_summary_p1: "Legendary DJ Gear는 음악과 패션을 결합한 혁신적인 로블록스 수집형 게임입니다. 플레이어는 다양한 음악 장르의 DJ가 되어 전설적인 의상과 음악을 수집하며 자신만의 독특한 스타일을 완성해 나갑니다.",
        project_beta_summary_p2: "게임 내에서 플레이어는 리듬 게임, 퀘스트, 이벤트를 통해 희귀한 아이템을 획득하고, 다른 플레이어들과 경쟁하며 최고의 DJ로 성장할 수 있습니다. 커뮤니티 중심의 소셜 기능으로 전 세계 플레이어들과 음악을 공유하고 협업할 수 있습니다.",
        project_beta_features_title: "주요 특징",
        project_beta_feature_1: "100개 이상의 유니크한 DJ 의상과 액세서리 수집",
        project_beta_feature_2: "다양한 음악 장르별 테마 월드와 리듬 게임",
        project_beta_feature_3: "실시간 멀티플레이어 DJ 배틀과 랭킹 시스템",
        project_beta_feature_4: "커스텀 플레이리스트와 음악 공유 커뮤니티",
        
        // 프로젝트 감마 페이지
        project_gamma_title: "NNN UGC",
        project_gamma_page_header: "NNN UGC",
        project_gamma_status: "제작 중",
        project_gamma_genre: "장르: UGC 아이템 제작",
        project_gamma_platform: "플랫폼: ROBLOX & ZEPETO",
        project_gamma_summary_p1: "NNN UGC 제작 프로젝트는 Roblox 플랫폼에서 활동하는 유저들을 대상으로, 트렌디하고 창의적인 아바타 아이템을 제작·판매하는 수익형 콘텐츠 프로젝트입니다.",
        project_gamma_summary_p2: "Z세대 유저의 감각에 맞춘 디자인과 시즌 테마, SNS 연동 요소 등을 적극 반영하여, 유저의 꾸미기 욕구와 소장 욕구를 자극하는 패션 중심의 UGC 브랜드를 구축합니다.",
        project_gamma_summary_p3: "단순한 아이템 제작을 넘어, 유저 참여형 콘텐츠, 리미티드 에디션, 협업 시리즈 등 다양한 방식으로 Roblox 경제 시스템 내에서 지속 가능한 수익 구조를 설계합니다.",
        project_gamma_feature_1_title: "동양권 감성을 담은 전통 의상 라인업",
        project_gamma_feature_1_desc: "한복, 기모노, 치파오 등 동아시아 전통 의상을 현대적으로 재해석\nRoblox 아바타에 최적화된 실루엣과 소재 연출",
        project_gamma_feature_2_title: "K-콘텐츠 기반 코스튬 제작",
        project_gamma_feature_2_desc: "K-POP, K-드라마, 한국 전통 설화 등에서 영감을 받은 캐릭터 스타일 구현\n글로벌 유저를 타깃으로 한 한류 감성 디자인",
        project_gamma_feature_3_title: "글로벌 Z세대를 겨냥한 최신 트렌드 반영",
        project_gamma_feature_3_desc: "Y2K, 스트릿웨어, 페스티벌룩 등 인기 테마 중심의 트렌디한 아바타 아이템 제작\nSNS 공유를 유도하는 스타일 구성 및 포징 최적화",
        project_gamma_feature_4_title: "Roblox 아이템 생태계에 최적화된 제작 및 유통 구조",
        project_gamma_feature_4_desc: "판매/가챠/보상형 배포 등 다양한 BM 적용 가능\n커뮤니티 기반 확산 전략과 한정판 운영 방식 병행",
        
        // 프로젝트 감마 관련 링크
        project_gamma_related_links: "관련 링크",
        project_gamma_group_page: "그룹 페이지:",
        project_gamma_group_page_text: "NNN UGC Roblox 그룹 방문하기",
        
        // 푸터
        footer_about_title: "NNN GAMES",
        footer_about_text: "NNN GAMES는 ZEPETO와 Roblox 기반의 UGC와 게임 콘텐츠를 통해, 전 세계 유저에게 재미와 가치를 동시에 전달하는 인터랙티브 콘텐츠를 만들어갑니다.",
        footer_links_title: "바로가기",
        footer_contact_title: "연락처",
        footer_address: "주소 : (13449) 경기도 성남시 수정구 창업로 54, 판교 제2테크노밸리 LH기업성장센터, 804B호",
        footer_business_number: "사업자등록번호: 629-87-01849",
        footer_copyright: "© 2025 Triple N Games Inc. All Rights Reserved."
    },
    
    en: {
        // Page titles
        page_title: "NNN GAMES - We amplify brands through the power of play",
        project_alpha_page_title: "Get Train(JR EAST)",
        
        // Navigation
        nav_home: "Home",
        nav_about: "About",
        nav_projects: "Projects",
        nav_contact: "Contact",
        
        // Language selection
        lang_ko: "한국어",
        lang_en: "English",
        lang_ja: "日本語",
        
        // Hero section
        hero_title: "We amplify brands through the power of play",
        hero_subtitle: "We create immersive branded game content on ZEPETO and Roblox.\n" +
            "When it's fun, your brand spreads naturally.",
        hero_cta: "View Project Details",
        
        // Features section
        features_title: "Our Strengths at NNN Games",
        feature_1_title: "Tailored Game Design for Brands",
        feature_1_desc: "We create play experiences optimized for ZEPETO and Roblox that naturally convey your brand’s message.",
        feature_2_title: "Systems That Connect Content and Monetization",
        feature_2_desc: "From ads and gacha to quests, we design and operate systems that balance user engagement with revenue generation.",
        feature_3_title: "Proven Global Operation Experience",
        feature_3_desc: "With worlds reaching over one million visits, we have successfully delivered large-scale projects for global and domestic clients.",
        
        // Project section
        project_preview_title: "Ongoing Projects",
        project_alpha_title: "Get Train (JR EAST)",
        project_alpha_desc: "A ZEPETO world that naturally promotes the JR EAST brand to users around the world through the fun of gameplay.",
        project_beta_title: "Legendary DJ Gear",
        project_beta_desc: "A Roblox collection game where you gather music and costumes to build your own playlist.",
        project_gamma_title: "NNN UGC",
        project_gamma_desc: "A UGC creation project delivering trendy items to Roblox users.",
        learn_more: "Learn More →",
        
        // Projects Page
        projects_page_title: "Projects - NNN GAMES",
        projects_page_header: "Projects",
        
        // About Page
        about_page_title: "About - NNN GAMES",
        about_page_header: "NOVELTY NOTABLE NIMBLE",
        about_mission_title: "Our Mission",
        about_mission_desc: "At NNN GAMES, we create interactive content on ZEPETO and Roblox that delivers brand messages in fun and creative ways. Our goal is to design gameplay experiences where global users naturally engage with brands through play.",
        about_mission_desc2: "By incorporating systems like collection, advertising, gacha, and quests, we drive user engagement while building monetization models that combine entertainment value with brand marketing effectiveness.",
        
        // Company History
        company_history_title: "Company History",
        history_2020_title: "2020",
        history_2020_desc: "Established Triple N Games; released mobile game 'MineSweeper: The Dungeon'",
        history_2023_title: "2023",
        history_2023_desc: "Released ZEPETO world 'K-Dance Studio'; Winner of ZEPETO World Jam Fall 2023",
        history_2024_title: "2024",
        history_2024_desc: "Signed MOU for ZEPETO world development; secured project contract; joined Pangyo Global Game Hub Center; began JR EAST project",
        history_2025_title: "2025",
        history_2025_desc: "Official launch of ZEPETO world 'Get Train (JR EAST)'; expanding to new platforms and projects",
        
        // Awards & Achievements
        awards_title: "Awards & Achievements",
        award_1_title: "1st Korea Cultural Experience Metaverse Content Contest",
        award_1_desc: "Grand Prize (Minister of Culture, Sports and Tourism Award)",
        award_2_title: "ZEPETO World Jam Fall 2023",
        award_2_desc: "1st Place",
        award_3_title: "Get Train (JR EAST)",
        award_3_desc: "Surpassed 1 million cumulative visits",
        
        // Contact Page
        contact_page_title: "Contact - NNN GAMES",
        contact_page_header: "Get in Touch",
        contact_page_subtitle: "We'd love to hear from you. Whether you have a question about our projects, services, or anything else, our team is ready to answer all your questions.",
        contact_info_title: "Contact Information",
        office_location_title: "Office Location",
        
        // Project Alpha page
        project_page_header: "Get Train (JR EAST)",
        project_status: "Officially Live",
        project_genre: "Genre: Social Adventure & Collection-Based Content",
        project_platform: "Platform: ZEPETO",
        project_summary_title: "Project Overview",
        project_summary_p1: "Get Train is a branded ZEPETO game project developed in collaboration with JR EAST and NAVER Z. Set in a virtual world inspired by Tokyo's Yamanote Line, players explore stations, complete quests, and collect Auras in a socially-driven experience.",
        project_summary_p2: "By combining spatial design that bridges reality and virtuality with the joy of collection, growth, and user interaction, the project offers a unique and immersive way to experience and share the brand universe.",
        project_features_title: "Key Features",
        project_feature_1: "Immersive world based on iconic Yamanote Line stations",
        project_feature_2: "Collection-based system built on gachas and quests",
        project_feature_3: "Unique growth systems including Auras, gachas, and co-op buffs",
        project_feature_4: "Seasonal events and advertising systems integrated with the brand",
        
        // Project related links
        project_related_links: "Related Links",
        project_world_link: "World Link:",
        project_world_link_text: "Visit Get Train World",
        project_related_article: "Related Article:",
        project_related_article_text: "View PR Times Article",
        project_related_event: "Related Event:",
        project_related_event_text: "JRE Wallet Campaign",
        
        // Common labels
        gallery_title: "Gallery",
        
        // Project Beta page
        project_beta_page_header: "Legendary DJ Gear",
        project_beta_status: "Live",
        project_beta_genre: "Genre: Music Collection Game",
        project_beta_platform: "Platform: ROBLOX",
        project_beta_summary_title: "Project Overview",
        project_beta_summary_p1: "Legendary DJ Gear is an innovative Roblox collection game that combines music and fashion. Players become DJs of various music genres, collecting legendary outfits and music to create their own unique style.",
        project_beta_summary_p2: "Through rhythm games, quests, and events, players can acquire rare items, compete with others, and grow to become the ultimate DJ. Community-centered social features allow players worldwide to share music and collaborate.",
        project_beta_features_title: "Key Features",
        project_beta_feature_1: "Over 100 unique DJ outfits and accessories to collect",
        project_beta_feature_2: "Theme worlds and rhythm games for various music genres",
        project_beta_feature_3: "Real-time multiplayer DJ battles and ranking system",
        project_beta_feature_4: "Custom playlists and music sharing community",
        
        // Project Gamma page
        project_gamma_title: "NNN UGC",
        project_gamma_page_header: "NNN UGC",
        project_gamma_status: "In Production",
        project_gamma_genre: "Genre: UGC Item Creation",
        project_gamma_platform: "Platform: ROBLOX & ZEPETO",
        project_gamma_summary_p1: "The NNN UGC creation project is a revenue-generating content project that creates and sells trendy and creative avatar items for users active on the Roblox platform.",
        project_gamma_summary_p2: "We actively incorporate designs that match Gen Z sensibilities, seasonal themes, and SNS integration elements to build a fashion-centered UGC brand that stimulates users' desire to customize and collect.",
        project_gamma_summary_p3: "Beyond simple item creation, we design sustainable revenue structures within the Roblox economic system through various methods such as user-participatory content, limited editions, and collaboration series.",
        project_gamma_feature_1_title: "Traditional Asian Fashion Lineup",
        project_gamma_feature_1_desc: "Modern reinterpretation of East Asian traditional clothing such as hanbok, kimono, and cheongsam\nSilhouettes and material rendering optimized for Roblox avatars",
        project_gamma_feature_2_title: "K-Content Based Costume Creation",
        project_gamma_feature_2_desc: "Character style implementation inspired by K-POP, K-dramas, and Korean traditional tales\nKorean Wave sensibility design targeting global users",
        project_gamma_feature_3_title: "Latest Trends for Global Gen Z",
        project_gamma_feature_3_desc: "Trendy avatar items focused on popular themes like Y2K, streetwear, and festival looks\nStyle composition and posing optimization to encourage SNS sharing",
        project_gamma_feature_4_title: "Production and Distribution Structure Optimized for Roblox Item Ecosystem",
        project_gamma_feature_4_desc: "Various business models applicable including sales/gacha/reward-based distribution\nCombining community-based expansion strategies with limited edition operations",
        
        // Project Gamma related links
        project_gamma_related_links: "Related Links",
        project_gamma_group_page: "Group Page:",
        project_gamma_group_page_text: "Visit NNN UGC Roblox Group",
        
        // Footer
        footer_about_title: "NNN GAMES",
        footer_about_text: "NNN GAMES creates interactive content that delivers both fun and value to users around the world through UGC and game experiences on ZEPETO and Roblox.",
        footer_links_title: "Quick Links",
        footer_contact_title: "Contact",
        footer_address: "Address: 804B, 54, Startup-ro, Sujeong-gu, Seongnam-si, Gyeonggi-do, 13449, Republic of Korea",
        footer_business_number: "Business Registration No: 629-87-01849",
        footer_copyright: "© 2025 TripleN Games Inc. All Rights Reserved."
    },
    
    ja: {
        // ページタイトル
        page_title: "NNN GAMES - ブランドを遊び心で広く伝えます",
        project_alpha_page_title: "プロジェクトアルファ - NNN GAMES",
        
        // ナビゲーション
        nav_home: "ホーム",
        nav_about: "紹介",
        nav_projects: "プロジェクト",
        nav_contact: "お問い合わせ",
        
        // 言語選択
        lang_ko: "한국어",
        lang_en: "English",
        lang_ja: "日本語",
        
        // ヒーローセクション
        hero_title: "ブランドをゲームのように、楽しさで広げます",
        hero_subtitle: "ZEPETOやRobloxを活用し、企業やブランドの魅力を伝える没入型ゲームコンテンツを制作しています。\n" +
            "楽しめば楽しむほど、ブランドは自然に広がります。",
        hero_cta: "プロジェクト詳細を見る",
        
        // 特徴セクション
        features_title: "NNN Gamesの強み",
        feature_1_title: "ブランドのためのカスタムゲーム設計",
        feature_1_desc: "ZEPETOとRobloxに最適化された構成で、ブランドメッセージを自然に伝えるプレイ体験を提供します。",
        feature_2_title: "コンテンツと収益をつなぐシステム",
        feature_2_desc: "広告、ガチャ、クエストなど、ユーザーの没入感と収益化を両立させるシステムを設計・運用しています。",
        feature_3_title: "実績あるグローバル運営力",
        feature_3_desc: "累計100万回以上の訪問を達成したワールドを含め、国内外の企業と連携した大規模プロジェクトを成功に導いています。",
        
        // プロジェクトセクション
        project_preview_title: "進行中のプロジェクト",
        project_alpha_title: "Get Train（JR東日本）",
        project_alpha_desc: "ゲームの楽しさを通じて、JR東日本のブランドを世界中のユーザーに自然に伝えるZEPETOワールドです。",
        project_beta_title: "Legendary DJ Gear",
        project_beta_desc: "音楽とコスチュームを集めて、自分だけのプレイリストを完成させるRobloxの収集型ゲーム。",
        project_gamma_title: "NNN UGC",
        project_gamma_desc: "Robloxユーザー向けにトレンド感のあるUGCアイテムを制作・提供するプロジェクトです。",
        learn_more: "詳細を見る →",
        
        // プロジェクトページ
        projects_page_title: "プロジェクト - NNN GAMES",
        projects_page_header: "プロジェクト",
        
        // Aboutページ
        about_page_title: "紹介 - NNN GAMES",
        about_page_header: "NOVELTY NOTABLE NIMBLE",
        about_mission_title: "私たちのミッション",
        about_mission_desc: "NNN GAMESは、ZEPETOとRobloxを基盤に、ブランドメッセージを楽しく創造的に伝えるインタラクティブコンテンツを制作しています。世界中のユーザーがゲームを楽しむ中で、自然にブランドとつながる体験を設計することを目指しています。",
        about_mission_desc2: "収集、広告、ガチャ、クエストなどのシステムを通じてユーザーの没入感を高め、コンテンツの面白さとブランドマーケティング効果を両立する収益モデルを構築しています。",
        
        // 会社沿革
        company_history_title: "会社沿革",
        history_2020_title: "2020年",
        history_2020_desc: "Triple N Games設立、モバイルゲーム『MineSweeper: The Dungeon』をリリース",
        history_2023_title: "2023年",
        history_2023_desc: "ZEPETOワールド『K-Dance Studio』をリリース、ZEPETO World Jam Fall 2023優勝",
        history_2024_title: "2024年",
        history_2024_desc: "ZEPETOワールド制作に関するMOU締結および事業受託、板橋グローバルゲームハブセンター入居、JR東日本プロジェクト開発開始",
        history_2025_title: "2025年",
        history_2025_desc: "ZEPETOワールド『Get Train（JR東日本）』正式リリース、新たなプラットフォームとプロジェクトへの展開",
        
        // 受賞歴
        awards_title: "受賞歴および実績",
        award_1_title: "第1回 韓国文化体験メタバースコンテンツ公募展",
        award_1_desc: "大賞（文化体育観光部長官賞）",
        award_2_title: "ZEPETO World Jam Fall 2023",
        award_2_desc: "第1位",
        award_3_title: "Get Train（JR東日本）",
        award_3_desc: "累計訪問者数100万人を突破",
        
        // Contactページ
        contact_page_title: "お問い合わせ - NNN GAMES",
        contact_page_header: "お問い合わせ",
        contact_page_subtitle: "ご連絡お待ちしております。プロジェクト、サービス、その他ご質問がございましたら、いつでもお答えいたします。",
        contact_info_title: "連絡先情報",
        office_location_title: "オフィス所在地",
        
        // プロジェクトアルファページ
        project_page_header: "Get Train（JR東日本）",
        project_status: "正式運営中",
        project_genre: "ジャンル：ソーシャルアドベンチャー＆収集型コンテンツ",
        project_platform: "プラットフォーム：ZEPETO",
        project_summary_title: "プロジェクト概要",
        project_summary_p1: "Get Trainは、JR東日本とNAVER Zが共同で開発したZEPETOのブランドゲームプロジェクトです。東京の山手線をモチーフにした仮想世界を舞台に、駅を巡りながらアウラを集め、様々なミッションをこなすソーシャルゲームです。",
        project_summary_p2: "現実と仮想をつなぐ空間デザイン、収集と成長の楽しさ、ユーザー同士の交流を融合させ、ブランドの世界観を体験し共有できるユニークで没入感のある体験を提供します。",
        project_features_title: "主な特徴",
        project_feature_1: "山手線の主要駅を再現した没入型ワールド",
        project_feature_2: "ガチャとクエストを基盤とした収集型コンテンツ構造",
        project_feature_3: "アウラ、ガチャ、協力バフなどの差別化された成長システム",
        project_feature_4: "ブランドと連動したシーズンイベントと広告システム",
        
        // プロジェクト関連リンク
        project_related_links: "関連リンク",
        project_world_link: "ワールドリンク:",
        project_world_link_text: "Get Trainワールドを訪問",
        project_related_article: "関連記事:",
        project_related_article_text: "PR Times記事を見る",
        project_related_event: "関連イベント:",
        project_related_event_text: "JRE Walletキャンペーン",
        
        // 共通ラベル
        gallery_title: "ギャラリー",
        
        // プロジェクトベータページ
        project_beta_page_header: "Legendary DJ Gear",
        project_beta_status: "正式運営中",
        project_beta_genre: "ジャンル：音楽コレクションゲーム",
        project_beta_platform: "プラットフォーム：ROBLOX",
        project_beta_summary_title: "プロジェクト概要",
        project_beta_summary_p1: "Legendary DJ Gearは、音楽とファッションを融合させた革新的なRobloxコレクションゲームです。プレイヤーは様々な音楽ジャンルのDJとなり、伝説的な衣装と音楽を集めて自分だけのユニークなスタイルを完成させていきます。",
        project_beta_summary_p2: "リズムゲーム、クエスト、イベントを通じてレアアイテムを獲得し、他のプレイヤーと競い合いながら最高のDJへと成長できます。コミュニティ中心のソーシャル機能により、世界中のプレイヤーと音楽を共有し、コラボレーションすることができます。",
        project_beta_features_title: "主な特徴",
        project_beta_feature_1: "100種類以上のユニークなDJ衣装とアクセサリーを収集",
        project_beta_feature_2: "様々な音楽ジャンル別のテーマワールドとリズムゲーム",
        project_beta_feature_3: "リアルタイムマルチプレイヤーDJバトルとランキングシステム",
        project_beta_feature_4: "カスタムプレイリストと音楽共有コミュニティ",
        
        // プロジェクトガンマページ
        project_gamma_title: "NNN UGC",
        project_gamma_page_header: "NNN UGC",
        project_gamma_status: "制作中",
        project_gamma_genre: "ジャンル：UGCアイテム制作",
        project_gamma_platform: "プラットフォーム：ROBLOX & ZEPETO",
        project_gamma_summary_p1: "NNN UGC制作プロジェクトは、Robloxプラットフォームで活動するユーザーを対象に、トレンディで創造的なアバターアイテムを制作・販売する収益型コンテンツプロジェクトです。",
        project_gamma_summary_p2: "Z世代ユーザーの感覚に合わせたデザインやシーズンテーマ、SNS連動要素などを積極的に反映し、ユーザーの着せ替え欲求とコレクション欲求を刺激するファッション中心のUGCブランドを構築します。",
        project_gamma_summary_p3: "単純なアイテム制作を超えて、ユーザー参加型コンテンツ、限定版、コラボシリーズなど、様々な方法でRoblox経済システム内で持続可能な収益構造を設計します。",
        project_gamma_feature_1_title: "東洋の感性を込めた伝統衣装ラインナップ",
        project_gamma_feature_1_desc: "韓服、着物、チャイナドレスなど東アジアの伝統衣装を現代的に再解釈\nRobloxアバターに最適化されたシルエットと素材表現",
        project_gamma_feature_2_title: "K-コンテンツベースのコスチューム制作",
        project_gamma_feature_2_desc: "K-POP、Kドラマ、韓国の伝統説話などからインスピレーションを得たキャラクタースタイル実装\nグローバルユーザーをターゲットにした韓流感性デザイン",
        project_gamma_feature_3_title: "グローバルZ世代に向けた最新トレンド反映",
        project_gamma_feature_3_desc: "Y2K、ストリートウェア、フェスティバルルックなど人気テーマ中心のトレンディなアバターアイテム制作\nSNSシェアを促すスタイル構成とポージング最適化",
        project_gamma_feature_4_title: "Robloxアイテム生態系に最適化された制作・流通構造",
        project_gamma_feature_4_desc: "販売/ガチャ/報酬型配布など様々なビジネスモデル適用可能\nコミュニティベース拡散戦略と限定版運営方式の並行",
        
        // プロジェクトガンマ関連リンク
        project_gamma_related_links: "関連リンク",
        project_gamma_group_page: "グループページ:",
        project_gamma_group_page_text: "NNN UGC Robloxグループを訪問",
        
        // フッター
        footer_about_title: "NNN GAMES",
        footer_about_text: "NNN GAMESは、ZEPETOやRobloxを基盤としたUGCとゲームコンテンツを通じて、世界中のユーザーに楽しさと価値を同時に届けるインタラクティブなコンテンツを制作しています。",
        footer_links_title: "クイックリンク",
        footer_contact_title: "連絡先",
        footer_address: "住所：〒13449 韓国 京畿道 城南市 修正区 スタートアップ路54\n" +
            "        LH企業成長センター 804B号室",
        footer_business_number: "事業者登録番号: 629-87-01849",
        footer_copyright: "© 2025 TripleN Games Inc. All Rights Reserved."
    }
};

// 브라우저 환경 체크
const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';

// 현재 언어 설정 (localStorage에서 가져오거나 기본값은 한국어)
let currentLanguage = isBrowser && localStorage.getItem('language') || 'ko';

// 언어 변경 함수
function changeLanguage(lang) {
    currentLanguage = lang;
    if (isBrowser) {
        localStorage.setItem('language', lang);
        // HTML lang 속성 변경
        document.documentElement.lang = lang;
        // 모든 번역 가능한 요소 업데이트
        updateTranslations();
        // 언어 버튼 활성화 상태 업데이트
        updateLanguageButtons();
        // 프로젝트 렌더러에 언어 변경 이벤트 전송
        if (window.ProjectRenderer) {
            window.ProjectRenderer.updateLanguage(lang);
        }
        // 커스텀 이벤트 발생
        document.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
    }
}

// 번역 업데이트 함수
function updateTranslations() {
    // data-key 속성을 가진 모든 요소 찾기
    const elements = document.querySelectorAll('[data-key]');
    
    elements.forEach(element => {
        const key = element.getAttribute('data-key');
        if (translations[currentLanguage] && translations[currentLanguage][key]) {
            // title 속성이 있는 경우 (페이지 제목)
            if (element.tagName === 'TITLE') {
                element.textContent = translations[currentLanguage][key];
            } else {
                element.textContent = translations[currentLanguage][key];
            }
        }
    });
}

// 언어 버튼 활성화 상태 업데이트
function updateLanguageButtons() {
    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(btn => {
        if (btn.getAttribute('data-lang') === currentLanguage) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// 페이지 로드 시 초기화
if (isBrowser) {
    document.addEventListener('DOMContentLoaded', function() {
        // 현재 언어로 번역 적용
        updateTranslations();
        updateLanguageButtons();
        
        // 프로젝트 렌더러에 초기 언어 설정 알림
        if (window.ProjectRenderer) {
            window.ProjectRenderer.updateLanguage(currentLanguage);
        }
        
        // 언어 버튼 클릭 이벤트 추가
        const langButtons = document.querySelectorAll('.lang-btn');
        langButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const lang = this.getAttribute('data-lang');
                changeLanguage(lang);
            });
        });
    });
}
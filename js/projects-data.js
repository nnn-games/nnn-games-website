// 프로젝트 데이터 관리
const projectsData = {
    // 메인 페이지에 표시될 프로젝트들 (최대 3개 권장)
    // 순서: 1.Roblox, 2.Meta Horizon (horizon), 3.Fortnite, 4.ZEPETO, 5.Mobile
    featured: [
        {
            id: 'korean-spa',
            title: {
                ko: 'Korean Spa',
                en: 'Korean Spa',
                ja: 'Korean Spa'
            },
            description: {
                ko: '작아진 탐험가가 되어 거대한 한국 목욕탕을 모험하는 퍼즐 어드벤처 게임.',
                en: 'A puzzle adventure game where you explore a giant Korean spa as a tiny explorer.',
                ja: '小さな探検家になって巨大な韓国式スパを冒険するパズルアドベンチャーゲーム。'
            },
            image: 'images/ks-preview.jpg',
            detailPage: 'korean-spa.html',
            category: 'roblox',
            status: 'development',
            featured: true
        },
        {
            id: 'slime-sanctum',
            title: {
                ko: '슬라임 성소: 최후의 항전',
                en: 'Slime Sanctum: Last Stand',
                ja: 'スライム聖域：ラストスタンド'
            },
            description: {
                ko: '어둡고 폐허가 된 성소에서 친구들과 함께 끝없이 몰려오는 슬라임 무리를 막아내고, 매번 달라지는 스킬 조합으로 얼마나 오래 버티는지 겨루는 협동 생존 디펜스 게임.',
                en: 'A co-op survival defense game where you and your friends hold a dark, ruined sanctum against endless slime hordes, using ever-changing skill combinations to see how long you can last.',
                ja: '暗く荒れ果てた聖域で、仲間とともに無限に押し寄せるスライムの群れを迎え撃ち、毎回変わるスキルの組み合わせでどこまで耐えられるかを競う協力型サバイバル防衛ゲーム。'
            },
            image: 'images/slimesanctum-preview.jpg',
            detailPage: 'slime-sanctum.html',
            category: 'horizon',
            status: 'development',
            featured: true
        },
        {
            id: 'get-train',
            title: {
                ko: '겟 트레인(JR 동일본)',
                en: 'Get Train (JR East)',
                ja: 'ゲットトレイン(JR東日本)'
            },
            description: {
                ko: '게임의 재미를 통해 JR 동일본의 브랜드를 전 세계 사용자에게 자연스럽게 알리는 ZEPETO 월드입니다.',
                en: 'A ZEPETO world that naturally introduces the JR East brand to global users through engaging gameplay.',
                ja: 'ゲームの楽しさを通じてJR東日本のブランドを世界中のユーザーに自然に紹介するZEPETOワールドです。'
            },
            image: 'images/gt-preview.jpg',
            detailPage: 'get-train.html',
            category: 'zepeto',
            status: 'active',
            featured: true
        },
        {
            id: 'legendary-dj-gear',
            title: {
                ko: 'Legendary DJ Gear',
                en: 'Legendary DJ Gear',
                ja: 'Legendary DJ Gear'
            },
            description: {
                ko: '음악과 코스튬을 수집하며 나만의 플레이리스트를 완성하는 로블록스 수집형 게임.',
                en: 'A Roblox collection game where you gather music and costumes to create your own playlist.',
                ja: '音楽とコスチュームを収集して自分だけのプレイリストを完成させるRobloxコレクションゲーム。'
            },
            image: 'images/ldg-preview.jpg',
            detailPage: 'legendary-dj-gear.html',
            category: 'roblox',
            status: 'active',
            featured: true
        },
        {
            id: 'nnn-ugc',
            title: {
                ko: 'NNN UGC',
                en: 'NNN UGC',
                ja: 'NNN UGC'
            },
            description: {
                ko: '트렌디한 아이템을 제작해 ZEPETO와 Roblox 유저에게 선보이는 UGC 제작 프로젝트.',
                en: 'A UGC creation project delivering trendy items to ZEPETO and Roblox users.',
                ja: 'ZEPETOとRobloxユーザー向けにトレンド感のあるUGCアイテムを制作・提供するプロジェクトです。'
            },
            image: 'images/nnnugc-preview.jpg',
            detailPage: 'nnn-ugc.html',
            category: 'other',
            status: 'development',
            featured: true
        }
    ],

    // 전체 프로젝트 목록 (프로젝트 페이지용)
    all: [
        {
            id: 'korean-spa',
            title: {
                ko: 'Korean Spa',
                en: 'Korean Spa',
                ja: 'Korean Spa'
            },
            description: {
                ko: '작아진 탐험가가 되어 거대한 한국 목욕탕을 모험하는 퍼즐 어드벤처 게임.',
                en: 'A puzzle adventure game where you explore a giant Korean spa as a tiny explorer.',
                ja: '小さな探検家になって巨大な韓国式スパを冒険するパズルアドベンチャーゲーム。'
            },
            image: 'images/ks-preview.jpg',
            detailPage: 'korean-spa.html',
            category: 'roblox',
            status: 'development',
            featured: true,
            launchDate: '2025-12',
            platform: 'Roblox',
            client: 'Internal Project',
            technologies: ['Roblox Studio', 'Luau', 'UGC Creation']
        },
        {
            id: 'slime-sanctum',
            title: {
                ko: '슬라임 성소: 최후의 항전',
                en: 'Slime Sanctum: Last Stand',
                ja: 'スライム聖域：ラストスタンド'
            },
            description: {
                ko: '어둡고 폐허가 된 성소에서 친구들과 함께 끝없이 몰려오는 슬라임 무리를 막아내고, 매번 달라지는 스킬 조합으로 얼마나 오래 버티는지 겨루는 협동 생존 디펜스 게임.',
                en: 'A co-op survival defense game where you and your friends hold a dark, ruined sanctum against endless slime hordes, using ever-changing skill combinations to see how long you can last.',
                ja: '暗く荒れ果てた聖域で、仲間とともに無限に押し寄せるスライムの群れを迎え撃ち、毎回変わるスキルの組み合わせでどこまで耐えられるかを競う協力型サバイバル防衛ゲーム。'
            },
            image: 'images/slimesanctum-preview.jpg',
            detailPage: 'slime-sanctum.html',
            category: 'horizon',
            status: 'development',
            featured: true,
            launchDate: '2026-01',
            platform: 'META HORIZON WORLD',
            client: 'Internal Project',
            technologies: ['META HORIZON WORLD Engine', 'Noesis UI']
        },
        {
            id: 'get-train',
            title: {
                ko: '겟 트레인(JR 동일본)',
                en: 'Get Train (JR East)',
                ja: 'ゲットトレイン(JR東日本)'
            },
            description: {
                ko: '게임의 재미를 통해 JR 동일본의 브랜드를 전 세계 사용자에게 자연스럽게 알리는 ZEPETO 월드입니다.',
                en: 'A ZEPETO world that naturally introduces the JR East brand to global users through engaging gameplay.',
                ja: 'ゲームの楽しさを通じてJR東日本のブランドを世界中のユーザーに自然に紹介するZEPETOワールドです。'
            },
            image: 'images/gt-preview.jpg',
            detailPage: 'get-train.html',
            category: 'zepeto',
            status: 'active',
            featured: true,
            launchDate: '2024-12',
            platform: 'ZEPETO',
            client: 'JR 동일본',
            technologies: ['ZEPETO Studio', 'Lua Script', '3D Modeling']
        },
        {
            id: 'legendary-dj-gear',
            title: {
                ko: 'Legendary DJ Gear',
                en: 'Legendary DJ Gear',
                ja: 'Legendary DJ Gear'
            },
            description: {
                ko: '음악과 코스튬을 수집하며 나만의 플레이리스트를 완성하는 로블록스 수집형 게임.',
                en: 'A Roblox collection game where you gather music and costumes to create your own playlist.',
                ja: '音楽とコスチュームを収集して自分だけのプレイリストを完成させるRobloxコレクションゲーム。'
            },
            image: 'images/ldg-preview.jpg',
            detailPage: 'legendary-dj-gear.html',
            category: 'roblox',
            status: 'active',
            featured: true,
            launchDate: '2024-11',
            platform: 'Roblox',
            client: 'Internal Project',
            technologies: ['Roblox Studio', 'Luau', 'UI Design']
        },
        {
            id: 'nnn-ugc',
            title: {
                ko: 'NNN UGC',
                en: 'NNN UGC',
                ja: 'NNN UGC'
            },
            description: {
                ko: '트렌디한 아이템을 제작해 ZEPETO와 Roblox 유저에게 선보이는 UGC 제작 프로젝트.',
                en: 'A UGC creation project delivering trendy items to ZEPETO and Roblox users.',
                ja: 'ZEPETOとRobloxユーザー向けにトレンド感のあるUGCアイテムを制作・提供するプロジェクトです。'
            },
            image: 'images/nnnugc-preview.jpg',
            detailPage: 'nnn-ugc.html',
            category: 'other',
            status: 'development',
            featured: true,
            launchDate: '2025-Q1',
            platform: 'TBD',
            client: 'Confidential',
            technologies: ['TBD']
        },
    ]
};

// 프로젝트 관리 유틸리티 함수들
const ProjectManager = {
    // 특정 프로젝트 가져오기
    getProject: function (id) {
        return this.all.find(project => project.id === id);
    },

    // 카테고리별 프로젝트 가져오기
    getProjectsByCategory: function (category) {
        return projectsData.all.filter(project => project.category === category);
    },

    // 상태별 프로젝트 가져오기
    getProjectsByStatus: function (status) {
        return projectsData.all.filter(project => project.status === status);
    },

    // 메인 페이지용 추천 프로젝트 가져오기
    getFeaturedProjects: function () {
        return projectsData.featured;
    },

    // 새 프로젝트 추가
    addProject: function (projectData) {
        const newProject = {
            id: projectData.id || this.generateId(),
            ...projectData,
            featured: projectData.featured || false
        };

        projectsData.all.push(newProject);

        if (newProject.featured) {
            projectsData.featured.push(newProject);
        }

        return newProject;
    },

    // 프로젝트 업데이트
    updateProject: function (id, updateData) {
        const projectIndex = projectsData.all.findIndex(project => project.id === id);
        if (projectIndex !== -1) {
            projectsData.all[projectIndex] = { ...projectsData.all[projectIndex], ...updateData };

            // featured 목록도 업데이트
            const featuredIndex = projectsData.featured.findIndex(project => project.id === id);
            if (featuredIndex !== -1) {
                projectsData.featured[featuredIndex] = { ...projectsData.featured[featuredIndex], ...updateData };
            }

            return projectsData.all[projectIndex];
        }
        return null;
    },

    // ID 생성 (단순한 예시)
    generateId: function () {
        return 'project-' + Date.now();
    }
};

// 전역에서 사용할 수 있도록 노출
window.projectsData = projectsData;
window.ProjectManager = ProjectManager;
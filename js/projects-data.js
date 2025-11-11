// 프로젝트 데이터 관리
const projectsData = {
    // 메인 페이지에 표시될 프로젝트들 (최대 3개 권장)
    // 순서: 1.ZEPETO, 2.Roblox, 3.Other, 4.ZEPETO, 5.Roblox
    featured: [
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
            detailPage: 'project-alpha.html',
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
            detailPage: 'project-beta.html',
            category: 'roblox',
            status: 'active',
            featured: true
        },
        {
            id: 'project-gamma',
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
            detailPage: 'project-gamma.html',
            category: 'other',
            status: 'development',
            featured: true
        },
        {
            id: 'project-epsilon',
            title: {
                ko: '프로젝트 K',
                en: 'Project K',
                ja: 'プロジェクト K'
            },
            description: {
                ko: 'ZEPETO에서 K-POP 곡에 맞춰 경쟁하며 퍼포먼스 영상을 만드는 실시간 경연 콘텐츠.',
                en: 'Real-time K-POP competition content where you compete and create performance videos on ZEPETO.',
                ja: 'ZEPETOでK-POPの曲に合わせて競い合い、パフォーマンス動画を作成するリアルタイム競演コンテンツ。'
            },
            image: 'images/projectk-preview.jpg',
            detailPage: 'project-epsilon.html',
            category: 'zepeto',
            status: 'development',
            featured: true
        },
        {
            id: 'project-delta',
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
            detailPage: 'project-delta.html',
            category: 'roblox',
            status: 'development',
            featured: true
        }
    ],

    // 전체 프로젝트 목록 (프로젝트 페이지용)
    all: [
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
            detailPage: 'project-alpha.html',
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
            detailPage: 'project-beta.html',
            category: 'roblox',
            status: 'active',
            featured: true,
            launchDate: '2024-11',
            platform: 'Roblox',
            client: 'Internal Project',
            technologies: ['Roblox Studio', 'Luau', 'UI Design']
        },
        {
            id: 'project-gamma',
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
            detailPage: 'project-gamma.html',
            category: 'other',
            status: 'development',
            featured: true,
            launchDate: '2025-Q1',
            platform: 'TBD',
            client: 'Confidential',
            technologies: ['TBD']
        },
        {
            id: 'project-epsilon',
            title: {
                ko: '프로젝트 K',
                en: 'Project K',
                ja: 'プロジェクト K'
            },
            description: {
                ko: 'ZEPETO에서 K-POP 곡에 맞춰 경쟁하며 퍼포먼스 영상을 만드는 실시간 경연 콘텐츠.',
                en: 'Real-time K-POP competition content where you compete and create performance videos on ZEPETO.',
                ja: 'ZEPETOでK-POPの曲に合わせて競い合い、パフォーマンス動画を作成するリアルタイム競演コンテンツ。'
            },
            image: 'images/projectk-preview.jpg',
            detailPage: 'project-epsilon.html',
            category: 'zepeto',
            status: 'development',
            featured: true,
            launchDate: '2025-TBA',
            platform: 'ZEPETO',
            client: 'Internal Project',
            technologies: ['ZEPETO Studio', 'Lua Script', 'Performance Capture']
        },
        {
            id: 'project-delta',
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
            detailPage: 'project-delta.html',
            category: 'roblox',
            status: 'development',
            featured: true,
            launchDate: '2025-12',
            platform: 'Roblox',
            client: 'Internal Project',
            technologies: ['Roblox Studio', 'Luau', 'UGC Creation']
        }
    ]
};

// 프로젝트 관리 유틸리티 함수들
const ProjectManager = {
    // 특정 프로젝트 가져오기
    getProject: function(id) {
        return this.all.find(project => project.id === id);
    },

    // 카테고리별 프로젝트 가져오기
    getProjectsByCategory: function(category) {
        return projectsData.all.filter(project => project.category === category);
    },

    // 상태별 프로젝트 가져오기
    getProjectsByStatus: function(status) {
        return projectsData.all.filter(project => project.status === status);
    },

    // 메인 페이지용 추천 프로젝트 가져오기
    getFeaturedProjects: function() {
        return projectsData.featured;
    },

    // 새 프로젝트 추가
    addProject: function(projectData) {
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
    updateProject: function(id, updateData) {
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
    generateId: function() {
        return 'project-' + Date.now();
    }
};

// 전역에서 사용할 수 있도록 노출
window.projectsData = projectsData;
window.ProjectManager = ProjectManager;
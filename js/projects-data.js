// 기본 프로젝트 데이터 (JSON 로드 실패 시 fallback)
let projectsData = {
    featured: [],
    all: [],
    summary: {
        hero: {
            projectCount: 0,
            projectIds: [],
            totalVisits: 0,
            visitProjectIds: [],
            updatedAt: null
        }
    }
};

const getProjectReporting = function (project) {
    return project && typeof project.reporting === 'object' && project.reporting
        ? project.reporting
        : {};
};

const isActiveProject = function (project) {
    return project && project.status === 'active';
};

const shouldIncludeInHeroProjectCount = function (project) {
    const reporting = getProjectReporting(project);
    const include = typeof reporting.includeInHeroProjectCount === 'boolean'
        ? reporting.includeInHeroProjectCount
        : true;
    return isActiveProject(project) && include;
};

const shouldIncludeInHeroVisitTotal = function (project) {
    const reporting = getProjectReporting(project);
    const include = typeof reporting.includeInHeroVisitTotal === 'boolean'
        ? reporting.includeInHeroVisitTotal
        : true;
    return isActiveProject(project) && include;
};

const buildProjectSummary = function (projects, updatedAt = null) {
    const heroProjects = (projects || []).filter(shouldIncludeInHeroProjectCount);
    const visitProjects = (projects || []).filter(shouldIncludeInHeroVisitTotal);
    const totalVisits = visitProjects.reduce((sum, project) => {
        const visits = project && project.metrics && typeof project.metrics.visits === 'number'
            ? project.metrics.visits
            : 0;
        return sum + visits;
    }, 0);

    return {
        hero: {
            projectCount: heroProjects.length,
            projectIds: heroProjects.map(project => project.id),
            totalVisits,
            visitProjectIds: visitProjects.map(project => project.id),
            updatedAt
        }
    };
};

// 프로젝트 관리 유틸리티 함수들
const ProjectManager = {
    loadPromise: null,

    // JSON에서 프로젝트 데이터 로드 (fallback: 내장 데이터)
    loadProjectsData: function () {
        if (this.loadPromise) return this.loadPromise;
        this.loadPromise = fetch('data/projects.json', { cache: 'no-cache' })
            .then(res => res.ok ? res.json() : Promise.reject(new Error('Failed to load projects.json')))
            .then(json => {
                const all = json.all || [];
                const summary = json.summary || buildProjectSummary(all, null);
                projectsData = {
                    all,
                    featured: all.filter(p => p.featured),
                    summary
                };
                return projectsData;
            })
            .catch(err => {
                console.warn('[ProjectManager] Using fallback projectsData due to load error:', err);
                // fallback 내장 데이터
                // JSON 로드 실패 시에도 PRD 순서(korean-spa → legendary-dj-gear → nnn-ugc)를 유지하도록 fallback 정렬
                const fallbackAll = [
                    {
                        id: 'tower-flood-race',
                        title: { ko: '타워 홍수 경주', en: 'Tower Flood Race', ja: 'タワー・フラッド・レース' },
                        description: {
                            ko: 'Race Up. Water Rises. – 물이 차오르는 가운데 랜덤 타워를 가장 빠르게 오르는 오비 레이스.',
                            en: 'Race up while the water keeps rising—an obby race to the top of random towers before the flood catches you.',
                            ja: '水位が上がる中、ランダムなタワーを誰より速く登り切るObbyレース。'
                        },
                        image: 'images/tfr-preview.jpg',
                        detailPage: 'tower-flood-race.html',
                        category: 'roblox',
                        status: 'active',
                        featured: true,
                        launchDate: '2026-01',
                        platform: 'Roblox',
                        client: 'Internal Project',
                        technologies: ['Roblox Studio', 'Luau', 'Procedural Level'],
                        links: {
                            play: 'https://www.roblox.com/games/77732766603333',
                            trailer: 'https://youtu.be/5g11rbdF4_I',
                            article: '',
                            group: 'https://www.roblox.com/groups/294985728',
                            showcase: ''
                        },
                        reporting: {
                            collectMetrics: true,
                            includeInHeroProjectCount: true,
                            includeInHeroVisitTotal: true
                        },
                        metrics: {
                            visits: null,
                            playing: null,
                            favorites: null,
                            likeRatio: null,
                            updatedAt: null
                        }
                    },
                    {
                        id: 'korean-spa',
                        title: { ko: 'Korean Spa', en: 'Korean Spa', ja: 'Korean Spa' },
                        description: {
                            ko: '작아진 탐험가가 되어 거대한 한국 목욕탕을 모험하는 퍼즐 어드벤처 게임.',
                            en: 'A puzzle adventure game where you explore a giant Korean spa as a tiny explorer.',
                            ja: '小さな探検家になって巨大な韓国式スパを冒険するパズルアドベンチャーゲーム。'
                        },
                        image: 'images/ks-preview.jpg',
                        detailPage: 'korean-spa.html',
                        category: 'roblox',
                        status: 'active',
                        featured: true,
                        launchDate: '2025-12',
                        platform: 'Roblox',
                        client: 'Internal Project',
                        technologies: ['Roblox Studio', 'Luau', 'UGC Creation'],
                        links: {
                            play: 'https://www.roblox.com/games/90029482000377/Grubby',
                            trailer: '',
                            article: ''
                        },
                        reporting: {
                            collectMetrics: true,
                            includeInHeroProjectCount: true,
                            includeInHeroVisitTotal: true
                        },
                        metrics: {
                            visits: 80002,
                            playing: 2,
                            favorites: 479,
                            likeRatio: 0.8581,
                            updatedAt: '2025-12-31T05:19:44.590Z'
                        }
                    },
                    {
                        id: 'legendary-dj-gear',
                        title: { ko: 'Legendary DJ Gear', en: 'Legendary DJ Gear', ja: 'Legendary DJ Gear' },
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
                        technologies: ['Roblox Studio', 'Luau', 'UI Design'],
                        links: {
                            play: 'https://www.roblox.com/games/110796735931100/Legendary-DJ-Gear',
                            trailer: 'https://www.youtube.com/watch?v=0cEj3Tnb-No',
                            article: ''
                        },
                        reporting: {
                            collectMetrics: true,
                            includeInHeroProjectCount: true,
                            includeInHeroVisitTotal: true
                        },
                        metrics: {
                            visits: 49865,
                            playing: 0,
                            favorites: 203,
                            likeRatio: 0.5323,
                            updatedAt: '2025-11-11T01:56:25.827Z'
                        }
                    },
                    {
                        id: 'fruit-battles',
                        title: { ko: 'Fruit Battles', en: 'Fruit Battles', ja: 'Fruit Battles' },
                        description: {
                            ko: '과일 스킬과 슬랩 액션으로 싸우고, 전리품으로 성장하는 Roblox 실시간 아레나 PvP 게임.',
                            en: 'A Roblox real-time arena PvP game where fruit skills, slap combat, and loot-driven growth come together.',
                            ja: 'フルーツスキルとスラップアクションで戦い、戦利品で成長するRobloxリアルタイムアリーナPvPゲーム。'
                        },
                        image: 'images/fruit-battls-preview.jpg',
                        detailPage: 'fruit-battles.html',
                        category: 'roblox',
                        status: 'development',
                        featured: true,
                        launchDate: '2026-03',
                        platform: 'Roblox',
                        client: 'Internal Project',
                        technologies: ['Roblox Studio', 'Luau', 'Live Arena Systems'],
                        placeId: '109322674605513',
                        universeId: '9867900121',
                        links: {
                            play: '',
                            trailer: '',
                            article: '',
                            group: '',
                            showcase: 'https://www.roblox.com/ko/games/109322674605513/Fruit-Battles'
                        },
                        reporting: {
                            collectMetrics: false,
                            includeInHomePreview: true,
                            includeInHeroProjectCount: false,
                            includeInHeroVisitTotal: false
                        },
                        metrics: {
                            visits: null,
                            playing: null,
                            favorites: null,
                            likeRatio: null,
                            updatedAt: null
                        }
                    },
                    {
                        id: 'nnn-ugc',
                        title: { ko: 'NNN UGC', en: 'NNN UGC', ja: 'NNN UGC' },
                        description: {
                            ko: '트렌디한 아이템을 제작해 Roblox 유저에게 선보이는 UGC 제작 프로젝트.',
                            en: 'A UGC creation project delivering trendy items to Roblox users.',
                            ja: 'Robloxユーザー向けにトレンド感のあるUGCアイテムを制作・提供するプロジェクトです。'
                        },
                        image: 'images/nnnugc-preview.jpg',
                        detailPage: 'nnn-ugc.html',
                        category: 'roblox',
                        status: 'development',
                        featured: true,
                        launchDate: '2025-Q1',
                        platform: 'Roblox',
                        client: 'Confidential',
                        technologies: ['Roblox Studio', 'Luau', 'UGC Creation'],
                        links: {
                            play: '',
                            trailer: '',
                            article: '',
                            group: 'https://www.roblox.com/ko/communities/34453707/NNN-UGC#!/about',
                            showcase: ''
                        },
                        reporting: {
                            collectMetrics: false,
                            includeInHeroProjectCount: false,
                            includeInHeroVisitTotal: false
                        },
                        metrics: {
                            visits: null,
                            playing: null,
                            favorites: null,
                            likeRatio: null,
                            updatedAt: null
                        }
                    },
                    {
                        id: 'great-tower-reset',
                        title: { ko: 'The Great Tower Reset', en: 'The Great Tower Reset', ja: 'The Great Tower Reset' },
                        description: {
                            ko: '리셋 성장과 타워 돌파를 결합한 Roblox 메타 진행형 프로젝트.',
                            en: 'A Roblox progression project built around tower pushes and reset-driven growth.',
                            ja: 'タワー攻略とリセット成長を組み合わせたRobloxメタ進行型プロジェクト。'
                        },
                        image: 'images/gt-preview.jpg',
                        detailPage: 'great-tower-reset.html',
                        showInProjectsList: false,
                        showDetailLinkInProjects: false,
                        category: 'roblox',
                        status: 'development',
                        featured: false,
                        launchDate: '2026-Q2',
                        platform: 'Roblox',
                        client: 'Internal Project',
                        technologies: ['Roblox Studio', 'Luau', 'Progression Systems'],
                        links: {
                            play: '',
                            trailer: '',
                            article: '',
                            group: '',
                            showcase: ''
                        },
                        reporting: {
                            collectMetrics: false,
                            includeInHeroProjectCount: false,
                            includeInHeroVisitTotal: false
                        },
                        metrics: {
                            visits: null,
                            playing: null,
                            favorites: null,
                            likeRatio: null,
                            updatedAt: null
                        }
                    },
                    {
                        id: 'hacker-vs-security',
                        title: { ko: 'Hacker vs Security', en: 'Hacker vs Security', ja: 'Hacker vs Security' },
                        description: {
                            ko: '침투와 방어의 읽기 싸움을 중심으로 한 Roblox 비대칭 전략 PvP 프로젝트.',
                            en: 'A Roblox asymmetric strategy PvP project centered on infiltration and defensive counterplay.',
                            ja: '侵入と防衛の読み合いを軸にしたRoblox非対称戦略PvPプロジェクト。'
                        },
                        image: 'images/projectk-preview.jpg',
                        detailPage: 'hacker-vs-security.html',
                        showInProjectsList: false,
                        showDetailLinkInProjects: false,
                        category: 'roblox',
                        status: 'development',
                        featured: false,
                        launchDate: '2026-Q3',
                        platform: 'Roblox',
                        client: 'Internal Project',
                        technologies: ['Roblox Studio', 'Luau', 'Systemic PvP'],
                        links: {
                            play: '',
                            trailer: '',
                            article: '',
                            group: '',
                            showcase: ''
                        },
                        reporting: {
                            collectMetrics: false,
                            includeInHeroProjectCount: false,
                            includeInHeroVisitTotal: false
                        },
                        metrics: {
                            visits: null,
                            playing: null,
                            favorites: null,
                            likeRatio: null,
                            updatedAt: null
                        }
                    }
                ];
                const summary = buildProjectSummary(fallbackAll, null);
                projectsData = {
                    all: fallbackAll,
                    featured: fallbackAll.filter(p => p.featured),
                    summary
                };
                return projectsData;
            });
        return this.loadPromise;
    },

    // 전체 데이터 접근자
    getAll: function () {
        return projectsData.all;
    },
    getFeatured: function () {
        return projectsData.featured;
    },
    getSummary: function () {
        if (!projectsData.summary) {
            projectsData.summary = buildProjectSummary(projectsData.all, null);
        }
        return projectsData.summary;
    },
    getHeroSummary: function () {
        const summary = this.getSummary();
        return summary && summary.hero ? summary.hero : buildProjectSummary(projectsData.all, null).hero;
    },
    getHeroProjects: function () {
        return projectsData.all.filter(shouldIncludeInHeroProjectCount);
    },

    // 특정 프로젝트 가져오기
    getProject: function (id) {
        return projectsData.all.find(project => project.id === id);
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

        projectsData.summary = buildProjectSummary(projectsData.all, null);

        return newProject;
    },

    // 프로젝트 업데이트
    updateProject: function (id, updateData) {
        const projectIndex = projectsData.all.findIndex(project => project.id === id);
        if (projectIndex !== -1) {
            projectsData.all[projectIndex] = { ...projectsData.all[projectIndex], ...updateData };

            projectsData.featured = projectsData.all.filter(project => project.featured);
            projectsData.summary = buildProjectSummary(projectsData.all, null);

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

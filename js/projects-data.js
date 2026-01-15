// 기본 프로젝트 데이터 (JSON 로드 실패 시 fallback)
let projectsData = {
    featured: [],
    all: []
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
                projectsData = {
                    all,
                    featured: all.filter(p => p.featured)
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
                            trailer: '',
                            article: '',
                            group: 'https://www.roblox.com/groups/294985728',
                            showcase: ''
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
                        metrics: {
                            visits: 49865,
                            playing: 0,
                            favorites: 203,
                            likeRatio: 0.5323,
                            updatedAt: '2025-11-11T01:56:25.827Z'
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
                        metrics: {
                            visits: null,
                            playing: null,
                            favorites: null,
                            likeRatio: null,
                            updatedAt: null
                        }
                    }
                ];
                projectsData = {
                    all: fallbackAll,
                    featured: fallbackAll.filter(p => p.featured)
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
// Star Reach — 개발 중 페이지 (project-detail-development.js 렌더러 사용)
// 표시 항목: 제목 / 한 줄 소개 / 장르 / 플랫폼 / 출시 예정일 / 프리뷰 이미지
// 프리뷰 이미지 업로드 후 media.src 를 `assets/starreach/sr-preview.jpg` 로 활성화하세요.
window.ProjectDetailConfigs = window.ProjectDetailConfigs || {};

window.ProjectDetailConfigs['star-reach'] = {
    seo: {
        title: {
            ko: 'Star Reach - NNN GAMES',
            en: 'Star Reach - NNN GAMES',
            ja: 'Star Reach - NNN GAMES'
        },
        description: {
            ko: 'NNN GAMES 가 개발 중인 신규 Roblox 프로젝트입니다. 자세한 내용은 추후 공개됩니다.',
            en: 'A new Roblox project in development at NNN GAMES. More details will be shared soon.',
            ja: 'NNN GAMESが開発中の新規Robloxプロジェクトです。詳細は後日公開予定です。'
        }
        // ogImage: 프리뷰 업로드 후 'assets/starreach/sr-preview.jpg' 로 설정
    },
    hero: {
        title: {
            ko: 'Star Reach',
            en: 'Star Reach',
            ja: 'Star Reach'
        },
        tagline: {
            ko: '준비 중인 신규 Roblox 프로젝트로, 자세한 컨셉은 추후 공개됩니다.',
            en: 'A new Roblox project in development. Concept details will be shared as we approach launch.',
            ja: '準備中の新規Robloxプロジェクト。コンセプトは後日公開予定です。'
        },
        genre: {
            ko: '장르: 추후 공개',
            en: 'Genre: TBA',
            ja: 'ジャンル: 後日公開'
        },
        platform: {
            ko: '플랫폼: Roblox',
            en: 'Platform: Roblox',
            ja: 'プラットフォーム: Roblox'
        }
    },
    snapshot: {
        launch: {
            ko: '출시일 추후 공개',
            en: 'Launch: TBA',
            ja: 'リリース日: 後日公開'
        }
    }
    // media: 프리뷰 업로드 후 아래 블록 활성화
    // media: {
    //     type: 'image',
    //     src: 'assets/starreach/sr-preview.jpg',
    //     alt: {
    //         ko: 'Star Reach 프리뷰 이미지',
    //         en: 'Star Reach preview image',
    //         ja: 'Star Reach プレビュー画像'
    //     }
    // }
};

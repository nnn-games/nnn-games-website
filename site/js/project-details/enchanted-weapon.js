// Enchant a Weapon — 개발 중 페이지 (project-detail-development.js 렌더러 사용)
// 표시 항목: 제목 / 한 줄 소개 / 장르 / 플랫폼 / 출시 예정일 / 프리뷰 이미지
// NOTE: 미출시 프로젝트. 카피/이미지는 임시값이며 출시 예정 월은 사용자 지정 일정입니다.
window.ProjectDetailConfigs = window.ProjectDetailConfigs || {};

window.ProjectDetailConfigs['enchanted-weapon'] = {
    seo: {
        title: {
            ko: 'Enchant a Weapon - NNN GAMES',
            en: 'Enchant a Weapon - NNN GAMES',
            ja: 'Enchant a Weapon - NNN GAMES'
        },
        description: {
            ko: '무기를 수집하고 마법을 부여해 나만의 최강 무기를 완성해가는 Roblox 무기 강화 게임입니다.',
            en: 'A Roblox weapon-enhancement game about collecting weapons and enchanting them into your ultimate arsenal.',
            ja: '武器を集めてエンチャントし、自分だけの最強武器を作り上げていくRobloxの武器強化ゲームです。'
        },
        ogImage: 'assets/enchantedweapon/ew-preview.jpg'
    },
    hero: {
        title: {
            ko: 'Enchant a Weapon',
            en: 'Enchant a Weapon',
            ja: 'Enchant a Weapon'
        },
        tagline: {
            ko: '무기를 수집하고 마법을 부여해 나만의 최강 무기를 완성해가는 Roblox 무기 강화 게임입니다.',
            en: 'Collect weapons and enchant them to forge your ultimate arsenal in this Roblox weapon-enhancement game.',
            ja: '武器を集めてエンチャントし、自分だけの最強武器を作り上げていくRobloxの武器強化ゲームです。'
        },
        genre: {
            ko: '장르: 무기 강화 · 수집',
            en: 'Genre: Weapon Enhancement · Collection',
            ja: 'ジャンル: 武器強化・コレクション'
        },
        platform: {
            ko: '플랫폼: Roblox',
            en: 'Platform: Roblox',
            ja: 'プラットフォーム: Roblox'
        }
    },
    snapshot: {
        launch: {
            ko: '2026년 10월 출시 예정',
            en: 'Expected October 2026',
            ja: '2026年10月公開予定'
        }
    },
    media: {
        type: 'image',
        src: 'assets/enchantedweapon/ew-preview.jpg',
        alt: {
            ko: 'Enchant a Weapon 프리뷰 이미지',
            en: 'Enchant a Weapon preview image',
            ja: 'Enchant a Weapon プレビュー画像'
        }
    }
};

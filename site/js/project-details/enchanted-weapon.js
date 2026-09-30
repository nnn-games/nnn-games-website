// Enchant a Weapon — GDD 기반 프로젝트 상세 콘텐츠 (KO / EN / JA).
window.ProjectDetailConfigs = window.ProjectDetailConfigs || {};

window.ProjectDetailConfigs['enchanted-weapon'] = {
    "seo": {
        "title": {
            "ko": "Enchant a Weapon - NNN GAMES",
            "en": "Enchant a Weapon - NNN GAMES",
            "ja": "Enchant a Weapon - NNN GAMES"
        },
        "description": {
            "ko": "원하는 Limited UGC를 선택하고, 개인 Noob 자동 사냥으로 주문서를 모아 +10 무기 강화와 UGC 교환에 도전하는 Roblox AFK 시뮬레이터입니다.",
            "en": "Choose your desired Limited UGC, farm scrolls through personal Noob auto-combat, and enchant a matching weapon to +10 to exchange it for your reward in this Roblox AFK simulator.",
            "ja": "欲しいLimited UGCを選び、自分専用のNoobとの自動戦闘で巻物を集め、対応する武器を+10まで強化して報酬と交換するRobloxのAFKシミュレーターです。"
        },
        "ogImage": "assets/enchantaweapon/eaw-main.jpg",
        "keywords": {
            "ko": "Roblox, Enchant a Weapon, AFK, Noob 사냥, 무기 강화, 주문서, Limited UGC, NNN GAMES",
            "en": "Roblox, Enchant a Weapon, AFK, Noob hunting, weapon enhancement, scrolls, Limited UGC, NNN GAMES",
            "ja": "Roblox, Enchant a Weapon, AFK, Noob狩り, 武器強化, 巻物, Limited UGC, NNN GAMES"
        }
    },
    "hero": {
        "title": {
            "ko": "Enchant a Weapon",
            "en": "Enchant a Weapon",
            "ja": "Enchant a Weapon"
        },
        "tagline": {
            "ko": "원하는 Limited UGC를 선택하고, 개인 Noob 자동 사냥으로 주문서를 모아 +10 무기 강화와 UGC 교환에 도전하는 Roblox AFK 시뮬레이터입니다.",
            "en": "Choose your desired Limited UGC, farm scrolls through personal Noob auto-combat, and enchant a matching weapon to +10 to exchange it for your reward in this Roblox AFK simulator.",
            "ja": "欲しいLimited UGCを選び、自分専用のNoobとの自動戦闘で巻物を集め、対応する武器を+10まで強化して報酬と交換するRobloxのAFKシミュレーターです。"
        },
        "genre": {
            "ko": "장르: AFK · 시뮬레이터 · 무기 강화 · Limited UGC 수집",
            "en": "Genre: AFK · Simulator · Weapon Enhancement · Limited UGC Collection",
            "ja": "ジャンル: AFK・シミュレーター・武器強化・Limited UGC収集"
        },
        "platform": {
            "ko": "플랫폼: Roblox",
            "en": "Platform: Roblox",
            "ja": "プラットフォーム: Roblox"
        },
        "status": {
            "ko": "개발 중 · 2026년 10월 출시 예정",
            "en": "In development · Expected October 2026",
            "ja": "開発中・2026年10月公開予定"
        }
    },
    "snapshot": {
        "launch": {
            "ko": "2026년 10월 출시 예정",
            "en": "Expected October 2026",
            "ja": "2026年10月公開予定"
        },
        "status": {
            "ko": "개발 중",
            "en": "In development",
            "ja": "開発中"
        },
        "client": {
            "ko": "자체 개발",
            "en": "Internal Project",
            "ja": "自社開発"
        },
        "stack": {
            "ko": "Roblox Studio / Luau",
            "en": "Roblox Studio / Luau",
            "ja": "Roblox Studio / Luau"
        }
    },
    "media": {
        "type": "image",
        "src": "assets/enchantaweapon/eaw-main.jpg",
        "alt": {
            "ko": "마법진 위의 검과 주문서를 든 캐릭터",
            "en": "A floating sword and a character holding a scroll",
            "ja": "魔法陣に浮かぶ剣と巻物を持つキャラクター"
        }
    },
    "mode": "standard",
    "overview": [
        {
            "ko": "Enchant a Weapon은 갖고 싶은 Limited UGC를 먼저 선택하고, 그 보상과 연결된 게임 내 무기를 +10까지 강화하는 AFK 시뮬레이터입니다. UGC Reward Wall에서 남은 재고와 보상 디자인을 확인해 목표를 정합니다. 같은 강화 수치의 무기는 전투 성능이 같아, 성능보다 원하는 UGC 디자인을 기준으로 선택할 수 있습니다.",
            "en": "Enchant a Weapon is an AFK simulator where you first choose a Limited UGC reward and enhance its matching in-game weapon to +10. Check reward designs and remaining stock at the UGC Reward Wall. Weapons at the same enchant level share the same combat performance, so you can choose the UGC design you want.",
            "ja": "Enchant a Weaponは、欲しいLimited UGCを先に選び、対応するゲーム内武器を+10まで強化するAFKシミュレーターです。UGC Reward Wallでデザインと残り在庫を確認して目標を決定。同じ強化値の武器は戦闘性能も同じなので、欲しいデザインを基準に選べます。"
        },
        {
            "ko": "Noob Hunt Zone에서는 자신에게만 보이는 개인 Noob을 자동으로 공격합니다. 공격할 때마다 포인트를 얻고, 처치하면 추가 포인트와 확률에 따른 주문서·물약 드랍을 얻습니다. 모은 포인트로 주문서를 구매하고, 무기를 강화한 뒤 다시 사냥하는 흐름을 반복합니다. 강화 수치가 높아질수록 공격력이 증가하고 더 큰 Noob을 만날 가능성도 높아집니다.",
            "en": "In the Noob Hunt Zone, automatically attack personal Noobs visible only to you. Each attack earns points; defeats grant additional points and a chance of scroll or potion drops. Spend points on scrolls, enchant your weapon, and return to hunting. Higher enchant levels increase damage and the chance of encountering larger Noobs.",
            "ja": "Noob Hunt Zoneでは、自分だけに見えるNoobを自動で攻撃します。攻撃ごとにポイントを獲得し、倒すと追加ポイントと確率による巻物・ポーションのドロップが得られます。ポイントで巻物を買い、武器を強化して再び狩りへ。強化値が上がると攻撃力が増し、大きなNoobと出会う確率も高まります。"
        },
        {
            "ko": "무기 강화는 주문서로만 진행하며, NetHack에서 영감을 받은 일반·축복·저주 주문서 전략을 사용합니다. 일반 주문서는 +6까지 확정적으로 강화하고, +7을 노리는 시도부터 무기 소멸 위험이 생깁니다. 축복 주문서로 여러 단계를 올리거나 저주 주문서로 수치를 낮춰 다시 도전할 수 있어, 주문서 선택과 강화 시점이 중요합니다.",
            "en": "Enhancement uses scrolls exclusively, with normal, blessed, and cursed scroll strategies inspired by NetHack. Normal scrolls guarantee upgrades through +6; attempts to reach +7 and beyond risk destroying the weapon. Blessed scrolls can raise multiple levels, while cursed scrolls lower a level to set up another attempt.",
            "ja": "強化は巻物のみで行い、NetHackに着想を得た通常・祝福・呪いの巻物を使い分けます。通常の巻物は+6まで確実に強化でき、+7を目指す挑戦から武器消滅のリスクが発生。祝福の巻物で複数段階を上げたり、呪いの巻物で強化値を下げて再挑戦したりと、使い方が重要です。"
        },
        {
            "ko": "+10은 강화의 마지막 단계이자 Limited UGC 교환권입니다. +10 무기는 추가 강화와 Noob 사냥에 사용할 수 없습니다. 보상 재고가 남아 있을 때 무기를 제출하면 해당 무기가 소모되고, 연결된 Limited UGC와 업적·도감 기록·UGC 획득 랭킹 포인트를 받습니다. +10 달성만으로 도감에 등록되지는 않으며, 교환을 마친 뒤 다음 UGC에 도전합니다.",
            "en": "+10 is the final enhancement state and a Limited UGC exchange ticket. A +10 weapon cannot be enhanced further or used for Noob hunting. Submit it while reward stock is available: the weapon is consumed and you receive its linked Limited UGC, achievement, collection entry, and UGC ranking points. Reaching +10 alone does not register a collection entry. After claiming, choose your next reward.",
            "ja": "+10は強化の最終段階であり、Limited UGCの交換券です。追加強化やNoob狩りには使えません。在庫がある報酬に武器を提出すると、武器は消費され、対応するLimited UGC、実績、図鑑登録、UGC獲得ランキングポイントが付与されます。+10達成だけでは図鑑に登録されず、交換後に次のUGCへ挑戦します。"
        }
    ],
    "highlights": [
        {
            "eyebrow": {
                "ko": "Choose Your UGC",
                "en": "Choose Your UGC",
                "ja": "Choose Your UGC"
            },
            "title": {
                "ko": "내가 원하는 보상을 먼저 선택",
                "en": "Choose your reward first",
                "ja": "欲しい報酬を先に選択"
            },
            "description": {
                "ko": "UGC Reward Wall에서 원하는 Limited UGC를 고르면 연결된 무기가 강화 목표가 됩니다. 한정 재고를 확인하며 원하는 아바타 아이템에 도전합니다.",
                "en": "Choose a Limited UGC at the Reward Wall and its matching weapon becomes your enhancement target. Check limited stock as you pursue your desired avatar item.",
                "ja": "Reward Wallで欲しいLimited UGCを選ぶと、対応武器が強化の目標になります。在庫を確認しながら欲しいアバターアイテムに挑戦します。"
            }
        },
        {
            "eyebrow": {
                "ko": "AFK & Enchant",
                "en": "AFK & Enchant",
                "ja": "AFK & Enchant"
            },
            "title": {
                "ko": "자동 사냥에서 주문서 강화까지",
                "en": "From AFK hunting to scroll enhancement",
                "ja": "自動狩りから巻物強化へ"
            },
            "description": {
                "ko": "개인 Noob 자동 사냥으로 포인트와 드랍을 모으고 주문서를 마련합니다. 사냥 → 주문서 → 강화 → 더 효율적인 사냥으로 이어지는 성장 흐름을 즐깁니다.",
                "en": "Farm points and drops from personal Noobs to obtain scrolls. Follow a growth loop of hunting, scrolls, enchantment, and more efficient hunting.",
                "ja": "自分専用のNoobからポイントやドロップを集めて巻物を入手。狩り、巻物、強化、より効率的な狩りへと成長がつながります。"
            }
        },
        {
            "eyebrow": {
                "ko": "+10 & Claim",
                "en": "+10 & Claim",
                "ja": "+10 & Claim"
            },
            "title": {
                "ko": "+10 무기를 실제 Limited UGC로 교환",
                "en": "Exchange a +10 weapon for Limited UGC",
                "ja": "+10武器をLimited UGCに交換"
            },
            "description": {
                "ko": "소멸 위험을 넘어 +10에 성공하면 무기가 교환권으로 바뀝니다. 재고가 있는 UGC로 교환을 완료해야 업적과 도감, UGC 획득 랭킹에 반영됩니다.",
                "en": "Overcome destruction risk to reach +10 and turn your weapon into an exchange ticket. Complete a claim while stock is available to earn the achievement, collection entry, and UGC ranking points.",
                "ja": "消滅リスクを乗り越えて+10に達すると武器が交換券に。在庫のあるUGCとの交換完了で、実績・図鑑・UGC獲得ランキングに反映されます。"
            }
        }
    ],
    "features": [
        {
            "title": {
                "ko": "Small · Big · Giant Noob",
                "en": "Small · Big · Giant Noobs",
                "ja": "Small・Big・Giant Noob"
            },
            "description": {
                "ko": "세 크기의 개인 Noob을 상대합니다. 강화 수치에 따라 공격력과 등장 비율이 달라지고, 큰 Noob일수록 처치 보상이 높습니다.",
                "en": "Face three sizes of personal Noobs. Enchant level affects damage and spawn weights, with larger Noobs offering higher defeat rewards.",
                "ja": "3サイズの自分専用Noobと戦います。強化値によって攻撃力と出現率が変わり、大きいNoobほど討伐報酬が高くなります。"
            }
        },
        {
            "title": {
                "ko": "일반·축복·저주 주문서 전략",
                "en": "Normal, blessed, and cursed scrolls",
                "ja": "通常・祝福・呪いの巻物"
            },
            "description": {
                "ko": "일반은 기본 강화, 축복은 조건에 따라 여러 단계 상승, 저주는 수치 -1입니다. +5에서 축복으로 +7을 노리고, +6이면 저주로 +5로 낮춰 재도전할 수 있습니다.",
                "en": "Normal scrolls provide basic upgrades, blessed scrolls can grant multiple levels, and cursed scrolls reduce the level by one. At +5, try a blessed scroll for +7; if it yields +6, use a cursed scroll to reset to +5 and retry.",
                "ja": "通常は基本強化、祝福は条件により複数段階上昇、呪いは強化値を1下げます。+5から祝福で+7を狙い、+6なら呪いで+5に戻して再挑戦できます。"
            }
        },
        {
            "title": {
                "ko": "+6까지 안전, +7부터 소멸 위험",
                "en": "Safe through +6, destruction risk from +7",
                "ja": "+6までは安全、+7から消滅リスク"
            },
            "description": {
                "ko": "일반 주문서는 +6까지 100% 성공합니다. +6→+7부터 +8→+9까지는 성공 33.33%·소멸 66.67%, +9→+10은 성공 3.70%·변화 없음 29.63%·소멸 66.67%로 기획되어 있습니다.",
                "en": "Normal scrolls succeed 100% through +6. From +6→+7 through +8→+9, the design specifies 33.33% success and 66.67% destruction. At +9→+10: 3.70% success, 29.63% no change, and 66.67% destruction.",
                "ja": "通常の巻物は+6まで成功率100%。+6→+7から+8→+9は成功33.33%・消滅66.67%、+9→+10は成功3.70%・変化なし29.63%・消滅66.67%で設計されています。"
            }
        },
        {
            "title": {
                "ko": "물약과 강화방어권",
                "en": "Potions and enchant protection",
                "ja": "ポーションと強化保護券"
            },
            "description": {
                "ko": "초록·용기 물약은 공격 간격을 줄여 사냥을 가속합니다. 강화방어권은 한 번의 강화 시도에서 무기 소멸을 막으며, 성공률을 높이거나 성공을 보장하지 않습니다.",
                "en": "Green and Courage potions shorten attack intervals to speed up hunting. A protection ticket prevents destruction for one enhancement attempt; it neither raises success rates nor guarantees success.",
                "ja": "Green・Courageポーションは攻撃間隔を短縮。強化保護券は1回の挑戦で武器消滅を防ぎますが、成功率を上げたり成功を保証したりはしません。"
            }
        },
        {
            "title": {
                "ko": "교환 완료로 채우는 도감과 업적",
                "en": "Collection and achievements after claiming",
                "ja": "交換完了で図鑑と実績を獲得"
            },
            "description": {
                "ko": "+10 무기를 제출해 UGC 지급이 완료되면 도감에 기록됩니다. 강화 성공만으로는 등록되지 않으며, 새로운 UGC를 목표로 수집을 이어갑니다.",
                "en": "Collection entries are added after submitting a +10 weapon and receiving its UGC, rather than on enhancement success alone. Continue collecting by selecting another UGC goal.",
                "ja": "+10武器を提出してUGCを受け取ると図鑑に登録されます。強化成功だけでは登録されず、次のUGCを目標に収集を続けます。"
            }
        },
        {
            "title": {
                "ko": "성공·실패·UGC 획득, 세 가지 랭킹",
                "en": "Three rankings: success, failure, and UGC claims",
                "ja": "成功・失敗・UGC獲得の3ランキング"
            },
            "description": {
                "ko": "강화 성공은 도달 수치, 실패 소멸은 잃은 무기의 강화 수치를 누적합니다. UGC 교환은 별도의 획득 랭킹에 반영되어 성공과 실패 모두 도전 기록으로 남습니다.",
                "en": "Successful enchantments accumulate the resulting level; destroyed weapons accumulate their lost level in the failure ranking. UGC claims count toward a separate ranking, so both success and failure leave a record.",
                "ja": "強化成功は到達値、消滅による失敗は失った武器の強化値を累積。UGC交換は別の獲得ランキングに反映され、成功も失敗も挑戦の記録になります。"
            }
        }
    ],
    "gallery": [
        {
            "src": "assets/enchantaweapon/eaw-gallery-1.jpg",
            "alt": {
                "ko": "대장간에서 검을 +10으로 강화하는 콘셉트 이미지",
                "en": "Concept artwork of a sword being enhanced from +0 to +10 at a forge",
                "ja": "鍛冶場で剣を+10に強化するコンセプトアート"
            }
        },
        {
            "src": "assets/enchantaweapon/eaw-gallery-2.jpg",
            "alt": {
                "ko": "주문서로 보라색 도끼를 강화하는 콘셉트 이미지",
                "en": "Concept artwork of a purple axe being enchanted with a scroll",
                "ja": "巻物で紫色の斧を強化するコンセプトアート"
            }
        },
        {
            "src": "assets/enchantaweapon/eaw-gallery-3.jpg",
            "alt": {
                "ko": "+10 무기와 무료 UGC를 소개하는 콘셉트 이미지",
                "en": "Concept artwork featuring a +10 weapon and free UGC",
                "ja": "+10の武器と無料UGCを紹介するコンセプトアート"
            }
        }
    ]
};

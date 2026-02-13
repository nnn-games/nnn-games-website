#!/usr/bin/env node
/**
 * Roblox metrics updater
 * - Fetches visits / playing / favorites / likeRatio for projects with universeId
 * - Updates data/projects.json in-place
 *
 * Usage: node scripts/update-metrics.js
 * Optional: add to build pipeline before static build
 */

const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '..', 'data', 'projects.json');
const COMMUNITY_PATH = path.join(__dirname, '..', 'data', 'communities.json');
const ROBLOX_API_BASE = 'https://games.roblox.com/v1/games';
const GROUP_API_BASE = 'https://groups.roblox.com/v1/groups';
const GROUP_ICON_API = 'https://thumbnails.roblox.com/v1/groups/icons';

// 커뮤니티 구성 (main.js와 동일 순서/ID를 유지)
const COMMUNITY_GROUPS = [
  {
    id: '294985728',
    url: 'https://www.roblox.com/communities/294985728/NNN-PLAY#!/about',
    nameFallback: 'NNN PLAY'
  },
  {
    id: '937186626',
    url: 'https://www.roblox.com/ko/communities/937186626/NNN-FUN#!/about',
    nameFallback: 'NNN FUN'
  },
  {
    id: '34453707',
    url: 'https://www.roblox.com/share/g/34453707',
    nameFallback: 'NNN UGC'
  },
  {
    id: '916094546',
    url: 'https://www.roblox.com/communities/916094546/NNN-Weapon-Master#!/about',
    nameFallback: 'NNN Weapon Master'
  }
];

async function fetchJson(url) {
  const res = await fetch(url, { headers: { accept: 'application/json' } });
  if (!res.ok) {
    throw new Error(`Fetch failed: ${res.status} ${res.statusText} for ${url}`);
  }
  return res.json();
}

async function main() {
  const raw = fs.readFileSync(DATA_PATH, 'utf-8');
  const data = JSON.parse(raw);
  const projects = Array.isArray(data.all) ? data.all : [];

  const universes = projects
    .map((p) => p.universeId)
    .filter((id) => typeof id === 'string' && id.trim().length > 0);

  if (universes.length === 0) {
    console.log('No universeId found. Nothing to update.');
    return;
  }

  const uniqueIds = [...new Set(universes)];
  const idsParam = uniqueIds.join(',');

  // Fetch summary (visits/playing/favorites)
  const gamesUrl = `${ROBLOX_API_BASE}?universeIds=${idsParam}`;
  // Fetch votes (up/down) for like ratio
  const votesUrl = `${ROBLOX_API_BASE}/votes?universeIds=${idsParam}`;

  const [gamesRes, votesRes] = await Promise.all([
    fetchJson(gamesUrl),
    fetchJson(votesUrl),
  ]);

  const gamesById = new Map();
  if (Array.isArray(gamesRes.data)) {
    for (const g of gamesRes.data) {
      gamesById.set(String(g.id), g);
    }
  }

  const votesById = new Map();
  if (Array.isArray(votesRes.data)) {
    for (const v of votesRes.data) {
      votesById.set(String(v.id), v);
    }
  }

  const now = new Date().toISOString();
  for (const project of projects) {
    const uId = project.universeId && String(project.universeId);
    if (!uId) continue;

    const g = gamesById.get(uId);
    const v = votesById.get(uId);

    const visits = g?.visits ?? null;
    const playing = g?.playing ?? null;
    const favorites = g?.favoritedCount ?? null;

    let likeRatio = null;
    if (v && typeof v.upVotes === 'number' && typeof v.downVotes === 'number') {
      const total = v.upVotes + v.downVotes;
      likeRatio = total > 0 ? v.upVotes / total : null;
    }

    project.metrics = {
      visits: typeof visits === 'number' ? visits : null,
      playing: typeof playing === 'number' ? playing : null,
      favorites: typeof favorites === 'number' ? favorites : null,
      likeRatio: typeof likeRatio === 'number' ? likeRatio : null,
      updatedAt: now,
    };
  }

  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2) + '\n', 'utf-8');
  console.log(`Updated metrics for ${projects.length} projects at ${now}`);

  // 커뮤니티 지표 업데이트 (아이콘 + 멤버수)
  try {
    const communityPayload = await updateCommunities(COMMUNITY_GROUPS, now);
    fs.writeFileSync(COMMUNITY_PATH, JSON.stringify(communityPayload, null, 2) + '\n', 'utf-8');
    console.log(`Updated community metrics for ${communityPayload.groups.length} groups at ${now}`);
  } catch (err) {
    console.warn('Community metrics update failed:', err.message);
  }
}

async function updateCommunities(groupsConfig, nowIso) {
  const ids = groupsConfig.map((g) => g.id);

  const [infos, icons] = await Promise.all([
    fetchGroupInfos(ids),
    fetchGroupIcons(ids).catch(() => new Map()) // 아이콘 실패 시 null로 처리
  ]);

  let totalMembers = 0;
  const groups = groupsConfig.map((cfg) => {
    const info = infos.get(cfg.id) || {};
    const memberCount = typeof info.memberCount === 'number' ? info.memberCount : null;
    const name = info.name || cfg.nameFallback;
    if (typeof memberCount === 'number') totalMembers += memberCount;
    return {
      id: cfg.id,
      name,
      url: cfg.url,
      memberCount,
      icon: icons.get(cfg.id) || null,
      updatedAt: nowIso
    };
  });

  return {
    groups,
    totalMembers,
    updatedAt: nowIso
  };
}

async function fetchGroupInfos(ids) {
  const results = await Promise.all(
    ids.map((id) =>
      fetch(`${GROUP_API_BASE}/${id}`, { headers: { accept: 'application/json' } })
        .then((res) => (res.ok ? res.json() : null))
        .catch(() => null)
    )
  );
  const map = new Map();
  results.forEach((info) => {
    if (info && info.id) map.set(String(info.id), info);
  });
  return map;
}

async function fetchGroupIcons(ids) {
  const url = `${GROUP_ICON_API}?groupIds=${ids.join(',')}&size=150x150&format=Png&isCircular=false`;
  const res = await fetch(url, { headers: { accept: 'application/json' } });
  if (!res.ok) throw new Error(`Group icon fetch failed: ${res.status} ${res.statusText}`);
  const json = await res.json();
  const map = new Map();
  (json.data || []).forEach((item) => {
    if (item && item.targetId) {
      map.set(String(item.targetId), item.imageUrl);
    }
  });
  return map;
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});

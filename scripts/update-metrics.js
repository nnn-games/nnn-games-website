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
const COMMUNITY_CONFIG_PATH = path.join(__dirname, '..', 'data', 'community-groups.json');
const ROBLOX_API_BASE = 'https://games.roblox.com/v1/games';
const GROUP_API_BASE = 'https://groups.roblox.com/v1/groups';
const GROUP_ICON_API = 'https://thumbnails.roblox.com/v1/groups/icons';

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function hasText(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function getProjectReporting(project) {
  return project && typeof project.reporting === 'object' && project.reporting
    ? project.reporting
    : {};
}

function isActiveProject(project) {
  return project && project.status === 'active';
}

function shouldCollectProjectMetrics(project) {
  const reporting = getProjectReporting(project);
  const hasUniverseId = hasText(project && project.universeId);

  if (typeof reporting.collectMetrics === 'boolean') {
    return reporting.collectMetrics && hasUniverseId;
  }

  return isActiveProject(project) && hasUniverseId;
}

function shouldIncludeProjectInHeroProjectCount(project) {
  const reporting = getProjectReporting(project);
  const include = typeof reporting.includeInHeroProjectCount === 'boolean'
    ? reporting.includeInHeroProjectCount
    : true;
  return isActiveProject(project) && include;
}

function shouldIncludeProjectInHeroVisitTotal(project) {
  const reporting = getProjectReporting(project);
  const include = typeof reporting.includeInHeroVisitTotal === 'boolean'
    ? reporting.includeInHeroVisitTotal
    : true;
  return isActiveProject(project) && include;
}

function buildProjectsSummary(projects, nowIso) {
  const heroProjects = projects.filter(shouldIncludeProjectInHeroProjectCount);
  const heroVisitProjects = projects.filter(shouldIncludeProjectInHeroVisitTotal);
  const totalVisits = heroVisitProjects.reduce((sum, project) => {
    const visits = project && project.metrics && typeof project.metrics.visits === 'number'
      ? project.metrics.visits
      : 0;
    return sum + visits;
  }, 0);

  return {
    hero: {
      projectCount: heroProjects.length,
      projectIds: heroProjects.map((project) => project.id),
      totalVisits,
      visitProjectIds: heroVisitProjects.map((project) => project.id),
      updatedAt: nowIso
    }
  };
}

function loadCommunityConfig() {
  const json = readJson(COMMUNITY_CONFIG_PATH);
  return Array.isArray(json.groups) ? json.groups : [];
}

function getCommunityNameFallback(group) {
  if (group && group.names) {
    return group.names.ko || group.names.en || group.names.ja || 'Community';
  }
  return 'Community';
}

function isActiveCommunity(group) {
  return group && group.status === 'active';
}

function shouldShowCommunityOnHomepage(group) {
  const show = typeof group.showOnHomepage === 'boolean' ? group.showOnHomepage : true;
  return isActiveCommunity(group) && show;
}

function shouldIncludeCommunityInHeroTotal(group) {
  const include = typeof group.includeInHeroSubscriberTotal === 'boolean'
    ? group.includeInHeroSubscriberTotal
    : true;
  return isActiveCommunity(group) && include;
}

async function fetchJson(url) {
  const res = await fetch(url, { headers: { accept: 'application/json' } });
  if (!res.ok) {
    throw new Error(`Fetch failed: ${res.status} ${res.statusText} for ${url}`);
  }
  return res.json();
}

async function main() {
  const data = readJson(DATA_PATH);
  const communityConfig = loadCommunityConfig();
  const projects = Array.isArray(data.all) ? data.all : [];
  const metricTargets = projects.filter(shouldCollectProjectMetrics);

  const universes = metricTargets
    .map((p) => p.universeId)
    .filter(hasText);

  const now = new Date().toISOString();
  const uniqueIds = [...new Set(universes)];

  if (uniqueIds.length > 0) {
    const idsParam = uniqueIds.join(',');
    const gamesUrl = `${ROBLOX_API_BASE}?universeIds=${idsParam}`;
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

    for (const project of metricTargets) {
      const uId = String(project.universeId);
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
  } else {
    console.log('No project matched the metric collection rule. Skipping Roblox game fetch.');
  }

  data.summary = buildProjectsSummary(projects, now);
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2) + '\n', 'utf-8');
  console.log(`Updated metrics for ${metricTargets.length} projects at ${now}`);

  // 커뮤니티 지표 업데이트 (아이콘 + 멤버수)
  try {
    const communityPayload = await updateCommunities(communityConfig, now);
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
    const name = info.name || getCommunityNameFallback(cfg);
    if (typeof memberCount === 'number' && shouldIncludeCommunityInHeroTotal(cfg)) {
      totalMembers += memberCount;
    }

    return {
      id: cfg.id,
      names: cfg.names || null,
      name,
      url: cfg.url,
      status: cfg.status || 'inactive',
      showOnHomepage: typeof cfg.showOnHomepage === 'boolean' ? cfg.showOnHomepage : true,
      includeInHeroSubscriberTotal: typeof cfg.includeInHeroSubscriberTotal === 'boolean'
        ? cfg.includeInHeroSubscriberTotal
        : true,
      memberCount,
      icon: icons.get(cfg.id) || null,
      updatedAt: nowIso
    };
  });

  return {
    groups,
    totals: {
      heroSubscriberCount: totalMembers,
      homepageGroupIds: groups.filter(shouldShowCommunityOnHomepage).map((group) => group.id)
    },
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

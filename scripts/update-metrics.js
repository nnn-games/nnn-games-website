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
const ROBLOX_API_BASE = 'https://games.roblox.com/v1/games';

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
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});

// 운영 빌드는 active만, 개발 감시 모드는 draft까지 포함한다.
const fs = require('fs');
const path = require('path');

function loadDecks(root, { includeDraft = false } = {}) {
  const registry = JSON.parse(fs.readFileSync(path.join(root, 'decks', 'decks.json'), 'utf8'));
  if (!Array.isArray(registry.decks)) throw new Error('decks.json: decks 배열이 필요합니다.');
  for (const deck of registry.decks) {
    if (!deck || typeof deck.slug !== 'string' || !['active', 'draft', 'archived'].includes(deck.status)) {
      throw new Error('decks.json: 각 덱에 slug와 active/draft/archived 상태가 필요합니다.');
    }
  }
  return registry.decks.filter((deck) => deck.status === 'active' || (includeDraft && deck.status === 'draft'));
}

module.exports = { loadDecks };

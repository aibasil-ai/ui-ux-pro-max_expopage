function normalizeTokens(value: string) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length > 2);
}

export function scorePhraseMatch(phrase: string, candidate: string) {
  const left = String(phrase || '').trim().toLowerCase();
  const right = String(candidate || '').trim().toLowerCase();

  if (!left || !right) {
    return 0;
  }

  if (left === right) {
    return 1.6;
  }

  if (left.includes(right) || right.includes(left)) {
    return 1.25;
  }

  const leftTokens = new Set(normalizeTokens(left));
  const rightTokens = normalizeTokens(right);
  if (rightTokens.length === 0) {
    return 0;
  }

  const shared = rightTokens.filter((token) => leftTokens.has(token)).length;
  return shared / rightTokens.length;
}

export function tokenizeText(value: string) {
  return normalizeTokens(value);
}

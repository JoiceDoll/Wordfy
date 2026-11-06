/** Classic edit distance between two strings (insert / delete / substitute). */
export function levenshteinDistance(a: string, b: string): number {
  if (a === b) {
    return 0;
  }
  if (a.length === 0) {
    return b.length;
  }
  if (b.length === 0) {
    return a.length;
  }

  const rows = a.length + 1;
  const cols = b.length + 1;
  const prev = new Array<number>(cols);
  const curr = new Array<number>(cols);

  for (let j = 0; j < cols; j += 1) {
    prev[j] = j;
  }

  for (let i = 1; i < rows; i += 1) {
    curr[0] = i;
    const aChar = a.charCodeAt(i - 1);

    for (let j = 1; j < cols; j += 1) {
      const cost = aChar === b.charCodeAt(j - 1) ? 0 : 1;
      curr[j] = Math.min(
        prev[j]! + 1,
        curr[j - 1]! + 1,
        prev[j - 1]! + cost,
      );
    }

    for (let j = 0; j < cols; j += 1) {
      prev[j] = curr[j]!;
    }
  }

  return prev[b.length]!;
}

/** Allowed typos grow slightly with longer queries; short queries stay exact. */
export function maxEditDistanceForQuery(query: string): number {
  const length = query.trim().length;
  if (length < 3) {
    return 0;
  }
  if (length <= 5) {
    return 1;
  }
  return 2;
}

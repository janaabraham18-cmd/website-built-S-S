// Wraps one chosen word (or short phrase) inside `text` in an accent-colored
// span — the site's "personal touch" device for headings: pick a single
// meaningful word per heading rather than a generic default (see CLAUDE.md
// for the selection rules). Safe to use with `set:html` since every caller
// passes our own static/data-driven copy, never user input.
export function hl(text: string, word: string): string {
  // A single-word heading (word === the whole text) stays plain black —
  // the accent only reads as "one word picked out of several," so pass ''
  // for those instead of the whole string.
  if (!word) return text;
  const idx = text.indexOf(word);
  if (idx === -1) return text;
  return `${text.slice(0, idx)}<span class="accent-word">${word}</span>${text.slice(idx + word.length)}`;
}

export type NoteName = 'E' | 'F' | 'G' | 'A' | 'B' | 'C\'' | 'D\'';

export interface MusicalSymbol {
  id: string;
  name: string;
  symbol: string;
  value: number | string;
  type: 'note' | 'rest' | 'term';
  audioFreq?: number;
}

export const MUSICAL_SYMBOLS: MusicalSymbol[] = [
  { id: 'sb', name: 'Semibreve', symbol: '𝅝', value: 4, type: 'note' },
  { id: 'm', name: 'Minim', symbol: '𝅗𝅥', value: 2, type: 'note' },
  { id: 'k', name: 'Krocet', symbol: '𝅘𝅥', value: 1, type: 'note' },
  { id: 'kv', name: 'Kuaver', symbol: '𝅘𝅥𝅮', value: 0.5, type: 'note' },
  { id: 'rsb', name: 'Tanda Rehat Semibreve', symbol: '𝄻', value: 4, type: 'rest' },
  { id: 'rm', name: 'Tanda Rehat Minim', symbol: '𝄼', value: 2, type: 'rest' },
  { id: 'rk', name: 'Tanda Rehat Krocet', symbol: '𝄽', value: 1, type: 'rest' },
  { id: 'rkv', name: 'Tanda Rehat Kuaver', symbol: '𝄾', value: 0.5, type: 'rest' },
];

export const TERMINOLOGIES: MusicalSymbol[] = [
  { id: 'p', name: 'Piano', symbol: '𝒑', value: 'Lembut', type: 'term' },
  { id: 'f', name: 'Forte', symbol: '𝒇', value: 'Kuat', type: 'term' },
  { id: 'stac', name: 'Staccato', symbol: '•', value: 'Pendek/Terputus', type: 'term' },
  { id: 'leg', name: 'Legato', symbol: '⌒', value: 'Berangkai/Lancar', type: 'term' },
];

export const STAFF_NOTES: MusicalSymbol[] = [
  { id: 'e4', name: 'E', symbol: 'E', value: 0, type: 'note', audioFreq: 329.63 },
  { id: 'f4', name: 'F', symbol: 'F', value: 1, type: 'note', audioFreq: 349.23 },
  { id: 'g4', name: 'G', symbol: 'G', value: 2, type: 'note', audioFreq: 392.00 },
  { id: 'a4', name: 'A', symbol: 'A', value: 3, type: 'note', audioFreq: 440.00 },
  { id: 'b4', name: 'B', symbol: 'B', value: 4, type: 'note', audioFreq: 493.88 },
  { id: 'c5', name: 'C\'', symbol: 'C\'', value: 5, type: 'note', audioFreq: 523.25 },
  { id: 'd5', name: 'D\'', symbol: 'D\'', value: 6, type: 'note', audioFreq: 587.33 },
];

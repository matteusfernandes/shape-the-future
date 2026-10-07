const DIACRITICS = new RegExp('[\\u0300-\\u036f]', 'g');

// Remove acentos e padroniza caixa para comparar nomes
export const normalizeText = (value: unknown) =>
  String(value ?? '')
    .normalize('NFD')
    .replace(DIACRITICS, '')
    .trim()
    .toUpperCase();

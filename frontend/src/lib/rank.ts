/* ------------- rank.ts ------------- */
export const LS_KEY = "dueto_rank";

/* Carrega ranking do localStorage */
export function loadRank<T = any>(): T[] {
  try { return JSON.parse(localStorage.getItem(LS_KEY) ?? "[]"); }
  catch { return []; }
}

/* Salva ranking */
export function saveRank(data: unknown) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(data)); }
  catch { /* ignore quota errors */ }
}

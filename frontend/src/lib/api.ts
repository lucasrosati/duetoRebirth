// frontend/src/lib/api.ts
// -----------------------------------------------------------
// rotas do backend C (porta 8888) + fallback em localStorage
// -----------------------------------------------------------
const BACKEND_URL = "http://localhost:8888";
const LS_KEY      = "duetoRanking";

// ---------- utilidades localStorage ----------
function readLS<T = any>(): T[] {
  try   { return JSON.parse(localStorage.getItem(LS_KEY) ?? "[]") as T[]; }
  catch { return []; }
}
function writeLS(list: unknown[]) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(list)); } catch {/*ignore*/}
}

// ---------- /palavras ----------
export interface WordsResponse { palavra1: string; palavra2: string; }

export async function fetchWords(): Promise<WordsResponse> {
  const res = await fetch(`${BACKEND_URL}/palavras`);
  if (!res.ok) throw new Error("backend");
  return res.json();
}

// ---------- /tentativa ----------
export interface GuessResponse { acertos: number; }        // 0 | 1 | 2

export async function submitGuess(guess: string): Promise<GuessResponse> {
  const res = await fetch(`${BACKEND_URL}/tentativa`, {
    method : "POST",
    headers: { "Content-Type": "application/json" },
    body   : JSON.stringify({ tentativa: guess })         // <-- nome que o C espera
  });
  if (!res.ok) throw new Error("backend");
  return res.json();
}

// ---------- /ranking ----------
export interface RankingEntry { name: string; score: number; attempts: number; }

export async function fetchRanking(): Promise<RankingEntry[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/ranking`);
    if (!res.ok) throw new Error("backend");
    return res.json();
  } catch {
    return readLS<RankingEntry>();                        // fallback
  }
}

export async function postScore(entry: RankingEntry): Promise<void> {
  try {
    const res = await fetch(`${BACKEND_URL}/ranking`, {
      method : "POST",
      headers: { "Content-Type": "application/json" },
      body   : JSON.stringify(entry)
    });
    if (!res.ok) throw new Error("backend");
  } catch {
    /* ----- fallback local ----- */
    const list = readLS<RankingEntry>();
    const idx  = list.findIndex(p => p.name === entry.name);
    if (idx >= 0) list[idx] = entry; else list.push(entry);
    list.sort((a,b) =>
      b.score !== a.score ? b.score - a.score : a.attempts - b.attempts
    );
    writeLS(list);
  }
}

/* aliases p/ manter compatibilidade com código antigo -------- */
export const getWordsFromAPI = fetchWords;
export const getRanking      = fetchRanking;

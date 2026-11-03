// 공공데이터포털 '한국천문연구원_특일 정보' API에서 공휴일을 받아 holidays.json에 합쳐요.
// GitHub Actions에서 HOLIDAY_API_KEY 환경변수(저장소 Secret)로 실행돼요.
// 받아 온 해는 그 해 자료를 통째로 바꾸고, 자료가 아직 없는 해(먼 미래)는 기존 값을 그대로 둬요.
import { readFile, writeFile } from 'node:fs/promises';

const FILE = new URL('../holidays.json', import.meta.url);
const ENDPOINT = 'https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo';
const key = (process.env.HOLIDAY_API_KEY || '').trim();
if (!key) {
  console.log('HOLIDAY_API_KEY가 없어서 건너뛰어요. 저장소 Settings → Secrets에 키를 넣어 주세요.');
  process.exit(0);
}
// 포털은 '인코딩 키'와 '디코딩 키'를 둘 다 줘요. 어느 쪽을 넣어도 되게 처리해요.
const encKey = /%[0-9A-Fa-f]{2}/.test(key) ? key : encodeURIComponent(key);

const now = new Date();
const thisYear = now.getFullYear();
const years = [thisYear - 1, thisYear, thisYear + 1, thisYear + 2];

export function parseItems(json) {
  const body = json?.response?.body;
  const code = json?.response?.header?.resultCode;
  if (code && code !== '00') throw new Error(`API 오류 ${code}: ${json.response.header.resultMsg}`);
  let items = body?.items?.item ?? [];
  if (!Array.isArray(items)) items = items ? [items] : [];
  const out = {};
  for (const it of items) {
    if (it.isHoliday && it.isHoliday !== 'Y') continue;
    const d = String(it.locdate);
    const iso = `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`;
    const name = String(it.dateName || '').trim();
    out[iso] = out[iso] && out[iso] !== name ? `${out[iso]}; ${name}` : name;
  }
  return out;
}

async function fetchYear(y) {
  const url = `${ENDPOINT}?serviceKey=${encKey}&solYear=${y}&numOfRows=100&_type=json`;
  const res = await fetch(url);
  const text = await res.text();
  if (!res.ok) throw new Error(`${y}년 요청 실패 HTTP ${res.status}: ${text.slice(0, 200)}`);
  let json;
  try { json = JSON.parse(text); } catch { throw new Error(`${y}년 응답을 읽지 못했어요: ${text.slice(0, 200)}`); }
  return parseItems(json);
}

async function main() {
  const data = JSON.parse(await readFile(FILE, 'utf8'));
  const hol = { ...data.holidays };
  const done = [];
  for (const y of years) {
    const got = await fetchYear(y);
    const n = Object.keys(got).length;
    if (!n) { console.log(`${y}년: 아직 발표된 자료가 없어 기존 값을 둬요.`); continue; }
    for (const k of Object.keys(hol)) if (k.startsWith(`${y}-`)) delete hol[k];
    Object.assign(hol, got);
    done.push(y);
    console.log(`${y}년: 공휴일 ${n}일`);
  }
  const sorted = Object.fromEntries(Object.entries(hol).sort(([a], [b]) => a.localeCompare(b)));
  const changed = JSON.stringify(sorted) !== JSON.stringify(data.holidays);
  if (!changed) { console.log('바뀐 공휴일이 없어요.'); return; }
  const out = {
    updated: now.toISOString().slice(0, 10),
    source: `한국천문연구원 특일 정보 API (${done.join(', ')}년 반영)`,
    holidays: sorted,
  };
  await writeFile(FILE, JSON.stringify(out, null, 1) + '\n');
  console.log('holidays.json을 갱신했어요.');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(e => { console.error(e.message); process.exit(1); });
}

#!/usr/bin/env node
/**
 * scripts/fetch-scores.js
 * 4개 플랫폼 API에서 AI 도구 트렌드 데이터를 수집하고 public/scores.json 생성
 *
 * 환경 변수:
 *   NAVER_CLIENT_ID, NAVER_CLIENT_SECRET  - 네이버 DataLab 검색어 트렌드
 *   YOUTUBE_API_KEY                        - YouTube Data API v3
 *   GITHUB_TOKEN                           - GitHub API (없으면 60req/h 제한)
 *   (Google Trends는 API 키 불필요)
 *
 * 실행: node scripts/fetch-scores.js
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const googleTrends = require('google-trends-api');

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dir, '..');
const OUTPUT = resolve(ROOT, 'public/scores.json');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ─── 날짜 헬퍼 ──────────────────────────────────────────────────────────────
const today = new Date();
const sevenDaysAgo = new Date(today - 7 * 24 * 60 * 60 * 1000);
const fmtDate = (d) => d.toISOString().split('T')[0];
const startDate = fmtDate(sevenDaysAgo);
const endDate = fmtDate(today);

// ─── 도구 목록 (id, 플랫폼별 검색어) ────────────────────────────────────────
const TOOLS = [
  { id:  1, naverKw:['ChatGPT','챗GPT','챗지피티'],               yt:'ChatGPT',                gt:'ChatGPT',          github:'chatgpt' },
  { id:  2, naverKw:['Claude AI','클로드 AI'],                    yt:'Claude AI Anthropic',    gt:'Claude AI',        github:'claude' },
  { id:  3, naverKw:['Gemini AI','구글 제미나이'],                 yt:'Google Gemini AI',       gt:'Gemini AI',        github:'gemini' },
  { id:  4, naverKw:['DeepSeek','딥시크'],                        yt:'DeepSeek AI',            gt:'DeepSeek',         github:'deepseek' },
  { id:  5, naverKw:['Grok AI','그록'],                           yt:'Grok xAI',               gt:'Grok AI',          github:'grok' },
  { id:  6, naverKw:['Llama Meta AI','메타 라마'],                yt:'Meta Llama',             gt:'Meta Llama',       github:'llama' },
  { id:  7, naverKw:['Mistral AI','미스트랄'],                    yt:'Mistral AI',             gt:'Mistral AI',       github:'mistral' },
  { id:  8, naverKw:['Character AI','캐릭터 AI'],                 yt:'Character AI',           gt:'Character AI',     github:'character-ai' },
  { id:  9, naverKw:['Poe AI','포 AI'],                          yt:'Poe AI Quora',           gt:'Poe AI',           github:'poe' },
  { id: 10, naverKw:['Midjourney','미드저니'],                    yt:'Midjourney AI',          gt:'Midjourney',       github:'midjourney' },
  { id: 11, naverKw:['Stable Diffusion','스테이블 디퓨전'],       yt:'Stable Diffusion',       gt:'Stable Diffusion', github:'stable-diffusion' },
  { id: 12, naverKw:['DALL-E 3','달리 AI'],                      yt:'DALL-E 3 OpenAI',        gt:'DALL-E',           github:'dall-e' },
  { id: 13, naverKw:['Adobe Firefly','어도비 파이어플라이'],       yt:'Adobe Firefly',          gt:'Adobe Firefly',    github:'adobe-firefly' },
  { id: 14, naverKw:['Leonardo AI','레오나르도 AI'],              yt:'Leonardo AI art',        gt:'Leonardo AI',      github:'leonardo-ai' },
  { id: 15, naverKw:['Ideogram AI'],                              yt:'Ideogram AI',            gt:'Ideogram AI',      github:'ideogram' },
  { id: 16, naverKw:['Flux AI','블랙포레스트 AI'],                yt:'Flux AI image',          gt:'Flux AI',          github:'flux' },
  { id: 17, naverKw:['Krea AI'],                                  yt:'Krea AI canvas',         gt:'Krea AI',          github:'krea' },
  { id: 18, naverKw:['GitHub Copilot','깃허브 코파일럿'],         yt:'GitHub Copilot',         gt:'GitHub Copilot',   github:'copilot' },
  { id: 19, naverKw:['Cursor editor','커서 AI'],                  yt:'Cursor AI editor',       gt:'Cursor AI',        github:'cursor' },
  { id: 20, naverKw:['Bolt new','볼트 풀스택'],                   yt:'Bolt.new AI',            gt:'Bolt.new',         github:'bolt' },
  { id: 21, naverKw:['Windsurf Codeium','윈드서프'],              yt:'Windsurf Codeium',       gt:'Windsurf AI',      github:'windsurf' },
  { id: 22, naverKw:['v0 Vercel UI'],                             yt:'v0 Vercel AI UI',        gt:'v0 Vercel',        github:'v0' },
  { id: 23, naverKw:['Replit AI','리플릿 AI'],                   yt:'Replit AI agent',        gt:'Replit AI',        github:'replit' },
  { id: 24, naverKw:['Tabnine','탭나인'],                         yt:'Tabnine AI',             gt:'Tabnine',          github:'tabnine' },
  { id: 25, naverKw:['Sora OpenAI','소라 AI'],                   yt:'OpenAI Sora video',      gt:'OpenAI Sora',      github:'sora' },
  { id: 26, naverKw:['Runway ML','런웨이'],                       yt:'Runway ML Gen-3',        gt:'Runway ML',        github:'runway' },
  { id: 27, naverKw:['Kling AI','클링 AI'],                      yt:'Kling AI video',         gt:'Kling AI',         github:'kling' },
  { id: 28, naverKw:['Pika Labs AI','피카 AI'],                  yt:'Pika Labs AI video',     gt:'Pika Labs',        github:'pika' },
  { id: 29, naverKw:['HeyGen AI','헤이젠'],                       yt:'HeyGen AI avatar',       gt:'HeyGen',           github:'heygen' },
  { id: 30, naverKw:['Luma AI Dream Machine'],                    yt:'Luma AI Dream Machine',  gt:'Luma AI',          github:'luma-ai' },
  { id: 31, naverKw:['Synthesia AI'],                             yt:'Synthesia AI video',     gt:'Synthesia AI',     github:'synthesia' },
  { id: 32, naverKw:['Suno AI music','수노 AI'],                 yt:'Suno AI music',          gt:'Suno AI',          github:'suno' },
  { id: 33, naverKw:['ElevenLabs','일레븐랩스'],                  yt:'ElevenLabs voice clone', gt:'ElevenLabs',       github:'elevenlabs' },
  { id: 34, naverKw:['Udio AI music'],                            yt:'Udio AI music',          gt:'Udio AI',          github:'udio' },
  { id: 35, naverKw:['Descript AI','데스크립트'],                 yt:'Descript AI editor',     gt:'Descript AI',      github:'descript' },
  { id: 36, naverKw:['Perplexity AI','퍼플렉시티'],               yt:'Perplexity AI search',   gt:'Perplexity AI',    github:'perplexity' },
  { id: 37, naverKw:['You.com AI search'],                        yt:'You.com AI',             gt:'You.com AI',       github:'you-com' },
  { id: 38, naverKw:['Elicit AI research'],                       yt:'Elicit AI research',     gt:'Elicit AI',        github:'elicit' },
  { id: 39, naverKw:['Microsoft Copilot','마이크로소프트 코파일럿'], yt:'Microsoft Copilot',   gt:'Microsoft Copilot',github:'microsoft-copilot' },
  { id: 40, naverKw:['Notion AI','노션 AI'],                     yt:'Notion AI features',     gt:'Notion AI',        github:'notion-ai' },
  { id: 41, naverKw:['Gamma AI presentation'],                    yt:'Gamma.app AI slides',    gt:'Gamma AI',         github:'gamma' },
  { id: 42, naverKw:['Otter AI meeting'],                         yt:'Otter.ai meeting notes', gt:'Otter AI',         github:'otter-ai' },
  { id: 43, naverKw:['Fireflies AI meeting'],                     yt:'Fireflies.ai',           gt:'Fireflies AI',     github:'fireflies' },
  { id: 44, naverKw:['Beautiful AI slides'],                      yt:'Beautiful.ai slides',    gt:'Beautiful AI',     github:'beautiful-ai' },
  { id: 45, naverKw:['Make automation','메이크 자동화'],           yt:'Make.com automation',    gt:'Make automation',  github:'make-automation' },
  { id: 46, naverKw:['Zapier AI automation','재피어'],            yt:'Zapier AI',              gt:'Zapier AI',        github:'zapier' },
  { id: 47, naverKw:['n8n workflow automation'],                   yt:'n8n automation',         gt:'n8n automation',   github:'n8n' },
  { id: 48, naverKw:['Canva AI','캔바 AI'],                      yt:'Canva AI design',        gt:'Canva AI',         github:'canva' },
  { id: 49, naverKw:['Figma AI','피그마 AI'],                    yt:'Figma AI features',      gt:'Figma AI',         github:'figma' },
  { id: 50, naverKw:['Uizard AI design'],                         yt:'Uizard AI',              gt:'Uizard AI',        github:'uizard' },
];

// ─── Naver DataLab ────────────────────────────────────────────────────────────
async function fetchNaver(chunk) {
  const clientId = process.env.NAVER_CLIENT_ID;
  const clientSecret = process.env.NAVER_CLIENT_SECRET;
  if (!clientId || !clientSecret) return {};

  const body = JSON.stringify({
    startDate,
    endDate,
    timeUnit: 'date',
    keywordGroups: chunk.map((t) => ({
      groupName: String(t.id),
      keywords: t.naverKw,
    })),
  });

  try {
    const res = await fetch('https://openapi.naver.com/v1/datalab/search', {
      method: 'POST',
      headers: {
        'X-Naver-Client-Id': clientId,
        'X-Naver-Client-Secret': clientSecret,
        'Content-Type': 'application/json',
      },
      body,
    });
    if (!res.ok) throw new Error(`Naver HTTP ${res.status}`);
    const json = await res.json();
    const out = {};
    for (const result of json.results ?? []) {
      const id = Number(result.title);
      const ratios = result.data?.map((d) => d.ratio) ?? [];
      out[id] = ratios.length ? ratios.reduce((s, v) => s + v, 0) / ratios.length : 0;
    }
    return out;
  } catch (e) {
    console.warn('Naver error:', e.message);
    return {};
  }
}

// ─── YouTube ──────────────────────────────────────────────────────────────────
async function fetchYoutube(tool) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) return 0;

  const params = new URLSearchParams({
    q: tool.yt,
    key: apiKey,
    type: 'video',
    part: 'id',
    publishedAfter: sevenDaysAgo.toISOString(),
    maxResults: 1,
  });

  try {
    const res = await fetch(`https://www.googleapis.com/youtube/v3/search?${params}`);
    if (!res.ok) throw new Error(`YouTube HTTP ${res.status}`);
    const json = await res.json();
    return json.pageInfo?.totalResults ?? 0;
  } catch (e) {
    console.warn(`YouTube error [${tool.id}]:`, e.message);
    return 0;
  }
}

// ─── Google Trends (5개씩 배치) ───────────────────────────────────────────────
async function fetchGoogleTrends(chunk) {
  try {
    const keywords = chunk.map((t) => t.gt);
    const raw = await googleTrends.interestOverTime({
      keyword: keywords,
      startTime: sevenDaysAgo,
      endTime: today,
      geo: '',          // 전 세계
      hl: 'en-US',
    });

    const json = JSON.parse(raw);
    const timelineData = json?.default?.timelineData ?? [];
    const out = {};

    chunk.forEach((tool, i) => {
      const values = timelineData
        .filter((d) => d.hasData?.[i])
        .map((d) => d.value?.[i] ?? 0);
      out[tool.id] = values.length
        ? values.reduce((s, v) => s + v, 0) / values.length
        : 0;
    });
    return out;
  } catch (e) {
    console.warn('Google Trends error:', e.message);
    return {};
  }
}

// ─── GitHub ───────────────────────────────────────────────────────────────────
async function fetchGitHub(tool) {
  const token = process.env.GITHUB_TOKEN;
  const headers = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'airank-score-bot/1.0',
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const params = new URLSearchParams({
    q: tool.github,
    per_page: 1,
  });

  try {
    const res = await fetch(`https://api.github.com/search/repositories?${params}`, { headers });
    if (!res.ok) throw new Error(`GitHub HTTP ${res.status}`);
    const json = await res.json();
    return json.total_count ?? 0;
  } catch (e) {
    console.warn(`GitHub error [${tool.id}]:`, e.message);
    return 0;
  }
}

// ─── 정규화 (0 ~ 100) ────────────────────────────────────────────────────────
function normalize(valuesMap) {
  const max = Math.max(...Object.values(valuesMap), 1);
  const out = {};
  for (const [id, v] of Object.entries(valuesMap)) {
    out[id] = Math.round((v / max) * 100);
  }
  return out;
}

// ─── main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log(`\n📡 점수 수집 시작 (${startDate} ~ ${endDate})\n`);

  // 이전 점수 로드
  let prevScores = {};
  if (existsSync(OUTPUT)) {
    try {
      prevScores = JSON.parse(readFileSync(OUTPUT, 'utf8')).tools ?? {};
    } catch {
      // 무시
    }
  }

  const raw = {
    naver:  Object.fromEntries(TOOLS.map((t) => [t.id, 0])),
    youtube:Object.fromEntries(TOOLS.map((t) => [t.id, 0])),
    gtrends:Object.fromEntries(TOOLS.map((t) => [t.id, 0])),
    github: Object.fromEntries(TOOLS.map((t) => [t.id, 0])),
  };

  // ── Naver DataLab (5개씩 배치) ──────────────────────────────────────────
  if (process.env.NAVER_CLIENT_ID) {
    console.log('🟢 Naver DataLab 수집 중...');
    const chunkSize = 5;
    for (let i = 0; i < TOOLS.length; i += chunkSize) {
      const chunk = TOOLS.slice(i, i + chunkSize);
      const result = await fetchNaver(chunk);
      for (const [id, val] of Object.entries(result)) raw.naver[id] = val;
      await sleep(500);
    }
    console.log('   ✅ Naver 완료');
  } else {
    console.log('⏭️  NAVER_CLIENT_ID 없음 → 건너뜀');
  }

  // ── YouTube ─────────────────────────────────────────────────────────────
  if (process.env.YOUTUBE_API_KEY) {
    console.log('🔴 YouTube 수집 중...');
    for (const tool of TOOLS) {
      raw.youtube[tool.id] = await fetchYoutube(tool);
      await sleep(200);
    }
    console.log('   ✅ YouTube 완료');
  } else {
    console.log('⏭️  YOUTUBE_API_KEY 없음 → 건너뜀');
  }

  // ── Google Trends (5개씩 배치) ───────────────────────────────────────────
  console.log('📈 Google Trends 수집 중...');
  let gtSuccess = 0;
  const chunkSize = 5;
  for (let i = 0; i < TOOLS.length; i += chunkSize) {
    const chunk = TOOLS.slice(i, i + chunkSize);
    const result = await fetchGoogleTrends(chunk);
    for (const [id, val] of Object.entries(result)) {
      raw.gtrends[id] = val;
      if (val > 0) gtSuccess++;
    }
    await sleep(1500); // Google Trends 요청 간 딜레이
  }
  console.log(`   ✅ Google Trends 완료 (${gtSuccess}개 데이터 수집)`);

  // ── GitHub ──────────────────────────────────────────────────────────────
  console.log('🟣 GitHub 수집 중...');
  for (const tool of TOOLS) {
    raw.github[tool.id] = await fetchGitHub(tool);
    await sleep(process.env.GITHUB_TOKEN ? 100 : 1200);
  }
  console.log('   ✅ GitHub 완료');

  // ── 정규화 ──────────────────────────────────────────────────────────────
  const norm = {
    naver:   normalize(raw.naver),
    youtube: normalize(raw.youtube),
    gtrends: normalize(raw.gtrends),
    github:  normalize(raw.github),
  };

  // ── 활성 플랫폼 가중치 자동 조정 ────────────────────────────────────────
  // score = 네이버×0.30 + YouTube×0.25 + Google Trends×0.20 + GitHub×0.25
  const baseWeights = { naver: 0.30, youtube: 0.25, gtrends: 0.20, github: 0.25 };
  const active = {
    naver:   !!process.env.NAVER_CLIENT_ID,
    youtube: !!process.env.YOUTUBE_API_KEY,
    gtrends: gtSuccess > 0,
    github:  true,
  };
  const totalWeight = Object.entries(baseWeights)
    .filter(([p]) => active[p])
    .reduce((s, [, w]) => s + w, 0);
  const weights = Object.fromEntries(
    Object.entries(baseWeights).map(([p, w]) => [p, active[p] ? w / totalWeight : 0])
  );
  console.log('\n   가중치:', Object.entries(weights).map(([p, w]) => `${p}=${(w * 100).toFixed(0)}%`).join(' | '));

  // ── 점수 계산 & 변화율 ──────────────────────────────────────────────────
  const tools = {};
  for (const tool of TOOLS) {
    const n = norm.naver[tool.id]   ?? 0;
    const y = norm.youtube[tool.id] ?? 0;
    const gt = norm.gtrends[tool.id] ?? 0;
    const g = norm.github[tool.id]  ?? 0;

    const score = Math.round(
      n * weights.naver + y * weights.youtube + gt * weights.gtrends + g * weights.github
    );

    const prev = prevScores[String(tool.id)];
    const change = prev?.score
      ? Math.round(((score - prev.score) / prev.score) * 1000) / 10
      : 0;

    tools[String(tool.id)] = {
      score,
      change,
      sns: { naver: n, youtube: y, google: gt, github: g },
    };
  }

  // ── 저장 ────────────────────────────────────────────────────────────────
  const output = {
    updated: new Date().toISOString(),
    tools,
  };
  writeFileSync(OUTPUT, JSON.stringify(output, null, 2), 'utf8');

  console.log(`\n✅ 저장 완료: ${OUTPUT}`);
  console.log(`   갱신 시각: ${output.updated}`);
  console.log(`   도구 수: ${Object.keys(tools).length}개\n`);
}

main().catch((e) => {
  console.error('❌ 오류:', e);
  process.exit(1);
});

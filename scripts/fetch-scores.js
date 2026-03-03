#!/usr/bin/env node
/**
 * scripts/fetch-scores.js
 * 4개 플랫폼 API에서 AI 도구 트렌드 데이터를 수집하고 public/scores.json 생성
 *
 * 환경 변수:
 *   NAVER_CLIENT_ID, NAVER_CLIENT_SECRET  - 네이버 DataLab 검색어 트렌드
 *   YOUTUBE_API_KEY                        - YouTube Data API v3
 *   REDDIT_CLIENT_ID, REDDIT_CLIENT_SECRET - Reddit API (OAuth)
 *   GITHUB_TOKEN                           - GitHub API (없으면 60req/h 제한)
 *
 * 실행: node scripts/fetch-scores.js
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

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
  { id:  1, naverKw:['ChatGPT','챗GPT','챗지피티'],               yt:'ChatGPT',                reddit:'ChatGPT',          github:'chatgpt' },
  { id:  2, naverKw:['Claude AI','클로드 AI'],                    yt:'Claude AI Anthropic',    reddit:'ClaudeAI',         github:'claude' },
  { id:  3, naverKw:['Gemini AI','구글 제미나이'],                 yt:'Google Gemini AI',       reddit:'Gemini',           github:'gemini' },
  { id:  4, naverKw:['DeepSeek','딥시크'],                        yt:'DeepSeek AI',            reddit:'DeepSeek',         github:'deepseek' },
  { id:  5, naverKw:['Grok AI','그록'],                           yt:'Grok xAI',               reddit:'Grok',             github:'grok' },
  { id:  6, naverKw:['Llama Meta AI','메타 라마'],                yt:'Meta Llama',             reddit:'LocalLlama',       github:'llama' },
  { id:  7, naverKw:['Mistral AI','미스트랄'],                    yt:'Mistral AI',             reddit:'MistralAI',        github:'mistral' },
  { id:  8, naverKw:['Character AI','캐릭터 AI'],                 yt:'Character AI',           reddit:'CharacterAI',      github:'character-ai' },
  { id:  9, naverKw:['Poe AI','포 AI'],                          yt:'Poe AI Quora',           reddit:'poe',              github:'poe' },
  { id: 10, naverKw:['Midjourney','미드저니'],                    yt:'Midjourney AI',          reddit:'midjourney',       github:'midjourney' },
  { id: 11, naverKw:['Stable Diffusion','스테이블 디퓨전'],       yt:'Stable Diffusion',       reddit:'StableDiffusion',  github:'stable-diffusion' },
  { id: 12, naverKw:['DALL-E 3','달리 AI'],                      yt:'DALL-E 3 OpenAI',        reddit:'dalle',            github:'dall-e' },
  { id: 13, naverKw:['Adobe Firefly','어도비 파이어플라이'],       yt:'Adobe Firefly',          reddit:'AdobeFirefly',     github:'adobe-firefly' },
  { id: 14, naverKw:['Leonardo AI','레오나르도 AI'],              yt:'Leonardo AI art',        reddit:'LeonardoAI',       github:'leonardo-ai' },
  { id: 15, naverKw:['Ideogram AI'],                              yt:'Ideogram AI',            reddit:'ideogram',         github:'ideogram' },
  { id: 16, naverKw:['Flux AI','블랙포레스트 AI'],                yt:'Flux AI image',          reddit:'FluxAI',           github:'flux' },
  { id: 17, naverKw:['Krea AI'],                                  yt:'Krea AI canvas',         reddit:'KreaAI',           github:'krea' },
  { id: 18, naverKw:['GitHub Copilot','깃허브 코파일럿'],         yt:'GitHub Copilot',         reddit:'githubcopilot',    github:'copilot' },
  { id: 19, naverKw:['Cursor editor','커서 AI'],                  yt:'Cursor AI editor',       reddit:'cursor',           github:'cursor' },
  { id: 20, naverKw:['Bolt new','볼트 풀스택'],                   yt:'Bolt.new AI',            reddit:'boltnew',          github:'bolt' },
  { id: 21, naverKw:['Windsurf Codeium','윈드서프'],              yt:'Windsurf Codeium',       reddit:'Windsurf_app',     github:'windsurf' },
  { id: 22, naverKw:['v0 Vercel UI'],                             yt:'v0 Vercel AI UI',        reddit:'v0dev',            github:'v0' },
  { id: 23, naverKw:['Replit AI','리플릿 AI'],                   yt:'Replit AI agent',        reddit:'replit',           github:'replit' },
  { id: 24, naverKw:['Tabnine','탭나인'],                         yt:'Tabnine AI',             reddit:'tabnine',          github:'tabnine' },
  { id: 25, naverKw:['Sora OpenAI','소라 AI'],                   yt:'OpenAI Sora video',      reddit:'sora',             github:'sora' },
  { id: 26, naverKw:['Runway ML','런웨이'],                       yt:'Runway ML Gen-3',        reddit:'runwayml',         github:'runway' },
  { id: 27, naverKw:['Kling AI','클링 AI'],                      yt:'Kling AI video',         reddit:'KlingAI',          github:'kling' },
  { id: 28, naverKw:['Pika Labs AI','피카 AI'],                  yt:'Pika Labs AI video',     reddit:'Pika_Labs',        github:'pika' },
  { id: 29, naverKw:['HeyGen AI','헤이젠'],                       yt:'HeyGen AI avatar',       reddit:'HeyGen',           github:'heygen' },
  { id: 30, naverKw:['Luma AI Dream Machine'],                    yt:'Luma AI Dream Machine',  reddit:'LumaLabsAI',       github:'luma-ai' },
  { id: 31, naverKw:['Synthesia AI'],                             yt:'Synthesia AI video',     reddit:'Synthesia',        github:'synthesia' },
  { id: 32, naverKw:['Suno AI music','수노 AI'],                 yt:'Suno AI music',          reddit:'SunoAI',           github:'suno' },
  { id: 33, naverKw:['ElevenLabs','일레븐랩스'],                  yt:'ElevenLabs voice clone', reddit:'ElevenLabs',       github:'elevenlabs' },
  { id: 34, naverKw:['Udio AI music'],                            yt:'Udio AI music',          reddit:'UdioMusic',        github:'udio' },
  { id: 35, naverKw:['Descript AI','데스크립트'],                 yt:'Descript AI editor',     reddit:'descript',         github:'descript' },
  { id: 36, naverKw:['Perplexity AI','퍼플렉시티'],               yt:'Perplexity AI search',   reddit:'perplexity_ai',    github:'perplexity' },
  { id: 37, naverKw:['You.com AI search'],                        yt:'You.com AI',             reddit:'YouDotCom',        github:'you-com' },
  { id: 38, naverKw:['Elicit AI research'],                       yt:'Elicit AI research',     reddit:'elicit',           github:'elicit' },
  { id: 39, naverKw:['Microsoft Copilot','마이크로소프트 코파일럿'], yt:'Microsoft Copilot',   reddit:'MicrosoftCopilot', github:'microsoft-copilot' },
  { id: 40, naverKw:['Notion AI','노션 AI'],                     yt:'Notion AI features',     reddit:'Notion',           github:'notion-ai' },
  { id: 41, naverKw:['Gamma AI presentation'],                    yt:'Gamma.app AI slides',    reddit:'gamma_app',        github:'gamma' },
  { id: 42, naverKw:['Otter AI meeting'],                         yt:'Otter.ai meeting notes', reddit:'otter_ai',         github:'otter-ai' },
  { id: 43, naverKw:['Fireflies AI meeting'],                     yt:'Fireflies.ai',           reddit:'fireflies_ai',     github:'fireflies' },
  { id: 44, naverKw:['Beautiful AI slides'],                      yt:'Beautiful.ai slides',    reddit:'beautiful_ai',     github:'beautiful-ai' },
  { id: 45, naverKw:['Make automation','메이크 자동화'],           yt:'Make.com automation',    reddit:'makercom',         github:'make-automation' },
  { id: 46, naverKw:['Zapier AI automation','재피어'],            yt:'Zapier AI',              reddit:'zapier',           github:'zapier' },
  { id: 47, naverKw:['n8n workflow automation'],                   yt:'n8n automation',         reddit:'n8n',              github:'n8n' },
  { id: 48, naverKw:['Canva AI','캔바 AI'],                      yt:'Canva AI design',        reddit:'canva',            github:'canva' },
  { id: 49, naverKw:['Figma AI','피그마 AI'],                    yt:'Figma AI features',      reddit:'FigmaDesign',      github:'figma' },
  { id: 50, naverKw:['Uizard AI design'],                         yt:'Uizard AI',              reddit:'uizard',           github:'uizard' },
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

// ─── Reddit ───────────────────────────────────────────────────────────────────
let redditToken = null;

async function getRedditToken() {
  const clientId = process.env.REDDIT_CLIENT_ID;
  const clientSecret = process.env.REDDIT_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  try {
    const res = await fetch('https://www.reddit.com/api/v1/access_token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'airank-score-bot/1.0',
      },
      body: 'grant_type=client_credentials',
    });
    if (!res.ok) throw new Error(`Reddit token HTTP ${res.status}`);
    const json = await res.json();
    return json.access_token ?? null;
  } catch (e) {
    console.warn('Reddit token error:', e.message);
    return null;
  }
}

async function fetchReddit(tool) {
  if (!redditToken) return 0;

  const params = new URLSearchParams({
    q: tool.reddit,
    t: 'week',
    limit: '100',
    sort: 'top',
  });

  try {
    const res = await fetch(`https://oauth.reddit.com/search?${params}`, {
      headers: {
        Authorization: `Bearer ${redditToken}`,
        'User-Agent': 'airank-score-bot/1.0',
      },
    });
    if (!res.ok) throw new Error(`Reddit HTTP ${res.status}`);
    const json = await res.json();
    // sum of upvotes of top posts (relative engagement indicator)
    const children = json.data?.children ?? [];
    return children.reduce((sum, p) => sum + Math.max(0, p.data?.score ?? 0), 0);
  } catch (e) {
    console.warn(`Reddit error [${tool.id}]:`, e.message);
    return 0;
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
    naver:   Object.fromEntries(TOOLS.map((t) => [t.id, 0])),
    youtube: Object.fromEntries(TOOLS.map((t) => [t.id, 0])),
    reddit:  Object.fromEntries(TOOLS.map((t) => [t.id, 0])),
    github:  Object.fromEntries(TOOLS.map((t) => [t.id, 0])),
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

  // ── Reddit ──────────────────────────────────────────────────────────────
  if (process.env.REDDIT_CLIENT_ID) {
    console.log('🟠 Reddit 수집 중...');
    redditToken = await getRedditToken();
    if (redditToken) {
      for (const tool of TOOLS) {
        raw.reddit[tool.id] = await fetchReddit(tool);
        await sleep(300);
      }
      console.log('   ✅ Reddit 완료');
    } else {
      console.log('   ⚠️  Reddit 토큰 발급 실패 → 건너뜀');
    }
  } else {
    console.log('⏭️  REDDIT_CLIENT_ID 없음 → 건너뜀');
  }

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
    reddit:  normalize(raw.reddit),
    github:  normalize(raw.github),
  };

  // ── 점수 계산 & 변화율 ──────────────────────────────────────────────────
  const tools = {};
  for (const tool of TOOLS) {
    const n = norm.naver[tool.id]   ?? 0;
    const y = norm.youtube[tool.id] ?? 0;
    const r = norm.reddit[tool.id]  ?? 0;
    const g = norm.github[tool.id]  ?? 0;

    const score = Math.round(n * 0.30 + y * 0.25 + r * 0.20 + g * 0.25);

    const prev = prevScores[String(tool.id)];
    const change = prev?.score
      ? Math.round(((score - prev.score) / prev.score) * 1000) / 10
      : 0;

    tools[String(tool.id)] = { score, change, sns: { naver: n, youtube: y, reddit: r, github: g } };
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

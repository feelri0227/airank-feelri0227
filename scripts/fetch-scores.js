#!/usr/bin/env node
/**
 * scripts/fetch-scores.js
 * 4개 플랫폼 API에서 AI 도구 트렌드 데이터를 수집하고 public/scores.json 생성
 *
 * 환경 변수:
 *   NAVER_CLIENT_ID, NAVER_CLIENT_SECRET  - 네이버 DataLab 검색어 트렌드
 *   GITHUB_TOKEN                           - GitHub API (없으면 60req/h 제한)
 *   (Google Trends / YouTube Trends는 API 키 불필요)
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

import { TOOLS_DATA as TOOLS } from '../src/data/tools.js';

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

// ─── YouTube Trends (Google Trends gprop=youtube, 5개씩 배치) ─────────────────
// kwField: 'yt' (영어) 또는 'ytKo' (한국어)
async function fetchYoutubeTrends(chunk, kwField = 'yt') {
  try {
    // 구글 차단 방지를 위해 랜덤 지연 추가 (1.5초 ~ 3.5초)
    const extraWait = Math.floor(Math.random() * 2000);
    await sleep(1500 + extraWait);

    const keywords = chunk.map((t) => t[kwField]);
    const raw = await googleTrends.interestOverTime({
      keyword: keywords,
      startTime: sevenDaysAgo,
      endTime: today,
      geo: '',
      hl: 'ko',
      gprop: 'youtube',
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
    console.warn(`⚠️ YouTube Trends [${kwField}] 일시 차단됨 (건너뜀):`, e.message.substring(0, 50));
    return null; // 실패 시 null 반환하여 기존 점수 유지 유도
  }
}

// ─── Google Trends (5개씩 배치) ───────────────────────────────────────────────
// kwField: 'gt' (영어) 또는 'gtKo' (한국어)
async function fetchGoogleTrends(chunk, kwField = 'gt') {
  try {
    const extraWait = Math.floor(Math.random() * 2000);
    await sleep(1500 + extraWait);

    const keywords = chunk.map((t) => t[kwField]);
    const raw = await googleTrends.interestOverTime({
      keyword: keywords,
      startTime: sevenDaysAgo,
      endTime: today,
      geo: '',
      hl: 'ko',
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
    console.warn(`⚠️ Google Trends [${kwField}] 일시 차단됨 (건너뜀):`, e.message.substring(0, 50));
    return null;
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

// ─── 영어+한국어 평균 합산 헬퍼 ─────────────────────────────────────────────
// 둘 다 데이터 있으면 평균, 하나만 있으면 그 값 사용
function mergeScores(enMap, koMap, toolIds) {
  const out = {};
  for (const id of toolIds) {
    const en = enMap[id] ?? 0;
    const ko = koMap[id] ?? 0;
    if (en > 0 && ko > 0) {
      out[id] = (en + ko) / 2;
    } else {
      out[id] = Math.max(en, ko);
    }
  }
  return out;
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

  const toolIds = TOOLS.map((t) => t.id);
  const raw = {
    naver:   Object.fromEntries(TOOLS.map((t) => [t.id, 0])),
    youtube: Object.fromEntries(TOOLS.map((t) => [t.id, 0])),
    gtrends: Object.fromEntries(TOOLS.map((t) => [t.id, 0])),
    github:  Object.fromEntries(TOOLS.map((t) => [t.id, 0])),
  };

  const chunkSize = 5;

  let ytTotal = 0;
  let gtTotal = 0;

  // 플랫폼별 수집 태스크 정의
  const tasks = [
    // 1. Naver DataLab
    async () => {
      if (process.env.NAVER_CLIENT_ID) {
        console.log('🟢 Naver DataLab 수집 중...');
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
    },

    // 2. YouTube Trends (한/영 병렬 처리 지양 - 구글 트렌드 API 제한 고려)
    async () => {
      console.log('🔴 YouTube Trends 수집 중...');
      const ytEn = Object.fromEntries(TOOLS.map((t) => [t.id, 0]));
      const ytKo = Object.fromEntries(TOOLS.map((t) => [t.id, 0]));
      
      for (let i = 0; i < TOOLS.length; i += chunkSize) {
        const chunk = TOOLS.slice(i, i + chunkSize);
        
        const [enRes, koRes] = await Promise.all([
          fetchYoutubeTrends(chunk, 'yt'),
          fetchYoutubeTrends(chunk, 'ytKo')
        ]);
        
        for (const [id, val] of Object.entries(enRes || {})) ytEn[id] = val;
        for (const [id, val] of Object.entries(koRes || {})) ytKo[id] = val;
        
        await sleep(2000); // 구글 API 부하 분산
      }
      
      const ytMerged = mergeScores(ytEn, ytKo, toolIds);
      for (const id of toolIds) raw.youtube[id] = ytMerged[id];
      const ytTotal = Object.values(ytMerged).filter((v) => v > 0).length;
      console.log(`   ✅ YouTube Trends 완료 (유효 데이터: ${ytTotal}개)`);
    },

    // 3. Google Trends
    async () => {
      console.log('📈 Google Trends 수집 중...');
      const gtEn = Object.fromEntries(TOOLS.map((t) => [t.id, 0]));
      const gtKo = Object.fromEntries(TOOLS.map((t) => [t.id, 0]));
      
      for (let i = 0; i < TOOLS.length; i += chunkSize) {
        const chunk = TOOLS.slice(i, i + chunkSize);
        
        const [enRes, koRes] = await Promise.all([
          fetchGoogleTrends(chunk, 'gt'),
          fetchGoogleTrends(chunk, 'gtKo')
        ]);
        
        for (const [id, val] of Object.entries(enRes || {})) gtEn[id] = val;
        for (const [id, val] of Object.entries(koRes || {})) gtKo[id] = val;
        
        await sleep(2000);
      }
      
      const gtMerged = mergeScores(gtEn, gtKo, toolIds);
      for (const id of toolIds) raw.gtrends[id] = gtMerged[id];
      const gtTotal = Object.values(gtMerged).filter((v) => v > 0).length;
      console.log(`   ✅ Google Trends 완료 (유효 데이터: ${gtTotal}개)`);
    },

    // 4. GitHub (개별 API 호출이므로 독립 실행)
    async () => {
      console.log('🟣 GitHub 수집 중...');
      // 깃허브는 호출 제한이 엄격하므로 순차적으로 하되 조금 더 빠르게 시도
      for (const tool of TOOLS) {
        raw.github[tool.id] = await fetchGitHub(tool);
        await sleep(process.env.GITHUB_TOKEN ? 1000 : 2000);
      }
      console.log('   ✅ GitHub 완료');
    }
  ];

  // 모든 플랫폼 태스크를 "가능한 한" 병렬로 실행
  // 주의: 구글 계열(YT, GT)은 동일 IP에서 동시에 대량 호출 시 차단 위험이 있으므로 
  // 실제로는 Naver, GitHub와 함께 실행하되 구글 태스크끼리는 간격을 두는 것이 좋음.
  // 여기서는 구조적 병렬화만 도입
  await Promise.all(tasks.map(t => t()));

  // ── 정규화 ──────────────────────────────────────────────────────────────
  const norm = {
    naver:   normalize(raw.naver),
    youtube: normalize(raw.youtube),
    gtrends: normalize(raw.gtrends),
    github:  normalize(raw.github),
  };

  // ── 활성 플랫폼 가중치 자동 조정 ────────────────────────────────────────
  // ... (나머지 로직 동일)
  const baseWeights = { naver: 0.30, youtube: 0.30, gtrends: 0.30, github: 0.10 };
  const active = {
    naver:   !!process.env.NAVER_CLIENT_ID,
    youtube: ytTotal > 0,
    gtrends: gtTotal > 0,
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
    const prev = prevScores[String(tool.id)];
    const prevSns = prev?.sns ?? { naver: 0, youtube: 0, google: 0, github: 0 };

    const n  = norm.naver[tool.id]   ?? prevSns.naver;
    const y  = norm.youtube[tool.id] ?? prevSns.youtube;
    const gt = norm.gtrends[tool.id] ?? prevSns.google;
    const g  = norm.github[tool.id]  ?? prevSns.github;

    const score = Math.round(
      n * weights.naver + y * weights.youtube + gt * weights.gtrends + g * weights.github
    );

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

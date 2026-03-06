#!/usr/bin/env node
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

const today = new Date();
const sevenDaysAgo = new Date(today - 7 * 24 * 60 * 60 * 1000);
const fmtDate = (d) => d.toISOString().split('T')[0];
const startDate = fmtDate(sevenDaysAgo);
const endDate = fmtDate(today);

import { TOOLS_DATA as TOOLS } from '../src/data/tools.js';

async function fetchNaver(chunk) {
  const clientId = process.env.NAVER_CLIENT_ID;
  const clientSecret = process.env.NAVER_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;

  const body = JSON.stringify({
    startDate, endDate, timeUnit: 'date',
    keywordGroups: chunk.map((t) => ({ groupName: String(t.id), keywords: t.naverKw }))
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
    if (!res.ok) return null;
    const json = await res.json();
    const out = {};
    for (const result of json.results ?? []) {
      const id = Number(result.title);
      const ratios = result.data?.map((d) => d.ratio) ?? [];
      out[id] = ratios.length ? ratios.reduce((s, v) => s + v, 0) / ratios.length : 0;
    }
    return out;
  } catch { return null; }
}

async function fetchYoutubeTrends(chunk, kwField = 'yt') {
  try {
    await sleep(2000 + Math.random() * 3000);
    const keywords = chunk.map((t) => t[kwField]);
    const raw = await googleTrends.interestOverTime({
      keyword: keywords, startTime: sevenDaysAgo, endTime: today, geo: '', hl: 'ko', gprop: 'youtube'
    });
    const json = JSON.parse(raw);
    const timelineData = json?.default?.timelineData ?? [];
    const out = {};
    chunk.forEach((tool, i) => {
      const values = timelineData.filter((d) => d.hasData?.[i]).map((d) => d.value?.[i] ?? 0);
      out[tool.id] = values.length ? values.reduce((s, v) => s + v, 0) / values.length : 0;
    });
    return out;
  } catch { return null; }
}

async function fetchGoogleTrends(chunk, kwField = 'gt') {
  try {
    await sleep(2000 + Math.random() * 3000);
    const keywords = chunk.map((t) => t[kwField]);
    const raw = await googleTrends.interestOverTime({
      keyword: keywords, startTime: sevenDaysAgo, endTime: today, geo: '', hl: 'ko'
    });
    const json = JSON.parse(raw);
    const timelineData = json?.default?.timelineData ?? [];
    const out = {};
    chunk.forEach((tool, i) => {
      const values = timelineData.filter((d) => d.hasData?.[i]).map((d) => d.value?.[i] ?? 0);
      out[tool.id] = values.length ? values.reduce((s, v) => s + v, 0) / values.length : 0;
    });
    return out;
  } catch { return null; }
}

async function fetchGitHub(tool) {
  const token = process.env.GITHUB_TOKEN;
  const headers = { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'airank-bot' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const params = new URLSearchParams({ q: tool.github, per_page: 1 });
  try {
    const res = await fetch(`https://api.github.com/search/repositories?${params}`, { headers });
    if (!res.ok) return null;
    const json = await res.json();
    return json.total_count ?? 0;
  } catch { return null; }
}

function normalize(valuesMap) {
  const vals = Object.values(valuesMap || {});
  const max = Math.max(...vals, 1);
  const out = {};
  for (const [id, v] of Object.entries(valuesMap || {})) {
    out[id] = Math.round((v / max) * 100);
  }
  return out;
}

async function main() {
  console.log('📡 점수 수집 시작...');
  let prevData = { tools: {} };
  if (existsSync(OUTPUT)) {
    try { prevData = JSON.parse(readFileSync(OUTPUT, 'utf8')); } catch {}
  }

  const raw = { naver: {}, youtube: {}, gtrends: {}, github: {} };
  const chunkSize = 5;

  for (let i = 0; i < TOOLS.length; i += chunkSize) {
    const chunk = TOOLS.slice(i, i + chunkSize);
    const [n, yEn, yKo, gEn, gKo] = await Promise.all([
      fetchNaver(chunk),
      fetchYoutubeTrends(chunk, 'yt'),
      fetchYoutubeTrends(chunk, 'ytKo'),
      fetchGoogleTrends(chunk, 'gt'),
      fetchGoogleTrends(chunk, 'gtKo')
    ]);

    chunk.forEach(t => {
      if (n) raw.naver[t.id] = n[t.id];
      if (yEn || yKo) raw.youtube[t.id] = Math.max(yEn?.[t.id] ?? 0, yKo?.[t.id] ?? 0);
      if (gEn || gKo) raw.gtrends[t.id] = Math.max(gEn?.[t.id] ?? 0, gKo?.[t.id] ?? 0);
    });
    console.log(`   Progress: ${i + chunkSize}/${TOOLS.length}`);
  }

  for (const t of TOOLS) {
    const g = await fetchGitHub(t);
    if (g !== null) raw.github[t.id] = g;
    await sleep(process.env.GITHUB_TOKEN ? 100 : 1000);
  }

  const norm = { naver: normalize(raw.naver), youtube: normalize(raw.youtube), gtrends: normalize(raw.gtrends), github: normalize(raw.github) };
  const weights = { naver: 0.3, youtube: 0.3, gtrends: 0.3, github: 0.1 };

  const finalTools = {};
  for (const t of TOOLS) {
    const prev = prevData.tools[String(t.id)] || { score: 0, sns: { naver: 0, youtube: 0, google: 0, github: 0 } };
    
    // 이번에 수집 성공한 값이 있으면 쓰고, 없으면(null/undefined) 어제 값을 그대로 씀
    const n = (raw.naver[t.id] !== undefined) ? norm.naver[t.id] : prev.sns.naver;
    const y = (raw.youtube[t.id] !== undefined) ? norm.youtube[t.id] : prev.sns.youtube;
    const gt = (raw.gtrends[t.id] !== undefined) ? norm.gtrends[t.id] : prev.sns.google;
    const g = (raw.github[t.id] !== undefined) ? norm.github[t.id] : prev.sns.github;

    const score = Math.round(n * weights.naver + y * weights.youtube + gt * weights.gtrends + g * weights.github);
    const change = prev.score ? Math.round(((score - prev.score) / prev.score) * 1000) / 10 : 0;

    finalTools[String(t.id)] = { score, change, sns: { naver: n, youtube: y, google: gt, github: g } };
  }

  writeFileSync(OUTPUT, JSON.stringify({ updated: new Date().toISOString(), tools: finalTools }, null, 2));
  console.log('✅ 저장 완료!');
}

main().catch(console.error);

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

// ─── 도구 목록 (id, 플랫폼별 검색어 - 영어/한국어) ──────────────────────────
const TOOLS = [
  { id:  1, naverKw:['ChatGPT','챗GPT','챗지피티'],                 yt:'ChatGPT',                ytKo:'챗GPT',              gt:'ChatGPT',          gtKo:'챗GPT',              github:'chatgpt' },
  { id:  2, naverKw:['Claude AI','클로드 AI'],                      yt:'Claude AI Anthropic',    ytKo:'클로드 AI',          gt:'Claude AI',        gtKo:'클로드 AI',          github:'claude' },
  { id:  3, naverKw:['Gemini AI','구글 제미나이'],                   yt:'Google Gemini AI',       ytKo:'구글 제미나이',       gt:'Gemini AI',        gtKo:'구글 제미나이',       github:'gemini' },
  { id:  4, naverKw:['DeepSeek','딥시크'],                          yt:'DeepSeek AI',            ytKo:'딥시크',             gt:'DeepSeek',         gtKo:'딥시크',             github:'deepseek' },
  { id:  5, naverKw:['Grok AI','그록'],                             yt:'Grok xAI',               ytKo:'그록 AI',            gt:'Grok AI',          gtKo:'그록',               github:'grok' },
  { id:  6, naverKw:['Llama Meta AI','메타 라마'],                   yt:'Meta Llama',             ytKo:'메타 라마',          gt:'Meta Llama',       gtKo:'메타 라마',          github:'llama' },
  { id:  7, naverKw:['Mistral AI','미스트랄'],                       yt:'Mistral AI',             ytKo:'미스트랄 AI',        gt:'Mistral AI',       gtKo:'미스트랄',           github:'mistral' },
  { id:  8, naverKw:['Character AI','캐릭터 AI'],                   yt:'Character AI',           ytKo:'캐릭터 AI',          gt:'Character AI',     gtKo:'캐릭터 AI',          github:'character-ai' },
  { id:  9, naverKw:['Poe AI','포 AI'],                             yt:'Poe AI Quora',           ytKo:'포 AI',              gt:'Poe AI',           gtKo:'포 AI',              github:'poe' },
  { id: 10, naverKw:['Midjourney','미드저니'],                       yt:'Midjourney AI',          ytKo:'미드저니',           gt:'Midjourney',       gtKo:'미드저니',           github:'midjourney' },
  { id: 11, naverKw:['Stable Diffusion','스테이블 디퓨전'],          yt:'Stable Diffusion',       ytKo:'스테이블 디퓨전',    gt:'Stable Diffusion', gtKo:'스테이블 디퓨전',    github:'stable-diffusion' },
  { id: 12, naverKw:['DALL-E 3','달리 AI'],                         yt:'DALL-E 3 OpenAI',        ytKo:'달리 AI',            gt:'DALL-E',           gtKo:'달리 AI',            github:'dall-e' },
  { id: 13, naverKw:['Adobe Firefly','어도비 파이어플라이'],          yt:'Adobe Firefly',          ytKo:'어도비 파이어플라이', gt:'Adobe Firefly',    gtKo:'어도비 파이어플라이', github:'adobe-firefly' },
  { id: 14, naverKw:['Leonardo AI','레오나르도 AI'],                 yt:'Leonardo AI art',        ytKo:'레오나르도 AI',       gt:'Leonardo AI',      gtKo:'레오나르도 AI',       github:'leonardo-ai' },
  { id: 15, naverKw:['Ideogram AI'],                                yt:'Ideogram AI',            ytKo:'아이디오그램 AI',     gt:'Ideogram AI',      gtKo:'아이디오그램',        github:'ideogram' },
  { id: 16, naverKw:['Flux AI','블랙포레스트 AI'],                   yt:'Flux AI image',          ytKo:'플럭스 AI',          gt:'Flux AI',          gtKo:'블랙포레스트 AI',    github:'flux' },
  { id: 17, naverKw:['Krea AI'],                                    yt:'Krea AI canvas',         ytKo:'크레아 AI',          gt:'Krea AI',          gtKo:'크레아 AI',          github:'krea' },
  { id: 18, naverKw:['GitHub Copilot','깃허브 코파일럿'],            yt:'GitHub Copilot',         ytKo:'깃허브 코파일럿',    gt:'GitHub Copilot',   gtKo:'깃허브 코파일럿',    github:'copilot' },
  { id: 19, naverKw:['Cursor editor','커서 AI'],                    yt:'Cursor AI editor',       ytKo:'커서 AI',            gt:'Cursor AI',        gtKo:'커서 에디터',        github:'cursor' },
  { id: 20, naverKw:['Bolt new','볼트 풀스택'],                      yt:'Bolt.new AI',            ytKo:'볼트 AI',            gt:'Bolt.new',         gtKo:'볼트 풀스택',        github:'bolt' },
  { id: 21, naverKw:['Windsurf Codeium','윈드서프'],                 yt:'Windsurf Codeium',       ytKo:'윈드서프 AI',        gt:'Windsurf AI',      gtKo:'윈드서프',           github:'windsurf' },
  { id: 22, naverKw:['v0 Vercel UI'],                               yt:'v0 Vercel AI UI',        ytKo:'v0 버셀',            gt:'v0 Vercel',        gtKo:'v0 버셀',            github:'v0' },
  { id: 23, naverKw:['Replit AI','리플릿 AI'],                      yt:'Replit AI agent',        ytKo:'리플릿 AI',          gt:'Replit AI',        gtKo:'리플릿 AI',          github:'replit' },
  { id: 24, naverKw:['Tabnine','탭나인'],                            yt:'Tabnine AI',             ytKo:'탭나인',             gt:'Tabnine',          gtKo:'탭나인',             github:'tabnine' },
  { id: 25, naverKw:['Sora OpenAI','소라 AI'],                      yt:'OpenAI Sora video',      ytKo:'소라 AI',            gt:'OpenAI Sora',      gtKo:'소라 AI',            github:'sora' },
  { id: 26, naverKw:['Runway ML','런웨이'],                          yt:'Runway ML Gen-3',        ytKo:'런웨이 ML',          gt:'Runway ML',        gtKo:'런웨이',             github:'runway' },
  { id: 27, naverKw:['Kling AI','클링 AI'],                         yt:'Kling AI video',         ytKo:'클링 AI',            gt:'Kling AI',         gtKo:'클링 AI',            github:'kling' },
  { id: 28, naverKw:['Pika Labs AI','피카 AI'],                     yt:'Pika Labs AI video',     ytKo:'피카 AI',            gt:'Pika Labs',        gtKo:'피카 AI',            github:'pika' },
  { id: 29, naverKw:['HeyGen AI','헤이젠'],                          yt:'HeyGen AI avatar',       ytKo:'헤이젠 AI',          gt:'HeyGen',           gtKo:'헤이젠',             github:'heygen' },
  { id: 30, naverKw:['Luma AI Dream Machine'],                      yt:'Luma AI Dream Machine',  ytKo:'루마 AI',            gt:'Luma AI',          gtKo:'루마 AI',            github:'luma-ai' },
  { id: 31, naverKw:['Synthesia AI'],                               yt:'Synthesia AI video',     ytKo:'신데시아 AI',        gt:'Synthesia AI',     gtKo:'신데시아',           github:'synthesia' },
  { id: 32, naverKw:['Suno AI music','수노 AI'],                    yt:'Suno AI music',          ytKo:'수노 AI',            gt:'Suno AI',          gtKo:'수노 AI',            github:'suno' },
  { id: 33, naverKw:['ElevenLabs','일레븐랩스'],                     yt:'ElevenLabs voice clone', ytKo:'일레븐랩스',         gt:'ElevenLabs',       gtKo:'일레븐랩스',         github:'elevenlabs' },
  { id: 34, naverKw:['Udio AI music'],                              yt:'Udio AI music',          ytKo:'유디오 AI',          gt:'Udio AI',          gtKo:'유디오 AI',          github:'udio' },
  { id: 35, naverKw:['Descript AI','데스크립트'],                    yt:'Descript AI editor',     ytKo:'데스크립트 AI',      gt:'Descript AI',      gtKo:'데스크립트',         github:'descript' },
  { id: 36, naverKw:['Perplexity AI','퍼플렉시티'],                  yt:'Perplexity AI search',   ytKo:'퍼플렉시티 AI',      gt:'Perplexity AI',    gtKo:'퍼플렉시티',         github:'perplexity' },
  { id: 37, naverKw:['You.com AI search'],                          yt:'You.com AI',             ytKo:'유닷컴 AI',          gt:'You.com AI',       gtKo:'유닷컴 AI',          github:'you-com' },
  { id: 38, naverKw:['Elicit AI research'],                         yt:'Elicit AI research',     ytKo:'엘리싯 AI',          gt:'Elicit AI',        gtKo:'엘리싯 AI',          github:'elicit' },
  { id: 39, naverKw:['Microsoft Copilot','마이크로소프트 코파일럿'],  yt:'Microsoft Copilot',      ytKo:'마이크로소프트 코파일럿', gt:'Microsoft Copilot', gtKo:'마이크로소프트 코파일럿', github:'microsoft-copilot' },
  { id: 40, naverKw:['Notion AI','노션 AI'],                        yt:'Notion AI features',     ytKo:'노션 AI',            gt:'Notion AI',        gtKo:'노션 AI',            github:'notion-ai' },
  { id: 41, naverKw:['Gamma AI presentation'],                      yt:'Gamma.app AI slides',    ytKo:'감마 AI',            gt:'Gamma AI',         gtKo:'감마 AI',            github:'gamma' },
  { id: 42, naverKw:['Otter AI meeting'],                           yt:'Otter.ai meeting notes', ytKo:'오터 AI',            gt:'Otter AI',         gtKo:'오터 AI',            github:'otter-ai' },
  { id: 43, naverKw:['Fireflies AI meeting'],                       yt:'Fireflies.ai',           ytKo:'파이어플라이즈 AI',  gt:'Fireflies AI',     gtKo:'파이어플라이즈',     github:'fireflies' },
  { id: 44, naverKw:['Beautiful AI slides'],                        yt:'Beautiful.ai slides',    ytKo:'뷰티풀 AI',          gt:'Beautiful AI',     gtKo:'뷰티풀 AI',          github:'beautiful-ai' },
  { id: 45, naverKw:['Make automation','메이크 자동화'],              yt:'Make.com automation',    ytKo:'메이크 자동화',      gt:'Make automation',  gtKo:'메이크 자동화',      github:'make-automation' },
  { id: 46, naverKw:['Zapier AI automation','재피어'],               yt:'Zapier AI',              ytKo:'재피어 AI',          gt:'Zapier AI',        gtKo:'재피어',             github:'zapier' },
  { id: 47, naverKw:['n8n workflow automation'],                     yt:'n8n automation',         ytKo:'n8n 자동화',         gt:'n8n automation',   gtKo:'n8n',                github:'n8n' },
  { id: 48, naverKw:['Canva AI','캔바 AI'],                         yt:'Canva AI design',        ytKo:'캔바 AI',            gt:'Canva AI',         gtKo:'캔바 AI',            github:'canva' },
  { id: 49, naverKw:['Figma AI','피그마 AI'],                       yt:'Figma AI features',      ytKo:'피그마 AI',          gt:'Figma AI',         gtKo:'피그마 AI',          github:'figma' },
  { id: 50, naverKw:['Uizard AI design'],                           yt:'Uizard AI',              ytKo:'유아이자드',         gt:'Uizard AI',        gtKo:'유아이자드',         github:'uizard' },
  // ── 텍스트 (51-57) ──
  { id: 51, naverKw:['Le Chat Mistral','르챗 AI'],                  yt:'Le Chat Mistral AI',     ytKo:'르챗 AI',           gt:'Le Chat Mistral',  gtKo:'르챗 AI',            github:'mistral' },
  { id: 52, naverKw:['Qwen Alibaba AI','큰 AI'],                    yt:'Qwen AI Alibaba',        ytKo:'큰 AI',             gt:'Qwen AI',          gtKo:'알리바바 큰 AI',     github:'QwenLM' },
  { id: 53, naverKw:['Command R+ Cohere AI'],                       yt:'Cohere Command R+',      ytKo:'코히어 커맨드R',    gt:'Command R+ Cohere',gtKo:'코히어 AI',          github:'cohere-ai' },
  { id: 54, naverKw:['HyperCLOVA X','하이퍼클로바 X'],              yt:'HyperCLOVA X Naver',     ytKo:'하이퍼클로바 X',    gt:'HyperCLOVA X',     gtKo:'하이퍼클로바 X',     github:'naver-clova' },
  { id: 55, naverKw:['Kimi AI Moonshot','키미 AI'],                 yt:'Kimi AI Moonshot',       ytKo:'키미 AI',           gt:'Kimi AI',          gtKo:'키미 AI',            github:'moonshot-ai' },
  { id: 56, naverKw:['Phi-4 Microsoft AI','파이4 AI'],              yt:'Microsoft Phi-4 AI',     ytKo:'마이크로소프트 파이4',gt:'Phi-4 Microsoft',  gtKo:'파이4 AI',           github:'microsoft-phi' },
  { id: 57, naverKw:['Amazon Nova AI','아마존 노바'],               yt:'Amazon Nova AI model',   ytKo:'아마존 노바',       gt:'Amazon Nova AI',   gtKo:'아마존 노바',        github:'amazon-nova' },
  // ── 이미지 (58-63) ──
  { id: 58, naverKw:['Playground AI image'],                        yt:'Playground AI art',      ytKo:'플레이그라운드 AI', gt:'Playground AI',    gtKo:'플레이그라운드 AI',  github:'playgroundai' },
  { id: 59, naverKw:['SeaArt AI image'],                            yt:'SeaArt AI art',          ytKo:'씨아트 AI',         gt:'SeaArt AI',        gtKo:'씨아트 AI',          github:'seaart' },
  { id: 60, naverKw:['NightCafe AI art'],                           yt:'NightCafe AI art',       ytKo:'나이트카페 AI',     gt:'NightCafe AI',     gtKo:'나이트카페 AI',      github:'nightcafe' },
  { id: 61, naverKw:['Tensor.Art AI image'],                        yt:'Tensor Art AI',          ytKo:'텐서아트 AI',       gt:'Tensor.Art AI',    gtKo:'텐서아트 AI',        github:'tensorart' },
  { id: 62, naverKw:['Civitai AI models'],                          yt:'Civitai AI models',      ytKo:'시비타이 AI',       gt:'Civitai',          gtKo:'시비타이',           github:'civitai' },
  { id: 63, naverKw:['Bing Image Creator','빙 이미지'],             yt:'Bing Image Creator AI',  ytKo:'빙 이미지 크리에이터',gt:'Bing Image Creator',gtKo:'빙 이미지',         github:'bing-image' },
  // ── 코딩 (64-67) ──
  { id: 64, naverKw:['Amazon Q Developer','아마존 Q'],              yt:'Amazon Q Developer',     ytKo:'아마존 Q 개발자',   gt:'Amazon Q Developer',gtKo:'아마존 Q',           github:'amazon-q' },
  { id: 65, naverKw:['Lovable AI','러버블 AI'],                     yt:'Lovable AI app builder', ytKo:'러버블 AI',         gt:'Lovable AI',       gtKo:'러버블 AI',          github:'lovable' },
  { id: 66, naverKw:['Cody Sourcegraph AI'],                        yt:'Cody AI Sourcegraph',    ytKo:'코디 AI',           gt:'Cody AI coding',   gtKo:'코디 AI',            github:'sourcegraph' },
  { id: 67, naverKw:['Devin AI','데빈 AI'],                         yt:'Devin AI software',      ytKo:'데빈 AI',           gt:'Devin AI',         gtKo:'데빈 AI',            github:'devin' },
  { id: 68, naverKw:['Aider AI coding'],                            yt:'Aider AI pair programmer',ytKo:'에이더 AI',        gt:'Aider AI coding',  gtKo:'에이더 AI',          github:'aider' },
  // ── 영상 (69-73) ──
  { id: 69, naverKw:['CapCut AI video','캡컷 AI'],                  yt:'CapCut AI video',        ytKo:'캡컷 AI',           gt:'CapCut AI',        gtKo:'캡컷 AI',            github:'capcut' },
  { id: 70, naverKw:['InVideo AI','인비디오 AI'],                   yt:'InVideo AI video',       ytKo:'인비디오 AI',       gt:'InVideo AI',       gtKo:'인비디오 AI',        github:'invideo' },
  { id: 71, naverKw:['Hailuo AI video','하이루오 AI'],              yt:'Hailuo AI video',        ytKo:'하이루오 AI',       gt:'Hailuo AI',        gtKo:'하이루오 AI',        github:'hailuo' },
  { id: 72, naverKw:['Pictory AI video'],                           yt:'Pictory AI video',       ytKo:'픽토리 AI',         gt:'Pictory AI',       gtKo:'픽토리 AI',          github:'pictory' },
  { id: 73, naverKw:['Veed.io AI video','비드 AI'],                 yt:'Veed.io AI editor',      ytKo:'비드 AI',           gt:'Veed.io AI',       gtKo:'비드 AI',            github:'veed-io' },
  // ── 오디오 (74-78) ──
  { id: 74, naverKw:['AIVA AI music','아이바 음악'],                yt:'AIVA AI music composer', ytKo:'아이바 AI',         gt:'AIVA AI music',    gtKo:'아이바 AI',          github:'aiva' },
  { id: 75, naverKw:['Soundraw AI music'],                          yt:'Soundraw AI music',      ytKo:'사운드로우 AI',     gt:'Soundraw AI',      gtKo:'사운드로우',         github:'soundraw' },
  { id: 76, naverKw:['Mubert AI music'],                            yt:'Mubert AI music',        ytKo:'뮤버트 AI',         gt:'Mubert AI',        gtKo:'뮤버트 AI',          github:'mubert' },
  { id: 77, naverKw:['Adobe Podcast AI','어도비 팟캐스트'],         yt:'Adobe Podcast enhance',  ytKo:'어도비 팟캐스트',   gt:'Adobe Podcast AI', gtKo:'어도비 팟캐스트',    github:'adobe-podcast' },
  { id: 78, naverKw:['Lalal.ai audio'],                             yt:'Lalal AI audio split',   ytKo:'라랄 AI',           gt:'Lalal.ai',         gtKo:'라랄 AI',            github:'lalal' },
  // ── 검색 (79-82) ──
  { id: 79, naverKw:['Phind AI search coding'],                     yt:'Phind AI search',        ytKo:'파인드 AI',         gt:'Phind AI',         gtKo:'파인드 AI',          github:'phind' },
  { id: 80, naverKw:['Consensus AI research'],                      yt:'Consensus AI search',    ytKo:'컨센서스 AI',       gt:'Consensus AI',     gtKo:'컨센서스 AI',        github:'consensus' },
  { id: 81, naverKw:['Kagi search AI'],                             yt:'Kagi search engine',     ytKo:'카기 검색',         gt:'Kagi search',      gtKo:'카기 검색',          github:'kagi' },
  { id: 82, naverKw:['Exa AI search'],                              yt:'Exa AI search API',      ytKo:'엑사 AI',           gt:'Exa AI',           gtKo:'엑사 AI',            github:'exa-labs' },
  // ── 생산성 (83-93) ──
  { id: 83, naverKw:['Jasper AI writing'],                          yt:'Jasper AI writing',      ytKo:'재스퍼 AI',         gt:'Jasper AI',        gtKo:'재스퍼 AI',          github:'jasper' },
  { id: 84, naverKw:['Copy.ai writing'],                            yt:'Copy.ai AI writing',     ytKo:'카피 AI',           gt:'Copy.ai',          gtKo:'카피 AI',            github:'copyai' },
  { id: 85, naverKw:['Grammarly AI','그래머리'],                    yt:'Grammarly AI writing',   ytKo:'그래머리 AI',       gt:'Grammarly AI',     gtKo:'그래머리',           github:'grammarly' },
  { id: 86, naverKw:['Writesonic AI'],                              yt:'Writesonic AI writing',  ytKo:'라이트소닉 AI',     gt:'Writesonic AI',    gtKo:'라이트소닉',         github:'writesonic' },
  { id: 87, naverKw:['Tome AI presentation'],                       yt:'Tome AI slides',         ytKo:'톰 AI',             gt:'Tome AI',          gtKo:'톰 AI',              github:'tome' },
  { id: 88, naverKw:['Taskade AI productivity'],                    yt:'Taskade AI',             ytKo:'태스크에이드 AI',   gt:'Taskade AI',       gtKo:'태스크에이드',       github:'taskade' },
  { id: 89, naverKw:['Mem AI notes'],                               yt:'Mem AI notes',           ytKo:'멤 AI',             gt:'Mem AI',           gtKo:'멤 AI',              github:'mem-ai' },
  { id: 90, naverKw:['Reclaim.ai schedule'],                        yt:'Reclaim AI calendar',    ytKo:'리클레임 AI',       gt:'Reclaim AI',       gtKo:'리클레임 AI',        github:'reclaim' },
  { id: 91, naverKw:['Rytr AI writing'],                            yt:'Rytr AI writing',        ytKo:'라이터 AI',         gt:'Rytr AI',          gtKo:'라이터 AI',          github:'rytr' },
  { id: 92, naverKw:['Wordtune AI writing'],                        yt:'Wordtune AI',            ytKo:'워드튠 AI',         gt:'Wordtune AI',      gtKo:'워드튠',             github:'wordtune' },
  // ── 디자인 (93-100) ──
  { id: 93, naverKw:['Framer AI website'],                          yt:'Framer AI website',      ytKo:'프레이머 AI',       gt:'Framer AI',        gtKo:'프레이머 AI',        github:'framer' },
  { id: 94, naverKw:['Looka AI logo'],                              yt:'Looka AI logo design',   ytKo:'루카 AI',           gt:'Looka AI',         gtKo:'루카 AI',            github:'looka' },
  { id: 95, naverKw:['Khroma AI color'],                            yt:'Khroma AI color',        ytKo:'크로마 AI',         gt:'Khroma AI',        gtKo:'크로마 AI',          github:'khroma' },
  { id: 96, naverKw:['Relume AI sitemap'],                          yt:'Relume AI website',      ytKo:'릴루미 AI',         gt:'Relume AI',        gtKo:'릴루미 AI',          github:'relume' },
  { id: 97, naverKw:['Remove.bg background'],                       yt:'Remove.bg background',   ytKo:'리무브 배경제거',   gt:'Remove.bg',        gtKo:'배경 제거 AI',       github:'remove-bg' },
  { id: 98, naverKw:['Cleanup.pictures AI'],                        yt:'Cleanup pictures AI',    ytKo:'클린업 AI',         gt:'Cleanup.pictures', gtKo:'클린업 AI',          github:'cleanup-pictures' },
  { id: 99, naverKw:['Spline AI 3D'],                               yt:'Spline AI 3D design',    ytKo:'스플라인 AI',       gt:'Spline AI',        gtKo:'스플라인 AI',        github:'spline' },
  { id: 100, naverKw:['Visily AI UI'],                              yt:'Visily AI UI design',    ytKo:'비질리 AI',         gt:'Visily AI',        gtKo:'비질리 AI',          github:'visily' },
  // ── 챗봇 앱 (101-110) ──
  { id: 101, naverKw:['Replika AI companion','레플리카'],           yt:'Replika AI app',         ytKo:'레플리카 AI',       gt:'Replika AI',       gtKo:'레플리카',           github:'replika' },
  { id: 102, naverKw:['Pi AI Inflection','파이 AI'],               yt:'Pi AI Inflection',       ytKo:'파이 AI',           gt:'Pi AI',            gtKo:'파이 AI',            github:'inflection-ai' },
  { id: 103, naverKw:['Meta AI assistant','메타 AI'],              yt:'Meta AI assistant',      ytKo:'메타 AI',           gt:'Meta AI',          gtKo:'메타 AI',            github:'meta-ai' },
  { id: 104, naverKw:['Talkie AI app','토키 AI'],                  yt:'Talkie AI character',    ytKo:'토키 AI',           gt:'Talkie AI',        gtKo:'토키 AI',            github:'talkie' },
  { id: 105, naverKw:['Kindroid AI companion'],                     yt:'Kindroid AI app',        ytKo:'킨드로이드 AI',     gt:'Kindroid AI',      gtKo:'킨드로이드 AI',      github:'kindroid' },
  { id: 106, naverKw:['Chai AI chatbot'],                           yt:'Chai AI app',            ytKo:'차이 AI',           gt:'Chai AI',          gtKo:'차이 AI',            github:'chai-ai' },
  { id: 107, naverKw:['Anima AI friend'],                           yt:'Anima AI app',           ytKo:'애니마 AI',         gt:'Anima AI',         gtKo:'애니마 AI',          github:'anima-ai' },
  { id: 108, naverKw:['Hume AI empathic'],                          yt:'Hume AI voice',          ytKo:'휴미 AI',           gt:'Hume AI',          gtKo:'휴미 AI',            github:'hume-ai' },
  { id: 109, naverKw:['Woebot mental health AI'],                   yt:'Woebot AI therapy',      ytKo:'워봇 AI',           gt:'Woebot AI',        gtKo:'워봇 AI',            github:'woebot' },
  { id: 110, naverKw:['Kuki AI chatbot'],                           yt:'Kuki AI chatbot',        ytKo:'쿠키 AI',           gt:'Kuki AI',          gtKo:'쿠키 AI',            github:'kuki-ai' },
  // ── 사진편집 앱 (111-123) ──
  { id: 111, naverKw:['Lensa AI photo','렌사 AI'],                  yt:'Lensa AI app',           ytKo:'렌사 AI',           gt:'Lensa AI',         gtKo:'렌사 AI',            github:'lensa' },
  { id: 112, naverKw:['Photoroom AI photo'],                        yt:'Photoroom AI app',       ytKo:'포토룸 AI',         gt:'Photoroom AI',     gtKo:'포토룸 AI',          github:'photoroom' },
  { id: 113, naverKw:['Remini AI photo enhance','리미니'],          yt:'Remini AI photo',        ytKo:'리미니 AI',         gt:'Remini AI',        gtKo:'리미니 AI',          github:'remini' },
  { id: 114, naverKw:['Facetune AI photo'],                         yt:'Facetune AI app',        ytKo:'페이스튠 AI',       gt:'Facetune AI',      gtKo:'페이스튠',           github:'facetune' },
  { id: 115, naverKw:['Prisma AI art filter'],                      yt:'Prisma AI art',          ytKo:'프리즈마 AI',       gt:'Prisma AI',        gtKo:'프리즈마 AI',        github:'prisma' },
  { id: 116, naverKw:['Pixelcut AI photo'],                         yt:'Pixelcut AI app',        ytKo:'픽셀컷 AI',         gt:'Pixelcut AI',      gtKo:'픽셀컷 AI',          github:'pixelcut' },
  { id: 117, naverKw:['Wombo Dream AI art'],                        yt:'Wombo Dream AI',         ytKo:'웜보 드림 AI',      gt:'Wombo Dream AI',   gtKo:'웜보 드림',          github:'wombo' },
  { id: 118, naverKw:['Starryai art generator'],                    yt:'Starryai AI art',        ytKo:'스타리 AI',         gt:'Starryai',         gtKo:'스타리 AI',          github:'starryai' },
  { id: 119, naverKw:['Meitu AI photo','메이투'],                   yt:'Meitu AI photo',         ytKo:'메이투 AI',         gt:'Meitu AI',         gtKo:'메이투',             github:'meitu' },
  { id: 120, naverKw:['PicsArt AI photo'],                          yt:'PicsArt AI editor',      ytKo:'픽스아트 AI',       gt:'PicsArt AI',       gtKo:'픽스아트 AI',        github:'picsart' },
  { id: 121, naverKw:['Reface AI face swap'],                       yt:'Reface AI app',          ytKo:'리페이스 AI',       gt:'Reface AI',        gtKo:'리페이스 AI',        github:'reface' },
  { id: 122, naverKw:['FaceApp AI filter'],                         yt:'FaceApp AI',             ytKo:'페이스앱 AI',       gt:'FaceApp AI',       gtKo:'페이스앱',           github:'faceapp' },
  { id: 123, naverKw:['Photoleap AI photo'],                        yt:'Photoleap AI app',       ytKo:'포토립 AI',         gt:'Photoleap AI',     gtKo:'포토립 AI',          github:'photoleap' },
  { id: 124, naverKw:['Deep Nostalgia AI photo'],                   yt:'Deep Nostalgia AI',      ytKo:'딥 노스탤지아 AI',  gt:'Deep Nostalgia AI',gtKo:'딥 노스탤지아',      github:'myheritage' },
  // ── 영상 앱 (125-129) ──
  { id: 125, naverKw:['Captions AI video app'],                     yt:'Captions AI app',        ytKo:'캡션스 AI',         gt:'Captions AI',      gtKo:'캡션스 AI',          github:'captions' },
  { id: 126, naverKw:['D-ID AI avatar','디아이디 AI'],              yt:'D-ID AI avatar video',   ytKo:'디아이디 AI',       gt:'D-ID AI',          gtKo:'디아이디 AI',        github:'d-id' },
  { id: 127, naverKw:['Filmora AI video','필모라 AI'],              yt:'Filmora AI video editor',ytKo:'필모라 AI',         gt:'Filmora AI',       gtKo:'필모라 AI',          github:'filmora' },
  { id: 128, naverKw:['Pixverse AI video'],                         yt:'Pixverse AI video',      ytKo:'픽스버스 AI',       gt:'Pixverse AI',      gtKo:'픽스버스 AI',        github:'pixverse' },
  { id: 129, naverKw:['Haiper AI video'],                           yt:'Haiper AI video',        ytKo:'하이퍼 AI',         gt:'Haiper AI',        gtKo:'하이퍼 AI',          github:'haiper' },
  // ── 오디오 앱 (130-134) ──
  { id: 130, naverKw:['Voicemod AI voice'],                         yt:'Voicemod AI voice',      ytKo:'보이스모드 AI',     gt:'Voicemod AI',      gtKo:'보이스모드',         github:'voicemod' },
  { id: 131, naverKw:['Resemble AI voice clone'],                   yt:'Resemble AI voice',      ytKo:'리셈블 AI',         gt:'Resemble AI',      gtKo:'리셈블 AI',          github:'resemble-ai' },
  { id: 132, naverKw:['Play.ht AI voice'],                          yt:'Play.ht AI TTS',         ytKo:'플레이HT AI',       gt:'Play.ht AI',       gtKo:'플레이HT',           github:'playht' },
  { id: 133, naverKw:['Podcastle AI podcast'],                      yt:'Podcastle AI podcast',   ytKo:'팟캐슬 AI',         gt:'Podcastle AI',     gtKo:'팟캐슬 AI',          github:'podcastle' },
  { id: 134, naverKw:['Boomy AI music'],                            yt:'Boomy AI music',         ytKo:'부미 AI',           gt:'Boomy AI',         gtKo:'부미 AI',            github:'boomy' },
  // ── 생산성 앱 (135-139) ──
  { id: 135, naverKw:['Speechify AI text read'],                    yt:'Speechify AI app',       ytKo:'스피치파이 AI',     gt:'Speechify AI',     gtKo:'스피치파이 AI',      github:'speechify' },
  { id: 136, naverKw:['Motion AI schedule'],                        yt:'Motion AI calendar',     ytKo:'모션 AI',           gt:'Motion AI',        gtKo:'모션 AI',            github:'motion' },
  { id: 137, naverKw:['Krisp AI noise cancel'],                     yt:'Krisp AI noise',         ytKo:'크리스프 AI',       gt:'Krisp AI',         gtKo:'크리스프 AI',        github:'krisp' },
  { id: 138, naverKw:['Superhuman AI email'],                       yt:'Superhuman AI email',    ytKo:'슈퍼휴먼 AI',       gt:'Superhuman AI',    gtKo:'슈퍼휴먼 AI',        github:'superhuman' },
  { id: 139, naverKw:['Lindy AI automation'],                       yt:'Lindy AI agent',         ytKo:'린디 AI',           gt:'Lindy AI',         gtKo:'린디 AI',            github:'lindy-ai' },
  // ── 교육 앱 (140-145) ──
  { id: 140, naverKw:['Duolingo Max AI','듀오링고 AI'],             yt:'Duolingo Max AI',        ytKo:'듀오링고 AI',       gt:'Duolingo Max AI',  gtKo:'듀오링고 AI',        github:'duolingo' },
  { id: 141, naverKw:['Elsa Speak AI english'],                     yt:'Elsa Speak AI app',      ytKo:'엘사 스픽 AI',      gt:'Elsa Speak AI',    gtKo:'엘사 스픽',          github:'elsa-speak' },
  { id: 142, naverKw:['Speak AI language'],                         yt:'Speak AI language app',  ytKo:'스피크 AI',         gt:'Speak AI',         gtKo:'스피크 AI',          github:'speak' },
  { id: 143, naverKw:['QuillBot AI writing','퀼봇'],                yt:'QuillBot AI paraphrase', ytKo:'퀼봇 AI',           gt:'QuillBot AI',      gtKo:'퀼봇 AI',            github:'quillbot' },
  { id: 144, naverKw:['Photomath AI math'],                         yt:'Photomath AI app',       ytKo:'포토매스 AI',       gt:'Photomath AI',     gtKo:'포토매스 AI',        github:'photomath' },
  { id: 145, naverKw:['Socratic Google AI'],                        yt:'Socratic AI app',        ytKo:'소크라틱 AI',       gt:'Socratic AI',      gtKo:'소크라틱 AI',        github:'socratic' },
  // ── 검색·디자인 앱 (146-150) ──
  { id: 146, naverKw:['Liner AI highlight'],                        yt:'Liner AI search',        ytKo:'라이너 AI',         gt:'Liner AI',         gtKo:'라이너 AI',          github:'liner' },
  { id: 147, naverKw:['Google Lens AI','구글 렌즈'],                yt:'Google Lens AI',         ytKo:'구글 렌즈',         gt:'Google Lens',      gtKo:'구글 렌즈',          github:'google-lens' },
  { id: 148, naverKw:['Microsoft Designer AI'],                     yt:'Microsoft Designer AI',  ytKo:'마이크로소프트 디자이너',gt:'Microsoft Designer',gtKo:'마이크로소프트 디자이너',github:'microsoft-designer' },
  { id: 149, naverKw:['Adobe Express AI'],                          yt:'Adobe Express AI',       ytKo:'어도비 익스프레스', gt:'Adobe Express AI', gtKo:'어도비 익스프레스',  github:'adobe-express' },
  { id: 150, naverKw:['Fotor AI photo editor'],                     yt:'Fotor AI photo',         ytKo:'포터 AI',           gt:'Fotor AI',         gtKo:'포터 AI',            github:'fotor' },
  // ── 코딩 추가 (151-158) ──
  { id: 151, naverKw:['Devin AI','데빈 AI'],                        yt:'Devin AI software engineer', ytKo:'데빈 AI',          gt:'Devin AI',         gtKo:'데빈 AI',            github:'devin' },
  { id: 152, naverKw:['Lovable AI','러버블 AI'],                    yt:'Lovable AI app builder',     ytKo:'러버블 AI',         gt:'Lovable AI',       gtKo:'러버블 AI',           github:'lovable' },
  { id: 153, naverKw:['Amazon Q Developer','아마존 Q'],             yt:'Amazon Q Developer',         ytKo:'아마존 Q 개발자',   gt:'Amazon Q Developer', gtKo:'아마존 Q',          github:'amazon-q' },
  { id: 154, naverKw:['JetBrains AI','젯브레인 AI'],               yt:'JetBrains AI Assistant',     ytKo:'젯브레인 AI',       gt:'JetBrains AI',     gtKo:'젯브레인 AI',         github:'jetbrains-ai' },
  { id: 155, naverKw:['Continue dev AI coding'],                    yt:'Continue dev AI',            ytKo:'컨티뉴 AI',         gt:'Continue.dev AI',  gtKo:'컨티뉴 AI',           github:'continuedev' },
  { id: 156, naverKw:['Aider AI coding'],                           yt:'Aider AI pair programmer',   ytKo:'에이더 AI',         gt:'Aider AI coding',  gtKo:'에이더 AI',           github:'aider' },
  { id: 157, naverKw:['Zed editor AI'],                             yt:'Zed editor AI',              ytKo:'제드 에디터',       gt:'Zed editor',       gtKo:'제드 AI 에디터',      github:'zed-industries' },
  { id: 158, naverKw:['Cline AI agent','클라인 AI'],               yt:'Cline AI coding agent',      ytKo:'클라인 AI',         gt:'Cline AI agent',   gtKo:'클라인 AI',           github:'cline' },
  // ── 텍스트 추가 (159-163) ──
  { id: 159, naverKw:['뤼튼 AI','WRTN AI'],                         yt:'뤼튼 AI',                    ytKo:'뤼튼 AI',           gt:'WRTN AI',          gtKo:'뤼튼 AI',             github:'wrtn' },
  { id: 160, naverKw:['Gemma Google AI','젬마 AI'],                 yt:'Google Gemma AI',            ytKo:'구글 젬마 AI',      gt:'Google Gemma',     gtKo:'구글 젬마',           github:'google-gemma' },
  { id: 161, naverKw:['EXAONE LG AI','엑사원'],                     yt:'EXAONE LG AI',               ytKo:'엑사원 AI',         gt:'EXAONE AI',        gtKo:'엑사원',              github:'exaone' },
  { id: 162, naverKw:['Solar AI Upstage','솔라 AI'],                yt:'Solar AI Upstage',           ytKo:'솔라 AI 업스테이지', gt:'Upstage Solar AI', gtKo:'솔라 AI',            github:'upstage-solar' },
  { id: 163, naverKw:['InternLM AI'],                               yt:'InternLM AI model',          ytKo:'인턴LM AI',         gt:'InternLM',         gtKo:'인턴LM',              github:'internlm' },
  // ── 검색 추가 (164-167) ──
  { id: 164, naverKw:['Consensus AI research'],                     yt:'Consensus AI search',        ytKo:'컨센서스 AI',       gt:'Consensus AI',     gtKo:'컨센서스 AI',         github:'consensus' },
  { id: 165, naverKw:['SciSpace AI paper'],                         yt:'SciSpace AI research',       ytKo:'사이스페이스 AI',   gt:'SciSpace AI',      gtKo:'사이스페이스 AI',     github:'scispace' },
  { id: 166, naverKw:['Semantic Scholar AI'],                       yt:'Semantic Scholar AI',        ytKo:'시맨틱 스칼라',     gt:'Semantic Scholar', gtKo:'시맨틱 스칼라',       github:'semantic-scholar' },
  { id: 167, naverKw:['Research Rabbit AI'],                        yt:'Research Rabbit paper',      ytKo:'리서치 래빗',       gt:'Research Rabbit',  gtKo:'리서치 래빗',         github:'research-rabbit' },
  // ── 이미지 추가 (168-174) ──
  { id: 168, naverKw:['Imagen 3 Google','이마젠 3'],                yt:'Google Imagen 3',            ytKo:'구글 이마젠 3',     gt:'Imagen 3 Google',  gtKo:'구글 이마젠',         github:'imagen' },
  { id: 169, naverKw:['Recraft AI design'],                         yt:'Recraft AI image',           ytKo:'리크래프트 AI',     gt:'Recraft AI',       gtKo:'리크래프트 AI',       github:'recraft' },
  { id: 170, naverKw:['Flair AI product photo'],                    yt:'Flair AI product',           ytKo:'플레어 AI',         gt:'Flair AI',         gtKo:'플레어 AI',           github:'flair-ai' },
  { id: 171, naverKw:['Clipdrop AI','클립드롭'],                    yt:'Clipdrop Stability AI',      ytKo:'클립드롭 AI',       gt:'Clipdrop AI',      gtKo:'클립드롭',            github:'clipdrop' },
  { id: 172, naverKw:['Magnific AI upscale'],                       yt:'Magnific AI upscale',        ytKo:'매그니픽 AI',       gt:'Magnific AI',      gtKo:'매그니픽 AI',         github:'magnific' },
  { id: 173, naverKw:['ComfyUI Stable Diffusion','컴피UI'],         yt:'ComfyUI tutorial',           ytKo:'컴피UI',            gt:'ComfyUI',          gtKo:'컴피UI',              github:'comfyanonymous' },
  { id: 174, naverKw:['InvokeAI image generation'],                 yt:'InvokeAI image AI',          ytKo:'인보크 AI',         gt:'InvokeAI',         gtKo:'인보크 AI',           github:'invoke-ai' },
  // ── 영상 추가 (175-181) ──
  { id: 175, naverKw:['Veo 2 Google video','베오 AI'],              yt:'Google Veo 2 video',         ytKo:'구글 베오 2',       gt:'Google Veo 2',     gtKo:'구글 베오',           github:'veo' },
  { id: 176, naverKw:['Hailuo AI video','하이루오 AI'],             yt:'Hailuo AI video',            ytKo:'하이루오 AI',       gt:'Hailuo AI',        gtKo:'하이루오 AI',         github:'hailuo' },
  { id: 177, naverKw:['Wan AI video','완 AI 영상'],                 yt:'Wan AI video generation',    ytKo:'완 AI',             gt:'Wan AI video',     gtKo:'완 AI',               github:'wanvideo' },
  { id: 178, naverKw:['Opus Clip video','오퍼스 클립'],             yt:'Opus Clip AI shorts',        ytKo:'오퍼스 클립',       gt:'Opus Clip',        gtKo:'오퍼스 클립',         github:'opus-clip' },
  { id: 179, naverKw:['Veed.io AI video','비드 AI'],               yt:'Veed.io AI editor',          ytKo:'비드 AI',           gt:'Veed.io AI',       gtKo:'비드 AI',             github:'veed-io' },
  { id: 180, naverKw:['Kapwing AI video'],                          yt:'Kapwing AI editor',          ytKo:'캡윙 AI',           gt:'Kapwing AI',       gtKo:'캡윙 AI',             github:'kapwing' },
  { id: 181, naverKw:['InVideo AI video'],                          yt:'InVideo AI',                 ytKo:'인비디오 AI',       gt:'InVideo AI',       gtKo:'인비디오 AI',         github:'invideo' },
  // ── 오디오 추가 (182-186) ──
  { id: 182, naverKw:['Murf AI voice','머프 AI'],                   yt:'Murf AI voiceover',          ytKo:'머프 AI',           gt:'Murf AI',          gtKo:'머프 AI',             github:'murf-ai' },
  { id: 183, naverKw:['AIVA AI music','아이바 음악'],               yt:'AIVA AI music composer',     ytKo:'아이바 AI',         gt:'AIVA AI music',    gtKo:'아이바 AI',           github:'aiva' },
  { id: 184, naverKw:['Soundraw AI music'],                         yt:'Soundraw AI music',          ytKo:'사운드로우 AI',     gt:'Soundraw AI',      gtKo:'사운드로우',          github:'soundraw' },
  { id: 185, naverKw:['Whisper OpenAI','위스퍼 AI'],               yt:'OpenAI Whisper speech',      ytKo:'위스퍼 AI',         gt:'OpenAI Whisper',   gtKo:'위스퍼',              github:'openai-whisper' },
  { id: 186, naverKw:['Adobe Podcast AI','어도비 팟캐스트'],        yt:'Adobe Podcast enhance',      ytKo:'어도비 팟캐스트',   gt:'Adobe Podcast AI', gtKo:'어도비 팟캐스트',     github:'adobe-podcast' },
  // ── 생산성 추가 (187-193) ──
  { id: 187, naverKw:['Coda AI docs'],                              yt:'Coda AI features',           ytKo:'코다 AI',           gt:'Coda AI',          gtKo:'코다 AI',             github:'coda' },
  { id: 188, naverKw:['ClickUp AI','클릭업 AI'],                   yt:'ClickUp AI features',        ytKo:'클릭업 AI',         gt:'ClickUp AI',       gtKo:'클릭업 AI',           github:'clickup' },
  { id: 189, naverKw:['Tana AI notes'],                             yt:'Tana AI notes',              ytKo:'타나 AI',           gt:'Tana AI',          gtKo:'타나 AI',             github:'tana' },
  { id: 190, naverKw:['Reflect notes AI'],                          yt:'Reflect notes AI',           ytKo:'리플렉트 노트',     gt:'Reflect notes AI', gtKo:'리플렉트 AI',         github:'reflect' },
  { id: 191, naverKw:['CLOVA Note','클로바 노트'],                  yt:'CLOVA Note 네이버',          ytKo:'클로바 노트',       gt:'Clova Note Naver', gtKo:'클로바 노트',         github:'clova-note' },
  { id: 192, naverKw:['Napkin AI diagram'],                         yt:'Napkin AI visual',           ytKo:'냅킨 AI',           gt:'Napkin AI',        gtKo:'냅킨 AI',             github:'napkin-ai' },
  { id: 193, naverKw:['Granola AI meeting','그래놀라 AI'],          yt:'Granola AI notes',           ytKo:'그래놀라 AI',       gt:'Granola AI',       gtKo:'그래놀라 AI',         github:'granola' },
  // ── 디자인·사진 추가 (194-197) ──
  { id: 194, naverKw:['Kittl design AI','키틀 디자인'],             yt:'Kittl AI design',            ytKo:'키틀 AI',           gt:'Kittl AI',         gtKo:'키틀 AI',             github:'kittl' },
  { id: 195, naverKw:['Topaz Photo AI','토파즈 AI'],               yt:'Topaz Photo AI enhance',     ytKo:'토파즈 AI',         gt:'Topaz Photo AI',   gtKo:'토파즈 AI',           github:'topazlabs' },
  { id: 196, naverKw:['Upscayl AI upscale','업스케일 AI'],          yt:'Upscayl AI upscale',         ytKo:'업스케일 AI',       gt:'Upscayl AI',       gtKo:'업스케일 AI',         github:'upscayl' },
  { id: 197, naverKw:['Pixlr AI editor','픽슬러 AI'],              yt:'Pixlr AI photo editor',      ytKo:'픽슬러 AI',         gt:'Pixlr AI',         gtKo:'픽슬러 AI',           github:'pixlr' },
  // ── 자동화·에이전트 추가 (198-200) ──
  { id: 198, naverKw:['AutoGPT AI agent','오토GPT'],               yt:'AutoGPT AI agent',           ytKo:'오토GPT',           gt:'AutoGPT',          gtKo:'오토GPT',             github:'significant-gravitas' },
  { id: 199, naverKw:['Dify AI platform','다이파이'],               yt:'Dify AI LLM platform',       ytKo:'다이파이 AI',       gt:'Dify AI',          gtKo:'다이파이 AI',         github:'langgenius' },
  { id: 200, naverKw:['Flowise AI workflow','플로와이즈'],          yt:'Flowise AI builder',         ytKo:'플로와이즈 AI',     gt:'Flowise AI',       gtKo:'플로와이즈 AI',       github:'flowiseai' },
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

// ─── YouTube Trends (Google Trends gprop=youtube, 5개씩 배치) ─────────────────
// kwField: 'yt' (영어) 또는 'ytKo' (한국어)
async function fetchYoutubeTrends(chunk, kwField = 'yt') {
  try {
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
    console.warn(`YouTube Trends error [${kwField}]:`, e.message);
    return {};
  }
}

// ─── Google Trends (5개씩 배치) ───────────────────────────────────────────────
// kwField: 'gt' (영어) 또는 'gtKo' (한국어)
async function fetchGoogleTrends(chunk, kwField = 'gt') {
  try {
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
    console.warn(`Google Trends error [${kwField}]:`, e.message);
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
        
        for (const [id, val] of Object.entries(enRes)) ytEn[id] = val;
        for (const [id, val] of Object.entries(koRes)) ytKo[id] = val;
        
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
        
        for (const [id, val] of Object.entries(enRes)) gtEn[id] = val;
        for (const [id, val] of Object.entries(koRes)) gtKo[id] = val;
        
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
    const n  = norm.naver[tool.id]   ?? 0;
    const y  = norm.youtube[tool.id] ?? 0;
    const gt = norm.gtrends[tool.id] ?? 0;
    const g  = norm.github[tool.id]  ?? 0;

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

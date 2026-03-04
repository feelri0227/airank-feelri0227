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

  // ── Naver DataLab (5개씩 배치, 한/영 이미 포함) ──────────────────────────
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

  // ── YouTube Trends: 영어 패스 ────────────────────────────────────────────
  console.log('🔴 YouTube Trends 수집 중 (영어)...');
  const ytEn = Object.fromEntries(TOOLS.map((t) => [t.id, 0]));
  let ytEnSuccess = 0;
  for (let i = 0; i < TOOLS.length; i += chunkSize) {
    const chunk = TOOLS.slice(i, i + chunkSize);
    const result = await fetchYoutubeTrends(chunk, 'yt');
    for (const [id, val] of Object.entries(result)) {
      ytEn[id] = val;
      if (val > 0) ytEnSuccess++;
    }
    await sleep(1500);
  }
  console.log(`   영어 완료 (${ytEnSuccess}개)`);

  // ── YouTube Trends: 한국어 패스 ─────────────────────────────────────────
  console.log('🔴 YouTube Trends 수집 중 (한국어)...');
  const ytKo = Object.fromEntries(TOOLS.map((t) => [t.id, 0]));
  let ytKoSuccess = 0;
  for (let i = 0; i < TOOLS.length; i += chunkSize) {
    const chunk = TOOLS.slice(i, i + chunkSize);
    const result = await fetchYoutubeTrends(chunk, 'ytKo');
    for (const [id, val] of Object.entries(result)) {
      ytKo[id] = val;
      if (val > 0) ytKoSuccess++;
    }
    await sleep(1500);
  }
  console.log(`   한국어 완료 (${ytKoSuccess}개)`);

  // 영어+한국어 평균 합산
  const ytMerged = mergeScores(ytEn, ytKo, toolIds);
  for (const id of toolIds) raw.youtube[id] = ytMerged[id];
  const ytTotal = Object.values(ytMerged).filter((v) => v > 0).length;
  console.log(`   ✅ YouTube Trends 완료 (유효 데이터: ${ytTotal}개)`);

  // ── Google Trends: 영어 패스 ─────────────────────────────────────────────
  console.log('📈 Google Trends 수집 중 (영어)...');
  const gtEn = Object.fromEntries(TOOLS.map((t) => [t.id, 0]));
  let gtEnSuccess = 0;
  for (let i = 0; i < TOOLS.length; i += chunkSize) {
    const chunk = TOOLS.slice(i, i + chunkSize);
    const result = await fetchGoogleTrends(chunk, 'gt');
    for (const [id, val] of Object.entries(result)) {
      gtEn[id] = val;
      if (val > 0) gtEnSuccess++;
    }
    await sleep(1500);
  }
  console.log(`   영어 완료 (${gtEnSuccess}개)`);

  // ── Google Trends: 한국어 패스 ──────────────────────────────────────────
  console.log('📈 Google Trends 수집 중 (한국어)...');
  const gtKo = Object.fromEntries(TOOLS.map((t) => [t.id, 0]));
  let gtKoSuccess = 0;
  for (let i = 0; i < TOOLS.length; i += chunkSize) {
    const chunk = TOOLS.slice(i, i + chunkSize);
    const result = await fetchGoogleTrends(chunk, 'gtKo');
    for (const [id, val] of Object.entries(result)) {
      gtKo[id] = val;
      if (val > 0) gtKoSuccess++;
    }
    await sleep(1500);
  }
  console.log(`   한국어 완료 (${gtKoSuccess}개)`);

  // 영어+한국어 평균 합산
  const gtMerged = mergeScores(gtEn, gtKo, toolIds);
  for (const id of toolIds) raw.gtrends[id] = gtMerged[id];
  const gtTotal = Object.values(gtMerged).filter((v) => v > 0).length;
  console.log(`   ✅ Google Trends 완료 (유효 데이터: ${gtTotal}개)`);

  // ── GitHub ──────────────────────────────────────────────────────────────
  console.log('🟣 GitHub 수집 중...');
  for (const tool of TOOLS) {
    raw.github[tool.id] = await fetchGitHub(tool);
    await sleep(process.env.GITHUB_TOKEN ? 2100 : 1200);
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
  // score = 네이버×0.25 + YouTube Trends×0.25 + Google Trends×0.25 + GitHub×0.25
  const baseWeights = { naver: 0.25, youtube: 0.25, gtrends: 0.25, github: 0.25 };
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

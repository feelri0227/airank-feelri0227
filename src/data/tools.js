/**
 * AI 도구 데이터
 * score = naver×0.30 + youtube×0.25 + reddit×0.20 + github×0.25
 * sns 점수는 현재 추정값 (추후 API 연동으로 자동 갱신 예정)
 */
export const TOOLS_DATA = [
  { id: 1,  cat: "text",         icon: "🤖", name: "ChatGPT",          desc: "OpenAI의 대화형 AI. 보고서 작성, 이메일 초안, 브레인스토밍 등 일상 업무 전반에 활용되는 AI의 대명사.",                                     tags: ["텍스트", "무료", "API"],          score: 94, change:  1.2, sns: { naver: 100, youtube: 100, reddit: 99, github: 78 }, free: true,  life: ["office","student","freelancer","marketer","startup","creator"] },
  { id: 2,  cat: "text",         icon: "🧠", name: "Claude",            desc: "Anthropic의 AI 어시스턴트. 긴 문서 요약, 코드 작성, 창의적 글쓰기에서 뛰어난 성능. 200K 컨텍스트 지원.",                                   tags: ["텍스트", "무료", "API"],          score: 79, change:  5.3, sns: { naver:  82, youtube:  85, reddit: 88, github: 62 }, free: true,  life: ["office","student","freelancer","startup"] },
  { id: 3,  cat: "text",         icon: "💎", name: "Gemini",            desc: "Google DeepMind의 멀티모달 AI. 텍스트·이미지·오디오·비디오를 동시에 이해하고 생성하는 구글의 최신 모델.",                                   tags: ["멀티모달", "무료", "API"],        score: 81, change:  3.8, sns: { naver:  88, youtube:  88, reddit: 82, github: 65 }, free: true,  life: ["office","student","startup","marketer"] },
  { id: 4,  cat: "text",         icon: "🐋", name: "DeepSeek",          desc: "중국 스타트업의 오픈소스 AI. GPT-4급 성능을 대폭 저렴한 비용으로 구현해 AI 업계를 뒤흔든 화제의 모델.",                                     tags: ["텍스트", "무료", "오픈소스"],     score: 91, change: 12.5, sns: { naver:  88, youtube:  92, reddit: 88, github: 95 }, free: true,  life: ["office","student","startup","freelancer"] },
  { id: 5,  cat: "text",         icon: "🦅", name: "Grok",              desc: "Elon Musk의 xAI가 만든 AI. 실시간 X 데이터 접근과 유머러스하고 직설적인 답변이 특징인 차세대 LLM.",                                        tags: ["텍스트", "유료", "API"],          score: 75, change:  4.5, sns: { naver:  72, youtube:  75, reddit: 72, github: 80 }, free: false, life: ["office","startup","student"] },
  { id: 6,  cat: "text",         icon: "🦙", name: "Llama",             desc: "Meta의 오픈소스 LLM. 로컬 실행부터 파인튜닝까지 자유롭게 활용 가능한 개발자 친화적 AI 모델.",                                              tags: ["텍스트", "무료", "오픈소스"],     score: 79, change:  2.8, sns: { naver:  55, youtube:  78, reddit: 92, github: 98 }, free: true,  life: ["startup","freelancer","student"] },
  { id: 7,  cat: "text",         icon: "🌪️", name: "Mistral AI",       desc: "유럽발 오픈소스 AI. 효율적인 아키텍처로 작은 모델에서도 뛰어난 성능. 자체 서버에 배포해 완전한 데이터 통제 가능.",                          tags: ["텍스트", "무료", "오픈소스"],     score: 68, change:  3.8, sns: { naver:  45, youtube:  62, reddit: 78, github: 92 }, free: true,  life: ["startup","freelancer"] },
  { id: 8,  cat: "text",         icon: "💬", name: "Character.AI",      desc: "다양한 캐릭터와 대화하는 AI 플랫폼. 셀럽·애니 캐릭터부터 직접 만든 AI 페르소나까지 무한 대화.",                                            tags: ["텍스트", "무료", "채팅"],         score: 67, change:  1.5, sns: { naver:  75, youtube:  82, reddit: 90, github: 25 }, free: true,  life: ["student","creator"] },
  { id: 9,  cat: "text",         icon: "📚", name: "Poe",               desc: "Claude, GPT-4, Gemini 등 다양한 AI를 한 곳에서 이용하는 Quora의 AI 허브 플랫폼.",                                                         tags: ["텍스트", "무료", "멀티모델"],     score: 52, change: -0.8, sns: { naver:  60, youtube:  65, reddit: 62, github: 20 }, free: true,  life: ["office","student","freelancer"] },

  { id: 10, cat: "image",        icon: "🎨", name: "Midjourney",        desc: "텍스트 프롬프트로 영화 같은 이미지를 만드는 AI. Discord 기반, 아티스트·디자이너 필수 도구.",                                               tags: ["이미지 생성", "유료", "Discord"], score: 73, change:  2.1, sns: { naver:  78, youtube:  95, reddit: 92, github: 28 }, free: false, life: ["creator","freelancer","marketer"] },
  { id: 11, cat: "image",        icon: "🖼️", name: "Stable Diffusion",  desc: "오픈소스 이미지 생성 AI. 로컬에서 무료 실행 가능, 커스터마이즈 자유도 최고의 이미지 생성 모델.",                                           tags: ["이미지 생성", "무료", "오픈소스"], score: 86, change: -0.5, sns: { naver:  65, youtube:  90, reddit: 95, github: 98 }, free: true,  life: ["creator","freelancer","startup"] },
  { id: 12, cat: "image",        icon: "🎯", name: "DALL-E 3",          desc: "OpenAI의 이미지 생성 AI. ChatGPT와 통합되어 대화 중 자연스럽게 이미지를 생성하고 수정 가능.",                                               tags: ["이미지 생성", "유료", "API"],     score: 69, change:  1.8, sns: { naver:  78, youtube:  85, reddit: 80, github: 32 }, free: false, life: ["creator","marketer","freelancer"] },
  { id: 13, cat: "image",        icon: "🦋", name: "Adobe Firefly",     desc: "Adobe의 생성형 AI. Photoshop·Illustrator에 통합되어 상업적으로 안전한 이미지 생성·편집 지원.",                                           tags: ["이미지 생성", "유료", "Adobe"],   score: 64, change:  3.2, sns: { naver:  72, youtube:  82, reddit: 72, github: 30 }, free: false, life: ["creator","marketer","freelancer","office"] },
  { id: 14, cat: "image",        icon: "🏛️", name: "Leonardo AI",      desc: "게임 아트·캐릭터 디자인에 특화된 이미지 AI. 다양한 파인튜닝 모델로 일관된 스타일 유지 가능.",                                              tags: ["이미지 생성", "무료"],            score: 56, change:  2.8, sns: { naver:  55, youtube:  72, reddit: 70, github: 28 }, free: true,  life: ["creator","freelancer"] },
  { id: 15, cat: "image",        icon: "💡", name: "Ideogram",          desc: "텍스트가 포함된 이미지 생성에 강점. 로고·포스터·배너 등 글자가 들어간 디자인 작업에 최적화된 AI.",                                         tags: ["이미지 생성", "무료"],            score: 48, change:  3.5, sns: { naver:  45, youtube:  62, reddit: 65, github: 25 }, free: true,  life: ["marketer","creator"] },
  { id: 16, cat: "image",        icon: "🌊", name: "Flux",              desc: "Stable Diffusion 창시자들이 만든 차세대 오픈소스 이미지 모델. 뛰어난 사실감과 텍스트 표현력이 강점.",                                       tags: ["이미지 생성", "무료", "오픈소스"], score: 69, change:  7.5, sns: { naver:  52, youtube:  70, reddit: 72, github: 85 }, free: true,  life: ["creator","freelancer","startup"] },
  { id: 17, cat: "image",        icon: "🌈", name: "Krea AI",           desc: "스케치를 그리는 즉시 AI가 실시간으로 이미지로 변환하는 라이브 캔버스. 이미지 향상 기능도 탁월.",                                           tags: ["이미지 생성", "무료"],            score: 51, change:  5.8, sns: { naver:  50, youtube:  65, reddit: 60, github: 30 }, free: true,  life: ["creator","freelancer"] },

  { id: 18, cat: "code",         icon: "💻", name: "GitHub Copilot",    desc: "OpenAI와 GitHub이 만든 AI 코딩 어시스턴트. 코드 자동완성부터 함수 생성까지 개발 생산성 극대화.",                                          tags: ["코딩", "유료", "API"],            score: 86, change:  0.8, sns: { naver:  75, youtube:  88, reddit: 95, github: 90 }, free: false, life: ["office","freelancer","student","startup"] },
  { id: 19, cat: "code",         icon: "🖱️", name: "Cursor",           desc: "AI가 내장된 차세대 코드 에디터. 자연어로 코딩하고 코드베이스 전체를 AI와 함께 리팩토링.",                                                   tags: ["코딩", "무료", "에디터"],         score: 81, change:  8.7, sns: { naver:  70, youtube:  82, reddit: 90, github: 85 }, free: true,  life: ["freelancer","startup","student"] },
  { id: 20, cat: "code",         icon: "⚡", name: "Bolt.new",          desc: "브라우저에서 바로 풀스택 앱을 AI로 개발. 프롬프트 하나로 완성된 웹앱을 즉시 생성하고 배포 가능.",                                           tags: ["코딩", "무료", "풀스택"],         score: 78, change:  8.2, sns: { naver:  65, youtube:  80, reddit: 82, github: 88 }, free: true,  life: ["startup","freelancer","student"] },
  { id: 21, cat: "code",         icon: "🏄", name: "Windsurf",          desc: "Codeium이 만든 AI 코드 에디터. Cascade 기능으로 프로젝트 전체 맥락을 이해하고 코드 수정.",                                                  tags: ["코딩", "무료", "에디터"],         score: 67, change:  6.8, sns: { naver:  60, youtube:  72, reddit: 75, github: 65 }, free: true,  life: ["freelancer","startup","student"] },
  { id: 22, cat: "code",         icon: "🔷", name: "v0",                desc: "Vercel의 AI UI 생성 도구. 프롬프트로 React 컴포넌트와 UI를 즉시 생성하고 Vercel에 바로 배포.",                                              tags: ["코딩", "무료", "UI"],             score: 65, change:  5.2, sns: { naver:  62, youtube:  78, reddit: 78, github: 45 }, free: true,  life: ["startup","freelancer"] },
  { id: 23, cat: "code",         icon: "🔁", name: "Replit AI",         desc: "클라우드 기반 AI 코딩 환경. 설치 없이 브라우저에서 개발하고 AI와 함께 디버깅·코드를 생성.",                                                  tags: ["코딩", "무료", "클라우드"],       score: 63, change:  2.8, sns: { naver:  55, youtube:  72, reddit: 72, github: 55 }, free: true,  life: ["student","startup","freelancer"] },
  { id: 24, cat: "code",         icon: "⌨️", name: "Tabnine",          desc: "기업 친화적 AI 코드 자동완성. 프라이빗 코드베이스 학습 가능, 보안이 중요한 기업 환경에 최적.",                                              tags: ["코딩", "유료"],                   score: 60, change: -1.2, sns: { naver:  52, youtube:  65, reddit: 65, github: 60 }, free: false, life: ["office","freelancer","startup"] },

  { id: 25, cat: "video",        icon: "🎬", name: "Sora",              desc: "OpenAI의 텍스트-투-비디오 AI. 프롬프트 하나로 영화 수준의 고화질 영상을 자동 생성.",                                                       tags: ["영상 생성", "유료"],              score: 71, change: 12.4, sns: { naver:  85, youtube:  95, reddit: 85, github: 20 }, free: false, life: ["creator","marketer"] },
  { id: 26, cat: "video",        icon: "🎥", name: "Runway ML",         desc: "전문가용 AI 영상 편집·생성 플랫폼. Gen-3 Alpha 모델로 텍스트와 이미지에서 고품질 영상 생성.",                                               tags: ["영상 생성", "유료"],              score: 63, change:  5.8, sns: { naver:  62, youtube:  80, reddit: 78, github: 35 }, free: false, life: ["creator","freelancer","marketer"] },
  { id: 27, cat: "video",        icon: "🎞️", name: "Kling AI",         desc: "쾌수(Kuaishou)의 AI 영상 생성 도구. 최대 2분 길이의 고품질 영상을 텍스트·이미지로 생성.",                                                  tags: ["영상 생성", "무료"],              score: 58, change:  7.2, sns: { naver:  68, youtube:  72, reddit: 65, github: 28 }, free: true,  life: ["creator","marketer"] },
  { id: 28, cat: "video",        icon: "🌟", name: "Pika Labs",         desc: "직관적인 인터페이스로 텍스트·이미지를 자연스러운 동영상으로 변환. 빠른 생성 속도와 쉬운 조작이 강점.",                                      tags: ["영상 생성", "무료"],              score: 54, change:  2.5, sns: { naver:  55, youtube:  70, reddit: 70, github: 22 }, free: true,  life: ["creator","freelancer"] },
  { id: 29, cat: "video",        icon: "🧑‍💼", name: "HeyGen",         desc: "AI 아바타가 대신 말하는 영상 생성 플랫폼. 마케팅·교육·글로벌 콘텐츠 제작에 최적화된 영상 AI.",                                            tags: ["영상 생성", "유료", "아바타"],    score: 59, change:  4.8, sns: { naver:  65, youtube:  78, reddit: 68, github: 25 }, free: false, life: ["marketer","creator","office"] },
  { id: 30, cat: "video",        icon: "🌙", name: "Luma AI",           desc: "Dream Machine으로 알려진 AI 영상 생성 모델. 부드러운 모션과 현실적인 물리 효과가 특징.",                                                   tags: ["영상 생성", "무료"],              score: 57, change:  3.5, sns: { naver:  52, youtube:  70, reddit: 70, github: 38 }, free: true,  life: ["creator","marketer"] },
  { id: 31, cat: "video",        icon: "👤", name: "Synthesia",         desc: "AI 아바타로 기업 교육·홍보 영상 제작. 스크립트 입력만으로 130개 언어 지원 발표 영상 즉시 생성.",                                          tags: ["영상 생성", "유료", "아바타"],    score: 55, change:  3.2, sns: { naver:  58, youtube:  72, reddit: 62, github: 28 }, free: false, life: ["marketer","office","creator"] },

  { id: 32, cat: "audio",        icon: "🎵", name: "Suno AI",           desc: "텍스트로 완성된 음악을 만드는 AI. 장르·분위기·가사를 입력하면 몇 초 만에 노래 완성.",                                                     tags: ["오디오", "무료"],                 score: 61, change: 15.2, sns: { naver:  65, youtube:  85, reddit: 78, github: 18 }, free: true,  life: ["creator","freelancer"] },
  { id: 33, cat: "audio",        icon: "🗣️", name: "ElevenLabs",       desc: "업계 최고 수준의 AI 음성 합성·복제. 1분 샘플로 나만의 목소리 복제, 30개 이상 언어 지원.",                                                  tags: ["오디오", "무료", "API"],          score: 71, change:  3.5, sns: { naver:  68, youtube:  82, reddit: 80, github: 58 }, free: true,  life: ["creator","marketer","freelancer"] },
  { id: 34, cat: "audio",        icon: "🎶", name: "Udio",              desc: "고품질 AI 음악 생성 플랫폼. 다양한 장르와 스타일의 완성도 높은 음악을 텍스트 프롬프트로 제작.",                                            tags: ["오디오", "무료"],                 score: 54, change:  6.5, sns: { naver:  58, youtube:  70, reddit: 72, github: 20 }, free: true,  life: ["creator","freelancer"] },
  { id: 35, cat: "audio",        icon: "📼", name: "Descript",          desc: "영상·팟캐스트 편집을 텍스트로 하는 AI 에디터. 말 삭제=영상 삭제, AI 더빙·배경음 제거 지원.",                                             tags: ["오디오", "무료", "영상편집"],     score: 56, change:  2.8, sns: { naver:  55, youtube:  70, reddit: 65, github: 35 }, free: true,  life: ["creator","marketer","freelancer"] },

  { id: 36, cat: "search",       icon: "🔍", name: "Perplexity AI",     desc: "실시간 웹 검색과 AI를 결합한 차세대 검색 엔진. 출처 명시로 신뢰할 수 있는 답변을 제공.",                                                   tags: ["검색", "무료", "API"],            score: 69, change:  3.6, sns: { naver:  68, youtube:  80, reddit: 82, github: 48 }, free: true,  life: ["student","office","startup","freelancer"] },
  { id: 37, cat: "search",       icon: "🌐", name: "You.com",           desc: "AI 검색 엔진과 생산성 앱이 결합된 플랫폼. 코딩·리서치·글쓰기 모드로 다양한 AI 작업 지원.",                                                tags: ["검색", "무료"],                   score: 49, change:  0.8, sns: { naver:  42, youtube:  62, reddit: 60, github: 35 }, free: true,  life: ["office","student"] },
  { id: 38, cat: "search",       icon: "🔬", name: "Elicit",            desc: "학술 연구 특화 AI. 논문 검색·요약·분석을 자동화해 연구자의 리뷰 작업 시간을 대폭 단축.",                                                  tags: ["검색", "무료", "학술"],           score: 46, change:  1.5, sns: { naver:  38, youtube:  50, reddit: 58, github: 42 }, free: true,  life: ["student","office"] },

  { id: 39, cat: "productivity",  icon: "🪟", name: "Microsoft Copilot", desc: "Word·Excel·PowerPoint·Teams에 통합된 AI. 문서 요약부터 데이터 분석, 회의 자동화까지 Office 생산성 혁신.", tags: ["생산성", "유료", "Office"],      score: 82, change:  2.5, sns: { naver:  85, youtube:  90, reddit: 80, github: 72 }, free: false, life: ["office","student"] },
  { id: 40, cat: "productivity",  icon: "📝", name: "Notion AI",         desc: "Notion에 통합된 AI. 회의록 요약, 프로젝트 플랜 작성, 액션 아이템 추출 등 업무 효율 극대화.",                                            tags: ["생산성", "유료"],                 score: 68, change:  1.0, sns: { naver:  80, youtube:  82, reddit: 75, github: 35 }, free: false, life: ["office","startup","student"] },
  { id: 41, cat: "productivity",  icon: "📊", name: "Gamma",             desc: "AI가 자동으로 프레젠테이션을 만들어주는 도구. 텍스트 입력만으로 디자인된 슬라이드를 즉시 완성.",                                          tags: ["생산성", "무료", "PT"],           score: 62, change:  4.5, sns: { naver:  75, youtube:  80, reddit: 62, github: 28 }, free: true,  life: ["office","startup","marketer","student"] },
  { id: 42, cat: "productivity",  icon: "🦦", name: "Otter.ai",          desc: "회의를 실시간으로 AI가 기록·요약. Zoom, Google Meet, Teams와 연동해 회의록을 자동 생성.",                                                 tags: ["생산성", "무료", "회의"],         score: 53, change:  0.5, sns: { naver:  55, youtube:  68, reddit: 60, github: 30 }, free: true,  life: ["office","startup"] },
  { id: 43, cat: "productivity",  icon: "🔥", name: "Fireflies.ai",      desc: "AI 회의 어시스턴트. 회의 전 과정을 녹음·요약·분석하고 액션 아이템을 자동으로 추출.",                                                    tags: ["생산성", "유료", "회의"],         score: 50, change:  1.8, sns: { naver:  50, youtube:  65, reddit: 58, github: 28 }, free: false, life: ["office","startup"] },
  { id: 44, cat: "productivity",  icon: "✨", name: "Beautiful.ai",      desc: "AI가 레이아웃을 자동으로 정렬하는 스마트 프레젠테이션 툴. 콘텐츠 추가 시 디자인이 자동 최적화.",                                          tags: ["생산성", "유료", "PT"],           score: 46, change: -0.3, sns: { naver:  48, youtube:  62, reddit: 52, github: 22 }, free: false, life: ["office","startup","marketer"] },
  { id: 45, cat: "productivity",  icon: "⚙️", name: "Make",              desc: "노코드 자동화 플랫폼. 수천 개 앱을 시각적 플로우로 연결해 반복 업무를 완전 자동화.",                                                      tags: ["자동화", "무료", "노코드"],       score: 59, change:  2.2, sns: { naver:  58, youtube:  70, reddit: 68, github: 40 }, free: true,  life: ["startup","freelancer","office"] },
  { id: 46, cat: "productivity",  icon: "🔌", name: "Zapier AI",         desc: "5,000개 이상 앱을 연결하는 AI 자동화 플랫폼. 자연어만으로 자동화 플로우를 생성하고 실행.",                                                tags: ["자동화", "유료", "노코드"],       score: 61, change:  1.5, sns: { naver:  60, youtube:  72, reddit: 70, github: 45 }, free: false, life: ["startup","office","freelancer"] },
  { id: 47, cat: "productivity",  icon: "🔗", name: "n8n",               desc: "오픈소스 자동화 플랫폼. 자체 서버에 설치해 무제한 사용 가능, 개발자 친화적 AI 워크플로우 구축.",                                          tags: ["자동화", "무료", "오픈소스"],     score: 68, change:  4.2, sns: { naver:  52, youtube:  65, reddit: 72, github: 88 }, free: true,  life: ["startup","freelancer"] },

  { id: 48, cat: "design",        icon: "🖌️", name: "Canva AI",         desc: "Magic Design, 배경 제거, 텍스트-투-이미지 등 비전문가도 전문가급 디자인 완성.",                                                           tags: ["디자인", "무료"],                 score: 66, change:  4.2, sns: { naver:  82, youtube:  88, reddit: 70, github: 22 }, free: true,  life: ["marketer","office","freelancer","student","creator"] },
  { id: 49, cat: "design",        icon: "📐", name: "Figma AI",          desc: "Figma에 통합된 AI 기능. 텍스트로 UI 컴포넌트 생성, 레이아웃 자동화, 디자인 시스템 작업 가속.",                                           tags: ["디자인", "유료"],                 score: 70, change:  5.2, sns: { naver:  70, youtube:  80, reddit: 78, github: 55 }, free: false, life: ["creator","freelancer","startup"] },
  { id: 50, cat: "design",        icon: "🪄", name: "Uizard",            desc: "손으로 그린 스케치를 AI가 실제 UI로 변환. 비개발자도 쉽게 앱·웹 프로토타입을 만들 수 있음.",                                              tags: ["디자인", "무료"],                 score: 47, change:  1.2, sns: { naver:  45, youtube:  60, reddit: 55, github: 30 }, free: true,  life: ["startup","freelancer"] },
];

/** 위저드 - 1단계: 직업군 선택 옵션 */
export const WIZARD_Q1 = {
  question: "어떤 분야에서 일하고 계신가요?",
  opts: [
    { icon: "💼", label: "직장인", sub: "사무, 기획, 관리", value: "office" },
    { icon: "🏠", label: "프리랜서", sub: "자유 작업자, 1인 사업", value: "freelancer" },
    { icon: "🎓", label: "학생", sub: "대학생, 대학원생, 취준생", value: "student" },
    { icon: "🎥", label: "크리에이터", sub: "영상, 디자인, 음악 제작", value: "creator" },
    { icon: "📊", label: "마케터", sub: "콘텐츠, 퍼포먼스 마케팅", value: "marketer" },
    { icon: "🚀", label: "스타트업", sub: "초기 창업, CTO, 1인 개발", value: "startup" },
  ],
};

/** 위저드 - 2단계: 직업군별 작업 선택 옵션 */
export const WIZARD_Q2 = {
  office: { question: "주로 어떤 작업을 하시나요?", opts: [
    { icon: "📄", label: "보고서·문서 작성", sub: "기획서, 회의록, 이메일", value: "text" },
    { icon: "📊", label: "데이터 분석·시각화", sub: "엑셀, 대시보드, 리포트", value: "data" },
    { icon: "🎨", label: "디자인·발표자료", sub: "PPT, 인포그래픽", value: "design" },
    { icon: "💻", label: "업무 자동화·코딩", sub: "매크로, 스크립트, API", value: "code" },
  ]},
  freelancer: { question: "주로 어떤 작업을 하시나요?", opts: [
    { icon: "✍️", label: "글쓰기·번역", sub: "블로그, 카피, 번역", value: "text" },
    { icon: "🎨", label: "디자인·일러스트", sub: "로고, 배너, UI", value: "image" },
    { icon: "💻", label: "개발·코딩", sub: "웹, 앱, 자동화", value: "code" },
    { icon: "🎬", label: "영상·음악 편집", sub: "유튜브, 팟캐스트", value: "media" },
  ]},
  student: { question: "주로 어떤 작업을 하시나요?", opts: [
    { icon: "📝", label: "리포트·논문 작성", sub: "과제, 졸업논문", value: "text" },
    { icon: "💻", label: "코딩·프로젝트", sub: "과제, 팀프로젝트", value: "code" },
    { icon: "🔍", label: "자료 조사·검색", sub: "논문, 리서치", value: "search" },
    { icon: "🎨", label: "발표·디자인", sub: "PPT, 포스터", value: "design" },
  ]},
  creator: { question: "주로 어떤 콘텐츠를 만드시나요?", opts: [
    { icon: "🎬", label: "영상 콘텐츠", sub: "유튜브, 릴스, 숏폼", value: "video" },
    { icon: "🎨", label: "이미지·일러스트", sub: "썸네일, 아트워크", value: "image" },
    { icon: "🎵", label: "음악·오디오", sub: "배경음악, 팟캐스트", value: "audio" },
    { icon: "✍️", label: "글·스토리", sub: "블로그, 뉴스레터, 시나리오", value: "text" },
  ]},
  marketer: { question: "주로 어떤 작업을 하시나요?", opts: [
    { icon: "✍️", label: "카피라이팅·글쓰기", sub: "광고 문구, 뉴스레터", value: "text" },
    { icon: "🎨", label: "비주얼 콘텐츠 제작", sub: "배너, SNS 이미지", value: "image" },
    { icon: "📊", label: "데이터·성과 분석", sub: "지표, 리포트", value: "data" },
    { icon: "🔍", label: "트렌드·경쟁사 조사", sub: "리서치, 인사이트", value: "search" },
  ]},
  startup: { question: "주로 어떤 작업을 하시나요?", opts: [
    { icon: "💻", label: "제품 개발·코딩", sub: "MVP, API, 코드 리뷰", value: "code" },
    { icon: "📊", label: "데이터·투자 분석", sub: "지표, 피칭", value: "data" },
    { icon: "✍️", label: "문서·피치덱 작성", sub: "사업계획서, 보도자료", value: "text" },
    { icon: "🎨", label: "브랜딩·디자인", sub: "로고, UI, 마케팅", value: "design" },
  ]},
};

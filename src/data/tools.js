/**
 * AI 도구 데이터
 * score = naver×0.30 + youtube×0.30 + google×0.30 + github×0.10
 * sns 점수는 현재 추정값 (추후 API 연동으로 자동 갱신 예정)
 */
export const TOOLS_DATA = [
  {
    id: 1, cat: "text", icon: "🤖", name: "ChatGPT", free: true,
    desc: "OpenAI의 대화형 AI. 보고서 작성, 이메일 초안, 브레인스토밍 등 일상 업무 전반에 활용되는 AI의 대명사.",
    url: "https://chat.openai.com",
    features: ["GPT-4o 기반 대화형 AI", "파일·이미지 첨부 분석", "웹 검색 실시간 지원", "코드 작성 및 디버깅", "커스텀 GPT 생성"],
    tags: ["텍스트", "무료", "API"], score: 98, change: 1.2, sns: { naver: 100, youtube: 100, google: 99, github: 78 },
    life: ["office", "student", "freelancer", "marketer", "startup", "creator"],
    naverKw: ["ChatGPT", "챗GPT"], yt: "ChatGPT", ytKo: "챗GPT", gt: "ChatGPT", gtKo: "챗GPT", github: "openai/chatgpt"
  },
  {
    id: 2, cat: "text", icon: "🧠", name: "Claude", free: true,
    desc: "Anthropic의 AI 어시스턴트. 긴 문서 요약, 코드 작성, 창의적 글쓰기에서 뛰어난 성능. 200K 컨텍스트 지원.",
    url: "https://claude.ai",
    features: ["200K 토큰 긴 문서 처리", "코드 생성 및 분석", "창의적 글쓰기", "Artifacts로 결과물 미리보기", "정확하고 안전한 답변"],
    tags: ["텍스트", "무료", "API"], score: 83, change: 5.3, sns: { naver: 82, youtube: 85, google: 88, github: 62 },
    life: ["office", "student", "freelancer", "startup"],
    naverKw: ["Claude", "클로드"], yt: "Claude AI", ytKo: "클로드", gt: "Claude", gtKo: "클로드", github: "anthropics/claude"
  },
  {
    id: 3, cat: "text", icon: "💎", name: "Gemini", free: true,
    desc: "Google DeepMind의 멀티모달 AI. 텍스트·이미지·오디오·비디오를 동시에 이해하고 생성하는 구글의 최신 모델.",
    url: "https://gemini.google.com",
    features: ["텍스트·이미지·오디오 멀티모달", "Google 검색 실시간 연동", "Google Docs·Gmail 통합", "1M 토큰 초장문 컨텍스트", "Gemini Advanced 업무 자동화"],
    tags: ["멀티모달", "무료", "API"], score: 84, change: 3.8, sns: { naver: 88, youtube: 88, google: 82, github: 65 },
    life: ["office", "student", "startup", "marketer"],
    naverKw: ["Gemini", "제미나이"], yt: "Google Gemini", ytKo: "구글 제미나이", gt: "Google Gemini", gtKo: "구글 제미나이", github: "google/gemini"
  },
  {
    id: 4, cat: "text", icon: "🐋", name: "DeepSeek", free: true,
    desc: "중국 스타트업의 오픈소스 AI. GPT-4급 성능을 대폭 저렴한 비용으로 구현해 AI 업계를 뒤흔든 화제의 모델.",
    url: "https://chat.deepseek.com",
    features: ["GPT-4급 성능을 오픈소스로", "수학·코딩 특화 추론 능력", "API 비용 ChatGPT의 1/10 수준", "Chain-of-Thought 추론 공개", "로컬 실행 가능한 오픈소스"],
    tags: ["텍스트", "무료", "오픈소스"], score: 90, change: 12.5, sns: { naver: 88, youtube: 92, google: 88, github: 95 },
    life: ["office", "student", "startup", "freelancer"],
    naverKw: ["DeepSeek", "딥시크"], yt: "DeepSeek AI", ytKo: "딥시크", gt: "DeepSeek", gtKo: "딥시크", github: "deepseek-ai/deepseek-coder"
  },
  {
    id: 5, cat: "text", icon: "🦅", name: "Grok", free: false,
    desc: "Elon Musk의 xAI가 만든 AI. 실시간 X 데이터 접근과 유머러스하고 직설적인 답변이 특징인 차세대 LLM.",
    url: "https://grok.x.ai",
    features: ["실시간 X(트위터) 데이터 접근", "직설적이고 유머러스한 답변", "검열이 적은 자유로운 응답", "Grok-2 비전 모델 지원", "X Premium 구독으로 이용"],
    tags: ["텍스트", "유료", "API"], score: 74, change: 4.5, sns: { naver: 72, youtube: 75, google: 72, github: 80 },
    life: ["office", "startup", "student"],
    naverKw: ["Grok", "그록"], yt: "Grok AI", ytKo: "그록 AI", gt: "Grok AI", gtKo: "그록 AI", github: "xai-org/grok"
  },
  {
    id: 6, cat: "text", icon: "🦙", name: "Llama", free: true,
    desc: "Meta의 오픈소스 LLM. 로컬 실행부터 파인튜닝까지 자유롭게 활용 가능한 개발자 친화적 AI 모델.",
    url: "https://llama.meta.com",
    features: ["로컬 완전 무료 실행 가능", "파인튜닝 및 커스터마이즈 자유", "8B~405B 다양한 크기 선택", "상업적 이용 허가 (Meta 정책)", "Ollama 등 다양한 방법으로 실행"],
    tags: ["텍스트", "무료", "오픈소스"], score: 77, change: 2.8, sns: { naver: 55, youtube: 78, google: 92, github: 98 },
    life: ["startup", "freelancer", "student"],
    naverKw: ["Llama", "라마"], yt: "Llama AI", ytKo: "라마 AI", gt: "Llama AI", gtKo: "라마 AI", github: "meta-llama/Llama-3"
  },
  {
    id: 7, cat: "text", icon: "🌪️", name: "Mistral AI", free: true,
    desc: "유럽발 오픈소스 AI. 효율적인 아키텍처로 작은 모델에서도 뛰어난 성능. 자체 서버에 배포해 완전한 데이터 통제 가능.",
    url: "https://mistral.ai",
    features: ["유럽 기반 오픈소스 LLM", "자체 서버 배포로 완전 프라이버시", "7B~8x22B 다양한 모델 선택", "Mistral Large로 GPT-4급 성능", "코드 특화 모델 Codestral 제공"],
    tags: ["텍스트", "무료", "오픈소스"], score: 65, change: 3.8, sns: { naver: 45, youtube: 62, google: 78, github: 92 },
    life: ["startup", "freelancer"],
    naverKw: ["Mistral AI", "미스트랄 AI"], yt: "Mistral AI", ytKo: "미스트랄 AI", gt: "Mistral AI", gtKo: "미스트랄 AI", github: "mistralai/mistral-src"
  },
  {
    id: 8, cat: "chatbot", icon: "💬", name: "Character.AI", free: true,
    desc: "다양한 캐릭터와 대화하는 AI 플랫폼. 셀럽·애니 캐릭터부터 직접 만든 AI 페르소나까지 무한 대화.",
    url: "https://character.ai",
    features: ["수천 가지 AI 캐릭터와 대화", "직접 AI 페르소나 커스텀 생성", "셀럽·애니메이션 캐릭터 제공", "멀티 캐릭터 그룹 채팅", "언어 학습 AI 캐릭터 활용"],
    tags: ["텍스트", "무료", "채팅"], score: 77, change: 1.5, sns: { naver: 75, youtube: 82, google: 90, github: 25 },
    life: ["student", "creator"],
    naverKw: ["Character AI", "캐릭터 AI"], yt: "Character AI", ytKo: "캐릭터 AI", gt: "Character AI", gtKo: "캐릭터 AI", github: "" // No official repo
  },
  {
    id: 9, cat: "chatbot", icon: "📚", name: "Poe", free: true,
    desc: "Claude, GPT-4, Gemini 등 다양한 AI를 한 곳에서 이용하는 Quora의 AI 허브 플랫폼.",
    url: "https://poe.com",
    features: ["GPT-4·Claude·Gemini 한 곳에서", "사용량 초과 없는 다모델 전환", "커스텀 봇 생성 및 공유", "이미지 생성 모델도 지원", "웹·iOS·Android 지원"],
    tags: ["텍스트", "무료", "멀티모델"], score: 58, change: -0.8, sns: { naver: 60, youtube: 65, google: 62, github: 20 },
    life: ["office", "student", "freelancer"],
    naverKw: ["Poe AI", "포 AI"], yt: "Poe AI", ytKo: "포 AI", gt: "Poe AI", gtKo: "포 AI", github: "" // No official repo
  }
]

export const WIZARD_Q1 = [
  {
    question: "어떤 종류의 작업을 주로 하시나요?",
    answers: [
      { label: "글쓰기 및 문서 작업", value: "office" },
      { label: "디자인 및 이미지 생성", value: "creator" },
      { label: "개발 및 코딩", value: "startup" },
      { label: "재미있는 대화", value: "student" },
    ],
  },
];

export const WIZARD_Q2 = [
  {
    question: "어떤 성격의 AI를 선호하시나요?",
    answers: [
      { label: "가장 똑똑하고 성능 좋은 AI", value: "text" },
      { label: "가장 창의적이고 영감을 주는 AI", value: "image" },
      { label: "가장 빠르고 효율적인 AI", value: "code" },
      { label: "가장 자유롭고 제약 없는 AI", value: "open-source" },
    ],
  },
];

/**
 * AI 도구 데이터 (Mock)
 * - 향후 실제 API에서 가져올 데이터 구조
 * - life: 해당 도구가 적합한 직업군 배열
 * - sns: 플랫폼별 SNS 트렌드 점수
 */
export const TOOLS_DATA = [
  { id: 1, cat: "text", icon: "🤖", name: "ChatGPT", desc: "OpenAI의 대화형 AI. 보고서 작성, 이메일 초안, 브레인스토밍 등 일상 업무 전반에 활용되는 AI의 대명사.", tags: ["텍스트", "무료", "API"], score: 99, change: 1.2, sns: { x: 98, reddit: 95, hn: 88, github: 70 }, free: true, life: ["office", "student", "freelancer", "marketer", "startup", "creator"] },
  { id: 2, cat: "image", icon: "🎨", name: "Midjourney", desc: "텍스트 프롬프트로 영화 같은 이미지를 만드는 AI. Discord 기반, 아티스트·디자이너 필수 도구.", tags: ["이미지 생성", "유료", "Discord"], score: 98, change: 2.1, sns: { x: 92, reddit: 88, hn: 45, github: 30 }, free: false, life: ["creator", "freelancer", "marketer"] },
  { id: 3, cat: "code", icon: "💻", name: "GitHub Copilot", desc: "OpenAI와 GitHub이 만든 AI 코딩 어시스턴트. 코드 자동완성부터 함수 생성까지 개발 생산성 극대화.", tags: ["코딩", "유료", "API"], score: 96, change: 0.8, sns: { x: 78, reddit: 95, hn: 92, github: 98 }, free: false, life: ["office", "freelancer", "student", "startup"] },
  { id: 4, cat: "text", icon: "🧠", name: "Claude", desc: "Anthropic의 AI 어시스턴트. 긴 문서 요약, 코드 작성, 창의적 글쓰기에서 뛰어난 성능. 200K 컨텍스트.", tags: ["텍스트", "무료", "API"], score: 94, change: 5.3, sns: { x: 88, reddit: 82, hn: 90, github: 65 }, free: true, life: ["office", "student", "freelancer", "startup"] },
  { id: 5, cat: "code", icon: "🔧", name: "Cursor", desc: "AI가 내장된 차세대 코드 에디터. 자연어로 코딩하고 코드베이스 전체를 AI와 리팩토링.", tags: ["코딩", "무료", "에디터"], score: 89, change: 8.7, sns: { x: 91, reddit: 78, hn: 88, github: 82 }, free: true, life: ["freelancer", "startup", "student"] },
  { id: 6, cat: "video", icon: "🎬", name: "Sora", desc: "OpenAI의 텍스트-투-비디오 AI. 프롬프트 하나로 영화 수준의 고화질 영상을 자동 생성.", tags: ["영상 생성", "유료"], score: 87, change: 12.4, sns: { x: 95, reddit: 70, hn: 75, github: 20 }, free: false, life: ["creator", "marketer"] },
  { id: 7, cat: "search", icon: "🔍", name: "Perplexity AI", desc: "실시간 웹 검색과 AI를 결합한 차세대 검색 엔진. 출처 명시로 신뢰할 수 있는 답변.", tags: ["검색", "무료", "API"], score: 85, change: 3.6, sns: { x: 80, reddit: 75, hn: 88, github: 45 }, free: true, life: ["student", "office", "startup", "freelancer"] },
  { id: 8, cat: "audio", icon: "🎵", name: "Suno AI", desc: "텍스트로 완성된 음악을 만드는 AI. 장르·분위기·가사를 입력하면 몇 초 만에 노래 완성.", tags: ["오디오", "무료"], score: 83, change: 15.2, sns: { x: 88, reddit: 65, hn: 40, github: 15 }, free: true, life: ["creator", "freelancer"] },
  { id: 9, cat: "productivity", icon: "⚡", name: "Notion AI", desc: "Notion에 통합된 AI. 회의록 요약, 프로젝트 플랜 작성, 액션 아이템 추출 등 업무 효율 극대화.", tags: ["생산성", "유료"], score: 82, change: 1.0, sns: { x: 72, reddit: 68, hn: 55, github: 30 }, free: false, life: ["office", "startup", "student"] },
  { id: 10, cat: "design", icon: "🖌️", name: "Canva AI", desc: "Magic Design, 배경 제거, 텍스트-투-이미지 등 비전문가도 전문가급 디자인 완성.", tags: ["디자인", "무료"], score: 81, change: 4.2, sns: { x: 75, reddit: 60, hn: 35, github: 10 }, free: true, life: ["marketer", "office", "freelancer", "student", "creator"] },
  { id: 11, cat: "image", icon: "🖼️", name: "Stable Diffusion", desc: "오픈소스 이미지 생성 AI. 로컬에서 무료 실행 가능, 커스터마이즈 자유도 최고.", tags: ["이미지 생성", "무료", "오픈소스"], score: 79, change: -0.5, sns: { x: 65, reddit: 82, hn: 72, github: 95 }, free: true, life: ["creator", "freelancer", "startup"] },
  { id: 12, cat: "text", icon: "💎", name: "Gemini", desc: "Google DeepMind의 멀티모달 AI. 텍스트, 이미지, 오디오, 비디오를 동시에 이해하고 생성.", tags: ["멀티모달", "무료", "API"], score: 90, change: 3.8, sns: { x: 85, reddit: 78, hn: 80, github: 60 }, free: true, life: ["office", "student", "startup", "marketer"] },
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

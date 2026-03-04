/** 점수에 따른 그라데이션 색상 반환 */
export const getScoreColor = (score) => {
  if (score >= 95) return "linear-gradient(135deg, #f59e0b, #ef4444)";
  if (score >= 90) return "linear-gradient(135deg, #6366f1, #06b6d4)";
  if (score >= 80) return "linear-gradient(135deg, #06b6d4, #22c55e)";
  return "linear-gradient(135deg, #64748b, #94a3b8)";
};

/** 점수에 따른 텍스트 색상 */
export const getScoreTextColor = (score) => {
  if (score >= 95) return "#f59e0b";
  if (score >= 90) return "#6366f1";
  if (score >= 80) return "#06b6d4";
  return "#94a3b8";
};

/** 등수 메달 이모지 반환 */
export const getRankBadge = (rank) => {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return `${rank}`;
};

/** Firestore Timestamp 또는 Date → 상대 시간 문자열 */
export const formatRelativeTime = (timestamp) => {
  if (!timestamp) return "";
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "방금 전";
  if (diffMin < 60) return `${diffMin}분 전`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}시간 전`;
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 30) return `${diffDay}일 전`;
  return date.toLocaleDateString("ko-KR");
};

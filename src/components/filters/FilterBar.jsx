import { CATEGORIES, LIFE_FILTERS, SORT_OPTIONS } from "../../constants";

const pillStyle = (active, activeColor = "var(--accent-indigo)", activeBg = "var(--tag-bg)") => ({
  padding: "5px 12px",
  borderRadius: "100px",
  border: active ? `1px solid ${activeColor}` : "1px solid var(--border-primary)",
  background: active ? activeBg : "transparent",
  color: active ? activeColor : "var(--text-secondary)",
  fontSize: "0.78rem",
  fontFamily: "'Pretendard', sans-serif",
  fontWeight: active ? 600 : 400,
  cursor: "pointer",
  transition: "all 0.2s ease",
  whiteSpace: "nowrap",
  flexShrink: 0,
});

const rowStyle = {
  display: "flex",
  gap: "6px",
  overflowX: "auto",
  scrollbarWidth: "none",
  msOverflowStyle: "none",
  alignItems: "center",
  padding: "2px 0",
};

const FilterBar = ({ category, onCategoryChange, lifeFilter, onLifeFilterChange, sortBy, onSortChange }) => (
  <div style={{
    padding: "0 1.5rem",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    maxWidth: "1200px",
    margin: "0 auto 1.5rem",
  }}>
    {/* 카테고리 */}
    <div style={rowStyle}>
      {CATEGORIES.map((cat) => (
        <button key={cat.id} onClick={() => onCategoryChange(cat.id)} style={pillStyle(category === cat.id)}>
          {cat.label}
        </button>
      ))}
    </div>

    {/* 직업군 */}
    <div style={rowStyle}>
      {LIFE_FILTERS.map((lf) => (
        <button
          key={lf.id}
          onClick={() => onLifeFilterChange(lf.id)}
          style={pillStyle(lifeFilter === lf.id, "var(--color-gold)", "rgba(245,158,11,0.1)")}
        >
          {lf.label}
        </button>
      ))}
    </div>

    {/* 정렬 (우측 정렬) */}
    <div style={{ display: "flex", justifyContent: "flex-end", gap: "2px" }}>
      {SORT_OPTIONS.map((opt) => (
        <button
          key={opt.id}
          onClick={() => onSortChange(opt.id)}
          style={{
            padding: "4px 10px",
            borderRadius: "6px",
            border: "none",
            background: sortBy === opt.id ? "var(--bg-tertiary)" : "transparent",
            color: sortBy === opt.id ? "var(--text-primary)" : "var(--text-muted)",
            fontSize: "0.75rem",
            fontFamily: "'Pretendard', sans-serif",
            fontWeight: sortBy === opt.id ? 600 : 400,
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  </div>
);

export default FilterBar;

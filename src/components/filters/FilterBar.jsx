import { CATEGORIES, LIFE_FILTERS, SORT_OPTIONS } from "../../constants";

const FilterBar = ({ category, onCategoryChange, lifeFilter, onLifeFilterChange, sortBy, onSortChange }) => (
  <div style={{
    padding: "0 1.5rem",
    marginBottom: "1.5rem",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    maxWidth: "1200px",
    margin: "0 auto 1.5rem",
  }}>
    {/* 카테고리 필터 행 */}
    <div className="filter-row" style={{
      display: "flex",
      gap: "6px",
      flexWrap: "wrap",
      alignItems: "center",
    }}>
      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginRight: "4px", fontWeight: 500 }}>카테고리</span>
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onCategoryChange(cat.id)}
          style={{
            padding: "5px 12px",
            borderRadius: "100px",
            border: category === cat.id
              ? "1px solid var(--accent-indigo)"
              : "1px solid var(--border-primary)",
            background: category === cat.id
              ? "var(--tag-bg)"
              : "transparent",
            color: category === cat.id
              ? "var(--accent-indigo)"
              : "var(--text-secondary)",
            fontSize: "0.78rem",
            fontFamily: "'Pretendard', sans-serif",
            fontWeight: category === cat.id ? 600 : 400,
            cursor: "pointer",
            transition: "all 0.2s ease",
            whiteSpace: "nowrap",
          }}
        >
          {cat.label}
        </button>
      ))}
    </div>

    {/* 직업군 필터 + 정렬 행 */}
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: "8px",
    }}>
      {/* 직업군 필터 */}
      <div className="filter-scroll" style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginRight: "4px", fontWeight: 500 }}>직업군</span>
        {LIFE_FILTERS.map((lf) => (
          <button
            key={lf.id}
            onClick={() => onLifeFilterChange(lf.id)}
            style={{
              padding: "5px 12px",
              borderRadius: "100px",
              border: lifeFilter === lf.id
                ? "1px solid var(--color-gold)"
                : "1px solid var(--border-primary)",
              background: lifeFilter === lf.id
                ? "rgba(245, 158, 11, 0.1)"
                : "transparent",
              color: lifeFilter === lf.id
                ? "var(--color-gold)"
                : "var(--text-secondary)",
              fontSize: "0.78rem",
              fontFamily: "'Pretendard', sans-serif",
              fontWeight: lifeFilter === lf.id ? 600 : 400,
              cursor: "pointer",
              transition: "all 0.2s ease",
              whiteSpace: "nowrap",
            }}
          >
            {lf.label}
          </button>
        ))}
      </div>

      {/* 정렬 옵션 */}
      <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginRight: "4px" }}>정렬</span>
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
              transition: "all 0.2s",
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  </div>
);

export default FilterBar;

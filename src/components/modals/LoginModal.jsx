import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const LoginModal = ({ onClose }) => {
  const { loginWithEmail, registerWithEmail } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (isRegister) {
        if (!name) throw new Error("이름을 입력해주세요.");
        await registerWithEmail(email, password, name);
      } else {
        await loginWithEmail(email, password);
      }
      onClose();
    } catch (err) {
      setError(err.message.includes("auth/user-not-found") ? "사용자를 찾을 수 없습니다." : 
              err.message.includes("auth/wrong-password") ? "비밀번호가 틀렸습니다." :
              err.message.includes("auth/email-already-in-use") ? "이미 사용 중인 이메일입니다." :
              err.message);
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1100,
        background: "rgba(0,0,0,0.65)",
        display: "flex",
        alignItems: "center", // 세로 중앙 정렬
        justifyContent: "center", // 가로 중앙 정렬
        padding: "20px",
        backdropFilter: "blur(8px)",
        overflowY: "auto", // 내용이 많을 경우 스크롤 가능하게
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-primary)",
          borderRadius: "28px",
          padding: "2.5rem 2rem 2rem",
          width: "100%",
          maxWidth: "380px",
          boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
          position: "relative",
          margin: "auto", // 추가적인 중앙 정렬 보정
        }}
      >
        {/* 상단 우측 X 버튼 */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            background: "var(--bg-tertiary)",
            border: "none",
            borderRadius: "50%",
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1rem",
            cursor: "pointer",
            color: "var(--text-muted)",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "var(--border-primary)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "var(--bg-tertiary)"}
        >
          ✕
        </button>

        <h2 style={{
          textAlign: "center",
          marginBottom: "2rem",
          fontWeight: 800,
          fontSize: "1.5rem",
          color: "var(--text-primary)"
        }}>
          {isRegister ? "이메일 회원가입" : "이메일 로그인"}
        </h2>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {isRegister && (
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)", marginLeft: "4px" }}>이름</label>
              <input
                type="text"
                placeholder="홍길동"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{
                  padding: "14px",
                  borderRadius: "12px",
                  border: "1px solid var(--border-primary)",
                  background: "var(--bg-secondary)",
                  color: "var(--text-primary)",
                  fontSize: "1rem"
                }}
              />
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)", marginLeft: "4px" }}>이메일</label>
            <input
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                padding: "14px",
                borderRadius: "12px",
                border: "1px solid var(--border-primary)",
                background: "var(--bg-secondary)",
                color: "var(--text-primary)",
                fontSize: "1rem"
              }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)", marginLeft: "4px" }}>비밀번호</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                padding: "14px",
                borderRadius: "12px",
                border: "1px solid var(--border-primary)",
                background: "var(--bg-secondary)",
                color: "var(--text-primary)",
                fontSize: "1rem"
              }}
            />
          </div>
          
          {error && <p style={{ color: "#ef4444", fontSize: "0.85rem", margin: "4px 0", textAlign: "center" }}>{error}</p>}

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" }}>
            <button
              type="submit"
              style={{
                padding: "16px",
                borderRadius: "14px",
                background: "linear-gradient(135deg, var(--accent-indigo), var(--accent-cyan))",
                color: "#fff",
                border: "none",
                fontWeight: 700,
                fontSize: "1.05rem",
                cursor: "pointer",
                boxShadow: "0 8px 20px rgba(79, 70, 229, 0.25)",
              }}
            >
              {isRegister ? "회원가입 완료" : "로그인"}
            </button>
            
            {/* 하단 취소 버튼 */}
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "14px",
                borderRadius: "14px",
                background: "var(--bg-tertiary)",
                color: "var(--text-secondary)",
                border: "1px solid var(--border-primary)",
                fontWeight: 600,
                fontSize: "0.95rem",
                cursor: "pointer",
              }}
            >
              취소
            </button>
          </div>
        </form>

        <p style={{ textAlign: "center", marginTop: "2rem", fontSize: "0.95rem", color: "var(--text-muted)" }}>
          {isRegister ? "이미 계정이 있으신가요?" : "처음이신가요?"} {" "}
          <span
            onClick={() => setIsRegister(!isRegister)}
            style={{
              color: "var(--accent-indigo)",
              fontWeight: 700,
              cursor: "pointer",
              textDecoration: "underline",
              marginLeft: "4px"
            }}
          >
            {isRegister ? "로그인하기" : "회원가입하기"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginModal;

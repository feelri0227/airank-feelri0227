import { useState } from "react";
import { createPortal } from "react-dom"; // Portal 사용을 위해 추가
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

  // Portal을 사용하여 body 바로 아래에 렌더링함으로써 레이아웃 짤림 방지
  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 9999, // 매우 높은 z-index 부여
        background: "rgba(0,0,0,0.7)", // 배경을 좀 더 어둡게 하여 집중도 향상
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        backdropFilter: "blur(10px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-primary)",
          borderRadius: "32px",
          padding: "2.5rem 2rem 2rem",
          width: "100%",
          maxWidth: "380px",
          boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
        }}
      >
        {/* 상단 우측 X 버튼 */}
        <button
          onClick={onClose}
          aria-label="닫기"
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            background: "var(--bg-tertiary)",
            border: "none",
            borderRadius: "50%",
            width: "36px",
            height: "36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.2rem",
            cursor: "pointer",
            color: "var(--text-muted)",
            zIndex: 10,
          }}
        >
          ✕
        </button>

        <div style={{ textAlign: "center" }}>
          <h2 style={{
            fontWeight: 800,
            fontSize: "1.6rem",
            color: "var(--text-primary)",
            margin: "0 0 0.5rem 0"
          }}>
            {isRegister ? "회원가입" : "이메일 로그인"}
          </h2>
          <p style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
            {isRegister ? "정보를 입력하여 가입하세요" : "계정 정보를 입력하세요"}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {isRegister && (
            <input
              type="text"
              placeholder="이름"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{
                padding: "15px",
                borderRadius: "14px",
                border: "1px solid var(--border-primary)",
                background: "var(--bg-secondary)",
                color: "var(--text-primary)",
                fontSize: "1rem",
                width: "100%",
                boxSizing: "border-box"
              }}
            />
          )}
          <input
            type="email"
            placeholder="이메일 주소"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              padding: "15px",
              borderRadius: "14px",
              border: "1px solid var(--border-primary)",
              background: "var(--bg-secondary)",
              color: "var(--text-primary)",
              fontSize: "1rem",
              width: "100%",
              boxSizing: "border-box"
            }}
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              padding: "15px",
              borderRadius: "14px",
              border: "1px solid var(--border-primary)",
              background: "var(--bg-secondary)",
              color: "var(--text-primary)",
              fontSize: "1rem",
              width: "100%",
              boxSizing: "border-box"
            }}
          />
          
          {error && <p style={{ color: "#ef4444", fontSize: "0.85rem", margin: "4px 0", textAlign: "center" }}>{error}</p>}

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" }}>
            <button
              type="submit"
              style={{
                padding: "16px",
                borderRadius: "16px",
                background: "linear-gradient(135deg, var(--accent-indigo), var(--accent-cyan))",
                color: "#fff",
                border: "none",
                fontWeight: 700,
                fontSize: "1.1rem",
                cursor: "pointer",
                boxShadow: "0 8px 20px rgba(79, 70, 229, 0.3)",
              }}
            >
              {isRegister ? "가입 완료" : "로그인"}
            </button>
            
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "15px",
                borderRadius: "16px",
                background: "var(--bg-tertiary)",
                color: "var(--text-secondary)",
                border: "1px solid var(--border-primary)",
                fontWeight: 600,
                fontSize: "1rem",
                cursor: "pointer",
              }}
            >
              취소
            </button>
          </div>
        </form>

        <p style={{ textAlign: "center", margin: 0, fontSize: "0.95rem", color: "var(--text-muted)" }}>
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
    </div>,
    document.body // body에 직접 렌더링하여 네비게이션바 짤림 방지
  );
};

export default LoginModal;

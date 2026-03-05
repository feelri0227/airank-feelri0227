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
        position: "fixed", inset: 0, zIndex: 1100,
        background: "rgba(0,0,0,0.65)", display: "flex",
        alignItems: "center", justifyContent: "center", padding: "16px",
        backdropFilter: "blur(6px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--bg-card)", border: "1px solid var(--border-primary)",
          borderRadius: "24px", padding: "2rem", width: "100%", maxWidth: "400px",
          boxShadow: "0 24px 64px rgba(0,0,0,0.4)", position: "relative",
        }}
      >
        <button onClick={onClose} style={{
          position: "absolute", top: "16px", right: "16px",
          background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "var(--text-muted)"
        }}>✕</button>

        <h2 style={{ textAlign: "center", marginBottom: "1.5rem", fontWeight: 800 }}>
          {isRegister ? "개인 이메일 가입" : "개인 이메일 로그인"}
        </h2>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {isRegister && (
            <input
              type="text" placeholder="이름" value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ padding: "12px", borderRadius: "10px", border: "1px solid var(--border-primary)", background: "var(--bg-secondary)", color: "var(--text-primary)" }}
            />
          )}
          <input
            type="email" placeholder="이메일 주소" value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ padding: "12px", borderRadius: "10px", border: "1px solid var(--border-primary)", background: "var(--bg-secondary)", color: "var(--text-primary)" }}
          />
          <input
            type="password" placeholder="비밀번호" value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ padding: "12px", borderRadius: "10px", border: "1px solid var(--border-primary)", background: "var(--bg-secondary)", color: "var(--text-primary)" }}
          />
          
          {error && <p style={{ color: "#ef4444", fontSize: "0.85rem", margin: "4px 0" }}>{error}</p>}

          <button
            type="submit"
            style={{
              marginTop: "8px", padding: "14px", borderRadius: "12px",
              background: "linear-gradient(135deg, var(--accent-indigo), var(--accent-cyan))",
              color: "#fff", border: "none", fontWeight: 700, cursor: "pointer"
            }}
          >
            {isRegister ? "가입하기" : "로그인"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.9rem", color: "var(--text-muted)" }}>
          {isRegister ? "이미 계정이 있으신가요?" : "처음이신가요?"} {" "}
          <span
            onClick={() => setIsRegister(!isRegister)}
            style={{ color: "var(--accent-indigo)", fontWeight: 600, cursor: "pointer", textDecoration: "underline" }}
          >
            {isRegister ? "로그인하기" : "회원가입하기"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginModal;

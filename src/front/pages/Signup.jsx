import { useState } from "react";

// Función Signup, para crear una cuenta
export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const API = import.meta.env.VITE_BACKEND_URL || "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`${API}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({ msg: "Error" }));
        throw new Error(data.msg || "Error en registro");
      }
      // Redirige al login si todo va bien, de lo contrario muestra el error
      window.location.href = "/login";
    } catch (err) {
      setError(err.message || "Failed to fetch");
    }
  };

  // Render de Signup
  return (
    <div>
      <h1>Signup</h1>
      <form onSubmit={handleSubmit}>
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="email" />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="password" />
        <button>Crear cuenta</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

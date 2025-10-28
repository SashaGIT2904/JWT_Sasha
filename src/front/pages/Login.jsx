import { useState } from "react";

//Funcion Login, para iniciar sesion
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const API = import.meta.env.VITE_BACKEND_URL || "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`${API}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Login error");
      // Esto guarda el token en el sessionStorage
      sessionStorage.setItem("token", data.token);
      window.location.href = "/private";
    } catch (err) {
      setError(err.message || "Failed to fetch");
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="email" />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="password" />
        <button>Entrar</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

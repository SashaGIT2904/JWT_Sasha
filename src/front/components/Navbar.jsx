import { Link, useNavigate } from "react-router-dom";

export default function Navbar(){
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");

  const logout = ()=>{
    sessionStorage.removeItem("token");
    navigate("/login", { replace:true });
  };

  return (
    <nav>
      <Link to="/">Home</Link>{" "}
      <Link to="/signup">Signup</Link>{" "}
      <Link to="/login">Login</Link>{" "}
      <Link to="/private">Private</Link>{" "}
      {token && <button onClick={logout}>Logout</button>}
    </nav>
  );
}

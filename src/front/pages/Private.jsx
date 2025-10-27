import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Private(){
  const navigate = useNavigate();
  const [msg,setMsg] = useState("");
  const API = import.meta.env.VITE_BACKEND_URL || "";

  useEffect(()=>{
    const token = sessionStorage.getItem("token");
    if(!token){ navigate("/login", { replace:true }); return;}
    (async ()=>{
      const res = await fetch(`${API}/api/private`,{
        headers:{ Authorization: `Bearer ${token}` }
      });
      if(res.status===401){ sessionStorage.removeItem("token"); navigate("/login",{replace:true}); return;}
      const data = await res.json();
      setMsg(data.msg || "OK");
    })();
  },[navigate, API]);

  return <h1>Zona privada: {msg}</h1>;
}

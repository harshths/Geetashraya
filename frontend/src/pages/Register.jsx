import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username:"", email:"", password:"", role:"user" });
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(form).forEach(key => data.append(key, form[key]));
    if(file) data.append("profilepic", file);
    await axios.post("/auth/register", data);
    navigate("/login");
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Username" required onChange={e=>setForm({...form,username:e.target.value})}/>
        <input placeholder="Email" required onChange={e=>setForm({...form,email:e.target.value})}/>
        <input type="password" required placeholder="Password" onChange={e=>setForm({...form,password:e.target.value})}/>
        <select onChange={e=>setForm({...form,role:e.target.value})}>
          <option value="user">User</option>
          <option value="artist">Artist</option>
        </select>
        <p>Upload Profile Picture:</p>
        <input type="file" onChange={e=>setFile(e.target.files[0])}/>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
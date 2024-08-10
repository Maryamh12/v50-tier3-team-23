import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './login.css';

const Login = ({noteRegister, setNoteRegister,
  noteLogin, setNoteLogin,
  noteFoodCard, setNoteFoodCard,
  noteMainPage, setNoteMainPage}) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`https://resteraunt-app-server.onrender.com/login`, formData);
      console.log(data.token);
      console.log(data);
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.payload.id);
      axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
      setNoteLogin(false);
      setNoteRegister(false);
      setNoteFoodCard(false);
      setNoteMainPage(true);
      
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="registerContainer" id="loginContainerOutside">
      <div className="container" id="loginContainerInside">
        <div className="row justify-content-center" id="rowLoginContainer">
          <div className="col-md-6" id="collumnLoginContainer">
            <div className="card" id="cardLoginContainer">
              <div className="card-header" id="headerContainerLogin">
                <h4 className="text-center">Login</h4>
              </div>
              <div className="card-body" id="bodyContainerLogin">
                <form method="post" action="/login" onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email:</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password:</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="d-grid gap-2">
                    <button type="submit" className="btn btn-outline-secondary">Login</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

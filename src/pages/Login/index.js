import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "../Create/create.css";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitLocation, setSubmitLocation] = useState("");
  const history = useHistory();
  const [errorText, setErrorText] = useState();

  const handleSubmit = async (event) => {
    setErrorText();
    event.preventDefault();

    // Burada API'ye gönderilecek olan post işlemini yapabilirsiniz
    try {
      const response = await fetch(
        "https://server-mct-news.onrender.com/api/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );
      const data = await response.json();

      if (data?.token) {
        localStorage.setItem("token", data?.token);
        // checkTokenOnServer();

        history.push("/create");
      } else {
        setErrorText("Invalid email or pass");
      }
      // API'ye başarılı bir şekilde gönderildiğinde yapılacak işlemler
    } catch (error) {
      console.error("API hatası:", error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          flexDirection: "column",
        }}
        onSubmit={handleSubmit}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            flexDirection: "column",
          }}
        >
          <label>Email:</label>
          <input
            style={{ width: "80%" }}
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrorText();
            }}
            required
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            flexDirection: "column",
          }}
        >
          <label>Password:</label>
          <input
            style={{ width: "80%" }}
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrorText();
            }}
            required
          />
        </div>
        {errorText && <label className="error-text">{errorText}</label>}
        <button className="login-submit-btn" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Login;

import React, { useState } from "react";
import { useHistory } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitLocation, setSubmitLocation] = useState("");
  const history = useHistory();

  const handleSubmit = async (event) => {
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

      console.log(data);
      if (data?.token) {
        localStorage.setItem("token", data?.token);
        // checkTokenOnServer();

        history.push("/create");
      }
      // API'ye başarılı bir şekilde gönderildiğinde yapılacak işlemler
    } catch (error) {
      console.error("API hatası:", error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Login;

import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "../Create/create.css";
import { Input, Button, Tooltip } from "antd";
import {
  UserOutlined,
  InfoCircleOutlined,
  LockOutlined,
} from "@ant-design/icons";
// const { InfoCircleOutlined, UserOutlined } = icons;
// const { Input, Tooltip } = antd;

const Login = () => {
  const [isLoadingLoginButton, setIsLoadingLoginButton] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();
  const [errorText, setErrorText] = useState();

  const handleSubmit = async () => {
    setErrorText();
    setIsLoadingLoginButton(true);

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
    } finally {
      setIsLoadingLoginButton(false);
    }
  };

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>Login</h2>
      <form
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          flexDirection: "column",
        }}
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
          <Input
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrorText();
            }}
            style={{ width: "80%" }}
            type="email"
            placeholder="Enter your email"
            prefix={
              <UserOutlined
                style={{
                  color: "rgba(0,0,0,.25)",
                }}
              />
            }
            suffix={
              <Tooltip title="Email">
                <InfoCircleOutlined
                  style={{
                    color: "rgba(0,0,0,.45)",
                  }}
                />
              </Tooltip>
            }
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
          <Input
            style={{ width: "80%" }}
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrorText();
            }}
            required
            placeholder="Enter your password"
            prefix={
              <LockOutlined
                style={{
                  color: "rgba(0,0,0,.25)",
                }}
              />
            }
            suffix={
              <Tooltip title="password">
                <InfoCircleOutlined
                  style={{
                    color: "rgba(0,0,0,.45)",
                  }}
                />
              </Tooltip>
            }
          />
        </div>
        {errorText && <label className="error-text">{errorText}</label>}
        <Button
          onClick={() => {
            handleSubmit();
          }}
          type="primary"
          className="login-submit-btn"
          loading={isLoadingLoginButton}
        >
          Login
        </Button>
      </form>
    </div>
  );
};

export default Login;

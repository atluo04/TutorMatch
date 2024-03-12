import React, { useState } from "react";
import { useUser } from "../userContext";
import "../html/Login.css";
import { useNavigate } from "react-router-dom";
import user_icon from "../assets/person.png";
import password_icon from "../assets/password.png";
import { PasswordEmailInput } from "../components/PasswordEmailInput";


const LoginSignup = () => {
  const { uid, setUid } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/signin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setEmail("");
        setPassword("");
        setUid(data.uid);
        navigate("/home");
      } else {
        alert("Invalid username or password! Please try again.");
      }
    } catch (error) {
      alert("Server error!");
      console.log(error);
    }
  };

  return (
    <div className="login-container">
      <div className="header">
        <div className="title-1">TutorMatch</div> 
        <div className="title-2">for UCLA</div> 
        <div className="text">Login</div>
        <div className="underline"></div>
      </div>
      <div className="inputs">
        <div className="input">
          <img src={user_icon} alt="" />
          <PasswordEmailInput placeHolderText={"Email"} handleInput={setEmail} />
        </div>
        <div className="input">
          <img src={password_icon} alt="" />
          <PasswordEmailInput
            placeHolderText={"Password"}
            handleInput={setPassword}
            isPassword={true}
          />
        </div>
      </div>
      <div className="forgot-password">
        Lost Password? <span>Click Here!</span>
      </div>
      <div className="sign-up">
        Not Registered?{" "}
        <span onClick={() => navigate("/register")}>Sign Up Here!</span>
      </div>
      <div className="submit-container">
        <div className="submit" onClick={handleSignIn}>
          Login
        </div>
      </div>
    </div>
  );
};

export { LoginSignup };

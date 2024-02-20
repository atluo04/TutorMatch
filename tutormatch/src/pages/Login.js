import React, { useState } from "react";
import "../html/Login.css";
import { signInUser } from "../user/auth";
import { useNavigate } from "react-router-dom";
import user_icon from "../assets/person.png";
import password_icon from "../assets/password.png";
import { PasswordEmailInput } from "../components/PasswordEmailInput";

const LoginSignup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignIn = () => {
    signInUser(email, password).then((user) => {
      // If it's an error object, handle the error
      if (user instanceof Error) {
        //console.error("Sign In failed", user.code, user.message);
        console.log("Error Message:", user.message);
        // need toasting message
      } else {
        console.log("Signed In", user);
        navigate("/home");
        // need toasting message
      }
    });
  };

  return (
    <div className="login-container">
      <div className="header">
        <div className="text">Login</div>
        <div className="underline"></div>
      </div>
      <div className="inputs">
        <div className="input">
          <img src={user_icon} alt="" />
          <PasswordEmailInput placeHolder={"Email"} handleInput={setEmail} />
        </div>
        <div className="input">
          <img src={password_icon} alt="" />
          <PasswordEmailInput
            placeHolder={"Password"}
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

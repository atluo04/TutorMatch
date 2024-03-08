import { useState } from "react";
import { PasswordEmailInput } from "../components/PasswordEmailInput";
import { useNavigate } from "react-router-dom";
import { useUser } from "../userContext";
import "../html/Registration.css"

function RegistrationPage() {
  // State for registration form
  const {uid, setUid} = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleRegistration = async () => {
    if (process.env.REACT_APP_NODE_ENV !== "development") {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        setError("Invalid Email");
        console.log("Invalid Email");
        return;
      }
      const passwordMessage = validatePassword();
      if (passwordMessage !== null) {
        setError(passwordMessage);
        console.log(passwordMessage);
        return;
      }
    }
    try {
      const response = await fetch(
            `${process.env.REACT_APP_SERVER_URL}/register`,
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
            navigate("/info");
        } else {
            setError("Invalid username or password! Please try again.");
        }
    } catch (error) {
        alert("Server error!");
        console.log(error);
    }
  };

  const validatePassword = () => {
    const correctLength = /^.{8,16}$/;
    if (!correctLength.test(password)) {
      return "Password must be between 8 and 16 characters long.";
    }
    const noWhiteSpace = /^S*$/;
    if (noWhiteSpace.test(password)) {
      return "Password must not contain whitespace.";
    }
    const containsUppercase = /^(?=.*[A-Z]).*$/;
    if (!containsUppercase.test(password)) {
      return "Password must contain at least 1 uppercase letter.";
    }
    const containsLowercase = /^(?=.*[a-z]).*$/;
    if (!containsLowercase.test(password)) {
      return "Password must contain at least 1 lowercase letter.";
    }
    const containsSpecialChar = /^(?=.*[,.!@#$%^&*~:;'\"()-+=~`_\[\]\\/?|]).*$/;
    if (!containsSpecialChar.test(password)) {
      return "Password must contain at least 1 special character.";
    }
    if (password != confirmPassword) {
      return "Passwords do not match.";
    }
    return null;
  };

  return (
    <div className="registration-container">
      <div className="header">
        <div className="title">Registration</div>
        <div className="underline"></div>
      </div>
      <div className="inputs">
        <div className="input">
          <PasswordEmailInput
            placeHolderText={"Email"}
            handleInput={setEmail}
          />
        </div>
        <div className="input">
          <PasswordEmailInput
            placeHolderText={"Password"}
            handleInput={setPassword}
            isPassword={true}
          />
        </div>
        <div className="input">
          <PasswordEmailInput
            placeHolderText={"Confirm Password"}
            handleInput={setConfirmPassword}
            isPassword={true}
          />
        </div>
        <div>
          <span className="error">{error}</span>
        </div>
        <div className="submit-container">
          <div className="button" onClick={handleRegistration}>
            Register
          </div>
        </div>
      </div>
    </div>
  );
}

export { RegistrationPage };

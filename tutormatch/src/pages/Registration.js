import { useState } from "react";
import { registerUser } from "../user/auth";

function RegistrationPage() {
  // State for registration form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegistration = () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      console.log("Invalid Email!");
      //Enter some code to display invalid email
    }
    const passwordMessage = validatePassword();
    if (passwordMessage != null) {
      console.log(passwordMessage);
      return;
    }
    registerUser(email, password).then((user) => {
      if (user instanceof Error) {
        console.log("Error Message:", user.message);
        // need toasting message
      } else {
        console.log("New account created", user);
        // need toasting message
      }
    });
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
    <div>
      <h2>Registration</h2>
      <form>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label>Confirm Password:</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button type="button" onClick={handleRegistration}>
          Register
        </button>
      </form>
    </div>
  );
}

export { RegistrationPage };

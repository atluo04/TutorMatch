import { useState } from "react";
import { registerUser } from "../user/auth";
import { PasswordEmailInput } from "../components/PasswordEmailInput";

function RegistrationPage() {
  // State for registration form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);

  const handleRegistration = () => {
    if (process.env.NODE_ENV !== "development") {
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
    registerUser(email, password).then((user) => {
      if (user instanceof Error) {
        setError(user.message);
        console.log("Error Message:", user.message);
        // need toasting message
      } else {
        setError(null);
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
        <PasswordEmailInput placeHolder={" Email"} handleInput={setEmail} />
        <PasswordEmailInput
          placeHolder={" Password"}
          handleInput={setPassword}
          isPassword={true}
        />
        <PasswordEmailInput
          placeHolder={" Confirm Password"}
          handleInput={setConfirmPassword}
          isPassword={true}
        />
        <div>
          <span className="error">{error}</span>
        </div>
        <button type="button" onClick={handleRegistration}>
          Register
        </button>
      </form>
    </div>
  );
}

export { RegistrationPage };

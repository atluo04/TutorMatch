import { useState } from "react";
import { registerUser, signInUser } from "../user/auth";

function HomePage() {
  // State for registration form
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  // State for sign-in form
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");

  const handleRegistration = () => {
    registerUser(regEmail, regPassword)
      .then((user) => {
        console.log("Registered", user);
      })
      .catch((error) => {
        console.error("Registration failed", error);
      });
  };

  const handleSignIn = () => {
    signInUser(signInEmail, signInPassword)
      .then((user) => {
        console.log("Signed In", user);
      })
      .catch((error) => {
        console.error("Sign In failed", error);
      });
  };

  return (
    <div>
      <h2>Register</h2>
      <form>
        <label>Email:</label>
        <input
          type="email"
          value={regEmail}
          onChange={(e) => setRegEmail(e.target.value)}
        />
        <label>Password:</label>
        <input
          type="password"
          value={regPassword}
          onChange={(e) => setRegPassword(e.target.value)}
        />
        <button type="button" onClick={handleRegistration}>
          Register
        </button>
      </form>
      <h2>Sign In</h2>
      <form>
        <label>Email:</label>
        <input
          type="email"
          value={signInEmail}
          onChange={(e) => setSignInEmail(e.target.value)}
        />
        <label>Password:</label>
        <input
          type="password"
          value={signInPassword}
          onChange={(e) => setSignInPassword(e.target.value)}
        />
        <button type="button" onClick={handleSignIn}>
          Sign In
        </button>
      </form>
    </div>
  );
}

export { HomePage };

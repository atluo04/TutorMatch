import { useId, useState } from "react";
import { registerUser, signInUser, getdata} from "../user/auth";
import { useNavigate } from "react-router-dom"
import { db } from "../firebase/firebaseConfig";


function HomePage() {
  let navigate = useNavigate()
  // State for registration form
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  // State for sign-in form
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");

  const handleRegistration = () => {
    registerUser(regEmail, regPassword)
    .then((user) => {
      if (user instanceof Error) {
        console.log("Error Message:", user.message);
        // need toasting message
      } else {
        console.log("New account created", user);
        getdata();
        // need toasting message
      }
    });
  };

  const handleSignIn = () => {
    signInUser(signInEmail, signInPassword)
      .then((user) => {
        // If it's an error object, handle the error
        if (user instanceof Error) {
          //console.error("Sign In failed", user.code, user.message);
          console.log("Error Message:", user.message);
          // need toasting message
        } else {
          console.log("Signed In", user);
          navigate('/Profile')
          // need toasting message
        }
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

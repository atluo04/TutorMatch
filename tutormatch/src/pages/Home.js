import { useId, useState } from "react";
import { registerUser, signInUser, create_profile } from "../user/auth";
import { useNavigate } from "react-router-dom";
import { PasswordEmailInput } from "../components/PasswordEmailInput";

function HomePage() {
  let navigate = useNavigate();
  // State for sign-in form
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");

  const handleSignIn = () => {
    signInUser(signInEmail, signInPassword).then((user) => {
      // If it's an error object, handle the error
      if (user instanceof Error) {
        //console.error("Sign In failed", user.code, user.message);
        console.log("Error Message:", user.message);
        // need toasting message
      } else {
        console.log("Signed In", user);
        navigate("/Profile");
        // need toasting message
      }
    });
  };

  return (
    <div>
      <h2>Sign In</h2>
      <form>
        <PasswordEmailInput
          inputLabel={"Please Enter Your Email"}
          handleInput={setSignInEmail}
        />
        <PasswordEmailInput
          inputLabel={"Please Enter Your Password"}
          handleInput={setSignInPassword}
          isPassword={true}
        />
        <button type="button" onClick={handleSignIn}>
          Sign In
        </button>
      </form>
      <button type="button" onClick={() => navigate("/register")}>
        Register
      </button>
    </div>
  );
}

export { HomePage };

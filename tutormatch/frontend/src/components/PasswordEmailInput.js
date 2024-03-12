import "./PasswordEmailInput.css";
import { useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";


function PasswordEmailInput({ handleInput, isPassword, placeHolderText }) {
   const [isPasswordVisible, setIsPasswordVisible] = useState(isPassword);

   const togglePasswordVisibility = () => {
     setIsPasswordVisible((prev) => !prev);
   };
  return (
    <div className="container">
      <div className="input-field">
        <input
          type={isPasswordVisible ? "password" : "text"}
          onChange={(e) => handleInput(e.target.value)}
          placeholder={placeHolderText}
        />
        {isPassword && (
          <span className="toggle-icon" onClick={togglePasswordVisibility}>
            {isPasswordVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
          </span>
        )}
      </div>
    </div>
  );
}

export { PasswordEmailInput };

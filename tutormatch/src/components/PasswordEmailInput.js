import "./PasswordEmailInput.css";

function PasswordEmailInput({ inputLabel, handleInput, isPassword }) {
  return (
    <div className="container">
      <div className="input-field">
        <input
          type={isPassword ? "password" : "text"}
          onChange={(e) => handleInput(e.target.value)}
        />
        <label>{inputLabel}</label>
        <span></span>
      </div>
    </div>
  );
}

export { PasswordEmailInput };

import "./PasswordEmailInput.css";

function PasswordEmailInput({ handleInput, isPassword, placeHolderText }) {
  return (
    <div className="container">
      <div className="input-field">
        <input
          type={isPassword ? "password" : "text"}
          onChange={(e) => handleInput(e.target.value)}
          placeholder={placeHolderText}
        />
      </div>
    </div>
  );
}

export { PasswordEmailInput };

import "./PasswordEmailInput.css";

function PasswordEmailInput({ handleInput, isPassword, placeHolder }) {
  return (
    <div className="container">
      <div className="input-field">
        <input
          type={isPassword ? "password" : "text"}
          onChange={(e) => handleInput(e.target.value)}
          placeholder={placeHolder}
        />
      </div>
    </div>
  );
}

export { PasswordEmailInput };

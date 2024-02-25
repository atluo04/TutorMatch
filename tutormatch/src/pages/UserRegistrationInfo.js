import { useState } from "react";
import { PasswordEmailInput } from "../components/PasswordEmailInput";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import "../html/UserRegistrationInfo.css";

function UserRegistrationInfo() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [courses, setCourses] = useState([]);

  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };

  return (
    <div>
      <h2>Get Started with TutorMatch</h2>
      <PasswordEmailInput
        placeHolder={" First Name"}
        handleInput={setFirstName}
      />
      <PasswordEmailInput
        placeHolder={" Last Name"}
        handleInput={setLastName}
      />
      <div className="phoneContainer">
        <PhoneInput
          placeHolder={"Phone Number"}
          value={phone}
          onChange={setPhone}
          defaultCountry="US"
        />
      </div>
      <div className="genderContainer">
        <label>Select your gender:</label>
        <select value={gender} onChange={handleGenderChange}>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="non-binary">Non-Binary</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div className="courseContainer">
        <label>Select your current courses:</label>
      </div>
    </div>
  );
}

export { UserRegistrationInfo };

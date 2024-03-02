import { useState} from "react";
import { PasswordEmailInput } from "../components/PasswordEmailInput";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import "../html/UserRegistrationInfo.css";
import courseList from '../assets/courses.json'
import majorList from '../assets/majors.json'
import { update_profile } from "../user/user_doc";
import { useNavigate } from "react-router-dom";
import { ItemSelectionSearch } from "../components/ItemSelectionSearch";


function UserRegistrationInfo() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [majors, setMajors] = useState(new Set());
  const [gender, setGender] = useState("Male");
  const [year, setYear] = useState("Freshman");
  const [courses, setCourses] = useState(new Set());
  const navigate = useNavigate()

  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  const handleSubmit = async () => {
    update_profile("Fullname", firstName + " " + lastName);
    update_profile("Gender", gender);
    update_profile("Phone", phone);
    update_profile("Majors", [...majors]);
    update_profile("Year", year);
    update_profile("Courses", [...courses]);
    navigate("/home");
  }

  return (
    <div>
      <h2>Get Started with TutorMatch</h2>
      <PasswordEmailInput
        placeHolderText={"First Name"}
        handleInput={setFirstName}
      />
      <PasswordEmailInput
        placeHolderText={"Last Name"}
        handleInput={setLastName}
      />
      <div className="phoneContainer">
        <PhoneInput
          placeholder={"Phone Number"}
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
      <div className="yearContainer">
        <label>Select your current year:</label>
        <select value={year} onChange={handleYearChange}>
          <option value="freshman">Freshman</option>
          <option value="sophomore">Sophomore</option>
          <option value="junior">Junior</option>
          <option value="senior">Senior</option>
        </select>
      </div>
      <div className="majorContainer">
        <label>Select your current major(s):</label>
        <ItemSelectionSearch
          updateItems={setMajors}
          itemList={majorList}
          maxItems={3}
          placeHolderText={"Search for majors..."}
        />
      </div>
      <div className="courseContainer">
        <label>Select your current courses:</label>
        <ItemSelectionSearch
          updateItems={setCourses}
          itemList={courseList}
          maxItems={5}
          placeHolderText={"Search for course IDs..."}
        />
      </div>
      <button className="submitButton" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
}

export { UserRegistrationInfo };

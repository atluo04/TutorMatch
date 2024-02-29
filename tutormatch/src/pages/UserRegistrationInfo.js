import { useState } from "react";
import { PasswordEmailInput } from "../components/PasswordEmailInput";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import "../html/UserRegistrationInfo.css";

const CourseSearch = () => {
  const [value, setValue] = useState("");
 
  return (
    <div>
      <input
        type="text"
        className="courseSearch"
        placeholder="Search for courses..."
        onChange={e => setValue(e.target.value)}
      />
      {value && (<ul className="courseList">
        {courseList.filter((course) => course.id.toLowerCase().includes(value)).map((course) => (
          <button key={course.id} className="courseListItem">{course.id}</button>
        ))}
      </ul>)}
    </div>
  );
};

const courseList = [
  { id: "CS31", name: "Introduction to Computer Science" },
  { id: "CS32", name: "Data Structures and Algorithms" },
  { id: "MATH33B", name: "Differential Equations" },
  // Add more courses as needed
];

function UserRegistrationInfo() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [year, setYear] = useState("");
  const [courses, setCourses] = useState([]);

  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  return (
    <div>
      <h2>Get Started with TutorMatch</h2>
      <PasswordEmailInput
        placeHolderText={" First Name"}
        handleInput={setFirstName}
      />
      <PasswordEmailInput
        placeHolderText={" Last Name"}
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
      <div className="courseContainer">
        <label>Select your current courses:</label>
        <CourseSearch/>
      </div>
    </div>
  );
}

export { UserRegistrationInfo };
